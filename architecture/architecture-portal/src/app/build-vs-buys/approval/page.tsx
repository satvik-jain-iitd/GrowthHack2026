import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import { BVB_PLAYBOOKS_QUERY_KEY } from '@/app/resources/bvb-tracker/hooks/useGetBvBPlaybooks'
import { getBvBPlaybooks } from '@/app/resources/bvb-tracker/utils/server'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import BvBAcceptancePage from '@/app/build-vs-buys/approval/BvBAcceptanceList'

export const metadata: Metadata = {
    title: 'Build vs. Buy Approval'
}

export default async function BvBApproval() {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: BVB_PLAYBOOKS_QUERY_KEY,
        queryFn: getBvBPlaybooks
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content'>
            <HydrationBoundary state={dehydratedState}>
                <BvBAcceptancePage />
            </HydrationBoundary>
        </Box>
    )
}
