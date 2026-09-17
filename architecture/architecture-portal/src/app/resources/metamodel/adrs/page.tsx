/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import AdrsTable from './components/AdrsTable'
import { fetchAllAdrs, ALL_ADRS_QUERY_KEY } from './hooks/useGetAllAdrs'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import { isMetamodelDatasetEnabled } from '../constants'

export const metadata: Metadata = {
    title: 'ADRs'
}

export default async function MetamodelAdrsPage() {
    if (!isMetamodelDatasetEnabled('adrs')) {
        notFound()
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ALL_ADRS_QUERY_KEY,
        queryFn: () => fetchAllAdrs()
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content' py={4}>
            <HydrationBoundary state={dehydratedState}>
                <AdrsTable />
            </HydrationBoundary>
        </Box>
    )
}
