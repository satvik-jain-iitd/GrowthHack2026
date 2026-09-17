/* istanbul ignore file */
'use client'

import { Text } from '@chakra-ui/react'

export interface TextCellProps {
    value: string
    fontWeight?: string | number
    fontFamily?: string
}

/**
 * Read-only, single-line truncated text cell. Used by grids (and columns) that
 * have no update endpoint, so cells render plain text instead of an editor.
 */
export function TextCell({ value, fontWeight, fontFamily }: TextCellProps) {
    return (
        <Text
            as='span'
            fontSize='sm'
            fontWeight={fontWeight}
            fontFamily={fontFamily}
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
        >
            {value || '—'}
        </Text>
    )
}
