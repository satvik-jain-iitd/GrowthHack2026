/* istanbul ignore file */
'use server'
import React from 'react'
import Mdx from '@/app/docs/components/Mdx'
import Markdown from '@/app/docs/components/Markdown'
import DocumentLayout from '@/app/docs/components/DocumentLayout'
import { getStaticDocument } from '@/app/docs/utils/server'
import { CustomerJourneyLanding } from '@/app/enterprise-customer-journeys/components'
import { fetchCustomerJourneys } from '@/app/business-architecture/hooks/useGetCustomerJourneys'
import { CustomerJourney } from '@/app/enterprise-customer-journeys/components'
import { SidebarItem } from '@/types/SidebarItem'

type Props = {
    path: string
    route: string
    docs: string
    label: string
    isCustomerJourney?: boolean
    CJSidebar?: SidebarItem[]
    CJBreadcrumbs?: { label: string; href: string }[]
}

export default async function StaticDocument({
    path,
    label,
    route,
    docs,
    isCustomerJourney,
    CJSidebar,
    CJBreadcrumbs
}: Props) {
    const { isMdx, markdown, sidebar, toc, breadcrumbs, prevNext } =
        await getStaticDocument(route, docs, path)

    let customer_journey: CustomerJourney[] = []
    try {
        customer_journey = await fetchCustomerJourneys()
    } catch (error) {
        console.error('Failed to fetch customer journeys:', error)
    }

    const customerJourney = customer_journey?.find(
        journey => journey.journey_id === path.split('/').pop()
    )
    const renderCJDynamic =
        isCustomerJourney &&
        customerJourney?.journey_stages &&
        customerJourney.journey_stages.length > 0

    const breadcrumbsToUse =
        isCustomerJourney && CJBreadcrumbs ? CJBreadcrumbs : breadcrumbs
    const sectionBreadcrumb = isCustomerJourney
        ? { label, href: `/${route}` }
        : { label }

    return (
        <DocumentLayout
            label={label}
            sidebar={isCustomerJourney ? CJSidebar || sidebar : sidebar}
            tableOfContents={toc}
            prevNext={prevNext}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                sectionBreadcrumb,
                ...breadcrumbsToUse
            ]}
            isCustomerJourney={isCustomerJourney}
        >
            {renderCJDynamic ? (
                <CustomerJourneyLanding id={path.split('/').pop() || ''} />
            ) : (
                <div className='markdown-body'>
                    {isMdx ? (
                        <Mdx md={markdown} toc={toc} />
                    ) : (
                        <Markdown md={markdown} toc={toc} />
                    )}
                </div>
            )}
        </DocumentLayout>
    )
}
