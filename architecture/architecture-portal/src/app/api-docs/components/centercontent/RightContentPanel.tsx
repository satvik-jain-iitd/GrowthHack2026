/* istanbul ignore file */

import { Box } from '@chakra-ui/react'

export function RightContentPanel({ children }: { children: React.ReactNode }) {
    return (
        <Box
            flex='1'
            position='sticky'
            top='10px'
            alignSelf='flex-start'
            height='fit-content'
            width={{ base: '100%', md: '40%' }}
        >
            {children}
        </Box>
    )
}
