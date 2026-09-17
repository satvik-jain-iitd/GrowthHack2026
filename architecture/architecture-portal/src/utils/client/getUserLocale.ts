/* istanbul ignore file */

export function getUserLocale(): string {
    if (typeof window === 'undefined') return 'en-US'
    if (typeof navigator === 'undefined') return 'en-US'
    return navigator.language || 'en-US'
}
