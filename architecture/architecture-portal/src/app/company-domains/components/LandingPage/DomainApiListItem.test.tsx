import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { Table } from '@chakra-ui/react'
import { render } from '@/test/utils/test-utils'
import { DomainApiListItem } from './DomainApiListItem'
import { scrollToExpandedData } from '@/app/company-domains/utils'
import { getAbsoluteApiUrl } from '@/app/company-domains/constants'
import { ApiMetadata } from '@/app/company-domains/types'

jest.mock('@/app/company-domains/utils', () => ({
    scrollToExpandedData: jest.fn()
}))

jest.mock('@/app/company-domains/constants', () => ({
    getAbsoluteApiUrl: jest.fn(
        (domainId: string, apiMetadataId: string) =>
            `https://architecture.example.com/${domainId}#${apiMetadataId}`
    )
}))

jest.mock('./Status', () => ({
    __esModule: true,
    default: ({ data }: { data: { status: string } }) => (
        <div data-testid='status-badge'>{data?.status || 'unknown'}</div>
    )
}))

jest.mock('./CopyApiUrlButton', () => ({
    CopyApiUrlButton: ({
        apiUrl,
        isTableRow
    }: {
        apiUrl: string
        isTableRow?: boolean
    }) => (
        <button
            data-testid='copy-api-url-btn'
            data-url={apiUrl}
            data-table-row={String(Boolean(isTableRow))}
        >
            Copy
        </button>
    )
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconChevronDown: () => <span data-testid='icon-chevron-down'>down</span>,
    IconChevronRight: () => <span data-testid='icon-chevron-right'>right</span>,
    IconTrash: () => <span data-testid='icon-trash'>trash</span>
}))

jest.mock('@/app/company-domains/domain-api-page.module.css', () => ({
    domainApiListItemRow: 'domainApiListItemRow',
    apiDescriptionText: 'apiDescriptionText',
    deleteIcon: 'deleteIcon'
}))

jest.mock('@/components/ui/CodeText', () => ({
    __esModule: true,
    default: ({ text }: { text: string }) => (
        <span data-testid='code-text'>{text}</span>
    )
}))

jest.mock('../Modals', () => ({
    ConfirmationModal: () => <div data-testid='confirmation-modal' />
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: { alt: string }) => (
        <img data-testid='next-image' alt={props.alt} />
    )
}))

const mockScrollToExpandedData = scrollToExpandedData as jest.Mock
const mockGetAbsoluteApiUrl = getAbsoluteApiUrl as jest.Mock

const mockReloadData = jest.fn()
const mockHandleExpandRowClick = jest.fn()

const baseData = {
    api_metadata_id: 'api-123',
    api_nm: 'Payments API',
    sub_company_domain_name: 'Payments Processing',
    api_ds: 'Primary payments API for internal integrations',
    api_resource: 'payments-resource',
    status: 'DRAFT',
    add_da: {},
    api_endpoint: []
} as unknown as ApiMetadata

const getDefaultProps = (): React.ComponentProps<typeof DomainApiListItem> => ({
    data: baseData,
    domainId: 'domain-1',
    reloadData: mockReloadData,
    rowExpanded: false,
    handleExpandRowClick: mockHandleExpandRowClick
})

const renderWithTable = (ui: React.ReactElement) => {
    return render(
        <Table.Root>
            <Table.Body>
                <Table.Row>{ui}</Table.Row>
            </Table.Body>
        </Table.Root>
    )
}

describe('DomainApiListItem', () => {
    beforeEach(() => {
        mockGetAbsoluteApiUrl.mockClear()
        mockScrollToExpandedData.mockClear()
        mockHandleExpandRowClick.mockClear()
    })

    it('renders row values, status, and copy URL button', () => {
        renderWithTable(<DomainApiListItem {...getDefaultProps()} />)

        expect(screen.getByText('Payments API')).toBeInTheDocument()
        expect(screen.getByText('payments-resource')).toBeInTheDocument()
        expect(screen.getByText('Payments Processing')).toBeInTheDocument()
        expect(
            screen.getByText('Primary payments API for internal integrations')
        ).toBeInTheDocument()
        expect(screen.getByTestId('status-badge')).toHaveTextContent('DRAFT')

        expect(screen.getByTestId('copy-api-url-btn')).toHaveAttribute(
            'data-url',
            'https://architecture.example.com/domain-1#api-123'
        )
        expect(screen.getByTestId('copy-api-url-btn')).toHaveAttribute(
            'data-table-row',
            'true'
        )
        expect(mockGetAbsoluteApiUrl).toHaveBeenCalledWith(
            'domain-1',
            'api-123'
        )
    })

    it('uses fallback values when fields are empty', () => {
        renderWithTable(
            <DomainApiListItem
                {...getDefaultProps()}
                data={
                    {
                        ...baseData,
                        api_nm: '',
                        api_resource: undefined,
                        sub_company_domain_name: '',
                        api_ds: ''
                    } as unknown as ApiMetadata
                }
            />
        )

        const fallbackValues = screen.getAllByText('--')
        expect(fallbackValues.length).toBeGreaterThanOrEqual(3)
    })

    it('calls handleExpandRowClick with api metadata id on expand cell click', () => {
        renderWithTable(<DomainApiListItem {...getDefaultProps()} />)

        const chevron = screen.getByTestId('icon-chevron-right')
        fireEvent.click(chevron.closest('td')!)

        expect(mockHandleExpandRowClick).toHaveBeenCalledWith('api-123')
    })

    it('shows right chevron when collapsed', () => {
        renderWithTable(
            <DomainApiListItem {...getDefaultProps()} rowExpanded={false} />
        )

        expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument()
        expect(
            screen.queryByTestId('icon-chevron-down')
        ).not.toBeInTheDocument()
        expect(mockScrollToExpandedData).not.toHaveBeenCalled()
    })

    it('shows down chevron when expanded and calls scrollToExpandedData', async () => {
        renderWithTable(
            <DomainApiListItem {...getDefaultProps()} rowExpanded={true} />
        )

        expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument()
        expect(
            screen.queryByTestId('icon-chevron-right')
        ).not.toBeInTheDocument()

        await waitFor(() => {
            expect(mockScrollToExpandedData).toHaveBeenCalledWith(
                'api-123',
                'row-api-123'
            )
        })
    })

    it('renders api_resource via CodeText when available', () => {
        renderWithTable(<DomainApiListItem {...getDefaultProps()} />)

        expect(screen.getByTestId('code-text')).toHaveTextContent(
            'payments-resource'
        )
    })

    it('renders fallback when api_resource is not available', () => {
        renderWithTable(
            <DomainApiListItem
                {...getDefaultProps()}
                data={
                    {
                        ...baseData,
                        api_resource: undefined
                    } as unknown as ApiMetadata
                }
            />
        )

        expect(screen.queryByTestId('code-text')).not.toBeInTheDocument()
    })
})
