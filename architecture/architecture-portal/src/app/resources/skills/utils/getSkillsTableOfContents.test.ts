const mockParse = jest.fn()
const mockUse = jest.fn()

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

import { getSkillsTableOfContents } from './getSkillsTableOfContents'

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

function responseBlock(
    children: Array<{ type: string; [key: string]: unknown }>
) {
    return {
        type: 'mdxJsxFlowElement',
        name: 'ResponseBlock',
        attributes: [],
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
})

describe('getSkillsTableOfContents', () => {
    it('hides blockquoted headings from visible toc but preserves them in heading order', () => {
        const markdown = [
            '# Top Heading',
            '',
            '> ## Quoted Heading',
            '',
            '## Normal Heading'
        ].join('\n')

        expect(getSkillsTableOfContents(markdown, false)).toEqual({
            toc: [
                { level: 1, text: 'Top Heading', anchor: 'top-heading' },
                { level: 2, text: 'Normal Heading', anchor: 'normal-heading' }
            ],
            headingToc: [
                { level: 1, text: 'Top Heading', anchor: 'top-heading' },
                { level: 2, text: 'Quoted Heading', anchor: 'quoted-heading' },
                { level: 2, text: 'Normal Heading', anchor: 'normal-heading' }
            ]
        })
    })

    it('hides headings nested inside quoted lists from visible toc', () => {
        const markdown = [
            '# Parent',
            '',
            '> - quoted list',
            '>',
            '>   - ### Deep Quoted Heading',
            '',
            '## Outside Heading'
        ].join('\n')

        expect(getSkillsTableOfContents(markdown, false)).toEqual({
            toc: [
                { level: 1, text: 'Parent', anchor: 'parent' },
                { level: 2, text: 'Outside Heading', anchor: 'outside-heading' }
            ],
            headingToc: [
                { level: 1, text: 'Parent', anchor: 'parent' },
                {
                    level: 3,
                    text: 'Deep Quoted Heading',
                    anchor: 'deep-quoted-heading'
                },
                { level: 2, text: 'Outside Heading', anchor: 'outside-heading' }
            ]
        })
    })

    it('preserves anchor order for rendered headings when duplicates occur', () => {
        const markdown = ['## Repeat', '', '> ## Repeat', '', '## Repeat'].join(
            '\n'
        )

        expect(getSkillsTableOfContents(markdown, false)).toEqual({
            toc: [
                { level: 2, text: 'Repeat', anchor: 'repeat' },
                { level: 2, text: 'Repeat', anchor: 'repeat-2' }
            ],
            headingToc: [
                { level: 2, text: 'Repeat', anchor: 'repeat' },
                { level: 2, text: 'Repeat', anchor: 'repeat-1' },
                { level: 2, text: 'Repeat', anchor: 'repeat-2' }
            ]
        })
    })

    it('extracts heading text through inline markdown formatting', () => {
        const markdown = [
            '## Hello **World** and [Friends](https://example.com)'
        ].join('\n')

        expect(getSkillsTableOfContents(markdown, false)).toEqual({
            toc: [
                {
                    level: 2,
                    text: 'Hello World and Friends',
                    anchor: 'hello-world-and-friends'
                }
            ],
            headingToc: [
                {
                    level: 2,
                    text: 'Hello World and Friends',
                    anchor: 'hello-world-and-friends'
                }
            ]
        })
    })

    it('parses mdx input while keeping quoted headings out of the visible toc', () => {
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

        expect(getSkillsTableOfContents(markdown, true)).toEqual({
            toc: [
                { level: 1, text: 'Intro', anchor: 'intro' },
                { level: 2, text: 'Usage', anchor: 'usage' }
            ],
            headingToc: [
                { level: 1, text: 'Intro', anchor: 'intro' },
                {
                    level: 2,
                    text: 'Hidden Quote Heading',
                    anchor: 'hidden-quote-heading'
                },
                { level: 2, text: 'Usage', anchor: 'usage' }
            ]
        })

        expect(mockUse).toHaveBeenCalledTimes(3)
    })

    it('hides headings inside ResponseBlock from visible toc but preserves them in heading order', () => {
        mockParse.mockReturnValueOnce(
            root([
                heading(1, [text('Intro')]),
                responseBlock([
                    heading(2, [text('Example Response')]),
                    heading(3, [text('Detail Inside Response')])
                ]),
                heading(2, [text('After Block')])
            ])
        )

        expect(getSkillsTableOfContents('', true)).toEqual({
            toc: [
                { level: 1, text: 'Intro', anchor: 'intro' },
                { level: 2, text: 'After Block', anchor: 'after-block' }
            ],
            headingToc: [
                { level: 1, text: 'Intro', anchor: 'intro' },
                {
                    level: 2,
                    text: 'Example Response',
                    anchor: 'example-response'
                },
                {
                    level: 3,
                    text: 'Detail Inside Response',
                    anchor: 'detail-inside-response'
                },
                { level: 2, text: 'After Block', anchor: 'after-block' }
            ]
        })
    })

    it('skips headings whose extracted text is empty and handles childless non-text leaf nodes', () => {
        mockParse.mockReturnValueOnce(
            root([
                // text node with no value → '' ; break node with no children → ''
                // combined heading text is '' → heading is omitted from both toc arrays
                heading(2, [{ type: 'text' }, { type: 'break' }]),
                heading(3, [text('Valid')])
            ])
        )

        expect(getSkillsTableOfContents('', false)).toEqual({
            toc: [{ level: 3, text: 'Valid', anchor: 'valid' }],
            headingToc: [{ level: 3, text: 'Valid', anchor: 'valid' }]
        })
    })
})
