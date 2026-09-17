/* istanbul ignore file */
'use client'

import { Box, Flex, Spinner } from '@chakra-ui/react'
import { MetamodelTableHeader } from './MetamodelTableHeader'

export interface MetamodelLoadingProps {
    title: string
    subtitle: string
}

/**
 * Route-level loading UI for metamodel table pages. Rendered by each segment's
 * `loading.tsx` so the App Router paints the banner + a spinner immediately on
 * navigation while the server component prefetches its data.
 */
export function MetamodelLoading({ title, subtitle }: MetamodelLoadingProps) {
    return (
        <Box className='page-content' py={4}>
            <Box w='100%'>
                <MetamodelTableHeader title={title} subtitle={subtitle} />
                <Flex justify='center' align='center' minH='300px'>
                    <Spinner size='xl' color='blue.500' />
                </Flex>
            </Box>
        </Box>
    )
}
