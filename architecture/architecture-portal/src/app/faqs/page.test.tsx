import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'
import { mockFaqGroups } from '@/app/faqs/test-data'

const mockGetFaqGroupsFromMarkdown = jest.fn()

jest.mock('@/app/faqs/utils', () => ({
    getFaqGroupsFromMarkdown: (...args: unknown[]) =>
        mockGetFaqGroupsFromMarkdown(...args)
}))

jest.mock('@/app/faqs/components', () => ({
    FrequentlyAskedQuestions: ({ faqs }: { faqs: unknown[] }) => (
        <div
            data-testid='mock-faq-component'
            data-count={String(faqs.length)}
        />
    )
}))

import FAQs from './page'

describe('FAQs page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockGetFaqGroupsFromMarkdown.mockResolvedValue(mockFaqGroups)
    })

    it('fetches faq groups from expected docs repository and path', async () => {
        await FAQs()

        expect(mockGetFaqGroupsFromMarkdown).toHaveBeenCalledWith(
            'architecture-portal-docs',
            'docs/faqs'
        )
    })

    it('renders page container and faq component', async () => {
        const jsx = await FAQs()
        render(jsx)

        expect(
            screen.getByTestId(FAQ_TEST_IDS.pageContainer)
        ).toBeInTheDocument()
        expect(screen.getByTestId('mock-faq-component')).toHaveAttribute(
            'data-count',
            String(mockFaqGroups.length)
        )
    })
})
