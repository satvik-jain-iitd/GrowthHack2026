// Accent-insensitive folding, matching the sensitivity: 'base' behaviour the
// previous Combobox filter relied on.
export function normalizeText(value: string): string {
    if (!value) return ''
    return value
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
}
