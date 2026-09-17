/* istanbul ignore file */
import { Suspense } from 'react'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import BusinessArchitecture from './components/BusinessArchitecture'
import {
    CAPABILITY_QUERY_KEY,
    CAPABILITY_OWNERS_QUERY_KEY,
    CUSTOMER_JOURNEYS_QUERY_KEY
} from '@/app/business-architecture/hooks'
import {
    getCapabilities,
    getCapabilityOwners,
    getCustomerJourneys
} from '@/app/business-architecture/utils/server'

export default async function BusinessArchitecturePage() {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: CAPABILITY_QUERY_KEY,
        queryFn: getCapabilities
    })
    await queryClient.prefetchQuery({
        queryKey: CAPABILITY_OWNERS_QUERY_KEY,
        queryFn: getCapabilityOwners
    })
    await queryClient.prefetchQuery({
        queryKey: CUSTOMER_JOURNEYS_QUERY_KEY,
        queryFn: getCustomerJourneys
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Suspense>
            <HydrationBoundary state={dehydratedState}>
                <BusinessArchitecture />
            </HydrationBoundary>
        </Suspense>
    )
}
