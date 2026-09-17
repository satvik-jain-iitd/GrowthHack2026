/* istanbul ignore file */
'use client'

import { Badge, Text } from '@chakra-ui/react'

export interface StatusBadgeProps {
    value: string
}

// Maps a normalized (upper-cased, trimmed) status to a Chakra color palette.
const STATUS_COLOR: Record<string, string> = {
    APPROVED: 'green',
    ACCEPTED: 'green',
    COMPLETE: 'green',
    COMPLETED: 'green',
    DONE: 'green',
    ACTIVE: 'green',
    'IN PROGRESS': 'blue',
    'IN-PROGRESS': 'blue',
    INPROGRESS: 'blue',
    PROPOSED: 'yellow',
    DRAFT: 'yellow',
    PENDING: 'yellow',
    'ON HOLD': 'yellow',
    REJECTED: 'red',
    CANCELLED: 'red',
    CANCELED: 'red',
    DEPRECATED: 'red',
    SUPERSEDED: 'red'
}

function colorFor(value: string): string {
    return STATUS_COLOR[value.trim().toUpperCase()] ?? 'gray'
}

/**
 * Read-only status pill. Colors known lifecycle statuses; unknown values fall
 * back to a neutral gray badge. Empty values render an em dash.
 */
export function StatusBadge({ value }: StatusBadgeProps) {
    if (!value) {
        return (
            <Text as='span' fontSize='sm'>
                —
            </Text>
        )
    }

    return (
        <Badge
            colorPalette={colorFor(value)}
            variant='subtle'
            borderRadius='full'
            px={2}
        >
            {value}
        </Badge>
    )
}
