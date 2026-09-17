/* istanbul ignore file */
import React from 'react'
import { notFound } from 'next/navigation'
import { Separator, Text } from '@chakra-ui/react'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import {
    CustomerJourneyLanding,
    CustomerJourneysIndex
} from '@/app/enterprise-customer-journeys/components'
import {
    getCJSidebarFromJson,
    getCJBreadcrumbsFromJson
} from '@/app/enterprise-customer-journeys/utils'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from '@tanstack/react-query'
import { CUSTOMER_JOURNEYS_QUERY_KEY } from '@/app/business-architecture/hooks'
import { getCustomerJourneys } from '@/app/business-architecture/utils/server'
import { PrevNext } from '@/types/PrevNext'
import { SidebarItem } from '@/types/SidebarItem'

const BASE_ROUTE = 'enterprise-customer-journeys'

export async function generateMetadata() {
    return {
        title: 'Enterprise Customer Journey'
    }
}

export default async function CustomerJourneyPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const queryClient = new QueryClient()
    const { id } = await params

    const customer_journeys = await getCustomerJourneys()
    queryClient.setQueryData(CUSTOMER_JOURNEYS_QUERY_KEY, customer_journeys)
    const dehydratedState = dehydrate(queryClient)

    //req sidebar
    const journey = customer_journeys?.find(j => j.journey_id === id)

    if (!journey) {
        notFound()
    }

    const sidebar = getCJSidebarFromJson(
        BASE_ROUTE,
        customer_journeys || [],
        id
    )
    const breadcrumbs = getCJBreadcrumbsFromJson(
        BASE_ROUTE,
        id,
        customer_journeys || []
    )

    const hasStages =
        journey.journey_stages && journey.journey_stages.length > 0

    const allJourneys = (sidebar as SidebarItem[]).flatMap(group =>
        'children' in group ? (group.children ?? []) : []
    )

    const currentIndex = allJourneys.findIndex(
        j => j.href === `/${BASE_ROUTE}/${id}`
    )

    const prevNext: PrevNext = {
        previous:
            currentIndex > 0
                ? {
                      label: allJourneys[currentIndex - 1].name,
                      href: allJourneys[currentIndex - 1].href
                  }
                : undefined,
        next:
            currentIndex < allJourneys.length - 1
                ? {
                      label: allJourneys[currentIndex + 1].name,
                      href: allJourneys[currentIndex + 1].href
                  }
                : undefined
    }

    return (
        <DocumentLayout
            label='Enterprise Customer Journeys'
            sidebar={sidebar}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                {
                    label: 'Enterprise Customer Journeys',
                    href: `/${BASE_ROUTE}`
                },
                ...breadcrumbs
            ]}
            isCustomerJourney={true}
            prevNext={prevNext}
        >
            <HydrationBoundary state={dehydratedState}>
                {hasStages ? (
                    <CustomerJourneyLanding id={id} />
                ) : !id ? (
                    <CustomerJourneysIndex />
                ) : (
                    <>
                        <Text fontWeight='bold' fontSize='2xl' p={4}>
                            {journey.journey_statement}
                        </Text>
                        <Separator />
                        <Text fontSize='16px' p={4}>
                            {journey.journey_desc}
                        </Text>
                    </>
                )}
            </HydrationBoundary>
        </DocumentLayout>
    )
}
