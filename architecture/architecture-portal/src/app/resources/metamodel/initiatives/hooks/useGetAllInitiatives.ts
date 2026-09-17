import { useMemo } from 'react'

import { API_ENDPOINTS } from '@/constants'
import {
    createMetamodelList,
    type MetamodelListParams
} from '../../hooks/useMetamodelList'
import { formatDate } from '../../utils/format'
import type { Actor } from '../../components/cells'

interface InitiativeOwnerDto {
    title: string
    name: string | null
    email: string | null
}

interface CompanyDomainDto {
    companyDomainId: string
    companyDomainName: string
}

interface InitiativeReferenceDto {
    initiativeId: string
    initiativeName: string
    isCore: boolean
}

interface ApplicationReferenceDto {
    applicationId: string
    applicationName: string
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

export interface PlaybookReference {
    playbookId: string
    isCore: boolean
}

/**
 * Metamodel initiative list DTO (`GET /api/v1/initiatives` → `data[]`).
 * The deployed list endpoint returns only id + name.
 */
export interface InitiativeSummaryDto {
    initiativeId: string
    initiativeName: string
}

/**
 * Metamodel initiative detail DTO (`GET /api/v1/initiatives/:ids`).
 * Carries the rich fields, owners and linkages the grid renders.
 */
export interface InitiativeDetailDto {
    initiativeId: string
    initiativeName: string
    startDate: string | null
    endDate: string | null
    yearsActive: string[] | null
    lineOfBusiness: string | null
    strategicEpics: string[]
    etp_ecmi_id: string | null
    legacy_etp_ecmi_id: string | null
    /** Added by architecture-metamodel; absent on not-yet-deployed hosts. */
    isEtp?: boolean | null
    /** Added by architecture-metamodel; absent on not-yet-deployed hosts. */
    isEcmi?: boolean | null
    supportedBusinessUnits: string[]
    supportedMarkets: string[]
    technologyStacks: string[]
    techCapabilities: string[]
    businessCapabilities: string[]
    foundationalTechnologies: string[]
    initiativeOwners: InitiativeOwnerDto[]
    impactedCompanyDomains: CompanyDomainDto[]
    linkedInitiatives: InitiativeReferenceDto[]
    impactedApplications: ApplicationReferenceDto[]
    architectureDecisionRecords: ADRReferenceDto[]
    buildVsBuyAssessments: BVBReferenceDto[]
    playbooks: PlaybookReference[]
}

/**
 * Row shape consumed by `InitiativesTable`. `id` is required by
 * `MetamodelDataTable`; all fields are read-only.
 */
export interface InitiativeListItem {
    id: string
    name: string
    startDate: string
    endDate: string
    yearsActive: string
    lineOfBusiness: string
    strategicEpics: string[]
    etpEcmiId: string
    legacyEtpEcmiId: string
    isEtp: boolean | null
    isEcmi: boolean | null
    supportedBusinessUnits: string[]
    supportedMarkets: string[]
    technologyStacks: string[]
    techCapabilities: string[]
    businessCapabilities: string[]
    foundationalTechnologies: string[]
    ownerUnitCio: Actor
    ownerTechVp: Actor
    ownerHeadEngineer: Actor
    ownerPrincipalArchitect: Actor
    ownerEnterpriseArchitect: Actor
    additionalArchitects: Actor[]
    linkedInitiatives: string[]
    impactedApplications: string[]
    linkedAdrs: string[]
    linkedBvbs: string[]
    impactedCompanyDomains: string[]
    playbooks: PlaybookReference[]
}

export const ALL_INITIATIVES_QUERY_KEY = ['metamodel', 'initiatives']

// architecture-metamodel caps initiative get-by-ids at 5 ids per request.
const INITIATIVES_BY_IDS_BATCH_SIZE = 5

function ownerByTitle(owners: InitiativeOwnerDto[], title: string): Actor {
    const owner = owners.find(o => o.title === title && (o.name || o.email))
    return { name: owner?.name ?? '', email: owner?.email ?? '' }
}

function ownersByTitle(owners: InitiativeOwnerDto[], title: string): Actor[] {
    return owners
        .filter(owner => owner.title === title && (owner.name || owner.email))
        .map(owner => ({ name: owner.name ?? '', email: owner.email ?? '' }))
}

const initiativesList = createMetamodelList<
    InitiativeSummaryDto,
    InitiativeDetailDto,
    InitiativeListItem
>({
    queryKey: ALL_INITIATIVES_QUERY_KEY,
    listEndpoint: API_ENDPOINTS.METAMODEL_LIST_INITIATIVES,
    byIdsUrl: API_ENDPOINTS.METAMODEL_GET_INITIATIVES_BY_IDS,
    batchSize: INITIATIVES_BY_IDS_BATCH_SIZE,
    listId: dto => dto.initiativeId,
    detailId: dto => dto.initiativeId,
    map: (summary, detail) => ({
        id: summary.initiativeId,
        name: summary.initiativeName,
        startDate: formatDate(detail?.startDate),
        endDate: formatDate(detail?.endDate),
        yearsActive: (detail?.yearsActive ?? []).join(', '),
        lineOfBusiness: detail?.lineOfBusiness ?? '',
        strategicEpics: detail?.strategicEpics ?? [],
        etpEcmiId: detail?.etp_ecmi_id ?? '',
        legacyEtpEcmiId: detail?.legacy_etp_ecmi_id ?? '',
        isEtp: detail?.isEtp ?? null,
        isEcmi: detail?.isEcmi ?? null,
        supportedBusinessUnits: detail?.supportedBusinessUnits ?? [],
        supportedMarkets: detail?.supportedMarkets ?? [],
        technologyStacks: detail?.technologyStacks ?? [],
        techCapabilities: detail?.techCapabilities ?? [],
        businessCapabilities: detail?.businessCapabilities ?? [],
        foundationalTechnologies: detail?.foundationalTechnologies ?? [],
        ownerUnitCio: ownerByTitle(detail?.initiativeOwners ?? [], 'Unit CIO'),
        ownerTechVp: ownerByTitle(detail?.initiativeOwners ?? [], 'Tech VP'),
        ownerHeadEngineer: ownerByTitle(
            detail?.initiativeOwners ?? [],
            'Head Engineer'
        ),
        ownerPrincipalArchitect: ownerByTitle(
            detail?.initiativeOwners ?? [],
            'Principal Architect'
        ),
        ownerEnterpriseArchitect: ownerByTitle(
            detail?.initiativeOwners ?? [],
            'Enterprise Architect'
        ),
        additionalArchitects: ownersByTitle(
            detail?.initiativeOwners ?? [],
            'Additional Architect'
        ),
        linkedInitiatives: (detail?.linkedInitiatives ?? []).map(
            ref => ref.initiativeName
        ),
        impactedApplications: (detail?.impactedApplications ?? []).map(
            ref => ref.applicationName
        ),
        linkedAdrs: (detail?.architectureDecisionRecords ?? []).map(
            ref => ref.title
        ),
        linkedBvbs: (detail?.buildVsBuyAssessments ?? []).map(ref => ref.title),
        impactedCompanyDomains: (detail?.impactedCompanyDomains ?? []).map(
            ref => ref.companyDomainName
        ),
        playbooks: detail?.playbooks ?? []
    })
})

/** The type an initiative's `is_etp`/`is_ecmi` flags place it in. */
export const INITIATIVE_TYPES = ['none', 'etp', 'ecmi'] as const

export type InitiativeType = (typeof INITIATIVE_TYPES)[number]

/**
 * Server-side search/sort state the grid drives. Text fields are matched
 * case-insensitively as substrings by architecture-metamodel; the selected
 * initiative types are ORed, with `etp` covering ECMIs too.
 */
export interface InitiativeListFilters {
    name?: string
    lineOfBusiness?: string
    /** A single year, matched within the initiative's years active. */
    year?: string
    etpEcmiId?: string
    legacyEtpEcmiId?: string
    unitCio?: string
    techVp?: string
    headEngineer?: string
    principalArchitect?: string
    enterpriseArchitect?: string
    additionalArchitects?: string
    initiativeTypes?: InitiativeType[]
    sortBy?: InitiativeSortField
    sortDir?: 'asc' | 'desc'
}

/** Sortable/searchable column keys the metamodel list endpoint accepts. */
export type InitiativeSortField =
    | 'name'
    | 'lineOfBusiness'
    | 'etp_ecmi_id'
    | 'legacy_etp_ecmi_id'
    | 'unitCio'
    | 'techVp'
    | 'headEngineer'
    | 'principalArchitect'
    | 'enterpriseArchitect'
    | 'additionalArchitects'
    | 'initiativeType'

/** Filter keys, i.e. everything on the filters object except the sort state. */
export type InitiativeFilterKey = Exclude<
    keyof InitiativeListFilters,
    'sortBy' | 'sortDir'
>

/** Text filter keys, i.e. every filter but the initiative types. */
export type InitiativeTextFilterKey = Exclude<
    InitiativeFilterKey,
    'initiativeTypes'
>

/** Grid column id → metamodel query param for the searchable columns. */
export const INITIATIVE_FILTER_PARAMS: Record<string, InitiativeFilterKey> = {
    name: 'name',
    lineOfBusiness: 'lineOfBusiness',
    yearsActive: 'year',
    etpEcmiId: 'etpEcmiId',
    legacyEtpEcmiId: 'legacyEtpEcmiId',
    ownerUnitCio: 'unitCio',
    ownerTechVp: 'techVp',
    ownerHeadEngineer: 'headEngineer',
    ownerPrincipalArchitect: 'principalArchitect',
    ownerEnterpriseArchitect: 'enterpriseArchitect',
    additionalArchitects: 'additionalArchitects',
    initiativeType: 'initiativeTypes'
}

/** Grid column id → metamodel `sortBy` value. */
export const INITIATIVE_SORT_FIELDS: Record<string, InitiativeSortField> = {
    name: 'name',
    lineOfBusiness: 'lineOfBusiness',
    etpEcmiId: 'etp_ecmi_id',
    legacyEtpEcmiId: 'legacy_etp_ecmi_id',
    ownerUnitCio: 'unitCio',
    ownerTechVp: 'techVp',
    ownerHeadEngineer: 'headEngineer',
    ownerPrincipalArchitect: 'principalArchitect',
    ownerEnterpriseArchitect: 'enterpriseArchitect',
    additionalArchitects: 'additionalArchitects',
    initiativeType: 'initiativeType'
}

function isInitiativeType(value: string): value is InitiativeType {
    return (INITIATIVE_TYPES as readonly string[]).includes(value)
}

/**
 * Translates the grid's column filter and sorting state into the list filters.
 * Column ids the endpoint cannot search or order by are ignored.
 */
export function toInitiativeListFilters(
    columnFilters: { id: string; value: unknown }[],
    sorting: { id: string; desc: boolean }[] = []
): InitiativeListFilters {
    const filters: InitiativeListFilters = {}

    for (const filter of columnFilters) {
        const param = INITIATIVE_FILTER_PARAMS[filter.id]
        if (!param) continue
        if (param === 'initiativeTypes') {
            const types = (
                Array.isArray(filter.value) ? filter.value : [filter.value]
            )
                .map(value => String(value).toLowerCase())
                .filter(isInitiativeType)
            if (types.length) filters.initiativeTypes = types
            continue
        }
        filters[param as InitiativeTextFilterKey] = String(filter.value)
    }

    const [sort] = sorting
    const sortBy = sort ? INITIATIVE_SORT_FIELDS[sort.id] : undefined
    if (sortBy) {
        filters.sortBy = sortBy
        filters.sortDir = sort.desc ? 'desc' : 'asc'
    }

    return filters
}

/**
 * Translates the grid's filter/sort state into architecture-metamodel query
 * params. The endpoint searches and orders by node properties it does not
 * project, so the response shape (id + name) is unaffected.
 */
export function toInitiativeListParams(
    filters: InitiativeListFilters = {}
): MetamodelListParams {
    return {
        name: filters.name,
        lineOfBusiness: filters.lineOfBusiness,
        etp_ecmi_id: filters.etpEcmiId,
        legacy_etp_ecmi_id: filters.legacyEtpEcmiId,
        unitCio: filters.unitCio,
        techVp: filters.techVp,
        headEngineer: filters.headEngineer,
        principalArchitect: filters.principalArchitect,
        enterpriseArchitect: filters.enterpriseArchitect,
        additionalArchitects: filters.additionalArchitects,
        year: filters.year,
        initiativeTypes: filters.initiativeTypes?.length
            ? filters.initiativeTypes.join(',')
            : undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortBy ? (filters.sortDir ?? 'asc') : undefined
    }
}

export const fetchAllInitiatives = (filters?: InitiativeListFilters) =>
    initiativesList.fetchAll(toInitiativeListParams(filters))

/** Lightweight list fetch (id + name only) used to hydrate the lazy grid. */
export const fetchInitiativesList = (filters?: InitiativeListFilters) =>
    initiativesList.fetchList(toInitiativeListParams(filters))

/** React Query key holding the lightweight initiatives list. */
export const INITIATIVES_LIST_QUERY_KEY = initiativesList.listQueryKey

/**
 * The initiatives dataset has grown large enough that eagerly enriching every
 * row (get-by-ids, 5 at a time) dominates page load. When enabled, the grid
 * paginates and only enriches the visible page. Flip to `false` to fall back
 * to the eager, fetch-everything behavior used by the other grids.
 */
export const INITIATIVES_LAZY_ENRICHMENT = true

/** Rows per page when lazy enrichment is enabled. */
export const INITIATIVES_PAGE_SIZE = 25

export function useGetAllInitiatives(filters?: InitiativeListFilters) {
    const params = useInitiativeListParams(filters)
    const { data, loading, error, total } = initiativesList.useList(params)
    return { initiatives: data, loading, error, total }
}

export function useGetAllInitiativesLazy(
    visibleIds: string[],
    filters?: InitiativeListFilters
) {
    const params = useInitiativeListParams(filters)
    const { data, loading, error, total, enriching, pendingIds } =
        initiativesList.useLazyList(visibleIds, params)
    return { initiatives: data, loading, error, total, enriching, pendingIds }
}

/**
 * Memoizes the query params on their serialized value so a re-render with an
 * equivalent filters object doesn't change the react-query key (and refetch).
 */
function useInitiativeListParams(
    filters?: InitiativeListFilters
): MetamodelListParams {
    const params = toInitiativeListParams(filters)
    const key = JSON.stringify(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => params, [key])
}
