import React from 'react'
import { Box } from '@chakra-ui/react'

export function ResponseBlock({ children }: { children: React.ReactNode }) {
    return (
        <Box
            my={4}
            p='var(--base-size-16, 1rem)'
            overflow='auto'
            lineHeight='1.45'
            color='var(--fgColor-default, inherit)'
            backgroundColor='var(--bgColor-muted, var(--bgColor-default))'
            borderRadius='6px'
            css={{
                '& p:last-of-type': { marginBottom: 0 },
                '& ul, & ol': { paddingLeft: '1.5rem' }
            }}
        >
            {children}
        </Box>
    )
}
