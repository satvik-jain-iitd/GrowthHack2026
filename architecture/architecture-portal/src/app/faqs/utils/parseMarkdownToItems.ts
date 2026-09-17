import { rewriteImagePaths } from '@/app/docs/utils/server'
import { Item } from '@/app/faqs/types/Item'
import type { SourceHost } from '@/constants'
import { remark } from 'remark'
import html from 'remark-html'

export async function parseMarkdownToItems(
    md: string,
    repo: string,
    filePath: string,
    host: SourceHost = 'ghe'
): Promise<Item[]> {
    const markdown = rewriteImagePaths(md, repo, filePath, host)
    const lines = markdown.split(/\r?\n/)
    const items: Item[] = []
    let currentQ = ''
    let currentId = ''
    let currentA: string[] = []
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const headingMatch = line.match(/^#\s+(.+)/)
        if (headingMatch) {
            if (currentQ) {
                // Save previous item
                const htmlA = String(
                    await remark().use(html).process(currentA.join('\n'))
                )
                if (htmlA) {
                    items.push({ id: currentId, q: currentQ, a: htmlA })
                }
            }
            currentQ = headingMatch[1].trim()
            currentId = currentQ
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            currentA = []
        } else if (currentQ) {
            currentA.push(line)
        }
    }
    if (currentQ) {
        const htmlA = String(
            await remark().use(html).process(currentA.join('\n'))
        )
        if (htmlA) {
            items.push({ id: currentId, q: currentQ, a: htmlA })
        }
    }
    return items
}
