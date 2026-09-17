import {
    validateReviewersDecidersNoOverlap,
    validateNoOverlap,
    ADR_ACTOR_OVERLAP_ERROR_MESSAGE
} from './adrValidation'

describe('ADR Validation Utilities', () => {
    describe('validateReviewersDecidersNoOverlap', () => {
        it('returns true when reviewers and deciders have no overlap', () => {
            const reviewers = ['reviewer1@aexp.com', 'reviewer2@aexp.com']
            const deciders = ['decider1@aexp.com', 'decider2@aexp.com']

            const result = validateReviewersDecidersNoOverlap(
                reviewers,
                deciders
            )

            expect(result).toBe(true)
        })

        it('returns error message when reviewers and deciders have overlap', () => {
            const reviewers = ['reviewer1@aexp.com', 'reviewer2@aexp.com']
            const deciders = ['reviewer2@aexp.com', 'decider2@aexp.com']

            const result = validateReviewersDecidersNoOverlap(
                reviewers,
                deciders
            )

            expect(result).toBe(ADR_ACTOR_OVERLAP_ERROR_MESSAGE)
        })

        it('returns true when reviewers array is empty', () => {
            const reviewers: string[] = []
            const deciders = ['decider1@aexp.com', 'decider2@aexp.com']

            const result = validateReviewersDecidersNoOverlap(
                reviewers,
                deciders
            )

            expect(result).toBe(true)
        })

        it('returns true when deciders array is empty', () => {
            const reviewers = ['reviewer1@aexp.com', 'reviewer2@aexp.com']
            const deciders: string[] = []

            const result = validateReviewersDecidersNoOverlap(
                reviewers,
                deciders
            )

            expect(result).toBe(true)
        })

        it('returns true when both arrays are empty', () => {
            const reviewers: string[] = []
            const deciders: string[] = []

            const result = validateReviewersDecidersNoOverlap(
                reviewers,
                deciders
            )

            expect(result).toBe(true)
        })

        it('returns error message when all reviewers are also deciders', () => {
            const reviewers = ['reviewer1@aexp.com', 'reviewer2@aexp.com']
            const deciders = ['reviewer1@aexp.com', 'reviewer2@aexp.com']

            const result = validateReviewersDecidersNoOverlap(
                reviewers,
                deciders
            )

            expect(result).toBe(ADR_ACTOR_OVERLAP_ERROR_MESSAGE)
        })

        it('returns error message when only one person overlaps', () => {
            const reviewers = [
                'reviewer1@aexp.com',
                'reviewer2@aexp.com',
                'reviewer3@aexp.com'
            ]
            const deciders = [
                'decider1@aexp.com',
                'reviewer2@aexp.com',
                'decider3@aexp.com'
            ]

            const result = validateReviewersDecidersNoOverlap(
                reviewers,
                deciders
            )

            expect(result).toBe(ADR_ACTOR_OVERLAP_ERROR_MESSAGE)
        })
    })

    describe('validateNoOverlap', () => {
        it('returns true when arrays have no overlap', () => {
            const value = ['a', 'b', 'c']
            const comparisonArray = ['d', 'e', 'f']

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe(true)
        })

        it('returns error message when arrays have overlap', () => {
            const value = ['a', 'b', 'c']
            const comparisonArray = ['b', 'd', 'e']

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe('Values cannot overlap')
        })

        it('returns custom error message when provided', () => {
            const value = ['a', 'b']
            const comparisonArray = ['b', 'c']
            const customMessage = 'Custom error message'

            const result = validateNoOverlap(
                value,
                comparisonArray,
                customMessage
            )

            expect(result).toBe(customMessage)
        })

        it('handles undefined comparison array', () => {
            const value = ['a', 'b', 'c']
            const comparisonArray = undefined

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe(true)
        })

        it('handles null comparison array', () => {
            const value = ['a', 'b', 'c']
            const comparisonArray = null

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe(true)
        })

        it('returns true when value array is empty', () => {
            const value: string[] = []
            const comparisonArray = ['a', 'b', 'c']

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe(true)
        })

        it('returns true when comparison array is empty', () => {
            const value = ['a', 'b', 'c']
            const comparisonArray: string[] = []

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe(true)
        })

        it('returns true when both arrays are empty', () => {
            const value: string[] = []
            const comparisonArray: string[] = []

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe(true)
        })

        it('returns error message when multiple items overlap', () => {
            const value = ['a', 'b', 'c']
            const comparisonArray = ['b', 'c', 'd']

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe('Values cannot overlap')
        })

        it('handles single item arrays with overlap', () => {
            const value = ['a']
            const comparisonArray = ['a']

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe('Values cannot overlap')
        })

        it('handles single item arrays without overlap', () => {
            const value = ['a']
            const comparisonArray = ['b']

            const result = validateNoOverlap(value, comparisonArray)

            expect(result).toBe(true)
        })
    })
})
