/* istanbul ignore file */
'use client'
import React from 'react'
import { Box } from '@chakra-ui/react'
import { EbaHeader } from './EbaHeader'
import { EbaContent } from './EbaContent'

export default function BusinessArchitectureClient() {
    return (
        <Box className='page-content' background='surface.default.offwhite'>
            <EbaHeader />
            <EbaContent />
        </Box>
    )
}
