/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import ResourceCards from '@/app/resources/components/ResourceCards'

export const metadata: Metadata = {
    title: 'Resources'
}

export default function Resources() {
    return (
        <Box className='page-content'>
            <Box mt={7} display='flex' justifyContent='center'>
                <ResourceCards />
            </Box>
        </Box>
    )
}
