import { METHOD_TOKENS } from '@/app/api-docs/constants/search'
import { ParsedQuery } from '@/app/api-docs/types/search'
import { normalizeText } from './normalizeText'

const HAS_ALPHANUMERIC = /[a-z0-9]/

export function parseSearchQuery(raw: string): ParsedQuery {
    const trimmed = (raw || '').trim()
    const tokens = normalizeText(trimmed)
        .split(/\s+/)
        .filter(token => HAS_ALPHANUMERIC.test(token))

    // A bare `delete` is a legitimate search for operations literally named
    // "Delete ..."; only treat a leading method as a filter when it narrows
    // something else.
    if (tokens.length > 1 && METHOD_TOKENS.includes(tokens[0])) {
        return {
            method: tokens[0].toUpperCase(),
            tokens: tokens.slice(1),
            raw: trimmed
        }
    }

    return { tokens, raw: trimmed }
}
