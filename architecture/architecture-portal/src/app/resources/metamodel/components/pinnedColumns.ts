export interface PinnableColumn {
    id: string
    size: number
}

export interface PinnedColumnStyle {
    /** Distance from the scroll container's left edge, in px. */
    left: number
    /** True for the rightmost pinned column, which carries the divider. */
    isLast: boolean
}

/**
 * Left offsets for the columns pinned during horizontal scroll. Offsets are
 * accumulated in render order so a pinned column sits flush against the
 * previous one, and only pinned columns present in `columns` get an entry.
 */
export function getPinnedColumnStyles(
    columns: PinnableColumn[],
    pinnedIds: readonly string[]
): Record<string, PinnedColumnStyle> {
    const pinned = columns.filter(column => pinnedIds.includes(column.id))
    const styles: Record<string, PinnedColumnStyle> = {}

    let left = 0
    pinned.forEach((column, index) => {
        styles[column.id] = { left, isLast: index === pinned.length - 1 }
        left += column.size
    })

    return styles
}
