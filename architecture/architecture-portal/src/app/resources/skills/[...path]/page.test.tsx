import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import SkillsPage, { generateStaticParams, generateMetadata } from './page'

const mockGetGithubSkillsPaths = jest.fn()
const mockGetGithubSkillsMetadata = jest.fn()
const mockGetGithubSkillsDocument = jest.fn()
const mockReact = React

jest.mock('@/app/resources/skills/utils/getGithubSkillsDocument', () => ({
    getGithubSkillsPaths: (...args: unknown[]) =>
        mockGetGithubSkillsPaths(...args),
    getGithubSkillsMetadata: (...args: unknown[]) =>
        mockGetGithubSkillsMetadata(...args),
    getGithubSkillsDocument: (...args: unknown[]) =>
        mockGetGithubSkillsDocument(...args)
}))

jest.mock('@/components/icons', () => ({
    GitHubIcon: () => <svg data-testid='github-icon' />
}))

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        children,
        ...props
    }: {
        children: React.ReactNode
        [key: string]: unknown
    }) => mockReact.createElement('a', props, children)
}))

jest.mock('@/app/docs/components/Mdx', () => ({
    __esModule: true,
    default: ({ md }: { md: string }) => <div data-testid='mdx'>{md}</div>
}))

jest.mock('@/app/docs/components/Markdown', () => ({
    __esModule: true,
    default: ({ md }: { md: string }) => <div data-testid='markdown'>{md}</div>
}))

jest.mock('@/app/docs/components/DocumentLayout', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <section data-testid='document-layout'>{children}</section>
    )
}))

describe('resources/skills/[...path] page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('generateStaticParams', () => {
        it('returns path arrays split by "/" from GitHub skills paths', async () => {
            mockGetGithubSkillsPaths.mockResolvedValue({
                General: 'docs/skills/1-General.mdx',
                'architecture-mcp/index':
                    'docs/skills/architecture-mcp/index.md',
                'API Strategy': 'docs/skills/2-API Strategy.mdx'
            })

            const result = await generateStaticParams()

            expect(result).toEqual([
                { path: ['General'] },
                { path: ['architecture-mcp', 'index'] },
                { path: ['API Strategy'] }
            ])
        })

        it('returns empty list on fetch failure', async () => {
            mockGetGithubSkillsPaths.mockRejectedValue(new Error('network'))

            await expect(generateStaticParams()).resolves.toEqual([])
        })
    })

    describe('generateMetadata', () => {
        it('joins and decodes multi-segment path before delegating', async () => {
            const metadata = { title: 'Architecture MCP' }
            mockGetGithubSkillsMetadata.mockResolvedValue(metadata)

            const result = await generateMetadata({
                params: Promise.resolve({
                    path: ['architecture-mcp', 'getting-started']
                })
            })

            expect(result).toEqual(metadata)
            expect(mockGetGithubSkillsMetadata).toHaveBeenCalledWith(
                'architecture-mcp/getting-started'
            )
        })

        it('decodes URI-encoded segments', async () => {
            const metadata = { title: 'API Strategy' }
            mockGetGithubSkillsMetadata.mockResolvedValue(metadata)

            await generateMetadata({
                params: Promise.resolve({ path: ['API%20Strategy'] })
            })

            expect(mockGetGithubSkillsMetadata).toHaveBeenCalledWith(
                'API Strategy'
            )
        })

        it('returns fallback title when metadata fetch fails', async () => {
            mockGetGithubSkillsMetadata.mockRejectedValue(new Error('fail'))

            const result = await generateMetadata({
                params: Promise.resolve({ path: ['General'] })
            })

            expect(result).toEqual({ title: 'No skills available' })
        })
    })

    describe('Skills component', () => {
        it('renders mdx content for a single-segment path', async () => {
            mockGetGithubSkillsDocument.mockResolvedValue({
                isMdx: true,
                markdown: '# Hello MDX',
                sidebar: [],
                toc: [],
                headingToc: [],
                breadcrumbs: [{ label: 'General' }],
                prevNext: {},
                status: 'Launched',
                skillGithubUrl:
                    'https://github.com/amex-eng/amex-skills/blob/main/.agents/skills/general/SKILL.md'
            })

            const jsx = await SkillsPage({
                params: Promise.resolve({ path: ['General'] })
            })
            render(jsx)

            expect(mockGetGithubSkillsDocument).toHaveBeenCalledWith('General')
            expect(screen.getByTestId('document-layout')).toBeInTheDocument()
            expect(screen.getByTestId('mdx')).toHaveTextContent('# Hello MDX')
            expect(screen.queryByTestId('markdown')).not.toBeInTheDocument()
        })

        it('renders markdown content for a multi-segment path (directory skill)', async () => {
            mockGetGithubSkillsDocument.mockResolvedValue({
                isMdx: false,
                markdown: '# Architecture MCP',
                sidebar: [],
                toc: [],
                headingToc: [],
                breadcrumbs: [{ label: 'Architecture Mcp' }],
                prevNext: {},
                status: 'Launched',
                skillGithubUrl: null
            })

            const jsx = await SkillsPage({
                params: Promise.resolve({
                    path: ['architecture-mcp', 'getting-started']
                })
            })
            render(jsx)

            expect(mockGetGithubSkillsDocument).toHaveBeenCalledWith(
                'architecture-mcp/getting-started'
            )
            expect(screen.getByTestId('markdown')).toHaveTextContent(
                '# Architecture MCP'
            )
            expect(screen.queryByTestId('mdx')).not.toBeInTheDocument()
        })

        it('renders status tracker with Launched status and GitHub link', async () => {
            mockGetGithubSkillsDocument.mockResolvedValue({
                isMdx: false,
                markdown: 'content',
                sidebar: [],
                toc: [],
                headingToc: [],
                breadcrumbs: [{ label: 'General' }],
                prevNext: {},
                status: 'Launched',
                skillGithubUrl:
                    'https://github.aexp.com/amex-eng/amex-skills/tree/main/.agents/skills/general'
            })

            const jsx = await SkillsPage({
                params: Promise.resolve({ path: ['General'] })
            })
            render(jsx)

            expect(screen.getByText('Skill Status')).toBeInTheDocument()
            expect(screen.getByText('Launched')).toBeInTheDocument()
            expect(
                screen.getByRole('link', { name: 'View Skill on GitHub' })
            ).toHaveAttribute(
                'href',
                'https://github.aexp.com/amex-eng/amex-skills/tree/main/.agents/skills/general'
            )
        })

        it('renders status tracker with PR Submitted status and no GitHub link', async () => {
            mockGetGithubSkillsDocument.mockResolvedValue({
                isMdx: false,
                markdown: 'content',
                sidebar: [],
                toc: [],
                headingToc: [],
                breadcrumbs: [{ label: 'API Strategy' }],
                prevNext: {},
                status: 'PR Submitted',
                skillGithubUrl: null
            })

            const jsx = await SkillsPage({
                params: Promise.resolve({ path: ['API%20Strategy'] })
            })
            render(jsx)

            expect(screen.getByText('PR Submitted')).toBeInTheDocument()
            expect(
                screen.queryByRole('link', { name: 'View Skill on GitHub' })
            ).not.toBeInTheDocument()
        })

        it('does not render status tracker when both status and URL are null', async () => {
            mockGetGithubSkillsDocument.mockResolvedValue({
                isMdx: false,
                markdown: 'content',
                sidebar: [],
                toc: [],
                headingToc: [],
                breadcrumbs: [{ label: 'General' }],
                prevNext: {},
                status: null,
                skillGithubUrl: null
            })

            const jsx = await SkillsPage({
                params: Promise.resolve({ path: ['General'] })
            })
            render(jsx)

            expect(screen.queryByText('Skill Status')).not.toBeInTheDocument()
        })

        it('falls back to toc when headingToc is undefined', async () => {
            mockGetGithubSkillsDocument.mockResolvedValue({
                isMdx: false,
                markdown: 'content',
                sidebar: [],
                toc: [{ id: 'intro', text: 'Intro', level: 2 }],
                headingToc: undefined,
                breadcrumbs: [{ label: 'General' }],
                prevNext: {},
                status: null,
                skillGithubUrl: null
            })

            const jsx = await SkillsPage({
                params: Promise.resolve({ path: ['General'] })
            })
            render(jsx)

            expect(screen.getByTestId('document-layout')).toBeInTheDocument()
        })

        it('renders fallback when document loading fails', async () => {
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            const failure = new Error('document fail')
            mockGetGithubSkillsDocument.mockRejectedValue(failure)

            const jsx = await SkillsPage({
                params: Promise.resolve({ path: ['General'] })
            })
            render(jsx)

            expect(screen.getByText('No skills available')).toBeInTheDocument()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to load GitHub skills document:',
                failure
            )
            consoleSpy.mockRestore()
        })

        it('renders fallback when getGithubSkillsDocument returns null', async () => {
            mockGetGithubSkillsDocument.mockResolvedValue(null)

            const jsx = await SkillsPage({
                params: Promise.resolve({ path: ['nonexistent'] })
            })
            render(jsx)

            expect(screen.getByText('No skills available')).toBeInTheDocument()
        })
    })
})
