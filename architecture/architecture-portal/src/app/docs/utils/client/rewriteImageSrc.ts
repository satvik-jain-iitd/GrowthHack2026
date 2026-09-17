/* istanbul ignore file */
import type { SourceHost } from '@/constants'

export function rewriteImageSrc(
    src: string,
    repository?: string,
    filePath?: string,
    host: SourceHost = 'ghe'
): string {
    if (!src || src.startsWith('http')) return src
    const fileDir = filePath?.split('/').slice(0, -1).join('/')
    let resolvedPath = src
    if (fileDir) {
        resolvedPath = new URL(
            src,
            'file:///' + fileDir + '/'
        ).pathname.replace(/^\//, '')
    }
    resolvedPath = resolvedPath.replace(/^([.]{1,2}\/)+/, '')
    return `/api/v3/repos/amex-eng/${repository}/contents/${resolvedPath}?host=${host}`
}
