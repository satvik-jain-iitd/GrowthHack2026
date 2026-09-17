import {
    getGithubSkillsIndex,
    getGithubSkillsPaths,
    getGithubSkillsMetadata,
    getGithubSkillsDocument
} from './getGithubSkillsDocument'

const mockFetchGithub = jest.fn()
const mockNotFound = jest.fn()
const mockMatter = jest.fn()
const mockGetSkillsTableOfContents = jest.fn()

jest.mock('@/utils/server', () => ({
    fetchGithub: (...args: unknown[]) => mockFetchGithub(...args)
}))

jest.mock('next/navigation', () => ({
    notFound: () => mockNotFound()
}))

jest.mock('gray-matter', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockMatter(...args)
}))

jest.mock('./getSkillsTableOfContents', () => ({
    getSkillsTableOfContents: (...args: unknown[]) =>
        mockGetSkillsTableOfContents(...args)
}))

describe('getGithubSkillsDocument utils', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockMatter.mockReturnValue({
            content: 'parsed markdown',
            data: { title: 'Doc' }
        })
        mockGetSkillsTableOfContents.mockReturnValue({
            toc: [{ level: 2, text: 'Heading', anchor: 'heading' }],
            headingToc: [{ level: 2, text: 'Heading', anchor: 'heading' }]
        })
        mockNotFound.mockImplementation(() => {
            throw new Error('NOT_FOUND')
        })
    })

    it('returns sorted skills paths from GitHub directory entries', async () => {
        mockFetchGithub.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    name: '10-Zeta.mdx',
                    path: 'docs/skills/10-Zeta.mdx',
                    type: 'file'
                },
                {
                    name: '2-Alpha.mdx',
                    path: 'docs/skills/2-Alpha.mdx',
                    type: 'file'
                },
                {
                    name: 'README.txt',
                    path: 'docs/skills/README.txt',
                    type: 'file'
                },
                { name: 'folder', path: 'docs/skills/folder', type: 'dir' }
            ]
        })
        mockFetchGithub.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        })

        const paths = await getGithubSkillsPaths()

        expect(Object.keys(paths)).toEqual(['Alpha', 'Zeta'])
        expect(paths.Alpha).toBe('docs/skills/2-Alpha.mdx')
        expect(paths.Zeta).toBe('docs/skills/10-Zeta.mdx')
    })

    it('includes markdown files found inside nested skills directories', async () => {
        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: '1-Alpha.mdx',
                        path: 'docs/skills/1-Alpha.mdx',
                        type: 'file'
                    },
                    {
                        name: 'nested',
                        path: 'docs/skills/nested',
                        type: 'dir'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: 'SKILL.mdx',
                        path: 'docs/skills/nested/SKILL.mdx',
                        type: 'file'
                    },
                    {
                        name: 'notes.txt',
                        path: 'docs/skills/nested/notes.txt',
                        type: 'file'
                    }
                ]
            })

        const paths = await getGithubSkillsPaths()

        expect(paths).toEqual({
            Alpha: 'docs/skills/1-Alpha.mdx',
            nested: 'docs/skills/nested/SKILL.mdx'
        })
        expect(mockFetchGithub).toHaveBeenNthCalledWith(
            2,
            'ghc',
            '/repos/amex-eng/architecture-portal-docs/contents/docs/skills/nested?ref=main'
        )
    })

    it('uses frontmatter description for index entries when present', async () => {
        const encoded = Buffer.from('# Skill', 'utf8').toString('base64')

        mockMatter.mockReturnValueOnce({
            content: '## Skill Overview\n\nIgnored fallback paragraph.',
            data: {
                description:
                    'Frontmatter summary that should be preferred over fallback.',
                status: ' Launched '
            }
        })

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: '1-sample-skill.mdx',
                        path: 'docs/skills/1-sample-skill.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsIndex()

        expect(result).toEqual([
            {
                route: 'sample-skill',
                description:
                    'Frontmatter summary that should be preferred over fallback.',
                status: 'Launched'
            }
        ])
    })

    it('falls back to first Skill Overview sentence when frontmatter description is missing', async () => {
        const encoded = Buffer.from('# Skill', 'utf8').toString('base64')

        mockMatter.mockReturnValueOnce({
            content: `
# Skill Title

## Skill Overview

This skill helps *teams* automate \`secure\` reviews quickly. It also supports governance workflows.
`,
            data: {
                status: 'PR Submitted'
            }
        })

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: '2-review-automation.mdx',
                        path: 'docs/skills/2-review-automation.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsIndex()

        expect(result).toEqual([
            {
                route: 'review-automation',
                description:
                    'This skill helps teams automate secure reviews quickly.',
                status: 'PR Submitted'
            }
        ])
    })

    it('sorts numbered files before non-numbered files', async () => {
        mockFetchGithub.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    name: 'Zeta.mdx',
                    path: 'docs/skills/Zeta.mdx',
                    type: 'file'
                },
                {
                    name: '2-Alpha.mdx',
                    path: 'docs/skills/2-Alpha.mdx',
                    type: 'file'
                }
            ]
        })

        const paths = await getGithubSkillsPaths()

        expect(Object.keys(paths)).toEqual(['Alpha', 'Zeta'])
    })

    it('returns title-cased metadata', async () => {
        const metadata = await getGithubSkillsMetadata('type-a-api-reuse-check')
        expect(metadata).toEqual({ title: 'Type A API Reuse Check' })
    })

    it('preserves skill acronym capitalization in sidebar and prev next labels', async () => {
        const encoded = Buffer.from('# Heading', 'utf8').toString('base64')

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: 'architecture-mcp.mdx',
                        path: 'docs/skills/architecture-mcp.mdx',
                        type: 'file'
                    },
                    {
                        name: 'type-a-api-reuse-check.mdx',
                        path: 'docs/skills/type-a-api-reuse-check.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsDocument('architecture-mcp')

        expect(result.breadcrumbs).toEqual([{ label: 'Architecture MCP' }])
        expect(result.sidebar[0]).toMatchObject({
            name: 'Architecture MCP',
            href: '/resources/skills/architecture-mcp',
            expanded: true
        })
        expect(result.prevNext.next).toEqual({
            label: 'Type A API Reuse Check',
            href: '/resources/skills/type-a-api-reuse-check'
        })
    })

    it('loads, parses, and builds layout data for an mdx skill document', async () => {
        const encoded = Buffer.from(
            '---\ntitle: Test\n---\n# Hello',
            'utf8'
        ).toString('base64')

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: '1-General.mdx',
                        path: 'docs/skills/1-General.mdx',
                        type: 'file'
                    },
                    {
                        name: '2-API Strategy.mdx',
                        path: 'docs/skills/2-API Strategy.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsDocument('General')

        expect(result.isMdx).toBe(true)
        expect(result.frontmatter).toEqual({ title: 'Doc' })
        expect(result.markdown).toBe('parsed markdown')
        expect(result.toc).toEqual([
            { level: 2, text: 'Heading', anchor: 'heading' }
        ])
        expect(result.headingToc).toEqual([
            { level: 2, text: 'Heading', anchor: 'heading' }
        ])
        expect(result.status).toBeNull()
        expect(result.skillGithubUrl).toBeNull()
        expect(result.breadcrumbs).toEqual([{ label: 'General' }])
        expect(result.sidebar[0]).toMatchObject({
            name: 'General',
            href: '/resources/skills/General',
            expanded: true
        })
        expect(result.prevNext.next).toEqual({
            label: 'API Strategy',
            href: '/resources/skills/API%20Strategy'
        })
        expect(mockGetSkillsTableOfContents).toHaveBeenCalledWith(
            'parsed markdown',
            true
        )
        expect(mockFetchGithub).toHaveBeenNthCalledWith(
            1,
            'ghc',
            '/repos/amex-eng/architecture-portal-docs/contents/docs/skills?ref=main'
        )
        expect(mockFetchGithub).toHaveBeenNthCalledWith(
            2,
            'ghc',
            '/repos/amex-eng/architecture-portal-docs/contents/docs/skills/1-General.mdx?ref=main'
        )
    })

    it('extracts status and skill link from frontmatter metadata', async () => {
        const encoded = Buffer.from('# Heading', 'utf8').toString('base64')

        mockMatter.mockReturnValueOnce({
            content: '# Journey\n\n## Skill Overview',
            data: {
                title: 'Journey',
                status: 'PR Submitted',
                skillLink:
                    'https://github.com/amex-eng/amex-skills/blob/main/.agents/skills/journey-capability-dependency-mapping/SKILL.md'
            }
        })

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: 'journey-capability-dependency-mapping.mdx',
                        path: 'docs/skills/journey-capability-dependency-mapping.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsDocument(
            'journey-capability-dependency-mapping'
        )

        expect(result.status).toBe('PR Submitted')
        expect(result.skillGithubUrl).toBe(
            'https://github.com/amex-eng/amex-skills/blob/main/.agents/skills/journey-capability-dependency-mapping/SKILL.md'
        )
        expect(result.markdown).toBe('# Journey\n\n## Skill Overview')
    })

    it('accepts enterprise github skill links under the amex-eng prefix', async () => {
        const encoded = Buffer.from('# Heading', 'utf8').toString('base64')

        mockMatter.mockReturnValueOnce({
            content: '# Journey\n\n## Skill Overview',
            data: {
                title: 'Journey',
                status: 'PR Submitted',
                skillLink:
                    'https://github.aexp.com/amex-eng/amex-skills/blob/main/.agents/skills/journey-capability-dependency-mapping/SKILL.md'
            }
        })

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: 'journey-capability-dependency-mapping.mdx',
                        path: 'docs/skills/journey-capability-dependency-mapping.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsDocument(
            'journey-capability-dependency-mapping'
        )

        expect(result.skillGithubUrl).toBe(
            'https://github.aexp.com/amex-eng/amex-skills/blob/main/.agents/skills/journey-capability-dependency-mapping/SKILL.md'
        )
    })

    it('drops unsafe or non-allowlisted skill links from frontmatter metadata', async () => {
        const encoded = Buffer.from('# Heading', 'utf8').toString('base64')

        mockMatter.mockReturnValueOnce({
            content: '# Journey\n\n## Skill Overview',
            data: {
                title: 'Journey',
                status: 'PR Submitted',
                skillLink: 'javascript:alert(1)'
            }
        })

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: 'journey-capability-dependency-mapping.mdx',
                        path: 'docs/skills/journey-capability-dependency-mapping.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsDocument(
            'journey-capability-dependency-mapping'
        )

        expect(result.status).toBe('PR Submitted')
        expect(result.skillGithubUrl).toBeNull()
    })

    it('drops github links outside the amex-eng prefix', async () => {
        const encoded = Buffer.from('# Heading', 'utf8').toString('base64')

        mockMatter.mockReturnValueOnce({
            content: '# Journey\n\n## Skill Overview',
            data: {
                title: 'Journey',
                status: 'PR Submitted',
                skillLink:
                    'https://github.com/other-org/amex-skills/blob/main/.agents/skills/journey-capability-dependency-mapping/SKILL.md'
            }
        })

        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: 'journey-capability-dependency-mapping.mdx',
                        path: 'docs/skills/journey-capability-dependency-mapping.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: encoded, encoding: 'base64' })
            })

        const result = await getGithubSkillsDocument(
            'journey-capability-dependency-mapping'
        )

        expect(result.skillGithubUrl).toBeNull()
    })

    it('calls notFound when requested skill route does not exist', async () => {
        mockFetchGithub.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    name: '1-General.mdx',
                    path: 'docs/skills/1-General.mdx',
                    type: 'file'
                }
            ]
        })

        await expect(getGithubSkillsDocument('Missing')).rejects.toThrow(
            'NOT_FOUND'
        )
        expect(mockNotFound).toHaveBeenCalledTimes(1)
    })

    it('throws when the markdown file request fails', async () => {
        mockFetchGithub
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [
                    {
                        name: '1-General.mdx',
                        path: 'docs/skills/1-General.mdx',
                        type: 'file'
                    }
                ]
            })
            .mockResolvedValueOnce({ ok: false, status: 500 })

        await expect(getGithubSkillsDocument('General')).rejects.toThrow(
            'Failed to fetch skill document from GitHub: docs/skills/1-General.mdx [500]'
        )
    })
})
