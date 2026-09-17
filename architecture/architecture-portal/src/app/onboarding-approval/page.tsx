/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import { Stack } from '@chakra-ui/react'
import { PLAYBOOKS_QUERY_KEY } from '@/hooks/usePlaybooks'
import { getPlaybooks } from '@/utils/server'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { Approvals } from '@/app/onboarding-approval/components'

export const metadata: Metadata = {
    title: 'Onboarding Approval'
}

export default async function OnboardingApproval() {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: PLAYBOOKS_QUERY_KEY,
        queryFn: getPlaybooks
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Stack className='page-content'>
            <HydrationBoundary state={dehydratedState}>
                <Approvals />
            </HydrationBoundary>
        </Stack>
    )
}
