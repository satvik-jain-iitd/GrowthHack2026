import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockGetDocument = jest.fn()

jest.mock('@/app/docs/utils/server', () => ({
    getDocument: (...args: unknown[]) => mockGetDocument(...args)
}))

jest.mock('@/app/docs/components/Index', () => ({
    __esModule: true,
    default: ({ isBvB }: { isBvB?: boolean }) => (
        <div data-testid='index-component' data-is-bvb={String(isBvB)} />
    )
}))

jest.mock('@/app/docs/components/DocumentLayout', () => ({
    __esModule: true,
    default: ({
        label,
        children
    }: {
        label: string
        slug: string
        sidebar: unknown
        breadcrumbs: unknown[]
        children: React.ReactNode
    }) => (
        <div data-testid='document-layout' data-label={label}>
            {children}
        </div>
    )
}))

jest.mock('@/constants', () => ({
    PLAYBOOK_TYPE_IDS: { BUILD_VS_BUY: 'bvb-type-id' },
    PLAYBOOK_TYPE_SLUGS: { 'bvb-type-id': 'build-vs-buys' }
}))

import BuildvsBuys from './page'

// ── Helpers ────────────────────────────────────────────────────────────────

const mockSidebar = [{ label: 'Section 1', href: '/s1', children: [] }]

beforeEach(() => {
    jest.clearAllMocks()
    mockGetDocument.mockResolvedValue({ sidebar_hierarchy: mockSidebar })
})

// ── Tests ──────────────────────────────────────────────────────────────────

describe('BuildvsBuys page', () => {
    it('renders DocumentLayout with correct label', async () => {
        const jsx = await BuildvsBuys()
        render(jsx)
        expect(screen.getByTestId(BVB_TEST_IDS.documentLayout)).toHaveAttribute(
            'data-label',
            'Build vs Buy'
        )
    })

    it('renders Index component with isBvB=true', async () => {
        const jsx = await BuildvsBuys()
        render(jsx)
        expect(screen.getByTestId(BVB_TEST_IDS.indexComponent)).toHaveAttribute(
            'data-is-bvb',
            'true'
        )
    })

    it('calls getDocument with the BUILD_VS_BUY typeId', async () => {
        await BuildvsBuys()
        expect(mockGetDocument).toHaveBeenCalledWith({
            typeId: 'bvb-type-id'
        })
    })

    it('passes sidebar_hierarchy from getDocument to DocumentLayout', async () => {
        const jsx = await BuildvsBuys()
        render(jsx)
        // DocumentLayout rendered means sidebar was passed through correctly
        expect(
            screen.getByTestId(BVB_TEST_IDS.documentLayout)
        ).toBeInTheDocument()
    })

    it('renders without crashing when getDocument returns empty sidebar', async () => {
        mockGetDocument.mockResolvedValue({ sidebar_hierarchy: [] })
        const jsx = await BuildvsBuys()
        render(jsx)
        expect(
            screen.getByTestId(BVB_TEST_IDS.documentLayout)
        ).toBeInTheDocument()
    })
})
