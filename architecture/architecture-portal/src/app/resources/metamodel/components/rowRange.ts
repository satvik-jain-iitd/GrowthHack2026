export interface RowRangeArgs {
    /** Rows left after the active column filters. */
    filteredCount: number
    /** Total rows loaded into the grid, before filtering. */
    totalCount: number
    /** Zero-based page index; omit when the grid is not paginated. */
    pageIndex?: number
    /** Rows per page; omit when the grid is not paginated. */
    pageSize?: number
}

/**
 * Row-count label under the grid header. A paginated grid only renders a slice,
 * so it reports the visible range (`1–25 of 312`) rather than a bare count, and
 * notes the pre-filter total whenever filters are narrowing the set.
 */
export function getRowRangeLabel({
    filteredCount,
    totalCount,
    pageIndex,
    pageSize
}: RowRangeArgs): string {
    const filteredSuffix =
        filteredCount === totalCount ? '' : ` (filtered from ${totalCount})`

    if (filteredCount === 0) return 'Showing 0 of 0'

    if (pageIndex === undefined || pageSize === undefined) {
        return `Showing ${filteredCount} of ${totalCount}`
    }

    const start = pageIndex * pageSize + 1
    const end = Math.min(start + pageSize - 1, filteredCount)
    return `Showing ${start}\u2013${end} of ${filteredCount}${filteredSuffix}`
}
