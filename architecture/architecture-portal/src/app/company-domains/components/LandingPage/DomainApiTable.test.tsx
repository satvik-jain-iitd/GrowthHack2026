import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { DomainApiTable } from './DomainApiTable'
import { useDomainApiWithEndpointDetails } from '@/app/company-domains/hooks'
import { getStatusFiltersfromUrl } from '@/app/company-domains/utils/'
import { ApiMetadata, Reviewer } from '@/app/company-domains/types'

jest.mock('@/app/company-domains/hooks', () => ({
    useDomainApiWithEndpointDetails: jest.fn(),
    useReorderDomainApis: jest.fn(() => ({ reorderDomainApis: jest.fn() })),
    useUserDetails: jest.fn(() => ({
        isAdmin: false,
        domainOwner: [],
        loggedInUserEmail: ''
    }))
}))

jest.mock('@/app/company-domains/utils/', () => ({
    ...jest.requireActual('@/app/company-domains/utils/'),
    getStatusFiltersfromUrl: jest.fn()
}))

jest.mock('@/app/company-domains/domain-api-page.module.css', () => ({
    noDataTableCell: 'noDataTableCell',
    noDataContainer: 'noDataContainer',
    noDataText: 'noDataText',
    domainApiTable: 'domainApiTable',
    tableHeader: 'tableHeader',
    columnName: 'columnName',
    filterIcon: 'filterIcon',
    viewAllOption: 'viewAllOption',
    StatusBadge: 'StatusBadge',
    loader: 'loader'
}))

jest.mock('./Status', () => ({
    StatusBadge: ({ status }: { status: string }) => (
        <span data-testid={`status-badge-${status}`}>{status}</span>
    )
}))

jest.mock('./DomainApiListItem', () => ({
    DomainApiListItem: ({
        data,
        domainId,
        rowExpanded,
        rowIndex,
        handleExpandRowClick
    }: {
        data: { api_metadata_id: string; api_nm: string }
        domainId: string
        rowExpanded: boolean
        rowIndex: number
        handleExpandRowClick: (id: string) => void
    }) => (
        <tr
            data-testid='domain-api-list-item'
            data-api-id={data.api_metadata_id}
            data-api-name={data.api_nm}
            data-domain-id={domainId}
            data-row-expanded={String(rowExpanded)}
            data-row-index={String(rowIndex)}
            onClick={() => handleExpandRowClick(data.api_metadata_id)}
        >
            <td>{data.api_nm}</td>
        </tr>
    )
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconArrowDown: () => <span data-testid='icon-arrow-down'>down</span>,
    IconArrowUp: () => <span data-testid='icon-arrow-up'>up</span>,
    IconFilter: () => <span data-testid='icon-filter'>filter</span>
}))

const mockUseDomainApiWithEndpointDetails =
    useDomainApiWithEndpointDetails as jest.Mock
const mockGetStatusFiltersfromUrl = getStatusFiltersfromUrl as jest.Mock

const mockRefresh = jest.fn()
const mockSetIsEditRow = jest.fn()
const mockHandleTimeOutModalOpen = jest.fn()
const mockSetApiData = jest.fn()

const mockReviewer: Reviewer = {
    isEnggReviewer: false,
    isArchReviewer: false,
    isEArbReviewer: false,
    email: 'test@aexp.com'
}

const createApiMetadata = (
    overrides: Partial<ApiMetadata> = {}
): ApiMetadata => ({
    api_metadata_id: 'api-1',
    api_nm: 'Alpha API',
    api_ds: 'Alpha API Description',
    prim_company_domain_id: 'domain-1',
    prvd_company_domain_id: ['domain-1'],
    consm_company_domain_id: ['domain-2'],
    prvd_company_sub_domain_id: ['sub-1'],
    consm_company_sub_domain_id: ['sub-2'],
    prim_company_sub_domain_id: 'sub-1',
    prim_company_domain_nm: 'Payments',
    prvd_company_domain_nm: ['Payments'],
    consm_company_domain_nm: ['Lending'],
    prvd_company_sub_domain_nm: ['Card'],
    consm_company_sub_domain_nm: ['Loans'],
    prim_company_sub_domain_nm: 'Card',
    ebcm_names: [],
    co_editors: [],
    status: 'DRAFT',
    api_endpoint: [],
    sub_company_domain_name: 'Sub Domain A',
    draft_user_email: 'test@aexp.com',
    add_da: {
        api_resource: 'resource-a'
    },
    ...overrides
})

const getDefaultHookReturn = (overrides: Record<string, unknown> = {}) => ({
    isLoading: false,
    data: [
        createApiMetadata({ api_metadata_id: 'api-a', api_nm: 'Beta API' }),
        createApiMetadata({ api_metadata_id: 'api-b', api_nm: 'Alpha API' })
    ],
    status: { status: 'success', statusText: '' },
    refresh: mockRefresh,
    ...overrides
})

const getDefaultProps = (
    overrides: Partial<React.ComponentProps<typeof DomainApiTable>> = {}
): React.ComponentProps<typeof DomainApiTable> => ({
    searchVal: '',
    reviewers: mockReviewer,
    domainId: 'domain-1',
    setIsEditRow: mockSetIsEditRow,
    isReviewersLoading: false,
    handleTimeOutModalOpen: mockHandleTimeOutModalOpen,
    refreshTableData: false,
    setRefreshDomainData: jest.fn(),
    setApiData: mockSetApiData,
    viewOnly: false,
    isDraggingDisabled: false,
    orderedData: [
        createApiMetadata({ api_metadata_id: 'api-b', api_nm: 'Alpha API' }),
        createApiMetadata({ api_metadata_id: 'api-a', api_nm: 'Beta API' })
    ],
    setOrderedData: jest.fn(),
    ...overrides
})

const renderDomainApiTable = ({
    propOverrides = {},
    hookOverrides = {}
}: {
    propOverrides?: Partial<React.ComponentProps<typeof DomainApiTable>>
    hookOverrides?: Record<string, unknown>
} = {}) => {
    mockUseDomainApiWithEndpointDetails.mockReturnValue(
        getDefaultHookReturn(hookOverrides)
    )

    return render(<DomainApiTable {...getDefaultProps(propOverrides)} />)
}

describe('DomainApiTable', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockGetStatusFiltersfromUrl.mockReturnValue([])
        mockUseDomainApiWithEndpointDetails.mockReturnValue(
            getDefaultHookReturn()
        )
    })

    it('renders table rows from API metadata', () => {
        renderDomainApiTable()

        const rows = screen.getAllByTestId('domain-api-list-item')
        expect(rows).toHaveLength(2)
        expect(rows[0]).toHaveAttribute('data-domain-id', 'domain-1')
    })

    it('renders loading state while API data is loading', () => {
        renderDomainApiTable({
            hookOverrides: {
                isLoading: true,
                data: undefined
            }
        })

        expect(screen.getByTestId('domain-api-table')).toBeInTheDocument()
        expect(screen.queryAllByTestId('domain-api-list-item')).toHaveLength(0)
        expect(
            screen.queryByText(
                /No APIs found for this company domain\. Please click on the "Add Domain API" to add\./i
            )
        ).not.toBeInTheDocument()
    })

    it('renders empty message when no APIs are returned', () => {
        renderDomainApiTable({
            propOverrides: { orderedData: [] },
            hookOverrides: {
                data: []
            }
        })

        expect(
            screen.getByText(
                'No APIs found for this company domain. Please click on the "Add Domain API" to add.'
            )
        ).toBeInTheDocument()
    })

    it('renders search no-results message when search text has no matches', () => {
        renderDomainApiTable({
            propOverrides: { searchVal: 'zzz-no-match', orderedData: [] },
            hookOverrides: {
                data: [
                    createApiMetadata({
                        api_metadata_id: 'api-search-1',
                        api_nm: 'Payments API',
                        api_ds: 'Payment lifecycle API'
                    })
                ]
            }
        })

        expect(
            screen.getByText(
                'No results found. Please adjust your search criteria.'
            )
        ).toBeInTheDocument()
    })

    it('calls refresh when refreshTableData is true', async () => {
        renderDomainApiTable({
            propOverrides: {
                refreshTableData: true
            }
        })

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled()
        })
    })

    it('calls timeout handler and renders error message when hook status is error', async () => {
        renderDomainApiTable({
            propOverrides: { orderedData: [] },
            hookOverrides: {
                data: undefined,
                status: { status: 'error', statusText: 'Request timed out' }
            }
        })

        await waitFor(() => {
            expect(mockHandleTimeOutModalOpen).toHaveBeenCalledWith(
                'error',
                'Request timed out'
            )
        })

        expect(
            screen.getByText(
                'Failed to load data. Please try refreshing the page.'
            )
        ).toBeInTheDocument()
    })

    it('toggles sort order when clicking the API Name column header', async () => {
        const mockSetOrderedData = jest.fn()
        renderDomainApiTable({
            propOverrides: {
                orderedData: [
                    createApiMetadata({
                        api_metadata_id: 'api-1',
                        api_nm: 'Alpha API',
                        sub_company_domain_name: 'Sub Domain A'
                    }),
                    createApiMetadata({
                        api_metadata_id: 'api-2',
                        api_nm: 'Beta API',
                        sub_company_domain_name: 'Sub Domain A'
                    })
                ],
                setOrderedData: mockSetOrderedData
            },
            hookOverrides: {
                data: [
                    createApiMetadata({
                        api_metadata_id: 'api-2',
                        api_nm: 'Beta API',
                        sub_company_domain_name: 'Sub Domain A'
                    }),
                    createApiMetadata({
                        api_metadata_id: 'api-1',
                        api_nm: 'Alpha API',
                        sub_company_domain_name: 'Sub Domain A'
                    })
                ]
            }
        })

        // Wait for initial effect to call setOrderedData
        await waitFor(() => {
            expect(mockSetOrderedData).toHaveBeenCalled()
        })

        const initialCallCount = mockSetOrderedData.mock.calls.length

        const apiNameHeader = screen.getByTitle('API Name')
        fireEvent.click(apiNameHeader)

        await waitFor(() => {
            expect(mockSetOrderedData.mock.calls.length).toBeGreaterThan(
                initialCallCount
            )
        })
    })

    it('shows no-filters-selected empty state when VIEW ALL is toggled off', async () => {
        renderDomainApiTable({
            propOverrides: { orderedData: [] }
        })

        fireEvent.click(screen.getByTestId('status-filter-trigger'))
        fireEvent.click(await screen.findByText('VIEW ALL'))

        expect(
            await screen.findByText(
                'No filters selected. Please select at least one filter to view data.'
            )
        ).toBeInTheDocument()
    })

    it('shows only view-only status options in the status filter menu when viewOnly is true', async () => {
        renderDomainApiTable({
            propOverrides: {
                viewOnly: true
            }
        })

        fireEvent.click(screen.getByTestId('status-filter-trigger'))

        expect(await screen.findByText('earbAppr')).toBeInTheDocument()
        expect(screen.getByText('catalog')).toBeInTheDocument()
        expect(screen.getByText('preCert')).toBeInTheDocument()
        expect(screen.getByText('prodCert')).toBeInTheDocument()

        expect(screen.queryByText('draft')).not.toBeInTheDocument()
        expect(screen.queryByText('proposed')).not.toBeInTheDocument()
        expect(screen.queryByText('darbAppr')).not.toBeInTheDocument()
    })
})
