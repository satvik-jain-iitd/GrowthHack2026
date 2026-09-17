import { parseMarkdownToItems } from './parseMarkdownToItems'
import { mockMarkdown, mockMarkdownNoHeadings } from './test-data'

const mockRewriteImagePaths = jest.fn()

const mockProcess = jest.fn(async (input: string) => `<p>${input}</p>`)

jest.mock('remark', () => ({
    remark: () => ({
        use: () => ({
            process: (input: string) => mockProcess(input)
        })
    })
}))

jest.mock('remark-html', () => ({
    __esModule: true,
    default: {}
}))

jest.mock('@/app/docs/utils/server', () => ({
    rewriteImagePaths: (...args: unknown[]) => mockRewriteImagePaths(...args)
}))

describe('parseMarkdownToItems', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockRewriteImagePaths.mockImplementation((md: string) => md)
        mockProcess.mockImplementation(
            async (input: string) => `<p>${input}</p>`
        )
    })

    it('parses markdown headings into FAQ items', async () => {
        const result = await parseMarkdownToItems(
            mockMarkdown,
            'architecture-portal-docs',
            'docs/faqs/01-general.md'
        )

        expect(result).toHaveLength(2)
        expect(result[0].id).toBe('what-is-architecture-portal')
        expect(result[0].q).toBe('What is Architecture Portal?')
        expect(result[0].a.length).toBeGreaterThan(0)
    })

    it('returns empty array when markdown has no heading items', async () => {
        const result = await parseMarkdownToItems(
            mockMarkdownNoHeadings,
            'architecture-portal-docs',
            'docs/faqs/01-general.md'
        )

        expect(result).toEqual([])
    })

    it('calls rewriteImagePaths with raw markdown and source metadata', async () => {
        await parseMarkdownToItems(
            mockMarkdown,
            'architecture-portal-docs',
            'docs/faqs/01-general.md'
        )

        expect(mockRewriteImagePaths).toHaveBeenCalledWith(
            mockMarkdown,
            'architecture-portal-docs',
            'docs/faqs/01-general.md',
            'ghe'
        )
    })
})
