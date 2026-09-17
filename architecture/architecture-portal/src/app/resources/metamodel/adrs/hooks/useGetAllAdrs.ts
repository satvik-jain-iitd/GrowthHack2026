import { API_ENDPOINTS } from '@/constants'
import { createMetamodelList } from '../../hooks/useMetamodelList'

/**
 * Metamodel ADR list DTO (`GET /api/v1/adrs` → `data[]`).
 * The deployed list endpoint returns only id + name.
 */
export interface AdrListItemDto {
    id: string
    name: string
}

/**
 * Metamodel ADR detail DTO (`GET /api/v1/adrs/:ids`). Note: the detail record
 * carries no name — that comes from the list item.
 */
export interface AdrDetailDto {
    id: string
    status: string
    approvalCheckpoint: string | null
    displayUrl: string | null
    linkedInitiatives: string[]
    linkedApplications: string[]
}

/** Row shape consumed by `AdrsTable`. All fields are read-only. */
export interface AdrListItem {
    id: string
    name: string
    status: string
    displayUrl: string
    linkedInitiatives: string[]
    linkedApplications: string[]
}

export const ALL_ADRS_QUERY_KEY = ['metamodel', 'adrs']

// architecture-metamodel caps ADR get-by-ids at 10 ids per request.
const ADRS_BY_IDS_BATCH_SIZE = 10

const adrsList = createMetamodelList<AdrListItemDto, AdrDetailDto, AdrListItem>(
    {
        queryKey: ALL_ADRS_QUERY_KEY,
        listEndpoint: API_ENDPOINTS.METAMODEL_LIST_ADRS,
        byIdsUrl: API_ENDPOINTS.METAMODEL_GET_ADRS_BY_IDS,
        batchSize: ADRS_BY_IDS_BATCH_SIZE,
        listId: dto => dto.id,
        detailId: dto => dto.id,
        map: (summary, detail) => ({
            id: summary.id,
            name: summary.name,
            status: detail?.status ?? '',
            displayUrl: detail?.displayUrl ?? '',
            linkedInitiatives: detail?.linkedInitiatives ?? [],
            linkedApplications: detail?.linkedApplications ?? []
        })
    }
)

export const fetchAllAdrs = adrsList.fetchAll

export function useGetAllAdrs() {
    const { data, loading, error } = adrsList.useList()
    return { adrs: data, loading, error }
}
