/* istanbul ignore file */
import path from 'path'
import { SidebarItem } from '@/types/SidebarItem'
import { getStaticBreadcrumbs } from './getStaticBreadcrumbs'
import { getStaticDirectory } from './getStaticDirectory'
import { toTitleCase } from '@/utils/client'

export async function getStaticSidebar(
    baseRoute: string,
    baseDir: string,
    relativePath: string
): Promise<SidebarItem[]> {
    const dir = path.join(process.cwd(), baseDir)
    const activeSegments = getStaticBreadcrumbs(relativePath)

    async function scanDir(
        currentDir: string,
        relDir: string = '',
        depth: number = 0
    ): Promise<SidebarItem[]> {
        const entries = await getStaticDirectory(currentDir)
        const items: SidebarItem[] = []
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name)
            const relPath = path.join(relDir, entry.name)
            // Strip number prefix for display
            const displayName = toTitleCase(entry.name)
            if (entry.isDirectory()) {
                // Is this folder in the active path?
                const isExpanded = activeSegments[depth].label === displayName
                const children = await scanDir(fullPath, relPath, depth + 1)
                items.push({
                    type: 'folder',
                    name: displayName,
                    expanded: isExpanded,
                    children
                })
            } else if (/\.(md|mdx)$/i.test(entry.name)) {
                items.push({
                    type: 'file',
                    name: displayName,
                    href: `/${baseRoute}/${relPath
                        .replace(/\.(md|mdx)$/i, '')
                        .split(path.sep)
                        .map(seg => seg.replace(/^([0-9]+)-/, ''))
                        .join(path.sep)}`,
                    expanded: false
                })
            }
        }
        return items
    }

    return await scanDir(dir)
}
