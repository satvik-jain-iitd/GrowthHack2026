/* istanbul ignore file */
export function formatMetricDebugInfo(
    numerator: number,
    denominator: number,
    totalCount?: number
): string {
    const parts = [`Numerator: ${numerator}`, `Denominator: ${denominator}`]
    if (totalCount !== undefined) parts.push(`Total: ${totalCount}`)
    return parts.join(' · ')
}
