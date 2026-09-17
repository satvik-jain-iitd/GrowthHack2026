/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import BvBTrackerTable from '@/app/resources/bvb-tracker/components/BvBTrackerTable'
import { BVB_PLAYBOOKS_QUERY_KEY } from './hooks/useGetBvBPlaybooks'
import { getBvBPlaybooks } from './utils/server'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'

export const metadata: Metadata = {
    title: 'Build vs. Buy Tracker'
}

export default async function Tracker() {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: BVB_PLAYBOOKS_QUERY_KEY,
        queryFn: getBvBPlaybooks
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content'>
            <HydrationBoundary state={dehydratedState}>
                <BvBTrackerTable />
            </HydrationBoundary>
        </Box>
    )
}
