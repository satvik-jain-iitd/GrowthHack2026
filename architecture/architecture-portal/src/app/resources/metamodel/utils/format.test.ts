import { formatDate, capitalizeFirst } from './format'

describe('formatDate', () => {
    it('formats an ISO date-time to MM/DD/YYYY', () => {
        expect(formatDate('2026-01-05T12:00:00Z')).toBe('01/05/2026')
    })

    it('formats a plain YYYY-MM-DD date to MM/DD/YYYY', () => {
        expect(formatDate('2026-12-31')).toBe('12/31/2026')
    })

    it('returns empty string for null/undefined/empty', () => {
        expect(formatDate(null)).toBe('')
        expect(formatDate(undefined)).toBe('')
        expect(formatDate('')).toBe('')
    })

    it('returns empty string for an unparseable value', () => {
        expect(formatDate('not-a-date')).toBe('')
    })
})

describe('capitalizeFirst', () => {
    it('capitalizes the first letter and lowercases the rest', () => {
        expect(capitalizeFirst('LOW')).toBe('Low')
        expect(capitalizeFirst('high')).toBe('High')
        expect(capitalizeFirst('MeDiUm')).toBe('Medium')
    })

    it('returns empty string for null/undefined/blank', () => {
        expect(capitalizeFirst(null)).toBe('')
        expect(capitalizeFirst(undefined)).toBe('')
        expect(capitalizeFirst('   ')).toBe('')
    })
})
