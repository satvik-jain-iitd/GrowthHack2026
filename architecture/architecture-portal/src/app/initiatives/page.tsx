/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import Index from '@/app/docs/components/Index'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import { getDocument } from '@/app/docs/utils/server'
import {
    API_ENDPOINTS,
    PLAYBOOK_TYPE_IDS,
    PLAYBOOK_TYPE_SLUGS
} from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import NotFound from '../not-found'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Initiatives'
}

export default async function Initiatives({
    searchParams
}: {
    searchParams?: Promise<{ etpId: string }>
}) {
    const { sidebar_hierarchy } = await getDocument({
        typeId: PLAYBOOK_TYPE_IDS.INITIATIVE
    })

    const params = await searchParams
    const { etpId } = params || { etpId: null }

    if (etpId) {
        const ptbInitiative = await fetchArchitecture(
            API_ENDPOINTS.GET_PTB_INITIATIVES_BY_ETP_ID(etpId)
        )
            .then(res => res.json())
            .then(res => res.data)

        if (ptbInitiative && ptbInitiative.length > 0) {
            redirect('/initiatives/' + ptbInitiative[0].id)
        }

        return <NotFound />
    }
    return (
        <DocumentLayout
            label='Initiative'
            slug={PLAYBOOK_TYPE_SLUGS[PLAYBOOK_TYPE_IDS.INITIATIVE]}
            sidebar={sidebar_hierarchy}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Initiative', href: '/initiatives' }
            ]}
        >
            <Index />
        </DocumentLayout>
    )
}
