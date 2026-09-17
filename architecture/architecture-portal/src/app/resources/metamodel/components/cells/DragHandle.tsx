/* istanbul ignore file */
'use client'

import { Box } from '@chakra-ui/react'

/** 3×2 dot-grid drag handle rendered in the leftmost table column. */
export function DragHandle() {
    return (
        <Box
            display='grid'
            gridTemplateColumns='repeat(2, 4px)'
            gap='3px'
            w='11px'
            mx='auto'
        >
            {[...Array(6)].map((_, i) => (
                <Box
                    key={i}
                    w='3px'
                    h='3px'
                    borderRadius='full'
                    bg='fg.muted'
                />
            ))}
        </Box>
    )
}
