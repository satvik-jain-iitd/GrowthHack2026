import { parseAdvancedQuery, QUERY_FIELDS, type QueryRow } from './queryFilter'

function makeRow(overrides: Partial<QueryRow> = {}): QueryRow {
    return {
        recJourneyCount: 2,
        savedJourneyCount: 2,
        addedJourneys: 0,
        retainedJourneys: 2,
        recCapabilityCount: 3,
        savedCapabilityCount: 3,
        addedCapabilities: 0,
        retainedCapabilities: 3,
        timeSpentMs: 120_000,
        ...overrides
    }
}

function matches(query: string, row: QueryRow): boolean {
    const result = parseAdvancedQuery(query)
    if (!result.ok) {
        throw new Error(
            `expected query to parse but got error: ${result.error}`
        )
    }
    return result.matches(row)
}

describe('parseAdvancedQuery', () => {
    it('treats a blank query as matching everything', () => {
        expect(matches('', makeRow())).toBe(true)
        expect(matches('   ', makeRow())).toBe(true)
    })

    describe('operators', () => {
        it.each([
            ['AI_EBCs>=1', 1, true],
            ['AI_EBCs>=1', 0, false],
            ['AI_EBCs>1', 2, true],
            ['AI_EBCs>1', 1, false],
            ['AI_EBCs<=1', 1, true],
            ['AI_EBCs<=1', 2, false],
            ['AI_EBCs<1', 0, true],
            ['AI_EBCs<1', 1, false],
            ['AI_EBCs=3', 3, true],
            ['AI_EBCs=3', 4, false],
            ['AI_EBCs==3', 3, true],
            ['AI_EBCs!=3', 4, true],
            ['AI_EBCs!=3', 3, false]
        ])('%s with value %d -> %s', (query, value, expected) => {
            expect(matches(query, makeRow({ recCapabilityCount: value }))).toBe(
                expected
            )
        })
    })

    describe('and / or combination', () => {
        it('and requires both sides true', () => {
            const row = makeRow({ recCapabilityCount: 1, recJourneyCount: 3 })
            expect(matches('AI_EBCs>=1 and AI_ECJs>=3', row)).toBe(true)
            expect(matches('AI_EBCs>=1 and AI_ECJs>=5', row)).toBe(false)
        })

        it('or requires at least one side true', () => {
            const row = makeRow({ recCapabilityCount: 0, recJourneyCount: 3 })
            expect(matches('AI_EBCs>=1 or AI_ECJs>=3', row)).toBe(true)
            expect(matches('AI_EBCs>=1 or AI_ECJs>=5', row)).toBe(false)
        })

        it('and binds tighter than or', () => {
            // true or (false and false) -> true
            const row = makeRow({
                recCapabilityCount: 5,
                recJourneyCount: 0,
                savedJourneyCount: 0
            })
            expect(
                matches('AI_EBCs>=1 or AI_ECJs>=1 and Saved_ECJs>=1', row)
            ).toBe(true)
        })

        it('parentheses override default precedence', () => {
            // (false or false) and true -> false
            const row = makeRow({
                recCapabilityCount: 0,
                recJourneyCount: 0,
                savedJourneyCount: 5
            })
            expect(
                matches('(AI_EBCs>=1 or AI_ECJs>=1) and Saved_ECJs>=1', row)
            ).toBe(false)
        })

        it('worked example from the request', () => {
            const row = makeRow({
                recCapabilityCount: 1,
                recJourneyCount: 3,
                timeSpentMs: 60_000
            })
            expect(
                matches('AI_EBCs>=1 and AI_ECJs>=3 and Time_Taken<=2min', row)
            ).toBe(true)
            expect(
                matches('AI_EBCs>=1 and AI_ECJs>=3 and Time_Taken<=30s', row)
            ).toBe(false)
        })
    })

    describe('duration units', () => {
        it.each([
            ['1000ms', 1000],
            ['1s', 1000],
            ['1sec', 1000],
            ['1secs', 1000],
            ['2min', 120_000],
            ['2mins', 120_000],
            ['2minutes', 120_000],
            ['1h', 3_600_000],
            ['1hr', 3_600_000],
            ['1hrs', 3_600_000],
            ['1hour', 3_600_000],
            ['1.5h', 5_400_000],
            ['1d', 86_400_000],
            ['1day', 86_400_000],
            ['1days', 86_400_000]
        ])('Time_Taken<=%s matches an equal duration exactly', (unit, ms) => {
            expect(
                matches(`Time_Taken<=${unit}`, makeRow({ timeSpentMs: ms }))
            ).toBe(true)
            expect(
                matches(`Time_Taken<=${unit}`, makeRow({ timeSpentMs: ms + 1 }))
            ).toBe(false)
        })

        it('rejects an unknown time unit', () => {
            const result = parseAdvancedQuery('Time_Taken<=2fortnights')
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.error).toMatch(/Unknown time unit/)
        })

        it('requires a unit on a duration field', () => {
            const result = parseAdvancedQuery('Time_Taken<=2')
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.error).toMatch(/requires a unit/)
        })

        it('never matches a duration condition when timeSpentMs is null', () => {
            expect(
                matches('Time_Taken<=999h', makeRow({ timeSpentMs: null }))
            ).toBe(false)
            expect(
                matches('Time_Taken>=0ms', makeRow({ timeSpentMs: null }))
            ).toBe(false)
        })
    })

    describe('field name normalization', () => {
        it.each([
            ['AI_EBCs>=1', true],
            ['AI EBCs>=1', true],
            ['ai_ebcs>=1', true],
            ['aiebcs>=1', true]
        ])('%s normalizes to the AI_EBCs field', query => {
            expect(matches(query, makeRow({ recCapabilityCount: 1 }))).toBe(
                true
            )
        })

        it('resolves every documented field id', () => {
            for (const field of QUERY_FIELDS) {
                const query = field.isDuration
                    ? `${field.label}>=0ms`
                    : `${field.label}>=0`
                const result = parseAdvancedQuery(query)
                expect(result.ok).toBe(true)
            }
        })
    })

    describe('errors', () => {
        it('reports an unknown field', () => {
            const result = parseAdvancedQuery('Foo_Bar>=1')
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.error).toMatch(/Unknown field/)
        })

        it('rejects a non-duration field with a unit suffix', () => {
            const result = parseAdvancedQuery('AI_EBCs>=1min')
            expect(result.ok).toBe(false)
            if (!result.ok)
                expect(result.error).toMatch(/expects a plain number/)
        })

        it('reports a missing operator', () => {
            const result = parseAdvancedQuery('AI_EBCs 1')
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.error).toMatch(/Expected an operator/)
        })

        it('reports a missing value', () => {
            const result = parseAdvancedQuery('AI_EBCs>=')
            expect(result.ok).toBe(false)
            if (!result.ok)
                expect(result.error).toMatch(/Expected a numeric value/)
        })

        it('reports unbalanced parentheses', () => {
            const result = parseAdvancedQuery('(AI_EBCs>=1')
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.error).toMatch(/closing/)
        })

        it('reports trailing garbage after a valid query', () => {
            const result = parseAdvancedQuery('AI_EBCs>=1 foo')
            expect(result.ok).toBe(false)
            if (!result.ok)
                expect(result.error).toMatch(/Unexpected text after/)
        })

        it('reports an unrecognized character', () => {
            const result = parseAdvancedQuery('AI_EBCs>=1 & AI_ECJs>=1')
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.error).toMatch(/Unexpected character/)
        })

        it('reports an empty condition inside parentheses', () => {
            const result = parseAdvancedQuery('()')
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.error).toMatch(/field name/)
        })
    })
})
