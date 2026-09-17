/* istanbul ignore file */

import { Box } from '@chakra-ui/react'
import React from 'react'

export function CenterContentPanel({ children }: React.PropsWithChildren) {
    return (
        <Box flex='1' minW='60%'>
            {children}
        </Box>
    )
}
