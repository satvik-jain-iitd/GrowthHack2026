/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import Index from '@/app/docs/components/Index'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import { getDocument } from '@/app/docs/utils/server'
import { PLAYBOOK_TYPE_IDS, PLAYBOOK_TYPE_SLUGS } from '@/constants'

export const metadata: Metadata = {
    title: 'Standards & Compliance'
}

export default async function StandardsAndCompliance() {
    const { sidebar_hierarchy } = await getDocument({
        typeId: PLAYBOOK_TYPE_IDS.STANDARDS_AND_COMPLIANCE
    })
    return (
        <DocumentLayout
            label='Standards & Compliance'
            slug={
                PLAYBOOK_TYPE_SLUGS[PLAYBOOK_TYPE_IDS.STANDARDS_AND_COMPLIANCE]
            }
            sidebar={sidebar_hierarchy}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                {
                    label: 'Standards & Compliance',
                    href: '/standards-and-compliance'
                }
            ]}
        >
            <Index />
        </DocumentLayout>
    )
}
