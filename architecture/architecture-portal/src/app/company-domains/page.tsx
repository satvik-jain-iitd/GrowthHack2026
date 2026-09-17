/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import { DomainsContainer } from './components/DomainsContainer'
import { domainViews } from './constants'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from '@tanstack/react-query'
import { DOMAIN_QUERY_KEY } from '@/app/company-domains/hooks'
import { getDomains } from '@/app/company-domains/utils/server'
import { ANALYTICS_QUERY_KEY } from '@/hooks'
import { getAnalytics } from '@/utils/server'
import { Box } from '@chakra-ui/react'
import { DomainProvider } from '@/context/DomainContext'

export const metadata: Metadata = {
    title: 'Company Domains'
}

export default async function CompanyDomains() {
    const queryClient = new QueryClient()
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: DOMAIN_QUERY_KEY,
            queryFn: getDomains
        }),
        queryClient.prefetchQuery({
            queryKey: ANALYTICS_QUERY_KEY,
            queryFn: getAnalytics
        })
    ])
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content'>
            <HydrationBoundary state={dehydratedState}>
                <DomainProvider>
                    <DomainsContainer viewState={domainViews.cardView} />
                </DomainProvider>
            </HydrationBoundary>
        </Box>
    )
}
