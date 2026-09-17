/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import OneDataApi from './constants/OneDataEndpoints.json'
import { Box } from '@chakra-ui/react'

export const metadata: Metadata = {
    title: 'Architecture Portal APIs'
}

export default async function SwaggerApi() {
    return (
        <Box className='page-content' mb={12}>
            <Box w={'100%'}>
                <SwaggerUI spec={OneDataApi} />
            </Box>
        </Box>
    )
}
