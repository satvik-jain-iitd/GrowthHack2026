import { API_ENDPOINTS } from '@/constants'
import { createMetamodelList } from '../../hooks/useMetamodelList'
import { capitalizeFirst } from '../../utils/format'

/**
 * Metamodel BvB list DTO (`GET /api/v1/bvbs` → `data[]`).
 * The deployed list endpoint returns only id + title.
 */
export interface BvBListItemDto {
    id: string
    title: string
}

/** Metamodel BvB detail DTO (`GET /api/v1/bvbs/:ids`). */
export interface BvBDetailDto {
    id: string
    title: string
    status: string
    overallRisk: string | null
    estimatedCost: string | null
    etpImpacting: string | null
    creationDate: string | null
    completionDate: string | null
    displayUrl: string | null
    linkedInitiatives: string[]
    linkedApplications: string[]
    linkedAdrs: string[]
}

/** Row shape consumed by `BvbsTable`. All fields are read-only. */
export interface BvbListItem {
    id: string
    title: string
    status: string
    overallRisk: string
    estimatedCost: string
    etpImpacting: string
    creationDate: string
    completionDate: string
    linkedInitiatives: string[]
    linkedApplications: string[]
    linkedAdrs: string[]
}

export const ALL_BVBS_QUERY_KEY = ['metamodel', 'bvbs']

// architecture-metamodel caps BvB get-by-ids at 10 ids per request.
const BVBS_BY_IDS_BATCH_SIZE = 10

const bvbsList = createMetamodelList<BvBListItemDto, BvBDetailDto, BvbListItem>(
    {
        queryKey: ALL_BVBS_QUERY_KEY,
        listEndpoint: API_ENDPOINTS.METAMODEL_LIST_BVBS,
        byIdsUrl: API_ENDPOINTS.METAMODEL_GET_BVBS_BY_IDS,
        batchSize: BVBS_BY_IDS_BATCH_SIZE,
        listId: dto => dto.id,
        detailId: dto => dto.id,
        map: (summary, detail) => ({
            id: summary.id,
            title: summary.title,
            status: detail?.status ?? '',
            overallRisk: capitalizeFirst(detail?.overallRisk),
            estimatedCost: detail?.estimatedCost ?? '',
            etpImpacting: detail?.etpImpacting ?? '',
            creationDate: detail?.creationDate ?? '',
            completionDate: detail?.completionDate ?? '',
            linkedInitiatives: detail?.linkedInitiatives ?? [],
            linkedApplications: detail?.linkedApplications ?? [],
            linkedAdrs: detail?.linkedAdrs ?? []
        })
    }
)

export const fetchAllBvbs = bvbsList.fetchAll

export function useGetAllBvbs() {
    const { data, loading, error } = bvbsList.useList()
    return { bvbs: data, loading, error }
}
