/* istanbul ignore file */
import { Metadata } from 'next'
import { Flex } from '@chakra-ui/react'
import { notFound } from 'next/navigation'
import MetricsBody from '../components/MetricsBody'
import MetricsHeader from '../components/MetricsHeader'
import { METRIC_ID_TO_VIEW } from '../constants/metricRoutes'
import { DomainProvider } from '@/context/DomainContext'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from '@tanstack/react-query'
import { DOMAIN_QUERY_KEY } from '@/app/company-domains/hooks'
import { getDomains } from '@/app/company-domains/utils/server'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Company Domain Metrics'
}

export default async function Metrics({
    params
}: {
    params: Promise<{ metricId: string }>
}) {
    const { metricId } = await params
    if (!METRIC_ID_TO_VIEW[metricId]) notFound()

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: DOMAIN_QUERY_KEY,
        queryFn: getDomains
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            <Flex
                direction='column'
                minH='100vh'
                background='surface.default.offwhite'
            >
                <MetricsHeader />
                <DomainProvider>
                    <Suspense fallback={<div>Loading metrics...</div>}>
                        <MetricsBody />
                    </Suspense>
                </DomainProvider>
            </Flex>
        </HydrationBoundary>
    )
}
