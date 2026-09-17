/* istanbul ignore file */

export function rewriteImports(content: string): string {
    // Remove import statements (single-line)
    return content.replace(/^import[^\n]*;?$/gm, '')
}
