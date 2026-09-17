/* istanbul ignore file */
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import { visit } from 'unist-util-visit'

export function getTableOfContents(markdown: string, isMdx: boolean) {
    const processor = unified().use(remarkParse).use(remarkGfm)
    if (isMdx) processor.use(remarkMdx)
    const tree = processor.parse(markdown)
    const toc: { level: number; text: string; anchor: string }[] = []
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, 'heading', (node: any) => {
        const text = extractTextFromNode(node).trim()
        if (!text) return
        const anchor = slugifyUnique(text)
        toc.push({ anchor, text, level: node.depth })
    })

    return toc
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractTextFromNode(node: any): string {
    if (node.type === 'text') return node.value
    if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractTextFromNode).join('')
    }
    return ''
}
