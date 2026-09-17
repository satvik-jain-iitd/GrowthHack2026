import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import '@testing-library/jest-dom'
import ApiEndPointTable from './ApiEndpointTable'
import { Column } from '@/app/company-domains/types'
import { HistoryData } from '@/app/company-domains/hooks'

jest.mock('@/app/company-domains/utils', () => ({
    scrollToExpandedData: jest.fn()
}))

jest.mock('../Modals', () => ({
    ApiStatusHistoryTable: ({
        columns,
        isLoading
    }: {
        columns: Column[]
        data: unknown
        isLoading: boolean
    }) => (
        <div
            data-testid='api-status-history-table'
            data-columns={JSON.stringify(columns)}
            data-loading={String(isLoading)}
        >
            History Table
        </div>
    )
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconArrowUp: () => <span data-testid='icon-arrow-up'>↑</span>,
    IconArrowDown: () => <span data-testid='icon-arrow-down'>↓</span>,
    IconSearch: ({ id }: { id?: string }) => (
        <span data-testid='icon-search' id={id}>
            🔍
        </span>
    ),
    IconChevronDown: () => <span data-testid='icon-chevron-down'>▼</span>,
    IconChevronRight: () => <span data-testid='icon-chevron-right'>▶</span>
}))

jest.mock('react-select', () => {
    const MockSelect = ({
        onChange,
        value,
        options,
        isMulti,
        styles
    }: {
        onChange: (val: { label: string; value: string }[]) => void
        value: { label: string; value: string }[]
        options: { label: string; value: string }[]
        isMulti: boolean
        styles?: Record<
            string,
            (base: Record<string, unknown>) => Record<string, unknown>
        >
    }) => {
        return (
            <select
                data-testid='mock-select'
                data-styles={styles ? JSON.stringify(Object.keys(styles)) : ''}
                multiple={isMulti}
                value={value.map(v => v.value)}
                onChange={e => {
                    const selected = Array.from(
                        e.target.selectedOptions,
                        opt => {
                            const found = options.find(
                                o => o.value === opt.value
                            )
                            return (
                                found || {
                                    label: opt.value,
                                    value: opt.value
                                }
                            )
                        }
                    )
                    onChange(selected)
                }}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        )
    }
    return MockSelect
})

jest.mock('@/app/company-domains/domain-api-page.module.css', () => ({
    domainApiSearch: 'domainApiSearch',
    tableHeader: 'tableHeader',
    expandedRowOverride: 'expandedRowOverride'
}))

const mockColumns: Column[] = [
    { key: 'api_nm', name: 'API Name', title: 'API Name', isSortable: true },
    {
        key: 'api_endpoint_metadata_type',
        name: 'Type',
        title: 'Type',
        isSortable: true
    },
    {
        key: 'status',
        name: 'Status',
        title: 'Status',
        isSortable: false
    }
]

const createMockData = (overrides?: Partial<HistoryData>[]): HistoryData[] => [
    {
        api_metadata_id: 'api-1',
        api_endpoint_metadata_id: 'ep-1',
        api_endpoint_metadata_type: 'Type A',
        expanded: false,
        history: [],
        ...overrides?.[0]
    } as HistoryData,
    {
        api_metadata_id: 'api-2',
        api_endpoint_metadata_id: 'ep-2',
        api_endpoint_metadata_type: 'Type B',
        expanded: false,
        history: [],
        ...overrides?.[1]
    } as HistoryData,
    {
        api_metadata_id: 'api-3',
        api_endpoint_metadata_id: 'ep-3',
        api_endpoint_metadata_type: 'Type A',
        expanded: false,
        history: [],
        ...overrides?.[2]
    } as HistoryData
]

describe('ApiEndPointTable', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('renders search input and filter when isSearch is true (default)', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={false}
            />
        )

        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
        expect(screen.getByText('Search:')).toBeInTheDocument()
        expect(screen.getByText('Filter by:')).toBeInTheDocument()
        expect(screen.getByTestId('mock-select')).toBeInTheDocument()
    })

    it('does not render search input when isSearch is false', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={false}
                isSearch={false}
            />
        )

        expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument()
        expect(screen.queryByTestId('mock-select')).not.toBeInTheDocument()
    })

    it('renders loading spinner when isLoading is true', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={true}
            />
        )

        expect(
            document.querySelector('[class*="spinner"]') ||
                document.querySelector('[data-scope="spinner"]')
        ).toBeTruthy()
    })

    it('renders "No results found" when isLoading is false and data is empty', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={[]}
                isLoading={false}
            />
        )

        expect(screen.getByText('No results found.')).toBeInTheDocument()
    })

    it('renders table with data rows', () => {
        const data = createMockData()
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        expect(screen.getByText('API Name')).toBeInTheDocument()
        expect(screen.getByText('Type')).toBeInTheDocument()
        expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('renders column headers with sort icons for sortable columns', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={false}
            />
        )

        // Sortable columns show both up/down arrows initially
        const arrowUps = screen.getAllByTestId('icon-arrow-up')
        const arrowDowns = screen.getAllByTestId('icon-arrow-down')
        expect(arrowUps.length).toBeGreaterThan(0)
        expect(arrowDowns.length).toBeGreaterThan(0)
    })

    it('sorts data ascending on first column header click', () => {
        const data = createMockData([
            { api_nm: 'Zebra API' } as Partial<HistoryData>,
            { api_nm: 'Alpha API' } as Partial<HistoryData>,
            { api_nm: 'Middle API' } as Partial<HistoryData>
        ])

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const apiNameHeader = screen.getByTitle('API Name')
        fireEvent.click(apiNameHeader)

        const rows = screen.getAllByRole('row')
        // First row is header, subsequent rows are data
        const cells = rows.slice(1).map(row => row.querySelectorAll('td'))
        // After ASC sort: Alpha, Middle, Zebra
        expect(cells[0][1]?.textContent).toBe('Alpha API')
        expect(cells[1][1]?.textContent).toBe('Middle API')
        expect(cells[2][1]?.textContent).toBe('Zebra API')
    })

    it('sorts data descending on second click of same column header', () => {
        const data = createMockData([
            { api_nm: 'Zebra API' } as Partial<HistoryData>,
            { api_nm: 'Alpha API' } as Partial<HistoryData>,
            { api_nm: 'Middle API' } as Partial<HistoryData>
        ])

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const apiNameHeader = screen.getByTitle('API Name')
        fireEvent.click(apiNameHeader) // ASC
        fireEvent.click(apiNameHeader) // DESC

        const rows = screen.getAllByRole('row')
        const cells = rows.slice(1).map(row => row.querySelectorAll('td'))
        // After DESC sort: Zebra, Middle, Alpha
        expect(cells[0][1]?.textContent).toBe('Zebra API')
        expect(cells[1][1]?.textContent).toBe('Middle API')
        expect(cells[2][1]?.textContent).toBe('Alpha API')
    })

    it('does not sort when a non-sortable column header is clicked', () => {
        const data = createMockData([
            { status: 'Active' } as Partial<HistoryData>,
            { status: 'Inactive' } as Partial<HistoryData>,
            { status: 'Pending' } as Partial<HistoryData>
        ])

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const statusHeader = screen.getByTitle('Status')
        fireEvent.click(statusHeader)

        // Order should remain unchanged
        const rows = screen.getAllByRole('row')
        const cells = rows.slice(1).map(row => row.querySelectorAll('td'))
        expect(cells[0][3]?.textContent).toBe('Active')
        expect(cells[1][3]?.textContent).toBe('Inactive')
        expect(cells[2][3]?.textContent).toBe('Pending')
    })

    it('filters data by search input', async () => {
        const data = createMockData([
            { api_nm: 'Payment API' } as Partial<HistoryData>,
            { api_nm: 'User API' } as Partial<HistoryData>,
            { api_nm: 'Payment Service' } as Partial<HistoryData>
        ])

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const searchInput = screen.getByPlaceholderText('Search')
        fireEvent.change(searchInput, { target: { value: 'Payment' } })

        await waitFor(() => {
            const rows = screen.getAllByRole('row')
            // header + 2 matching rows
            expect(rows.length).toBe(3)
        })
    })

    it('filters by Type A only when Type B is deselected', async () => {
        const data = createMockData()

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const select = screen.getByTestId('mock-select')
        const options = select.querySelectorAll('option')
        ;(options[0] as HTMLOptionElement).selected = true
        ;(options[1] as HTMLOptionElement).selected = false
        fireEvent.change(select)

        await waitFor(() => {
            const rows = screen.getAllByRole('row')
            // header + Type A rows only (api-1 and api-3)
            expect(rows.length).toBe(3)
        })
    })

    it('filters by Type B only when Type A is deselected', async () => {
        const data = createMockData()

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const select = screen.getByTestId('mock-select')
        const options = select.querySelectorAll('option')
        ;(options[0] as HTMLOptionElement).selected = false
        ;(options[1] as HTMLOptionElement).selected = true
        fireEvent.change(select)

        await waitFor(() => {
            const rows = screen.getAllByRole('row')
            // header + Type B rows only (api-2)
            expect(rows.length).toBe(2)
        })
    })

    it('expands a row on chevron click and shows history table', async () => {
        const { scrollToExpandedData } = jest.requireMock(
            '@/app/company-domains/utils'
        )

        const data = createMockData([
            { history: [{ creat_user_nm: 'John' }] } as Partial<HistoryData>
        ])

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        // Click first row's chevron
        const chevrons = screen.getAllByTestId('icon-chevron-right')
        fireEvent.click(chevrons[0].closest('td')!)

        jest.runAllTimers()

        await waitFor(() => {
            expect(
                screen.getByTestId('api-status-history-table')
            ).toBeInTheDocument()
        })

        expect(scrollToExpandedData).toHaveBeenCalledWith(
            'api-1',
            'row-api-api-1'
        )
    })

    it('collapses an expanded row on second chevron click', async () => {
        const data = createMockData()

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        // Click to expand
        const chevrons = screen.getAllByTestId('icon-chevron-right')
        fireEvent.click(chevrons[0].closest('td')!)

        jest.runAllTimers()

        await waitFor(() => {
            expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument()
        })

        // Click to collapse
        const chevronDown = screen.getByTestId('icon-chevron-down')
        fireEvent.click(chevronDown.closest('td')!)

        jest.runAllTimers()

        await waitFor(() => {
            expect(
                screen.queryByTestId('api-status-history-table')
            ).not.toBeInTheDocument()
        })
    })

    it('only expands one row at a time', async () => {
        const data = createMockData()

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        // Expand first row
        const chevrons = screen.getAllByTestId('icon-chevron-right')
        fireEvent.click(chevrons[0].closest('td')!)
        jest.runAllTimers()

        await waitFor(() => {
            expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument()
        })

        // Expand second row - first should collapse
        const remainingChevrons = screen.getAllByTestId('icon-chevron-right')
        fireEvent.click(remainingChevrons[0].closest('td')!)
        jest.runAllTimers()

        await waitFor(() => {
            // Only one expanded row at a time
            const historyTables = screen.getAllByTestId(
                'api-status-history-table'
            )
            expect(historyTables.length).toBe(1)
        })
    })

    it('handles null values in data cells gracefully', () => {
        const data = [
            {
                api_metadata_id: 'api-1',
                api_endpoint_metadata_id: 'ep-1',
                api_endpoint_metadata_type: 'Type A',
                expanded: false,
                history: [],
                api_nm: null,
                status: undefined
            } as unknown as HistoryData
        ]

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const rows = screen.getAllByRole('row')
        expect(rows.length).toBe(2) // header + 1 data row
    })

    it('handles sort with null values', () => {
        const data = [
            {
                api_metadata_id: 'api-1',
                api_endpoint_metadata_id: 'ep-1',
                api_endpoint_metadata_type: 'Type A',
                expanded: false,
                history: [],
                api_nm: null
            } as unknown as HistoryData,
            {
                api_metadata_id: 'api-2',
                api_endpoint_metadata_id: 'ep-2',
                api_endpoint_metadata_type: 'Type B',
                expanded: false,
                history: [],
                api_nm: 'Beta'
            } as unknown as HistoryData
        ]

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        const apiNameHeader = screen.getByTitle('API Name')
        fireEvent.click(apiNameHeader)

        // Should not crash
        const rows = screen.getAllByRole('row')
        expect(rows.length).toBe(3) // header + 2 data rows
    })

    it('updates table data when external data prop changes', async () => {
        const data1 = createMockData([
            { api_nm: 'Original API' } as Partial<HistoryData>
        ])
        const data2 = [
            {
                api_metadata_id: 'api-new',
                api_endpoint_metadata_id: 'ep-new',
                api_endpoint_metadata_type: 'Type A',
                expanded: false,
                history: [],
                api_nm: 'Updated API'
            } as unknown as HistoryData
        ]

        const { rerender } = render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data1}
                isLoading={false}
            />
        )

        rerender(
            <ApiEndPointTable
                columns={mockColumns}
                data={data2}
                isLoading={false}
            />
        )

        await waitFor(() => {
            expect(screen.getByText('Updated API')).toBeInTheDocument()
        })
    })

    it('shows both filter types when both are selected (default)', () => {
        const data = createMockData()

        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={data}
                isLoading={false}
            />
        )

        // Default has both typeA and typeB selected, all 3 rows visible
        const rows = screen.getAllByRole('row')
        expect(rows.length).toBe(4) // header + 3 data rows
    })

    it('renders sort icon as ASC arrow after ascending sort', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={false}
            />
        )

        const apiNameHeader = screen.getByTitle('API Name')
        fireEvent.click(apiNameHeader)

        // After clicking once, should show single up arrow for that column
        // The sorted column shows either up or down icon
        expect(
            apiNameHeader.querySelector('[data-testid="icon-arrow-up"]')
        ).toBeInTheDocument()
    })

    it('renders sort icon as DESC arrow after descending sort', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={false}
            />
        )

        const apiNameHeader = screen.getByTitle('API Name')
        fireEvent.click(apiNameHeader) // ASC
        fireEvent.click(apiNameHeader) // DESC

        expect(
            apiNameHeader.querySelector('[data-testid="icon-arrow-down"]')
        ).toBeInTheDocument()
    })

    it('does not render sort icon for non-sortable columns', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={false}
            />
        )

        const statusHeader = screen.getByTitle('Status')
        expect(
            statusHeader.querySelector('[data-testid="icon-arrow-up"]')
        ).not.toBeInTheDocument()
        expect(
            statusHeader.querySelector('[data-testid="icon-arrow-down"]')
        ).not.toBeInTheDocument()
    })

    it('renders search icon in search input', () => {
        render(
            <ApiEndPointTable
                columns={mockColumns}
                data={createMockData()}
                isLoading={false}
            />
        )

        expect(screen.getByTestId('icon-search')).toBeInTheDocument()
    })
})
