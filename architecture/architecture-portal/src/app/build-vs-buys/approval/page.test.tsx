import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockGetBvBPlaybooks = jest.fn()

jest.mock('@/app/resources/bvb-tracker/utils/server', () => ({
    getBvBPlaybooks: (...args: unknown[]) => mockGetBvBPlaybooks(...args)
}))

jest.mock('@/app/resources/bvb-tracker/hooks/useGetBvBPlaybooks', () => ({
    BVB_PLAYBOOKS_QUERY_KEY: ['bvb-playbooks']
}))

jest.mock('@/app/build-vs-buys/approval/BvBAcceptanceList', () => ({
    __esModule: true,
    default: () => <div data-testid='bvb-acceptance-page'>Acceptance Page</div>
}))

jest.mock('@tanstack/react-query', () => {
    const actual = jest.requireActual('@tanstack/react-query')
    return {
        ...actual,
        dehydrate: jest.fn(() => ({ mutations: [], queries: [] }))
    }
})

import BvBApproval from './page'

// ── Tests ──────────────────────────────────────────────────────────────────

beforeEach(() => {
    jest.clearAllMocks()
    mockGetBvBPlaybooks.mockResolvedValue([])
})

describe('BvBApproval page', () => {
    it('renders the BvBAcceptancePage inside a Box', async () => {
        const jsx = await BvBApproval()
        render(jsx)
        expect(
            screen.getByTestId(BVB_TEST_IDS.acceptancePage)
        ).toBeInTheDocument()
    })

    it('renders the page content wrapper with class "page-content"', async () => {
        const jsx = await BvBApproval()
        const { container } = render(jsx)
        expect(container.querySelector('.page-content')).toBeInTheDocument()
    })

    it('calls getBvBPlaybooks to prefetch query data', async () => {
        await BvBApproval()
        expect(mockGetBvBPlaybooks).toHaveBeenCalledTimes(1)
    })

    it('renders without crashing when getBvBPlaybooks returns data', async () => {
        mockGetBvBPlaybooks.mockResolvedValue([
            { id: '1', playbook_nm: 'Test Playbook' }
        ])
        const jsx = await BvBApproval()
        render(jsx)
        expect(
            screen.getByTestId(BVB_TEST_IDS.acceptancePage)
        ).toBeInTheDocument()
    })

    it('renders without crashing when getBvBPlaybooks rejects', async () => {
        mockGetBvBPlaybooks.mockRejectedValue(new Error('Network error'))
        // prefetchQuery swallows errors, component should still render
        const jsx = await BvBApproval()
        render(jsx)
        expect(
            screen.getByTestId(BVB_TEST_IDS.acceptancePage)
        ).toBeInTheDocument()
    })
})
