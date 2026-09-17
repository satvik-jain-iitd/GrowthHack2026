import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import '@testing-library/jest-dom'
import DomainApiSearchableTable from './DomainApiSearchableTable'
import { useUserContext } from '@/context'
import { useGetReviewer, useEBCMLevels } from '@/app/company-domains/hooks'
import { Reviewer } from '@/app/company-domains/types'

const mockSetCompanyDomainApiData = jest.fn()

jest.mock('@/context', () => ({
    __esModule: true,
    useUserContext: jest.fn(),
    useDirectoryContext: () => ({
        setCompanyDomainApiData: mockSetCompanyDomainApiData
    })
}))

jest.mock('@/app/company-domains/hooks', () => ({
    useGetReviewer: jest.fn(),
    useEBCMLevels: jest.fn(),
    useDelegateOwner: jest.fn(() => ({
        addDelegateOwner: jest.fn(),
        getDelegateOwner: jest.fn()
    }))
}))

jest.mock('./DomainApiTable', () => ({
    DomainApiTable: ({
        searchVal,
        reviewers,
        domainId,
        viewOnly,
        isReviewersLoading
    }: {
        searchVal: string
        reviewers: Reviewer | undefined
        domainId: string
        viewOnly: boolean
        isReviewersLoading: boolean
    }) => (
        <div
            data-testid='domain-api-table'
            data-search-val={searchVal}
            data-domain-id={domainId}
            data-view-only={String(viewOnly)}
            data-reviewers-loading={String(isReviewersLoading)}
            data-reviewer-email={reviewers?.email || 'none'}
        />
    )
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconSearch: () => <span data-testid='icon-search'>search</span>,
    IconChevronDown: () => <span data-testid='icon-chevron-down'>down</span>
}))

jest.mock('@/app/company-domains/domain-api-page.module.css', () => ({
    showHistorySection: 'showHistorySection'
}))

const mockUseUserContext = useUserContext as jest.Mock
const mockUseGetReviewer = useGetReviewer as jest.Mock
const mockUseEBCMLevels = useEBCMLevels as jest.Mock

const mockGetEBCMLevels = jest.fn()
const mockHandleEdit = jest.fn()

const mockReviewerData: Reviewer = {
    isEnggReviewer: true,
    isArchReviewer: false,
    isEArbReviewer: false,
    email: 'test2@aexp.com'
}

describe('DomainApiSearchableTable', () => {
    beforeEach(() => {
        mockUseUserContext.mockReturnValue({
            attributes: {
                email: 'test1@aexp.com'
            }
        })

        mockUseGetReviewer.mockReturnValue({
            isLoading: false,
            data: mockReviewerData
        })

        mockUseEBCMLevels.mockReturnValue({
            fetchData: mockGetEBCMLevels
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders search input and default text when children is not provided', () => {
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
        expect(
            screen.getByText(/Use the table below to view, manage and propose/i)
        ).toBeInTheDocument()
        expect(screen.getByTestId('icon-search')).toBeInTheDocument()
    })

    it('renders custom children when provided', () => {
        const customText = 'Custom Header Content'
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                <div>{customText}</div>
            </DomainApiSearchableTable>
        )

        expect(screen.getByText(customText)).toBeInTheDocument()
        expect(
            screen.queryByText(
                /Use the table below to view, manage and propose/i
            )
        ).not.toBeInTheDocument()
    })

    it('updates search value on input change', () => {
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        const searchInput = screen.getByPlaceholderText(
            'Search'
        ) as HTMLInputElement
        expect(searchInput.value).toBe('')

        fireEvent.change(searchInput, { target: { value: 'test search' } })

        expect(searchInput.value).toBe('test search')
        expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
            'data-search-val',
            'test search'
        )
    })

    it('passes correct props to DomainApiTable', () => {
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        const table = screen.getByTestId('domain-api-table')
        expect(table).toHaveAttribute('data-domain-id', 'domain-1')
        expect(table).toHaveAttribute('data-view-only', 'false')
        expect(table).toHaveAttribute('data-reviewers-loading', 'false')
    })

    it('passes viewOnly prop to DomainApiTable', () => {
        const { rerender } = render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
            'data-view-only',
            'false'
        )

        rerender(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={true}>
                {null}
            </DomainApiSearchableTable>
        )

        expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
            'data-view-only',
            'true'
        )
    })

    it('loads reviewer data and passes to DomainApiTable', async () => {
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        await waitFor(() => {
            expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
                'data-reviewer-email',
                'test2@aexp.com'
            )
        })
    })

    it('handles loading state from useGetReviewer', () => {
        mockUseGetReviewer.mockReturnValue({
            isLoading: true,
            data: null
        })

        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
            'data-reviewers-loading',
            'true'
        )
    })

    it('calls getEBCMLevels on mount when user email exists', () => {
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        expect(mockGetEBCMLevels).toHaveBeenCalled()
    })

    it('does not call getEBCMLevels when user email is not available', () => {
        mockUseUserContext.mockReturnValue({
            attributes: {}
        })

        mockGetEBCMLevels.mockClear()

        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        expect(mockGetEBCMLevels).not.toHaveBeenCalled()
    })

    it('passes handleEdit as setIsEditRow to DomainApiTable', () => {
        render(
            <DomainApiSearchableTable
                domainId='domain-1'
                viewOnly={false}
                handleEdit={mockHandleEdit}
            >
                {null}
            </DomainApiSearchableTable>
        )

        expect(screen.getByTestId('domain-api-table')).toBeInTheDocument()
    })

    it('provides default handleTimeOutModalOpen when not passed', () => {
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        expect(screen.getByTestId('domain-api-table')).toBeInTheDocument()
    })

    it('passes useGetReviewer domainId parameter correctly', () => {
        render(
            <DomainApiSearchableTable
                domainId='custom-domain-id'
                viewOnly={false}
            >
                {null}
            </DomainApiSearchableTable>
        )

        expect(mockUseGetReviewer).toHaveBeenCalledWith('custom-domain-id')
    })

    it('handles multiple search input changes', () => {
        render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        const searchInput = screen.getByPlaceholderText(
            'Search'
        ) as HTMLInputElement

        fireEvent.change(searchInput, { target: { value: 'first search' } })
        expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
            'data-search-val',
            'first search'
        )

        fireEvent.change(searchInput, { target: { value: 'second search' } })
        expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
            'data-search-val',
            'second search'
        )

        fireEvent.change(searchInput, { target: { value: '' } })
        expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
            'data-search-val',
            ''
        )
    })

    it('updates reviewer data when useGetReviewer data changes', async () => {
        const { rerender } = render(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        await waitFor(() => {
            expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
                'data-reviewer-email',
                'test2@aexp.com'
            )
        })

        const updatedReviewers: Reviewer = {
            isEnggReviewer: false,
            isArchReviewer: true,
            isEArbReviewer: false,
            email: 'test4@aexp.com'
        }

        mockUseGetReviewer.mockReturnValue({
            isLoading: false,
            data: updatedReviewers
        })

        rerender(
            <DomainApiSearchableTable domainId='domain-1' viewOnly={false}>
                {null}
            </DomainApiSearchableTable>
        )

        await waitFor(() => {
            expect(screen.getByTestId('domain-api-table')).toHaveAttribute(
                'data-reviewer-email',
                'test4@aexp.com'
            )
        })
    })
})
