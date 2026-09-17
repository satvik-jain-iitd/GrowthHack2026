/* istanbul ignore file */
import path from 'path'
import { getStaticDirectory } from './getStaticDirectory'

export async function getStaticPaths(baseDir: string) {
    const dir = path.join(process.cwd(), baseDir) // baseDir is base directory relative to project root
    const routeMap: Record<string, string> = {}
    async function scanDir(currentDir: string): Promise<void> {
        const entries = await getStaticDirectory(currentDir)
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name)
            if (entry.isDirectory()) {
                await scanDir(fullPath)
            } else if (/\.(md|mdx)$/i.test(entry.name)) {
                // Get relative path from base dir, remove extension and strip number prefixes
                const filePath = path.relative(dir, fullPath)
                const route = filePath
                    .replace(/\.(md|mdx)$/i, '')
                    .replace(/(^|[\\\/])([0-9]+-)/g, '$1')
                routeMap[route] = filePath
            }
        }
    }
    await scanDir(dir)
    return routeMap
}
