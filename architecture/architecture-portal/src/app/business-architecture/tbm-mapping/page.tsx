/* istanbul ignore file */
import { Suspense } from 'react'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import {
    CAPABILITY_QUERY_KEY,
    CUSTOMER_JOURNEYS_QUERY_KEY,
    APPTIO_EPIC_JOURNEYS_QUERY_KEY
} from '@/app/business-architecture/hooks'
import {
    getCapabilities,
    getCustomerJourneys,
    getApptioEpicJourneys
} from '@/app/business-architecture/utils/server'
import { NavbarHider } from '@/context'
import { AptioForm } from './components'
import { TBMMappingGuard } from './components/TBMMappingGuard'

export default async function AptioPage({
    searchParams
}: {
    searchParams: Promise<{ strategicEpic?: string }>
}) {
    const { strategicEpic = '' } = await searchParams
    const queryClient = new QueryClient()
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: CAPABILITY_QUERY_KEY,
            queryFn: getCapabilities
        }),
        queryClient.prefetchQuery({
            queryKey: CUSTOMER_JOURNEYS_QUERY_KEY,
            queryFn: getCustomerJourneys
        }),
        ...(strategicEpic
            ? [
                  queryClient.prefetchQuery({
                      queryKey: APPTIO_EPIC_JOURNEYS_QUERY_KEY(strategicEpic),
                      queryFn: () => getApptioEpicJourneys(strategicEpic)
                  })
              ]
            : [])
    ])
    const dehydratedState = dehydrate(queryClient)

    return (
        <TBMMappingGuard>
            <NavbarHider />
            <Suspense>
                <HydrationBoundary state={dehydratedState}>
                    <AptioForm epicId={strategicEpic} />
                </HydrationBoundary>
            </Suspense>
        </TBMMappingGuard>
    )
}
