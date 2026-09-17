/**
 * Shared read-only formatting helpers for the metamodel datagrids.
 */

/**
 * Formats an ISO / `YYYY-MM-DD` date string as `MM/DD/YYYY`. Returns an empty
 * string for empty/unparseable input so cells can fall back to an em dash.
 */
export function formatDate(value: string | null | undefined): string {
    if (!value) return ''
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
    if (match) {
        const [, year, month, day] = match
        return `${month}/${day}/${year}`
    }
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return ''
    const month = String(parsed.getUTCMonth() + 1).padStart(2, '0')
    const day = String(parsed.getUTCDate()).padStart(2, '0')
    return `${month}/${day}/${parsed.getUTCFullYear()}`
}

/**
 * Upper-cases the first character and lower-cases the rest (e.g. `LOW` → `Low`).
 * Empty input is returned unchanged.
 */
export function capitalizeFirst(value: string | null | undefined): string {
    if (!value) return ''
    const trimmed = value.trim()
    if (!trimmed) return ''
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}
