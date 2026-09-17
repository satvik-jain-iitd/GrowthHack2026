export const ADR_ACTOR_OVERLAP_ERROR_MESSAGE =
    'Reviewers and Deciders cannot share the same person'

/**
 * Validates that reviewers and deciders don't share the same person
 * @param reviewers - Array of reviewer emails
 * @param deciders - Array of decider emails
 * @returns True if valid (no overlap), error message string if invalid
 */
export const validateReviewersDecidersNoOverlap = (
    reviewers: string[],
    deciders: string[]
): boolean | string => {
    const hasOverlap = reviewers.some(reviewer =>
        (deciders ?? []).includes(reviewer)
    )
    return !hasOverlap || ADR_ACTOR_OVERLAP_ERROR_MESSAGE
}

/**
 * Validates that a value array doesn't contain any items from the comparison array
 * @param value - Array to validate
 * @param comparisonArray - Array to check against
 * @returns True if valid (no overlap), error message string if invalid
 */
export const validateNoOverlap = (
    value: string[],
    comparisonArray: string[] | undefined | null,
    errorMessage: string = 'Values cannot overlap'
): boolean | string => {
    const hasOverlap = value.some(v => (comparisonArray ?? []).includes(v))
    return !hasOverlap || errorMessage
}
