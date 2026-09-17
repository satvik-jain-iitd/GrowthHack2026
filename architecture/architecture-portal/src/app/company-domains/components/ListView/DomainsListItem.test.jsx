import React from 'react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen, fireEvent } from '@testing-library/react'
import { Table } from '@chakra-ui/react'
import { DomainsListItem } from './DomainsListItem'
import { render } from '@/test/utils/test-utils'

const mockPush = jest.fn()
jest.mock('@/hooks', () => ({
    useNavigation: jest.fn(() => ({
        push: mockPush
    })),
    usePlaybookAnalytics: jest.fn(() => ({}))
}))

jest.mock('@/app/company-domains/constants', () => ({
    VERSION_1_DOMAINS_UUIDS: new Set(['domain-1'])
}))
// Helper to render component within Table and QueryClient context
const renderWithTable = ui => {
    const queryClient = new QueryClient()
    return render(
        <QueryClientProvider client={queryClient}>
            <Table.Root>
                <Table.Body>{ui}</Table.Body>
            </Table.Root>
        </QueryClientProvider>
    )
}
describe('DomainsListItem', () => {
    const defaultProps = {
        category: 'Group A',
        title: 'Domain Title',
        imgSrcDM: 'img-dark',
        imgSrcLM: 'img-light',
        imgSrcFilledDM: 'img-filled-dark',
        imgSrcFilledLM: 'img-filled-light',
        noContributions: false,
        description: 'Domain Description',
        domainId: 'domain-1',
        playbookId: 'playbook-1',
        EARBApproved: true,
        isv1: true
    }

    it('renders domain details', () => {
        renderWithTable(<DomainsListItem {...defaultProps} />)
        expect(screen.getByText('Domain Title')).toBeInTheDocument()
        expect(screen.getByText('Group A')).toBeInTheDocument()
        expect(screen.getByText('Domain Description')).toBeInTheDocument()
    })
    it('renders V1 version badge when domain is in VERSION_1_DOMAINS_UUIDS', () => {
        renderWithTable(<DomainsListItem {...defaultProps} />)
        expect(screen.getByText('V1')).toBeInTheDocument()
    })

    it('shows filled image on hover', () => {
        renderWithTable(<DomainsListItem {...defaultProps} />)
        const row = screen.getByRole('row')
        fireEvent.mouseEnter(row)
        const img = screen.getAllByRole('img')
        expect(img[1].src).toContain(defaultProps.imgSrcFilledDM)
        fireEvent.mouseLeave(row)
        expect(img[1].src).toContain(defaultProps.imgSrcDM)
    })
    it('navigates to link on click', () => {
        renderWithTable(<DomainsListItem {...defaultProps} />)
        fireEvent.click(screen.getByRole('row'))
        expect(mockPush).toHaveBeenCalledWith('/docs/playbook-1')
    })
    it('renders evolving badge if domainId not in version 1', () => {
        renderWithTable(
            <DomainsListItem {...defaultProps} domainId='unknown-domain' />
        )
        expect(screen.getByText('E')).toBeInTheDocument()
    })
})
