/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import { getCJSidebarFromJson } from './utils'
import { CustomerJourneysIndex } from './components'
import { getCustomerJourneys } from '@/app/business-architecture/utils/server'

export const metadata: Metadata = {
    title: 'Enterprise Customer Journeys'
}

export default async function EnterpriseCustomerJourneys() {
    let customer_journeys: Awaited<ReturnType<typeof getCustomerJourneys>> = []
    try {
        customer_journeys = await getCustomerJourneys()
    } catch (error) {
        console.error(
            'Failed to fetch customer journeys during prerender, using empty data:',
            error
        )
    }

    const sidebar = getCJSidebarFromJson(
        'enterprise-customer-journeys',
        customer_journeys
    )

    return (
        <DocumentLayout
            label='Enterprise Customer Journeys'
            slug='enterprise-customer-journeys'
            sidebar={sidebar}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                {
                    label: 'Enterprise Customer Journeys',
                    href: '/enterprise-customer-journeys'
                }
            ]}
            isCustomerJourney
        >
            <CustomerJourneysIndex />
        </DocumentLayout>
    )
}
