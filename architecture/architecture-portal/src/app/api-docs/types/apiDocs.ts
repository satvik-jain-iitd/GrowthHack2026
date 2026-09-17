/* istanbul ignore file */

import { Domain } from '@/app/company-domains/types/domains'
import { OpenAPIV3 } from 'openapi-types'
import type { OperationNfrs } from '@/components/ui/NfrList'

interface domainsLeftNav {
    id: string
    name: string
    apis: { [key: string]: apisLeftNav }
}

interface apisLeftNav {
    id: string
    name: string
    description: string
    path: string[]
    catalogUrl?: string
    operations: { [key: string]: operationsLeftNav }
}

interface operationsLeftNav {
    id: string
    name: string
    description: string
    path: string[]
    status?: string
    statusId?: string
    method?: OpenAPIV3.HttpMethods
    resource?: string
    catalogUrl?: string
}

interface OperationMetadata {
    operation_id: string
    operation_nm: string
    operation_desc: string | null
    operation_type: string | null
    operation_journey_url: string | null
    operation_catalog_url: string | null
    design_score: string | null
    design_report_url: string | null
    nfrs: OperationNfrs | null
    api_id: string
    schema?: OpenAPIV3.Document
}

interface DomainInfo {
    id: string
    name: string
    description: string
    lightIcon: string
    darkIcon: string
    filledLightIcon: string
    filledDarkIcon: string
    playbookId: string
    loading: boolean
    error: Error | null | undefined
    sortOrder: number
}

interface Domains {
    domains: Domain[] | undefined
    loading: boolean
    error: Error | null
}

export type {
    domainsLeftNav,
    apisLeftNav,
    operationsLeftNav,
    OperationMetadata,
    DomainInfo,
    Domains
}
