/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import TechnicalCapabilitiesTable from './components/TechnicalCapabilitiesTable'
import {
    fetchAllTechnicalCapabilities,
    ALL_TECHNICAL_CAPABILITIES_QUERY_KEY
} from './hooks/useGetAllTechnicalCapabilities'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import { isMetamodelDatasetEnabled } from '../constants'

export const metadata: Metadata = {
    title: 'Technical Capabilities'
}

export default async function MetamodelTechnicalCapabilitiesPage() {
    if (!isMetamodelDatasetEnabled('technical-capabilities')) {
        notFound()
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ALL_TECHNICAL_CAPABILITIES_QUERY_KEY,
        queryFn: () => fetchAllTechnicalCapabilities()
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content' py={4}>
            <HydrationBoundary state={dehydratedState}>
                <TechnicalCapabilitiesTable />
            </HydrationBoundary>
        </Box>
    )
}
