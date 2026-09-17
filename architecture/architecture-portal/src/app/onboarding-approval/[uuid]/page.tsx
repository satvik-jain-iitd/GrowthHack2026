/* istanbul ignore file */
import React from 'react'
import { Stack } from '@chakra-ui/react'
import { PLAYBOOK_QUERY_KEY } from '@/hooks/usePlaybooks'
import { getPlaybook } from '@/utils/server'
import {
    HydrationBoundary,
    dehydrate,
    QueryClient
} from '@tanstack/react-query'
import { Approval } from '@/app/onboarding-approval/components'

export async function generateMetadata({
    params
}: {
    params: Promise<{ uuid: string }>
}) {
    try {
        const { uuid } = await params
        const { playbook_nm } = await getPlaybook(uuid)
        return {
            title: `${playbook_nm} - Onboarding Approval`
        }
    } catch {
        return {
            title: 'Onboarding Approval'
        }
    }
}

export default async function OnboardingApproval({
    params
}: {
    params: Promise<{ uuid: string }>
}) {
    const { uuid } = await params
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: PLAYBOOK_QUERY_KEY(uuid),
        queryFn: () => getPlaybook(uuid)
    })
    const dehydratedState = dehydrate(queryClient)

    return (
        <Stack className='page-content'>
            <HydrationBoundary state={dehydratedState}>
                <Approval id={uuid} />
            </HydrationBoundary>
        </Stack>
    )
}
