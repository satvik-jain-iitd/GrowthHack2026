/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import Index from '@/app/docs/components/Index'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import { getDocument } from '@/app/docs/utils/server'
import { PLAYBOOK_TYPE_IDS, PLAYBOOK_TYPE_SLUGS } from '@/constants'

export const metadata: Metadata = {
    title: 'Papers'
}

export default async function Papers() {
    const { sidebar_hierarchy } = await getDocument({
        typeId: PLAYBOOK_TYPE_IDS.PAPER
    })
    return (
        <DocumentLayout
            label='Paper'
            slug={PLAYBOOK_TYPE_SLUGS[PLAYBOOK_TYPE_IDS.PAPER]}
            sidebar={sidebar_hierarchy}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                {
                    label: 'Paper',
                    href: '/papers'
                }
            ]}
        >
            <Index />
        </DocumentLayout>
    )
}
