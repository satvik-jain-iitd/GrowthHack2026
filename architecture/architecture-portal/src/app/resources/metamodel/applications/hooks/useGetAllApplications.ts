import { API_ENDPOINTS } from '@/constants'
import { createMetamodelList } from '../../hooks/useMetamodelList'

interface InitiativeReferenceDto {
    initiativeId: string
    initiativeName: string
    isCore: boolean
}

interface ADRReferenceDto {
    adrId: string
    title: string
    isCore: boolean
}

interface BVBReferenceDto {
    bvbId: string
    title: string
    isCore: boolean
}

interface CompanyDomainDto {
    companyDomainId: string
    companyDomainName: string
}

/**
 * Metamodel application list DTO (`GET /api/v1/applications` → `data[]`).
 * The deployed list endpoint returns only id + name.
 */
export interface ApplicationSummaryDto {
    applicationId: string
    applicationName: string
}

/**
 * Metamodel application detail DTO (`GET /api/v1/applications/:ids`).
 */
export interface ApplicationDetailDto {
    applicationId: string
    applicationName: string
    lifecycleState: string | null
    applicationType: string[]
    lineOfBusiness: string | null
    supportedBusinessUnits: string[]
    marketsSupported: string[]
    technologyStacks: string[]
    linkedInitiatives: InitiativeReferenceDto[]
    linkedArchitectureDecisionRecords: ADRReferenceDto[]
    linkedBuildVsBuyAssessments: BVBReferenceDto[]
    linkedCompanyDomain: CompanyDomainDto | null
}

/** Row shape consumed by `ApplicationsTable`. All fields are read-only. */
export interface ApplicationListItem {
    id: string
    name: string
    lifecycleState: string
    applicationType: string
    lineOfBusiness: string
    linkedCompanyDomain: string
    supportedBusinessUnits: string[]
    marketsSupported: string[]
    technologyStacks: string[]
    linkedInitiatives: string[]
    linkedAdrs: string[]
    linkedBvbs: string[]
}

export const ALL_APPLICATIONS_QUERY_KEY = ['metamodel', 'applications']

// architecture-metamodel caps application get-by-ids at 5 ids per request.
const APPLICATIONS_BY_IDS_BATCH_SIZE = 5

const applicationsList = createMetamodelList<
    ApplicationSummaryDto,
    ApplicationDetailDto,
    ApplicationListItem
>({
    queryKey: ALL_APPLICATIONS_QUERY_KEY,
    listEndpoint: API_ENDPOINTS.METAMODEL_LIST_APPLICATIONS,
    byIdsUrl: API_ENDPOINTS.METAMODEL_GET_APPLICATIONS_BY_IDS,
    batchSize: APPLICATIONS_BY_IDS_BATCH_SIZE,
    listId: dto => dto.applicationId,
    detailId: dto => dto.applicationId,
    map: (summary, detail) => ({
        id: summary.applicationId,
        name: summary.applicationName,
        lifecycleState: detail?.lifecycleState ?? '',
        applicationType: (detail?.applicationType ?? []).join(', '),
        lineOfBusiness: detail?.lineOfBusiness ?? '',
        linkedCompanyDomain:
            detail?.linkedCompanyDomain?.companyDomainName ?? '',
        supportedBusinessUnits: detail?.supportedBusinessUnits ?? [],
        marketsSupported: detail?.marketsSupported ?? [],
        technologyStacks: detail?.technologyStacks ?? [],
        linkedInitiatives: (detail?.linkedInitiatives ?? []).map(
            ref => ref.initiativeName
        ),
        linkedAdrs: (detail?.linkedArchitectureDecisionRecords ?? []).map(
            ref => ref.title
        ),
        linkedBvbs: (detail?.linkedBuildVsBuyAssessments ?? []).map(
            ref => ref.title
        )
    })
})

export const fetchAllApplications = applicationsList.fetchAll

/** Lightweight list fetch (id + name only) used to hydrate the lazy grid. */
export const fetchApplicationsList = applicationsList.fetchList

/** React Query key holding the lightweight applications list. */
export const APPLICATIONS_LIST_QUERY_KEY = applicationsList.listQueryKey

/**
 * Applications is by far the largest metamodel dataset, so eagerly enriching
 * every row (get-by-ids, 5 at a time) is slow. When enabled, the grid paginates
 * and only enriches the visible page. Flip to `false` to fall back to the
 * eager, fetch-everything behavior used by the other grids.
 */
export const APPLICATIONS_LAZY_ENRICHMENT = true

/** Rows per page when lazy enrichment is enabled. */
export const APPLICATIONS_PAGE_SIZE = 25

export function useGetAllApplications() {
    const { data, loading, error } = applicationsList.useList()
    return { applications: data, loading, error }
}

export function useGetAllApplicationsLazy(visibleIds: string[]) {
    const { data, loading, error, enriching } =
        applicationsList.useLazyList(visibleIds)
    return { applications: data, loading, error, enriching }
}
