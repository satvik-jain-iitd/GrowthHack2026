import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'

type SkillsTocItem = {
    level: number
    text: string
    anchor: string
}

type SkillsTableOfContents = {
    toc: SkillsTocItem[]
    headingToc: SkillsTocItem[]
}

type MarkdownAstNode = {
    type: string
    name?: string
    value?: string
    depth?: number
    children?: MarkdownAstNode[]
}

function extractTextFromNode(node: MarkdownAstNode): string {
    if (node.type === 'text') {
        return typeof node.value === 'string' ? node.value : ''
    }
    if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractTextFromNode).join('')
    }
    return ''
}

export function getSkillsTableOfContents(
    markdown: string,
    isMdx: boolean
): SkillsTableOfContents {
    const processor = unified().use(remarkParse).use(remarkGfm)
    if (isMdx) processor.use(remarkMdx)
    const tree = processor.parse(markdown) as MarkdownAstNode
    const toc: SkillsTocItem[] = []
    const headingToc: SkillsTocItem[] = []
    const slugCount: Record<string, number> = {}

    function slugifyUnique(text: string) {
        const baseSlug = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
        const count = slugCount[baseSlug] ?? 0
        slugCount[baseSlug] = count + 1
        return count === 0 ? baseSlug : `${baseSlug}-${count}`
    }

    function collectHeadings(node: MarkdownAstNode, inExcludedBlock = false) {
        const isResponseBlock =
            node.type === 'mdxJsxFlowElement' && node.name === 'ResponseBlock'
        const isExcluded =
            inExcludedBlock || node.type === 'blockquote' || isResponseBlock

        if (node.type === 'heading' && typeof node.depth === 'number') {
            const text = extractTextFromNode(node).trim()

            if (text) {
                const item = {
                    anchor: slugifyUnique(text),
                    text,
                    level: node.depth
                }

                headingToc.push(item)

                if (!isExcluded) {
                    toc.push(item)
                }
            }
        }

        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                collectHeadings(child, isExcluded)
            }
        }
    }

    collectHeadings(tree)

    return { toc, headingToc }
}
