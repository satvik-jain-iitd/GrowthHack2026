/* istanbul ignore file */

export function sanitizeContent(content: string): string {
    // Remove HTML comments (multi-line)
    return content.replace(/<!--([\s\S]*?)-->/g, '')
}
