/* istanbul ignore file */
'use client'

import { Badge, Text } from '@chakra-ui/react'

export interface YesNoCellProps {
    value: boolean | null | undefined
}

/**
 * Read-only boolean pill rendering `Yes`/`No`. Renders an em dash when the
 * value is missing (e.g. the row has not been enriched yet, or the API does
 * not return the field).
 */
export function YesNoCell({ value }: YesNoCellProps) {
    if (value === null || value === undefined) {
        return (
            <Text as='span' fontSize='sm'>
                —
            </Text>
        )
    }

    return (
        <Badge
            colorPalette={value ? 'green' : 'gray'}
            variant='subtle'
            borderRadius='full'
            px={2}
        >
            {value ? 'Yes' : 'No'}
        </Badge>
    )
}
