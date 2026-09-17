/* istanbul ignore file */
import { Metadata } from 'next'
import { Box } from '@chakra-ui/react'
import CompanyDomainsTable from './components/CompanyDomainsTable'
import {
    fetchAllCompanyDomains,
    ALL_COMPANY_DOMAINS_QUERY_KEY
} from './hooks/useGetAllCompanyDomains'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import { isMetamodelDatasetEnabled } from '../constants'

export const metadata: Metadata = {
    title: 'Company Domains'
}

export default async function MetamodelCompanyDomainsPage() {
    if (!isMetamodelDatasetEnabled('company-domains')) {
        notFound()
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ALL_COMPANY_DOMAINS_QUERY_KEY,
        queryFn: () => fetchAllCompanyDomains()
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Box className='page-content' py={4}>
            <HydrationBoundary state={dehydratedState}>
                <CompanyDomainsTable />
            </HydrationBoundary>
        </Box>
    )
}
