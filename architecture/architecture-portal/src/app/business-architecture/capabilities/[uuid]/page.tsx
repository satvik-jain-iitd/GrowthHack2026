/* istanbul ignore file */
import { Box } from '@chakra-ui/react'
import { notFound } from 'next/navigation'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import {
    Details,
    DetailsHeader
} from '@/app/business-architecture/capabilities/components/Details'
import {
    CAPABILITY_QUERY_KEY,
    CAPABILITY_COMPANY_DOMAINS_QUERY_KEY,
    CUSTOMER_JOURNEYS_QUERY_KEY
} from '@/app/business-architecture/hooks'
import {
    getCapabilities,
    getCapabilityCompanyDomains,
    getCustomerJourneys
} from '@/app/business-architecture/utils/server'
import { DOMAIN_QUERY_KEY } from '@/app/company-domains/hooks'
import { getDomains } from '@/app/company-domains/utils/server'
import { Capability } from '@/app/business-architecture/types'

const generateBreadcrumbs = (
    selectedCapability: Capability | undefined,
    capabilities: Capability[]
) => {
    if (!selectedCapability) {
        return []
    }
    const breadcrumbs = [
        {
            label: selectedCapability.capability_nm,
            href: `/business-architecture/capabilities/${selectedCapability.capability_id}?tab=Enterprise+Customer+Journeys`
        }
    ]

    let currCap = selectedCapability
    while (currCap?.parent_capability_id) {
        const parent = capabilities?.find(
            capability =>
                capability.capability_id === currCap?.parent_capability_id
        )
        if (parent) {
            breadcrumbs.unshift({
                label: parent.capability_nm,
                href: `/business-architecture/capabilities/${parent.capability_id}?tab=Enterprise+Customer+Journeys`
            })
            currCap = parent
        } else {
            break
        }
    }
    breadcrumbs.unshift(
        { label: 'Home', href: '/' },
        {
            label: 'EBCM',
            href: '/business-architecture/model'
        }
    )

    return breadcrumbs
}

export default async function CapabilityDetails({
    params
}: {
    params: Promise<{ uuid: string }>
}) {
    const { uuid } = await params
    const queryClient = new QueryClient()
    // getCapabilities is awaited directly rather than prefetched: prefetchQuery
    // swallows errors, which would turn an upstream failure into a bogus 404.
    const [capabilities] = await Promise.all([
        getCapabilities(),
        queryClient.prefetchQuery({
            queryKey: CUSTOMER_JOURNEYS_QUERY_KEY,
            queryFn: getCustomerJourneys
        }),
        queryClient.prefetchQuery({
            queryKey: DOMAIN_QUERY_KEY,
            queryFn: getDomains
        }),
        queryClient.prefetchQuery({
            queryKey: CAPABILITY_COMPANY_DOMAINS_QUERY_KEY(uuid),
            queryFn: () => getCapabilityCompanyDomains(uuid)
        })
    ])
    queryClient.setQueryData(CAPABILITY_QUERY_KEY, capabilities)

    const selectedCapability = capabilities?.find(
        capability => capability.capability_id === uuid
    )
    const breadcrumbs = generateBreadcrumbs(
        selectedCapability,
        capabilities || []
    )

    if (!selectedCapability) {
        notFound()
    }

    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            <Box>
                <DetailsHeader />
                <Details
                    breadcrumbs={breadcrumbs}
                    capability_id={uuid}
                    capabilityData={selectedCapability}
                />
            </Box>
        </HydrationBoundary>
    )
}
