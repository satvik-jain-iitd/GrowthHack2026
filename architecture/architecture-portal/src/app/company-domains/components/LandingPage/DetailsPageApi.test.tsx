import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import '@testing-library/jest-dom'
import DetailsPageAPI from './DetailsPageApi'
import { useUserContext } from '@/context'
import {
    useDomainApiHistoryList,
    useUserDetails
} from '@/app/company-domains/hooks'
import {
    ApiAddDa,
    ApiEndpoint,
    ApiMetadata,
    Reviewer
} from '@/app/company-domains/types'

jest.mock('@/context', () => ({
    useUserContext: jest.fn()
}))

jest.mock('@/app/company-domains/hooks', () => ({
    useDomainApiHistoryList: jest.fn(),
    useUserDetails: jest.fn(() => ({
        isAdmin: false,
        domainOwner: [],
        loggedInUserEmail: ''
    })),
    useGetDomains: jest.fn(() => ({ domains: [] }))
}))

jest.mock('@/app/company-domains/constants', () => ({
    getAbsoluteApiUrl: jest.fn(
        (domainId: string, apiMetadataId: string) =>
            `https://architecture.example.com/${domainId}#${apiMetadataId}`
    ),
    domainHistoryTableLabel: [
        {
            name: 'Operation Name',
            title: 'Operation Name',
            key: 'api_endpoint_metadata_name',
            isSortable: true
        }
    ],
    REVIEW_LABELS: {
        ENGINEER_REVIEW: 'HEAD ENGINEER REVIEW',
        ARCHITECT_REVIEW: 'ENTERPRISE ARCHITECT REVIEW',
        EARB_REVIEW: 'E-ARB REVIEW'
    }
}))

jest.mock('./ExpandableText', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid='expandable-text'>{children}</div>
    )
}))

jest.mock('./OperationTable', () => ({
    OperationalTable: () => (
        <div data-testid='operational-table'>OperationTable</div>
    )
}))

jest.mock('../Modals/AddCoEditorsModal', () => ({
    AddCoEditorsModal: ({ isOpen }: { isOpen: boolean }) => (
        <div data-testid='co-editors-modal'>{String(isOpen)}</div>
    )
}))

jest.mock('../Modals/ApiEndpointHistoryModal', () => ({
    ApiEndpointHistoryModal: ({
        isOpen,
        data
    }: {
        isOpen: boolean
        data: Array<{ api_endpoint_metadata_id: string }>
    }) => (
        <div
            data-testid='history-modal'
            data-open={String(isOpen)}
            data-first-metadata-id={data?.[0]?.api_endpoint_metadata_id || ''}
        />
    )
}))

jest.mock('../Modals/ApiEndpointConfirmationModal', () => ({
    ApiEndpointConfirmationModal: ({
        isOpen,
        reviewLabel,
        isApprove
    }: {
        isOpen: boolean
        reviewLabel: string
        isApprove: boolean
    }) => (
        <div
            data-testid='confirmation-modal'
            data-open={String(isOpen)}
            data-review-label={reviewLabel}
            data-approve={String(isApprove)}
        />
    )
}))

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        href,
        children,
        target,
        title
    }: {
        href: string
        children: React.ReactNode
        target?: string
        title?: string
    }) => (
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        <a href={href} target={target} title={title}>
            {children}
        </a>
    ),
    Tooltip: ({
        children,
        content
    }: {
        children: React.ReactNode
        content: React.ReactNode
    }) => <span title={String(content)}>{children}</span>
}))

jest.mock(
    '@/app/company-domains/components/LandingPage/CopyApiUrlButton',
    () => ({
        CopyApiUrlButton: ({ apiUrl }: { apiUrl: string }) => (
            <button data-testid='copy-api-url-btn' data-url={apiUrl}>
                Copy URL
            </button>
        )
    })
)

jest.mock('@americanexpress/dls-icons', () => ({
    IconTime: () => <span data-testid='icon-time'>time</span>
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ alt }: { alt: string }) => <img alt={alt} />
}))

jest.mock('@/app/company-domains/domain-api-page.module.css', () => ({
    fields: 'fields',
    apiName: 'apiName',
    content: 'content',
    description: 'description',
    endpointIconText: 'endpointIconText',
    endpointText: 'endpointText',
    showButton: 'showButton',
    Approve: 'Approve',
    coEditorsButton: 'coEditorsButton',
    reject: 'reject',
    apiShowHistory: 'apiShowHistory'
}))

const mockUseUserContext = useUserContext as jest.Mock
const mockUseDomainApiHistoryList = useDomainApiHistoryList as jest.Mock
const mockUseUserDetails = useUserDetails as jest.Mock

const mockSetIsEditRow = jest.fn()
const mockReloadData = jest.fn()
const mockFetchData = jest.fn()

const baseReviewers: Reviewer = {
    isEnggReviewer: false,
    isArchReviewer: false,
    isEArbReviewer: false,
    email: 'reviewer@aexp.com'
}

const baseData = {
    api_nm: 'Payments API',
    api_ds: '<p>Payment APIs for internal systems</p>',
    prvd_company_domain_nm: ['Provider Domain'],
    consm_company_domain_nm: ['Consumer Domain'],
    ebcm_names: ['Payments EBCM'],
    co_editors: ['coeditor@aexp.com'],
    status: 'DRAFT',
    proposed: 'PROPOSED',
    darb_eng: '',
    darb_arch: '',
    api_resource: 'payments-resource',
    earb: '',
    api_endpoint: [
        {
            draft_user_email: 'requestor@aexp.com'
        }
    ]
} as unknown as ApiMetadata & ApiEndpoint

const baseAdditionalData: ApiAddDa = {
    api_resource: 'payments-resource',
    apiCatalogUrl: 'https://catalog.example.com/payments'
}

const baseEndpointMetadata = [
    { api_endpoint_metadata_id: 'endpoint-1' }
] as unknown as ApiEndpoint[]

const getDefaultProps = (): React.ComponentProps<typeof DetailsPageAPI> => ({
    reviewers: baseReviewers,
    setIsEditRow: mockSetIsEditRow,
    data: baseData,
    reloadData: mockReloadData,
    domainId: 'domain-1',
    api_metadata_id: 'api-meta-1',
    additionalData: baseAdditionalData,
    endpointMetadata: baseEndpointMetadata,
    isLoading: false,
    api_nm: 'Payments API',
    rowExpanded: false,
    viewOnly: false
})

const makeCapabilities = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
        capability_id: `cap-${index + 1}`,
        capability_nm: `Capability ${index + 1}`
    }))

const getCapabilityLinks = () =>
    screen
        .getAllByRole('link')
        .filter(link =>
            link
                .getAttribute('href')
                ?.startsWith('/business-architecture/capabilities/')
        )

const renderComponent = (
    overrides: Partial<React.ComponentProps<typeof DetailsPageAPI>> = {}
) => {
    const props = { ...getDefaultProps(), ...overrides }
    return render(<DetailsPageAPI {...props} />)
}

describe('DetailsPageAPI', () => {
    let consoleLogSpy: jest.SpyInstance

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

        mockUseUserContext.mockReturnValue({
            attributes: {
                email: 'requestor@aexp.com'
            },
            userDirectoryAccess: {
                admin: false,
                domains: ['domain-1'],
                ebc: []
            }
        })
        mockUseUserDetails.mockReturnValue({
            isAdmin: false,
            domainOwner: ['domain-1'],
            loggedInUserEmail: 'test@aexp.com'
        })
        mockUseDomainApiHistoryList.mockReturnValue({
            isLoading: false,
            data: [],
            fetchData: mockFetchData
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        consoleLogSpy.mockRestore()
    })

    it('renders API details and copy API URL button', () => {
        renderComponent()

        expect(screen.getByText('Payments API')).toBeInTheDocument()
        expect(screen.getByText('Provider Company Domain')).toBeInTheDocument()
        expect(screen.getByText('Provider Domain')).toBeInTheDocument()
        expect(screen.getByText('API Resource')).toBeInTheDocument()
        expect(screen.getByText('payments-resource')).toBeInTheDocument()

        expect(screen.getByTestId('copy-api-url-btn')).toHaveAttribute(
            'data-url',
            'https://architecture.example.com/domain-1#api-meta-1'
        )
    })

    it('shows operation label for one endpoint and operations for multiple endpoints', () => {
        const { rerender } = renderComponent({
            endpointMetadata: [
                { api_endpoint_metadata_id: 'endpoint-1' }
            ] as ApiEndpoint[]
        })

        expect(screen.getByText('Operation')).toBeInTheDocument()

        rerender(
            <DetailsPageAPI
                {...getDefaultProps()}
                endpointMetadata={
                    [
                        { api_endpoint_metadata_id: 'endpoint-1' },
                        { api_endpoint_metadata_id: 'endpoint-2' }
                    ] as ApiEndpoint[]
                }
            />
        )

        expect(screen.getByText('Operations')).toBeInTheDocument()
    })

    it('calls setIsEditRow when clicking Add / Propose Operation', () => {
        renderComponent()

        fireEvent.click(
            screen.getByRole('button', { name: 'Add / Propose Operation' })
        )

        expect(mockSetIsEditRow).toHaveBeenCalledWith(
            'api-meta-1',
            { ...baseData, ebcm_da: [] },
            'Payments API'
        )
    })

    it('opens co-editors modal when clicking Add / View Co-Editor(s)', () => {
        renderComponent()

        expect(screen.getByTestId('co-editors-modal')).toHaveTextContent(
            'false'
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Add \/ View Co-Editor\(s\)/i
            })
        )

        expect(screen.getByTestId('co-editors-modal')).toHaveTextContent('true')
    })

    it('shows edit button for domain owner and passes edit flag', () => {
        renderComponent()

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

        expect(mockSetIsEditRow).toHaveBeenCalledWith(
            'api-meta-1',
            baseData,
            'Payments API',
            true
        )
    })

    it('shows history button for allowed users and opens history modal', () => {
        mockUseDomainApiHistoryList.mockReturnValue({
            isLoading: false,
            data: [
                {
                    api_metadata_id: 'old-api-id',
                    api_endpoint_metadata_id: 'endpoint-123',
                    expanded: true,
                    api_endpoint_metadata_type: 'POST',
                    history: []
                }
            ],
            fetchData: mockFetchData
        })

        renderComponent()

        fireEvent.click(screen.getByRole('button', { name: /Show History/i }))

        expect(mockFetchData).toHaveBeenCalledTimes(1)
        expect(screen.getByTestId('history-modal')).toHaveAttribute(
            'data-open',
            'true'
        )
        expect(screen.getByTestId('history-modal')).toHaveAttribute(
            'data-first-metadata-id',
            'endpoint-123'
        )
    })

    it('hides history button for non-admin, non-owner, and non-reviewer', () => {
        mockUseUserContext.mockReturnValue({
            attributes: {
                email: 'someone@aexp.com'
            },
            userDirectoryAccess: {
                admin: false,
                domains: [],
                ebc: []
            }
        })
        mockUseUserDetails.mockReturnValue({
            isAdmin: false,
            domainOwner: [],
            loggedInUserEmail: 'test1@aexp.com'
        })
        renderComponent({
            reviewers: {
                ...baseReviewers,
                isEArbReviewer: false
            }
        })

        expect(
            screen.queryByRole('button', { name: /Show History/i })
        ).not.toBeInTheDocument()
    })

    it('renders operational table only when rowExpanded is true', () => {
        const { rerender } = renderComponent({ rowExpanded: false })

        expect(
            screen.queryByTestId('operational-table')
        ).not.toBeInTheDocument()

        rerender(<DetailsPageAPI {...getDefaultProps()} rowExpanded />)

        expect(screen.getByTestId('operational-table')).toBeInTheDocument()
    })

    it('does not render actions section when viewOnly is true', () => {
        renderComponent({ viewOnly: true })

        expect(
            screen.queryByRole('button', { name: 'Add / Propose Operation' })
        ).not.toBeInTheDocument()
        expect(
            screen.queryByRole('button', {
                name: /Add \/ View Co-Editor\(s\)/i
            })
        ).not.toBeInTheDocument()
    })

    it('renders API Catalog link only when apiCatalogUrl is present', () => {
        const { rerender } = renderComponent({
            additionalData: {
                ...baseAdditionalData,
                apiCatalogUrl: 'https://catalog.example.com/payments'
            }
        })

        expect(screen.getByTitle('API Catalog Link')).toHaveAttribute(
            'href',
            'https://catalog.example.com/payments'
        )

        rerender(
            <DetailsPageAPI
                {...getDefaultProps()}
                additionalData={{
                    ...baseAdditionalData,
                    apiCatalogUrl: ''
                }}
            />
        )

        expect(screen.queryByTitle('API Catalog Link')).not.toBeInTheDocument()
    })

    it('renders EBCM capability badges linking to the capability details page', () => {
        renderComponent({
            data: { ...baseData, ebcm_v10: makeCapabilities(2) }
        })

        expect(screen.getByText('Capability 1').closest('a')).toHaveAttribute(
            'href',
            '/business-architecture/capabilities/cap-1/?tab=Enterprise+Customer+Journeys'
        )
        expect(getCapabilityLinks()).toHaveLength(2)
    })

    it('falls back to joined ebcm_names when ebcm_v10 is empty', () => {
        renderComponent()

        expect(screen.getByText('Payments EBCM')).toBeInTheDocument()
        expect(getCapabilityLinks()).toHaveLength(0)
    })

    it('collapses EBCM badges past the visible limit behind a show more control', () => {
        renderComponent({
            data: { ...baseData, ebcm_v10: makeCapabilities(12) }
        })

        expect(getCapabilityLinks()).toHaveLength(8)

        fireEvent.click(screen.getByRole('button', { name: '+4 more' }))
        expect(getCapabilityLinks()).toHaveLength(12)

        fireEvent.click(screen.getByRole('button', { name: 'Show less' }))
        expect(getCapabilityLinks()).toHaveLength(8)
    })
})
