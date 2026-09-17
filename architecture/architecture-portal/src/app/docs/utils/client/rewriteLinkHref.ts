/* istanbul ignore file */
import { isDownloadablePath } from './fileTypes'
import type { SourceHost } from '@/constants'

export function rewriteLinkHref(
    href: string,
    repository?: string,
    filePath?: string,
    host: SourceHost = 'ghe'
): string {
    if (!href || href.startsWith('http') || !isDownloadablePath(href))
        return href
    const fileDir = filePath?.split('/').slice(0, -1).join('/')
    let resolvedPath = href
    if (fileDir) {
        resolvedPath = new URL(
            href,
            'file:///' + fileDir + '/'
        ).pathname.replace(/^\//, '')
    }
    resolvedPath = resolvedPath.replace(/^([.]{1,2}\/)+/, '')
    return `/api/v3/repos/amex-eng/${repository}/contents/${resolvedPath}?host=${host}`
}
