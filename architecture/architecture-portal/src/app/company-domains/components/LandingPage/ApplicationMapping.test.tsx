import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import '@testing-library/jest-dom'
import ApplicationMapping from './ApplicationMapping'
import { useUserContext } from '@/context'
import { useDomainMapping, useEBCMMapping } from '@/app/company-domains/hooks'
import {
    Application,
    ApplicationCentralInfo
} from '@/app/company-domains/types'

jest.mock('@/context', () => ({
    __esModule: true,
    useUserContext: jest.fn()
}))

jest.mock('@/app/company-domains/hooks', () => ({
    __esModule: true,
    useDomainMapping: jest.fn(),
    useEBCMMapping: jest.fn()
}))

jest.mock('../Modals', () => ({
    ApplicationMappingConfirmationModal: ({
        label,
        isOpen,
        onClose,
        errorMessage
    }: {
        label: string
        isOpen: boolean
        onClose: () => void
        modalClose: () => void
        errorMessage: string | null
        setErrorMessage: (msg: string | null) => void
        onConfirm?: () => void
    }) => (
        <div
            data-testid='confirmation-modal'
            data-label={label}
            data-is-open={String(isOpen)}
            data-error={errorMessage || ''}
        >
            <button data-testid='confirmation-close' onClick={onClose}>
                Close Confirmation
            </button>
        </div>
    )
}))

jest.mock('@/app/company-domains/modals.module.css', () => ({
    modalContent: 'modalContent',
    modalTitle: 'modalTitle',
    modalBody: 'modalBody',
    modalBodyText: 'modalBodyText'
}))

const mockUseUserContext = useUserContext as jest.Mock
const mockUseDomainMapping = useDomainMapping as jest.Mock
const mockUseEBCMMapping = useEBCMMapping as jest.Mock

const mockFetchData = jest.fn()
const mockSetServerError = jest.fn()
const mockEbcmFetchData = jest.fn()

const defaultDomainMappingReturn = {
    status: null,
    serverError: null,
    isLoading: false,
    fetchData: mockFetchData,
    setServerError: mockSetServerError
}

const defaultEbcmMappingReturn = {
    status: null,
    serverError: null,
    isLoading: false,
    fetchData: mockEbcmFetchData
}

const createMockApplicationData = (
    overrides?: Partial<Application & ApplicationCentralInfo>
): Application & ApplicationCentralInfo =>
    ({
        application_nm: 'Test App',
        application_id: 'app-123',
        life_cycle_status_nm: 'Active',
        domain_nm: 'Test Domain',
        company_domain_id: 'domain-1',
        count: 1,
        ebc_level_4_nm: 'L4',
        ebc_level_3_nm: 'L3',
        last_update_ts: '2024-01-01',
        last_update_user_id: 'user1',
        unlink: false,
        sub_domain_id: 'sub-1',
        id: 'central-id',
        name: 'Central Name',
        application_name: 'App Display Name',
        ...overrides
    }) as Application & ApplicationCentralInfo

describe('ApplicationMapping', () => {
    const mockOnClose = jest.fn()
    const mockClearData = jest.fn()

    const defaultProps = {
        modalDetails: {
            data: 'Test Domain',
            name: 'Company Domain',
            isLinked: true
        },
        applicationData: createMockApplicationData(),
        isLinked: true,
        isOpen: true,
        onClose: mockOnClose,
        domainName: { id: 'domain-1' },
        clearData: mockClearData
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'test@example.com' }
        })
        mockUseDomainMapping.mockReturnValue(defaultDomainMappingReturn)
        mockUseEBCMMapping.mockReturnValue(defaultEbcmMappingReturn)
    })

    it('renders unlink dialog when isLinked is true', () => {
        render(<ApplicationMapping {...defaultProps} />)

        expect(screen.getByText(/You are about to/)).toBeInTheDocument()
        expect(screen.getByText(/You are about to/)).toBeInTheDocument()
        expect(
            screen.getByText('Are you sure you want to unlink Application')
        ).toBeInTheDocument()
        expect(screen.getByText('Yes, Unlink')).toBeInTheDocument()
    })

    it('renders link dialog when isLinked is false', () => {
        render(
            <ApplicationMapping
                {...defaultProps}
                isLinked={false}
                modalDetails={{
                    data: 'Test Domain',
                    name: 'Company Domain',
                    isLinked: false
                }}
            />
        )

        expect(screen.getByText(/You are about to/)).toBeInTheDocument()
        expect(screen.getByText('Yes, Link')).toBeInTheDocument()
        expect(screen.getByText('Yes, Link')).toBeInTheDocument()
    })

    it('displays application_nm in modal body', () => {
        render(<ApplicationMapping {...defaultProps} />)

        expect(screen.getByText('Test App')).toBeInTheDocument()
        expect(screen.getByText('Test Domain')).toBeInTheDocument()
    })

    it('displays application_name when application_nm is not available', () => {
        const data = createMockApplicationData({ application_nm: '' })

        render(<ApplicationMapping {...defaultProps} applicationData={data} />)

        expect(screen.getByText('App Display Name')).toBeInTheDocument()
    })

    it('displays name when application_nm and application_name are not available', () => {
        const data = createMockApplicationData({
            application_nm: '',
            application_name: ''
        })

        render(<ApplicationMapping {...defaultProps} applicationData={data} />)

        expect(screen.getByText('Central Name')).toBeInTheDocument()
    })

    it('calls handleLinkDomain on "Yes" click for Company Domain', async () => {
        render(<ApplicationMapping {...defaultProps} />)

        fireEvent.click(screen.getByText('Yes, Unlink'))

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                'domain-1',
                {
                    car_id: 'app-123',
                    email_id: 'test@example.com',
                    domain_id: 'domain-1'
                },
                true
            )
        })
    })

    it('calls handleLinkEBCM on "Yes" click for EBCM', async () => {
        render(
            <ApplicationMapping
                {...defaultProps}
                modalDetails={{
                    data: 'EBCM Data',
                    name: 'EBCM',
                    isLinked: true
                }}
            />
        )

        fireEvent.click(screen.getByText('Yes, Unlink'))

        await waitFor(() => {
            expect(mockEbcmFetchData).toHaveBeenCalledWith(
                {
                    car_id: 'app-123',
                    capability: { id: 'domain-1' },
                    email_id: 'test@example.com'
                },
                true
            )
        })
    })

    it('uses applicationData.id when application_id is not available', async () => {
        const data = createMockApplicationData({ application_id: '' })

        render(<ApplicationMapping {...defaultProps} applicationData={data} />)

        fireEvent.click(screen.getByText('Yes, Unlink'))

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                'domain-1',
                expect.objectContaining({ car_id: 'central-id' }),
                true
            )
        })
    })

    it('calls onClose and clearData on "No, Cancel" click', () => {
        render(<ApplicationMapping {...defaultProps} />)

        fireEvent.click(screen.getByText('No, Cancel'))

        expect(mockOnClose).toHaveBeenCalled()
        expect(mockClearData).toHaveBeenCalled()
    })

    it('calls onClose when dialog close button is clicked', () => {
        render(<ApplicationMapping {...defaultProps} />)

        // Find the CloseButton (rendered by Chakra's Dialog.CloseTrigger)
        const closeButtons = screen.getAllByRole('button', { name: /close/i })
        // Click the first close button (the dialog close trigger)
        fireEvent.click(closeButtons[0])

        expect(mockOnClose).toHaveBeenCalled()
    })

    it('opens confirmation modal on successful domain mapping', () => {
        mockUseDomainMapping.mockReturnValue({
            ...defaultDomainMappingReturn,
            status: 'success',
            serverError: null,
            isLoading: false
        })

        render(<ApplicationMapping {...defaultProps} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute('data-label', 'Unlinked')
    })

    it('opens confirmation modal with "Linked" label when isLinked is false', () => {
        mockUseDomainMapping.mockReturnValue({
            ...defaultDomainMappingReturn,
            status: 'success',
            serverError: null,
            isLoading: false
        })

        render(<ApplicationMapping {...defaultProps} isLinked={false} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute('data-label', 'Linked')
    })

    it('opens confirmation modal with error on domain mapping server error', () => {
        mockUseDomainMapping.mockReturnValue({
            ...defaultDomainMappingReturn,
            status: null,
            serverError: 'Something went wrong',
            isLoading: false
        })

        render(<ApplicationMapping {...defaultProps} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute(
            'data-error',
            'Something went wrong'
        )
    })

    it('opens confirmation modal and calls clearData on successful EBCM mapping', () => {
        mockUseEBCMMapping.mockReturnValue({
            ...defaultEbcmMappingReturn,
            status: 'success',
            serverError: null,
            isLoading: false
        })

        render(<ApplicationMapping {...defaultProps} />)

        expect(mockClearData).toHaveBeenCalled()
    })

    it('opens confirmation modal with error and calls clearData on EBCM server error', () => {
        mockUseEBCMMapping.mockReturnValue({
            ...defaultEbcmMappingReturn,
            status: null,
            serverError: 'EBCM Error',
            isLoading: false
        })

        render(<ApplicationMapping {...defaultProps} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute('data-error', 'EBCM Error')
        expect(mockClearData).toHaveBeenCalled()
    })

    it('does not open confirmation when status is null and no error (domain)', () => {
        mockUseDomainMapping.mockReturnValue(defaultDomainMappingReturn)

        render(<ApplicationMapping {...defaultProps} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute('data-is-open', 'false')
    })

    it('does not open confirmation when EBCM status is null and no error', () => {
        mockUseEBCMMapping.mockReturnValue(defaultEbcmMappingReturn)

        render(<ApplicationMapping {...defaultProps} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute('data-is-open', 'false')
    })

    it('does not call clearData when clearData prop is not provided', () => {
        mockUseEBCMMapping.mockReturnValue({
            ...defaultEbcmMappingReturn,
            status: 'success',
            serverError: null,
            isLoading: false
        })

        const propsWithoutClearData = {
            modalDetails: defaultProps.modalDetails,
            applicationData: defaultProps.applicationData,
            isLinked: defaultProps.isLinked,
            isOpen: defaultProps.isOpen,
            onClose: defaultProps.onClose,
            domainName: defaultProps.domainName
        }

        render(<ApplicationMapping {...propsWithoutClearData} />)

        // Should not throw
        expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
    })

    it('does not open confirmation when domain isLoading is true', () => {
        mockUseDomainMapping.mockReturnValue({
            ...defaultDomainMappingReturn,
            status: 'success',
            serverError: null,
            isLoading: true
        })

        render(<ApplicationMapping {...defaultProps} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute('data-is-open', 'false')
    })

    it('does not open confirmation when EBCM isLoading is true', () => {
        mockUseEBCMMapping.mockReturnValue({
            ...defaultEbcmMappingReturn,
            status: 'success',
            serverError: null,
            isLoading: true
        })

        render(<ApplicationMapping {...defaultProps} />)

        const confirmationModal = screen.getByTestId('confirmation-modal')
        expect(confirmationModal).toHaveAttribute('data-is-open', 'false')
    })

    it('renders when isOpen is false', () => {
        render(<ApplicationMapping {...defaultProps} isOpen={false} />)

        expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
    })

    it('handles null applicationData', () => {
        render(<ApplicationMapping {...defaultProps} applicationData={null} />)

        expect(screen.getByText('No, Cancel')).toBeInTheDocument()
    })

    it('handles undefined user attributes', async () => {
        mockUseUserContext.mockReturnValue(undefined)

        render(<ApplicationMapping {...defaultProps} />)

        fireEvent.click(screen.getByText('Yes, Unlink'))

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledWith(
                'domain-1',
                {
                    car_id: 'app-123',
                    email_id: undefined,
                    domain_id: 'domain-1'
                },
                true
            )
        })
    })
})
