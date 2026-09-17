import { API_ENDPOINTS } from '@/constants'
import { createMetamodelList } from '../../hooks/useMetamodelList'
import type { Actor } from '../../components/cells'

interface CompanyDomainOwnerDto {
    title: string
    name: string | null
    emails: string[]
}

interface CompanyDomainApplicationRefDto {
    applicationId: string
    applicationName: string
}

/**
 * Metamodel company domain list DTO
 * (`GET /api/v1/company-domains` → `data[]`). Returns only id + name.
 */
export interface CompanyDomainListItemDto {
    companyDomainId: string
    companyDomainName: string
}

/**
 * Metamodel company domain detail DTO
 * (`GET /api/v1/company-domains/:ids`).
 */
export interface CompanyDomainDetailDto {
    companyDomainId: string
    companyDomainName: string
    description: string | null
    shortDescription: string | null
    domainCategoryId: string | null
    displaySortOrder: number | null
    apiSequenceNumber: number | null
    lastUpdateUserId: string | null
    lastUpdateTimestamp: string | null
    owners: CompanyDomainOwnerDto[]
    linkedApplications: CompanyDomainApplicationRefDto[]
}

/** Row shape consumed by `CompanyDomainsTable`. All fields are read-only. */
export interface CompanyDomainListItem {
    id: string
    name: string
    description: string
    shortDescription: string
    ownerUnitCio: Actor
    ownerTechnologyOwner: Actor
    ownerPrincipalEaArchitect: Actor
    ownerEaArchitect: Actor
    ownerHeadEngineer: Actor
    ownerEaArchitectDelegate: Actor
    linkedApplications: string[]
}

export const ALL_COMPANY_DOMAINS_QUERY_KEY = ['metamodel', 'company-domains']

// architecture-metamodel caps company-domain get-by-ids at 10 ids per request.
const COMPANY_DOMAINS_BY_IDS_BATCH_SIZE = 10

function ownerByTitle(owners: CompanyDomainOwnerDto[], title: string): Actor {
    const owner = owners.find(
        o => o.title === title && (o.name || o.emails?.length)
    )
    return { name: owner?.name ?? '', email: owner?.emails?.[0] ?? '' }
}

const companyDomainsList = createMetamodelList<
    CompanyDomainListItemDto,
    CompanyDomainDetailDto,
    CompanyDomainListItem
>({
    queryKey: ALL_COMPANY_DOMAINS_QUERY_KEY,
    listEndpoint: API_ENDPOINTS.METAMODEL_LIST_COMPANY_DOMAINS,
    byIdsUrl: API_ENDPOINTS.METAMODEL_GET_COMPANY_DOMAINS_BY_IDS,
    batchSize: COMPANY_DOMAINS_BY_IDS_BATCH_SIZE,
    listId: dto => dto.companyDomainId,
    detailId: dto => dto.companyDomainId,
    map: (summary, detail) => ({
        id: summary.companyDomainId,
        name: summary.companyDomainName,
        description: detail?.description ?? '',
        shortDescription: detail?.shortDescription ?? '',
        ownerUnitCio: ownerByTitle(detail?.owners ?? [], 'Unit CIO'),
        ownerTechnologyOwner: ownerByTitle(
            detail?.owners ?? [],
            'Technology Owner'
        ),
        ownerPrincipalEaArchitect: ownerByTitle(
            detail?.owners ?? [],
            'Principal EA Architect'
        ),
        ownerEaArchitect: ownerByTitle(detail?.owners ?? [], 'EA Architect'),
        ownerHeadEngineer: ownerByTitle(detail?.owners ?? [], 'Head Engineer'),
        ownerEaArchitectDelegate: ownerByTitle(
            detail?.owners ?? [],
            'EA Architect Delegate'
        ),
        linkedApplications: (detail?.linkedApplications ?? []).map(
            ref => ref.applicationName
        )
    })
})

export const fetchAllCompanyDomains = companyDomainsList.fetchAll

export function useGetAllCompanyDomains() {
    const { data, loading, error } = companyDomainsList.useList()
    return { companyDomains: data, loading, error }
}
