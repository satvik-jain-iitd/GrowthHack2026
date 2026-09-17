/* istanbul ignore file */
'use client'
import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export function LoadingSpinner() {
    return (
        <Box
            position='fixed'
            top={0}
            left={0}
            width='100vw'
            height='100vh'
            display='flex'
            alignItems='center'
            justifyContent='center'
            bg='rgba(0,0,0,0.5)'
            zIndex={1400}
            animation='fadeIn 0.15s ease-out'
        >
            <Spinner size='xl' color='white' />
        </Box>
    )
}
