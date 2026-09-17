const mockParse = jest.fn()
const mockUse = jest.fn()
const mockVisit = jest.fn()

jest.mock('unified', () => ({
    unified: () => ({
        use: mockUse.mockReturnThis(),
        parse: mockParse
    })
}))

jest.mock('remark-parse', () => ({
    __esModule: true,
    default: {}
}))

jest.mock('remark-gfm', () => ({
    __esModule: true,
    default: {}
}))

jest.mock('remark-mdx', () => ({
    __esModule: true,
    default: {}
}))

jest.mock('unist-util-visit', () => ({
    visit: (...args: unknown[]) => mockVisit(...args)
}))

import { extractTextFromNode, getTableOfContents } from './getTableOfContents'

function text(value: string) {
    return { type: 'text', value }
}

function strong(value: string) {
    return {
        type: 'strong',
        children: [text(value)]
    }
}

function link(label: string) {
    return {
        type: 'link',
        url: 'https://example.com',
        children: [text(label)]
    }
}

function heading(
    depth: number,
    children: Array<{ type: string; [key: string]: unknown }>
) {
    return {
        type: 'heading',
        depth,
        children
    }
}

function paragraph(children: Array<{ type: string; [key: string]: unknown }>) {
    return {
        type: 'paragraph',
        children
    }
}

function blockquote(children: Array<{ type: string; [key: string]: unknown }>) {
    return {
        type: 'blockquote',
        children
    }
}

function list(children: Array<{ type: string; [key: string]: unknown }>) {
    return {
        type: 'list',
        ordered: false,
        start: null,
        spread: false,
        children
    }
}

function listItem(children: Array<{ type: string; [key: string]: unknown }>) {
    return {
        type: 'listItem',
        spread: true,
        checked: null,
        children
    }
}

function root(children: Array<{ type: string; [key: string]: unknown }>) {
    return {
        type: 'root',
        children
    }
}

function buildHeading(depth: number, label: string) {
    if (label === 'Hello **World** and [Friends](https://example.com)') {
        return heading(depth, [
            text('Hello '),
            strong('World'),
            text(' and '),
            link('Friends')
        ])
    }

    return heading(depth, [text(label)])
}

function simpleAstFromMarkdown(markdown: string) {
    const children: Array<{ type: string; [key: string]: unknown }> = []

    for (const line of markdown.split('\n')) {
        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
        if (headingMatch) {
            children.push(buildHeading(headingMatch[1].length, headingMatch[2]))
            continue
        }

        const quotedHeadingMatch = line.match(/^>\s+(#{1,6})\s+(.*)$/)
        if (quotedHeadingMatch) {
            children.push(
                blockquote([
                    buildHeading(
                        quotedHeadingMatch[1].length,
                        quotedHeadingMatch[2]
                    )
                ])
            )
            continue
        }

        const nestedQuotedHeadingMatch = line.match(/^>\s+>\s+(#{1,6})\s+(.*)$/)
        if (nestedQuotedHeadingMatch) {
            children.push(
                blockquote([
                    blockquote([
                        buildHeading(
                            nestedQuotedHeadingMatch[1].length,
                            nestedQuotedHeadingMatch[2]
                        )
                    ])
                ])
            )
            continue
        }

        if (line.startsWith('import ')) {
            children.push({
                type: 'mdxjsEsm',
                value: line
            })
            continue
        }

        if (/^<[A-Z][\w]*\s*\/?>$/.test(line.trim())) {
            children.push({
                type: 'mdxJsxFlowElement',
                name: line.replace(/[</>\s]/g, ''),
                attributes: [],
                children: []
            })
        }
    }

    return root(children)
}

function markdownToAst(markdown: string) {
    const nestedQuotedListMarkdown = [
        '# Parent',
        '',
        '> - quoted list',
        '>',
        '>   - ### Deep Quoted Heading',
        '',
        '## Outside Heading'
    ].join('\n')

    if (markdown === nestedQuotedListMarkdown) {
        return root([
            heading(1, [text('Parent')]),
            blockquote([
                list([
                    listItem([
                        paragraph([text('quoted list')]),
                        heading(3, [text('Deep Quoted Heading')])
                    ])
                ])
            ]),
            heading(2, [text('Outside Heading')])
        ])
    }

    return simpleAstFromMarkdown(markdown)
}

beforeEach(() => {
    jest.clearAllMocks()
    mockParse.mockImplementation(markdownToAst)
    mockVisit.mockImplementation(
        (
            tree: {
                type: string
                children?: Array<{ type: string; children?: unknown[] }>
            },
            type: string,
            visitor: (node: { type: string; [key: string]: unknown }) => void
        ) => {
            function walk(node: { type: string; children?: unknown[] }) {
                if (node.type === type) {
                    visitor(node)
                }

                if (node.children && Array.isArray(node.children)) {
                    for (const child of node.children as Array<{
                        type: string
                        children?: unknown[]
                    }>) {
                        walk(child)
                    }
                }
            }

            walk(tree)
        }
    )
})

describe('getTableOfContents', () => {
    it('returns headings outside blockquotes with level and anchor', () => {
        const markdown = [
            '# Top Heading',
            '',
            'Some intro text',
            '',
            '## Section One',
            '',
            '### Section Two'
        ].join('\n')

        expect(getTableOfContents(markdown, false)).toEqual([
            { level: 1, text: 'Top Heading', anchor: 'top-heading' },
            { level: 2, text: 'Section One', anchor: 'section-one' },
            { level: 3, text: 'Section Two', anchor: 'section-two' }
        ])

        expect(mockVisit).toHaveBeenCalledTimes(1)
    })

    it('preserves the original behavior by including blockquoted headings', () => {
        const markdown = [
            '# Top Heading',
            '',
            '> ## Quoted Heading',
            '>',
            '> Content inside quote',
            '',
            '## Normal Heading'
        ].join('\n')

        expect(getTableOfContents(markdown, false)).toEqual([
            { level: 1, text: 'Top Heading', anchor: 'top-heading' },
            { level: 2, text: 'Quoted Heading', anchor: 'quoted-heading' },
            { level: 2, text: 'Normal Heading', anchor: 'normal-heading' }
        ])
    })

    it('includes headings nested inside quoted lists', () => {
        const markdown = [
            '# Parent',
            '',
            '> - quoted list',
            '>',
            '>   - ### Deep Quoted Heading',
            '',
            '## Outside Heading'
        ].join('\n')

        expect(getTableOfContents(markdown, false)).toEqual([
            { level: 1, text: 'Parent', anchor: 'parent' },
            {
                level: 3,
                text: 'Deep Quoted Heading',
                anchor: 'deep-quoted-heading'
            },
            { level: 2, text: 'Outside Heading', anchor: 'outside-heading' }
        ])
    })

    it('includes headings inside nested blockquotes', () => {
        const markdown = [
            '# Parent',
            '',
            '> > ### Nested Quoted Heading',
            '',
            '## Outside Heading'
        ].join('\n')

        expect(getTableOfContents(markdown, false)).toEqual([
            { level: 1, text: 'Parent', anchor: 'parent' },
            {
                level: 3,
                text: 'Nested Quoted Heading',
                anchor: 'nested-quoted-heading'
            },
            { level: 2, text: 'Outside Heading', anchor: 'outside-heading' }
        ])
    })

    it('creates unique anchors for duplicate headings', () => {
        const markdown = ['## Repeat', '## Repeat', '## Repeat'].join('\n\n')

        expect(getTableOfContents(markdown, false)).toEqual([
            { level: 2, text: 'Repeat', anchor: 'repeat' },
            { level: 2, text: 'Repeat', anchor: 'repeat-1' },
            { level: 2, text: 'Repeat', anchor: 'repeat-2' }
        ])
    })

    it('extracts heading text through inline markdown formatting', () => {
        const markdown = [
            '## Hello **World** and [Friends](https://example.com)'
        ].join('\n')

        expect(getTableOfContents(markdown, false)).toEqual([
            {
                level: 2,
                text: 'Hello World and Friends',
                anchor: 'hello-world-and-friends'
            }
        ])
    })

    it('parses mdx input and includes quoted headings', () => {
        const markdown = [
            "import Demo from './Demo'",
            '',
            '# Intro',
            '',
            '> ## Hidden Quote Heading',
            '',
            '<Demo />',
            '',
            '## Usage'
        ].join('\n')

        expect(getTableOfContents(markdown, true)).toEqual([
            { level: 1, text: 'Intro', anchor: 'intro' },
            {
                level: 2,
                text: 'Hidden Quote Heading',
                anchor: 'hidden-quote-heading'
            },
            { level: 2, text: 'Usage', anchor: 'usage' }
        ])

        expect(mockUse).toHaveBeenCalledTimes(3)
    })
})

describe('extractTextFromNode', () => {
    it('returns text node value', () => {
        expect(extractTextFromNode({ type: 'text', value: 'Hello' })).toBe(
            'Hello'
        )
    })

    it('recursively concatenates nested child text', () => {
        const node = {
            type: 'heading',
            children: [
                { type: 'text', value: 'Hello ' },
                {
                    type: 'strong',
                    children: [{ type: 'text', value: 'World' }]
                },
                { type: 'text', value: '!' }
            ]
        }

        expect(extractTextFromNode(node)).toBe('Hello World!')
    })

    it('returns empty string for node without text or children', () => {
        expect(extractTextFromNode({ type: 'html', value: '<br />' })).toBe('')
    })
})
