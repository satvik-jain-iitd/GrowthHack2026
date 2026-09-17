/* istanbul ignore file */
'use client'

import { Skeleton } from '@chakra-ui/react'

export interface SkeletonCellProps {
    /** Row id, part of the deterministic width seed. */
    rowId: string
    /** Column id, part of the deterministic width seed. */
    columnId: string
}

const MIN_WIDTH_PCT = 55
const WIDTH_RANGE_PCT = 35

/**
 * Deterministic pseudo-random width so a page of placeholders reads like
 * ragged text instead of a solid block. Must not use `Math.random()`: the
 * width would change on every render while the row is still loading.
 */
export function skeletonWidth(rowId: string, columnId: string): string {
    const seed = `${rowId}:${columnId}`
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 1000
    }
    return `${MIN_WIDTH_PCT + (hash % WIDTH_RANGE_PCT)}%`
}

/** Placeholder for a cell whose value is still being fetched. */
export function SkeletonCell({ rowId, columnId }: SkeletonCellProps) {
    return (
        <Skeleton
            height='16px'
            borderRadius='sm'
            width={skeletonWidth(rowId, columnId)}
        />
    )
}
