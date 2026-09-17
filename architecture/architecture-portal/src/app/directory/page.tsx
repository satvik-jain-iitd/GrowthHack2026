/* istanbul ignore file */
import React from 'react'
import { DOMAIN_QUERY_KEY } from '@/app/company-domains/hooks'
import { getDomains } from '@/app/company-domains/utils/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DirectoryContainer } from './components'
import { DomainProvider } from '@/context/DomainContext'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from '@tanstack/react-query'
import { featureFlags } from '@/constants'

export const metadata: Metadata = {
    title: 'Architecture Directory'
}

export default async function Directory() {
    const showDirectory = featureFlags.enableDirectoryMVP1Changes
    if (!showDirectory) {
        notFound()
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: DOMAIN_QUERY_KEY,
        queryFn: getDomains
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            <DomainProvider>
                <DirectoryContainer />
            </DomainProvider>
        </HydrationBoundary>
    )
}
