/* istanbul ignore file */
import { getUserLocale } from './getUserLocale'

export function getUserCountryCode(): string {
    const locale = getUserLocale()
    return (locale.split('-')[1] || 'US').toUpperCase()
}
