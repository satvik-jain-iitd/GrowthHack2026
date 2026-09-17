/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import BvbsTable from './components/BvbsTable'
import { fetchAllBvbs, ALL_BVBS_QUERY_KEY } from './hooks/useGetAllBvbs'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import { isMetamodelDatasetEnabled } from '../constants'

export const metadata: Metadata = {
    title: 'Build vs Buy Assessments'
}

export default async function MetamodelBvbsPage() {
    if (!isMetamodelDatasetEnabled('bvbs')) {
        notFound()
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ALL_BVBS_QUERY_KEY,
        queryFn: () => fetchAllBvbs()
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content' py={4}>
            <HydrationBoundary state={dehydratedState}>
                <BvbsTable />
            </HydrationBoundary>
        </Box>
    )
}
