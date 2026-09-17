/* istanbul ignore file */

export function toTitleCase(str: string): string {
    return str
        .replace(/^([0-9]+-)/, '')
        .replace(/\.(md|mdx)$/i, '')
        .replace(/-/g, ' ')
        .split(' ')
        .map((word, idx) => {
            if (idx > 0 && word.length < 3) return word
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
}
