import { getFaqGroupsFromMarkdown } from './getFaqGroupsFromMarkdown'
import { mockGithubFileResponse, mockGithubListingResponse } from './test-data'

const mockFetchGithub = jest.fn()
const mockParseMarkdownToItems = jest.fn()

jest.mock('@/utils/server', () => ({
    fetchGithub: (...args: unknown[]) => mockFetchGithub(...args)
}))

jest.mock('./parseMarkdownToItems', () => ({
    parseMarkdownToItems: (...args: unknown[]) =>
        mockParseMarkdownToItems(...args)
}))

describe('getFaqGroupsFromMarkdown', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns mapped groups for markdown files with parsed items', async () => {
        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockGithubListingResponse
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockGithubFileResponse
            })

        mockParseMarkdownToItems.mockResolvedValue([
            {
                id: 'what-is-architecture-portal',
                q: 'What is Architecture Portal?',
                a: '<p>Internal platform.</p>'
            }
        ])

        const result = await getFaqGroupsFromMarkdown(
            'architecture-portal-docs',
            'docs/faqs'
        )

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('general')
        expect(result[0].title).toBe('general')
        expect(result[0].items).toHaveLength(1)
        expect(result[0].sourceLink).toContain(
            'architecture-portal-docs/blob/main/docs/faqs/01-general.md'
        )
    })

    it('throws when list request fails', async () => {
        mockFetchGithub.mockResolvedValueOnce({ ok: false, status: 500 })

        await expect(
            getFaqGroupsFromMarkdown('architecture-portal-docs', 'docs/faqs')
        ).rejects.toThrow(
            'Failed to fetch FAQ file content from GitHub: [ghe] /repos/amex-eng/architecture-portal-docs/contents/docs/faqs [500]'
        )
    })

    it('throws when file content request fails', async () => {
        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockGithubListingResponse
            })
            .mockResolvedValueOnce({ ok: false, status: 404 })

        mockParseMarkdownToItems.mockResolvedValue([
            {
                id: 'what-is-architecture-portal',
                q: 'What is Architecture Portal?',
                a: '<p>Internal platform.</p>'
            }
        ])

        await expect(
            getFaqGroupsFromMarkdown('architecture-portal-docs', 'docs/faqs')
        ).rejects.toThrow(
            'Failed to fetch FAQ file content from GitHub: [ghe] /repos/amex-eng/architecture-portal-docs/contents/docs/faqs/01-general.md [404]'
        )
    })

    it('filters out markdown files that parse to no items', async () => {
        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockGithubListingResponse
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockGithubFileResponse
            })

        mockParseMarkdownToItems.mockResolvedValue([])

        const result = await getFaqGroupsFromMarkdown(
            'architecture-portal-docs',
            'docs/faqs'
        )

        expect(result).toEqual([])
    })
})
