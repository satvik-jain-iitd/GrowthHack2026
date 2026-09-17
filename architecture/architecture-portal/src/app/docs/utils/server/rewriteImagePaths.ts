/* istanbul ignore file */
import type { SourceHost } from '@/constants'

export function rewriteImagePaths(
    markdownText: string,
    repo: string,
    markdownFilePath: string,
    host: SourceHost = 'ghe'
) {
    // Get the directory of the markdown file
    const fileDir = markdownFilePath.split('/').slice(0, -1).join('/')

    return markdownText.replace(
        /!\[(.*?)\]\((?!https?:\/\/)([^)]+)\)/g,
        (match, alt, relPath) => {
            // Resolve the image path relative to the markdown file's directory
            let resolvedPath = relPath
            if (fileDir) {
                // Use URL to resolve relative paths
                resolvedPath = new URL(
                    relPath,
                    'file:///' + fileDir + '/'
                ).pathname.replace(/^\//, '')
            }
            // Remove any leading './' or '../' from the start
            resolvedPath = resolvedPath.replace(/^([.]{1,2}\/)+/, '')
            // Build the API endpoint
            return `![${alt}](/api/v3/repos/amex-eng/${repo}/contents/${resolvedPath}?host=${host})`
        }
    )
}
