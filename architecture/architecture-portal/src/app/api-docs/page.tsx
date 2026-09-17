/* istanbul ignore file */

import { Metadata } from 'next'
import LandingPage from './components/LandingPage'
import { DOMAIN_QUERY_KEY } from '@/app/company-domains/hooks'
import { getDomains } from '@/app/company-domains/utils/server'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { APIDOCS_SIDEBAR_KEY } from './components/hooks/useGetApiDocsSidebar'
import { getApiDocsSidebar } from '@/app/api-docs/utils/server'

export const revalidate = 3600 // Revalidate every hour
export const metadata: Metadata = {
    title: 'API Documentation'
}

export default async function ApiDocs() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 3600000 * 24 // 24 hours
            }
        }
    })
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: DOMAIN_QUERY_KEY,
            queryFn: getDomains
        }),
        queryClient.prefetchQuery({
            queryKey: APIDOCS_SIDEBAR_KEY,
            queryFn: getApiDocsSidebar
        })
    ])
    const dehydratedState = dehydrate(queryClient)
    return (
        <HydrationBoundary state={dehydratedState}>
            <LandingPage />
        </HydrationBoundary>
    )
}
