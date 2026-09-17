'use server'
import React from 'react'
import { Domain } from '../../types'
import { fetchArchitecture } from '@/utils/server'
import { API_ENDPOINTS } from '@/constants'
import DomainApiPage from './DomainApiPage'

export default async function DomainApiContainer({
    playbook_id
}: {
    playbook_id?: string
}) {
    const [companySubDomains, domainDetails] = await Promise.all([
        fetchArchitecture(API_ENDPOINTS.GET_SUB_DOMAINS)
            .then(res => res.json())
            .then(res => res.data),
        fetchArchitecture(API_ENDPOINTS.GET_DOMAINS)
            .then(res => res.json())
            .then(res => res.data)
    ])

    const domainMetadata =
        domainDetails.find((x: Domain) => x.playbook_id === playbook_id) ?? {}

    const { company_domain_id } = domainMetadata
    const statusCount = await fetchArchitecture(
        API_ENDPOINTS.GET_STATUS_COUNT(company_domain_id)
    )
        .then(res => res.json())
        .then(res => res.data)

    return (
        <DomainApiPage
            domainMetadata={domainMetadata}
            statusCount={statusCount}
            companyDomains={domainDetails}
            companySubDomains={companySubDomains}
        />
    )
}
