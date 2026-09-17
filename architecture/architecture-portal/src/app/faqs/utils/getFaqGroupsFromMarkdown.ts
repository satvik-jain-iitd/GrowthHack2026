import { parseMarkdownToItems } from './parseMarkdownToItems'
import { fetchGithub } from '@/utils/server'
import { SOURCE_HOST_CONFIG, type SourceHost } from '@/constants'
import { Group } from '@/app/faqs/types'

export async function getFaqGroupsFromMarkdown(
    repo: string,
    path: string,
    host: SourceHost = 'ghe'
) {
    const res = await fetchGithub(
        host,
        `/repos/amex-eng/${repo}/contents/${path}`,
        {
            next: { revalidate: 600 }
        }
    )
    if (!res.ok)
        throw new Error(
            `Failed to fetch FAQ file content from GitHub: [${host}] /repos/amex-eng/${repo}/contents/${path} [${res.status}]`
        )
    const files = await res.json()
    const mdFiles = files.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fileEnt: any) =>
            fileEnt.type === 'file' && /\.(md|mdx)$/i.test(fileEnt.name)
    )
    const baseUrl = SOURCE_HOST_CONFIG[host].url
    const groups: Group[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groupPromises = mdFiles.map(async (fileEnt: any) => {
        const filePath = `${path}/${fileEnt.name}`
        const fileRes = await fetchGithub(
            host,
            `/repos/amex-eng/${repo}/contents/${filePath}`,
            { next: { revalidate: 600 } }
        )
        if (!fileRes.ok)
            throw new Error(
                `Failed to fetch FAQ file content from GitHub: [${host}] /repos/amex-eng/${repo}/contents/${filePath} [${fileRes.status}]`
            )
        const fileData = await fileRes.json()
        const fileContent = Buffer.from(fileData.content, 'base64').toString(
            'utf8'
        )
        const items = await parseMarkdownToItems(
            fileContent,
            repo,
            filePath,
            host
        )
        if (items.length > 0) {
            const title = fileEnt.name
                .replace(/^\d+-/, '')
                .replace(/\.(md|mdx)$/i, '')
            const id = title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
            return {
                id,
                title,
                sourceLink: `${baseUrl}/amex-eng/${repo}/blob/main/${filePath}`,
                items
            }
        }
        return null
    })
    const groupResults = await Promise.all(groupPromises)
    for (const group of groupResults) {
        if (group) groups.push(group)
    }
    return groups
}
