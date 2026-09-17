/* istanbul ignore file */
import {
    QueryClient,
    dehydrate,
    HydrationBoundary
} from '@tanstack/react-query'
import { PLAYBOOKS_QUERY_KEY, ANALYTICS_QUERY_KEY } from '@/hooks'
import { getPlaybooks, getAnalytics } from '@/utils/server'
import CardSection from '@/app/home/CardSection'
import HeroSection from '@/app/home/HeroSection'
import Insights from '@/app/home/Insights'
import HowToContribute from '@/app/home/HowToContribute'
import { Stack } from '@chakra-ui/react'

export default async function Home() {
    const queryClient = new QueryClient()
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: PLAYBOOKS_QUERY_KEY,
            queryFn: getPlaybooks
        }),
        queryClient.prefetchQuery({
            queryKey: ANALYTICS_QUERY_KEY,
            queryFn: getAnalytics
        })
    ])
    const dehydratedState = dehydrate(queryClient)

    return (
        <Stack className='page-content'>
            <HydrationBoundary state={dehydratedState}>
                <HeroSection />
                <CardSection />
                <Insights />
                <HowToContribute />
            </HydrationBoundary>
        </Stack>
    )
}
