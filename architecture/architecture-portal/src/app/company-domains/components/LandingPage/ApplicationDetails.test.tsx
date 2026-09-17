import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import '@testing-library/jest-dom'
import { ApplicationDetail } from './ApplicationDetail'
import { Application } from '@/app/company-domains/types'
import { useUserContext } from '@/context'
import { useNavigation } from '@/hooks'
import { showAdmin } from '@/app/admin/utils'

jest.mock('@/context', () => ({
    __esModule: true,
    useUserContext: jest.fn()
}))

jest.mock('@/hooks', () => ({
    useNavigation: jest.fn()
}))

jest.mock('@/app/admin/utils', () => ({
    showAdmin: jest.fn()
}))

jest.mock('../UserAvatar', () => ({
    UserAvatar: ({ email, name }: { email: string; name?: string }) => (
        <div data-testid='user-avatar' data-email={email}>
            {name}
        </div>
    )
}))

jest.mock('./ApplicationMapping', () => ({
    __esModule: true,
    default: ({
        modalDetails,
        isOpen
    }: {
        modalDetails: { name?: string; isLinked?: boolean }
        isOpen: boolean
    }) => (
        <div
            data-testid='application-mapping'
            data-is-open={String(isOpen)}
            data-name={modalDetails.name}
        >
            Application Mapping
        </div>
    )
}))

jest.mock(
    '@/app/directory/components/ApplicationTable/LinkApplication',
    () => ({
        __esModule: true,
        default: ({
            isOpen,
            modalDetails
        }: {
            isOpen: boolean
            modalDetails: { name?: string }
        }) => (
            <div
                data-testid='link-application'
                data-is-open={String(isOpen)}
                data-name={modalDetails.name}
            >
                Link Application
            </div>
        )
    })
)

jest.mock('@/context/DomainContext', () => ({
    DomainProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid='domain-provider'>{children}</div>
    )
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ alt, src }: { alt: string; src: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} src={src} data-testid='next-image' />
    )
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconInsurance: () => <span data-testid='icon-insurance' />,
    IconLaptop: () => <span data-testid='icon-laptop' />,
    IconLineGraph: () => <span data-testid='icon-line-graph' />,
    IconBank: () => <span data-testid='icon-bank' />,
    IconProcessing: () => <span data-testid='icon-processing' />,
    IconGlobal: () => <span data-testid='icon-global' />,
    IconLink: () => <span data-testid='icon-link' />
}))

const mockPush = jest.fn()
const mockUseUserContext = useUserContext as jest.Mock
const mockUseNavigation = useNavigation as jest.Mock
const mockShowAdmin = showAdmin as jest.Mock

const createMockApplicationData = (
    overrides?: Partial<Application>
): Application => ({
    application_nm: 'Test Application',
    application_id: '500000846',
    life_cycle_status_nm: 'Active',
    domain_nm: 'Test Domain',
    company_domain_id: 'domain-123',
    count: 5,
    ebc_level_4_nm: 'Level 4',
    ebc_level_3_nm: 'Level 3',
    last_update_ts: '2024-01-01',
    last_update_user_id: 'user1',
    unlink: false,
    sub_domain_id: 'sub-1',
    sub_domain_nm: 'Sub Domain',
    central_application_da: {
        name: 'Central App',
        description: 'A test application description',
        lineOfBusiness: { lineOfBusiness2: 'Consumer Services' },
        lifeCycleStatus: 'Production',
        appType: 'Custom',
        ownershipInfo: {
            applicationOwner: {
                fullName: 'John Owner',
                email: 'john@test.com'
            },
            unitCIO: { fullName: 'Jane CIO', email: 'jane@test.com' },
            ownerSVP: { fullName: 'Bob SVP', email: 'bob@test.com' },
            applicationOwnerLeader2: {
                fullName: 'Alice VP2',
                email: 'alice@test.com'
            },
            businessOwner: {
                fullName: 'Charlie BO',
                email: 'charlie@test.com'
            },
            pmo: { fullName: 'Dave PMO', email: 'dave@test.com' },
            applicationOwnerLeader1: {
                fullName: 'Eve VP1',
                email: 'eve@test.com'
            },
            productionSupportOwner: {
                fullName: 'Frank PSO',
                email: 'frank@test.com'
            },
            businessOwnerLeader1: {
                fullName: 'Grace Business VP',
                email: 'grace@test.com'
            },
            productionSupportOwnerLeader1: {
                fullName: 'Henry Prod Support VP',
                email: 'henry@test.com'
            }
        }
    },
    ...overrides
})

describe('ApplicationDetail', () => {
    const mockSetOpenModal = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseNavigation.mockReturnValue({ push: mockPush })
        mockUseUserContext.mockReturnValue({
            groups: ['admin-group'],
            userDirectoryAccess: { domains: ['domain-123'] }
        })
        mockShowAdmin.mockReturnValue(true)
    })

    it('renders application description', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(
            screen.getByText('A test application description')
        ).toBeInTheDocument()
    })

    it('renders all app info fields', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Central ID')).toBeInTheDocument()
        expect(screen.getByText('500000846')).toBeInTheDocument()
        expect(
            screen.queryByText('Investment Strategy')
        ).not.toBeInTheDocument()
        expect(screen.getByText('Line of Business 2')).toBeInTheDocument()
        expect(screen.getByText('Consumer Services')).toBeInTheDocument()
        expect(screen.getByText('Lifecycle Status')).toBeInTheDocument()
        expect(screen.getByText('Production')).toBeInTheDocument()
        expect(screen.getByText('Countries Support')).toBeInTheDocument()
        expect(screen.getByText('Global')).toBeInTheDocument()
        expect(screen.getByText('App Type')).toBeInTheDocument()
        expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('renders "--" for missing lineOfBusiness2', () => {
        const data = createMockApplicationData({
            central_application_da: {
                description: 'Test',
                lineOfBusiness: {}
            }
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('--')).toBeInTheDocument()
    })

    it('renders owner/SME section with all owners', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Owner / SMEs')).toBeInTheDocument()
        expect(screen.getAllByText('John Owner').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Jane CIO').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Bob SVP').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Alice VP2').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Charlie BO').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Dave PMO').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Eve VP1').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Frank PSO').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Grace Business VP').length).toBeGreaterThan(
            0
        )
        expect(
            screen.getAllByText('Henry Prod Support VP').length
        ).toBeGreaterThan(0)
    })

    it('renders the "Show More" button', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Show More')).toBeInTheDocument()
    })

    it('navigates to application page on "Show More" click', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        fireEvent.click(screen.getByText('Show More'))
        expect(mockPush).toHaveBeenCalledWith('/applications/500000846')
    })

    it('renders "Unlink Company Domain" button when user has domain access', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Unlink Company Domain')).toBeInTheDocument()
    })

    it('renders "Unlink Company Domain" button when user is admin', () => {
        mockUseUserContext.mockReturnValue({
            groups: ['admin-group'],
            userDirectoryAccess: { domains: [] }
        })
        mockShowAdmin.mockReturnValue(true)

        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Unlink Company Domain')).toBeInTheDocument()
    })

    it('renders "Link Company Domain" button when no domain is linked and user has domains', () => {
        mockShowAdmin.mockReturnValue(false)
        mockUseUserContext.mockReturnValue({
            groups: [],
            userDirectoryAccess: { domains: ['some-domain'] }
        })

        const data = createMockApplicationData({
            company_domain_id: '',
            domain_nm: ''
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Link Company Domain')).toBeInTheDocument()
    })

    it('renders "Link Company Domain" button when domainId is undefined and user is admin', () => {
        mockShowAdmin.mockReturnValue(true)
        mockUseUserContext.mockReturnValue({
            groups: ['admin'],
            userDirectoryAccess: { domains: [] }
        })

        const data = createMockApplicationData({
            company_domain_id: undefined as unknown as string,
            domain_nm: ''
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Link Company Domain')).toBeInTheDocument()
    })

    it('does not render link/unlink buttons when user has no access and is not admin', () => {
        mockShowAdmin.mockReturnValue(false)
        mockUseUserContext.mockReturnValue({
            groups: [],
            userDirectoryAccess: { domains: [] }
        })

        const data = createMockApplicationData({
            company_domain_id: '',
            domain_nm: ''
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(
            screen.queryByText('Unlink Company Domain')
        ).not.toBeInTheDocument()
        expect(
            screen.queryByText('Link Company Domain')
        ).not.toBeInTheDocument()
    })

    it('opens ApplicationMapping modal on "Unlink Company Domain" click', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        fireEvent.click(screen.getByText('Unlink Company Domain'))

        expect(screen.getByTestId('application-mapping')).toBeInTheDocument()
    })

    it('opens LinkApplication modal on "Link Company Domain" click', () => {
        mockShowAdmin.mockReturnValue(true)
        mockUseUserContext.mockReturnValue({
            groups: ['admin'],
            userDirectoryAccess: { domains: ['some-domain'] }
        })

        const data = createMockApplicationData({
            company_domain_id: '',
            domain_nm: ''
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        fireEvent.click(screen.getByText('Link Company Domain'))

        expect(screen.getByTestId('link-application')).toBeInTheDocument()
    })

    it('calls setOpenModal(false) on "Close" button click', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        fireEvent.click(screen.getByText('Close'))
        expect(mockSetOpenModal).toHaveBeenCalledWith(false)
    })

    it('handles null applicationData gracefully', () => {
        render(
            <ApplicationDetail
                applicationData={null}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('renders with undefined user', () => {
        mockUseUserContext.mockReturnValue(undefined)
        mockShowAdmin.mockReturnValue(false)

        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('renders UserAvatar with correct props for owners', () => {
        render(
            <ApplicationDetail
                applicationData={createMockApplicationData()}
                setOpenModal={mockSetOpenModal}
            />
        )

        const avatars = screen.getAllByTestId('user-avatar')
        expect(avatars.length).toBe(10)
        expect(avatars[0]).toHaveAttribute('data-email', 'john@test.com')
    })

    it('renders UserAvatar with empty email when owner email is undefined', () => {
        const data = createMockApplicationData({
            central_application_da: {
                description: 'Test',
                ownershipInfo: {
                    applicationOwner: { fullName: 'No Email Owner' }
                }
            }
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        const avatars = screen.getAllByTestId('user-avatar')
        expect(avatars[0]).toHaveAttribute('data-email', '')
    })

    it('handles handleEdit with empty application_id', () => {
        const data = createMockApplicationData({
            application_id: ''
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        fireEvent.click(screen.getByText('Show More'))
        expect(mockPush).toHaveBeenCalledWith('/applications/')
    })

    it('renders DomainProvider wrapper for LinkApplication', () => {
        mockShowAdmin.mockReturnValue(true)
        mockUseUserContext.mockReturnValue({
            groups: ['admin'],
            userDirectoryAccess: { domains: ['some-domain'] }
        })

        const data = createMockApplicationData({
            company_domain_id: '',
            domain_nm: ''
        })

        render(
            <ApplicationDetail
                applicationData={data}
                setOpenModal={mockSetOpenModal}
            />
        )

        expect(screen.getByTestId('domain-provider')).toBeInTheDocument()
    })
})
