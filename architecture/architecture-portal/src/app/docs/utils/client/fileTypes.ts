const DOWNLOADABLE_EXTENSIONS = new Set([
    'csv',
    'doc',
    'docx',
    'json',
    'pdf',
    'ppt',
    'pptx',
    'rtf',
    'txt',
    'xls',
    'xlsm',
    'xlsx',
    'zip'
])

export function getFileName(path: string): string {
    return path.split(/[?#]/)[0].split('/').pop() || ''
}

function getExtension(path: string): string {
    const name = getFileName(path)
    const dot = name.lastIndexOf('.')
    return dot === -1 ? '' : name.slice(dot + 1).toLowerCase()
}

export function isDownloadablePath(path: string): boolean {
    return DOWNLOADABLE_EXTENSIONS.has(getExtension(path))
}
