import * as React from 'react'
import { API_ENDPOINTS, PLAYBOOK_TYPE_IDS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { AdminLayout } from './AdminLayout'

async function getAdminSidebar(playbookTypeIds: string[]) {
    const sidebar_hierarchy = await fetchArchitecture(
        API_ENDPOINTS.GET_ADMIN_SIDEBAR,
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playbook_type_ids: playbookTypeIds })
        }
    )
        .then(res => {
            return res.json()
        })
        .then(res => {
            return res.data
        })
    return sidebar_hierarchy
}

export async function AdminContainer({
    playbookCategory
}: {
    playbookCategory:
        | 'initiatives'
        | 'company-domains'
        | 'foundational-technologies'
}) {
    const sidebarInitiative = await getAdminSidebar([
        PLAYBOOK_TYPE_IDS.INITIATIVE
    ])
    const sidebarCompanyDomains = await getAdminSidebar([
        PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN,
        PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN,
        PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN_CATEGORY
    ])
    const sidebarFoundationalTechnologies = await getAdminSidebar([
        PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY
    ])

    const paramMap = {
        initiatives: sidebarInitiative,
        'company-domains': sidebarCompanyDomains,
        'foundational-technologies': sidebarFoundationalTechnologies
    }

    return <AdminLayout sidebar={paramMap[playbookCategory]} />
}
