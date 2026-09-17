import { FIELD_WEIGHTS, MATCH_QUALITY } from '@/app/api-docs/constants/search'
import { ParsedQuery, SearchIndexEntry } from '@/app/api-docs/types/search'

// Includes URI punctuation so "payments" scores a word-boundary hit inside
// /v1/{cardId}/payments rather than a bare substring.
const WORD_BOUNDARY = /[\s\-_/.{}:]/

export function matchQuality(hayN: string, token: string): 0 | 1 | 2 | 3 | 4 {
    if (!hayN || !token) return MATCH_QUALITY.NONE
    if (hayN === token) return MATCH_QUALITY.EXACT
    const idx = hayN.indexOf(token)
    if (idx === -1) return MATCH_QUALITY.NONE
    if (idx === 0) return MATCH_QUALITY.PREFIX
    if (WORD_BOUNDARY.test(hayN[idx - 1])) return MATCH_QUALITY.WORD_BOUNDARY
    return MATCH_QUALITY.SUBSTRING
}

const fieldsOf = (entry: SearchIndexEntry): [number, string][] => {
    if (entry.kind === 'operation') {
        return [
            [FIELD_WEIGHTS.OPERATION_NAME, entry.nameN],
            [FIELD_WEIGHTS.URI, entry.uriN || ''],
            [FIELD_WEIGHTS.OPERATION_DESCRIPTION, entry.descriptionN]
        ]
    }
    if (entry.kind === 'api') {
        return [
            [FIELD_WEIGHTS.API_NAME, entry.nameN],
            [FIELD_WEIGHTS.API_DESCRIPTION, entry.descriptionN]
        ]
    }
    return [[FIELD_WEIGHTS.DOMAIN_NAME, entry.nameN]]
}

export function scoreSearchEntry(
    entry: SearchIndexEntry,
    query: ParsedQuery
): number {
    if (!query.tokens.length) return 0
    if (query.method) {
        if (entry.kind !== 'operation') return 0
        if (entry.method !== query.method) return 0
    }

    const fields = fieldsOf(entry)
    let total = 0
    for (const token of query.tokens) {
        let best = 0
        for (const [weight, value] of fields) {
            const quality = matchQuality(value, token)
            if (quality) best = Math.max(best, weight * quality)
        }
        // AND semantics: every token has to land somewhere on this entry.
        if (best === 0) return 0
        total += best
    }
    return total
}
