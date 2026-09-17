import React from 'react'
import { Metadata } from 'next'
import Index from '@/app/docs/components/Index'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import { getDocument } from '@/app/docs/utils/server'
import { PLAYBOOK_TYPE_IDS, PLAYBOOK_TYPE_SLUGS } from '@/constants'

export const metadata: Metadata = {
    title: 'Build vs. Buys'
}

export default async function BuildvsBuys() {
    const { sidebar_hierarchy } = await getDocument({
        typeId: PLAYBOOK_TYPE_IDS.BUILD_VS_BUY
    })
    return (
        <DocumentLayout
            label='Build vs Buy'
            slug={PLAYBOOK_TYPE_SLUGS[PLAYBOOK_TYPE_IDS.BUILD_VS_BUY]}
            sidebar={sidebar_hierarchy}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Build vs Buy', href: '/build-vs-buys' }
            ]}
        >
            <Index isBvB />
        </DocumentLayout>
    )
}
