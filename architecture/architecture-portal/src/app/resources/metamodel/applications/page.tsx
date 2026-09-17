/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import ApplicationsTable from './components/ApplicationsTable'
import {
    fetchAllApplications,
    fetchApplicationsList,
    ALL_APPLICATIONS_QUERY_KEY,
    APPLICATIONS_LIST_QUERY_KEY,
    APPLICATIONS_LAZY_ENRICHMENT
} from './hooks/useGetAllApplications'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import { isMetamodelDatasetEnabled } from '../constants'

export const metadata: Metadata = {
    title: 'Applications'
}

export default async function MetamodelApplicationsPage() {
    if (!isMetamodelDatasetEnabled('applications')) {
        notFound()
    }

    const queryClient = new QueryClient()
    // Lazy grid hydrates only the lightweight list (id + name) and enriches
    // the visible page client-side; eagerly enriching every row here is what
    // made this the slowest page to prerender.
    if (APPLICATIONS_LAZY_ENRICHMENT) {
        await queryClient.prefetchQuery({
            queryKey: APPLICATIONS_LIST_QUERY_KEY,
            queryFn: () => fetchApplicationsList()
        })
    } else {
        await queryClient.prefetchQuery({
            queryKey: ALL_APPLICATIONS_QUERY_KEY,
            queryFn: () => fetchAllApplications()
        })
    }
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content' py={4}>
            <HydrationBoundary state={dehydratedState}>
                <ApplicationsTable />
            </HydrationBoundary>
        </Box>
    )
}
