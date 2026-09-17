/* istanbul ignore file */
import { getUserLocale } from './getUserLocale'

export function getUserLanguage(): string {
    const locale = getUserLocale()
    return (locale.split('-')[0] || 'en').toLowerCase()
}
