import { API_ENDPOINTS } from '@/constants'
import { createMetamodelList } from '../../hooks/useMetamodelList'

/**
 * Metamodel technical capability list DTO
 * (`GET /api/v1/technical-capabilities` → `data[]`). Returns id + name.
 */
export interface TechnicalCapabilitySummaryDto {
    technicalCapabilityId: string
    name: string
}

/**
 * Metamodel technical capability detail DTO
 * (`GET /api/v1/technical-capabilities/:ids`).
 */
export interface TechnicalCapabilityDetailDto {
    technicalCapabilityId: string
    name: string
    parentTechnicalCapabilityId: string | null
}

/** Row shape consumed by `TechnicalCapabilitiesTable`. */
export interface TechnicalCapabilityListItem {
    id: string
    name: string
    parentTechnicalCapabilityId: string
}

export const ALL_TECHNICAL_CAPABILITIES_QUERY_KEY = [
    'metamodel',
    'technical-capabilities'
]

// architecture-metamodel caps technical-capability get-by-ids at 5 ids.
const TECHNICAL_CAPABILITIES_BY_IDS_BATCH_SIZE = 5

const technicalCapabilitiesList = createMetamodelList<
    TechnicalCapabilitySummaryDto,
    TechnicalCapabilityDetailDto,
    TechnicalCapabilityListItem
>({
    queryKey: ALL_TECHNICAL_CAPABILITIES_QUERY_KEY,
    listEndpoint: API_ENDPOINTS.METAMODEL_LIST_TECHNICAL_CAPABILITIES,
    byIdsUrl: API_ENDPOINTS.METAMODEL_GET_TECHNICAL_CAPABILITIES_BY_IDS,
    batchSize: TECHNICAL_CAPABILITIES_BY_IDS_BATCH_SIZE,
    listId: dto => dto.technicalCapabilityId,
    detailId: dto => dto.technicalCapabilityId,
    map: (summary, detail) => ({
        id: summary.technicalCapabilityId,
        name: summary.name,
        parentTechnicalCapabilityId: detail?.parentTechnicalCapabilityId ?? ''
    })
})

export const fetchAllTechnicalCapabilities = technicalCapabilitiesList.fetchAll

export function useGetAllTechnicalCapabilities() {
    const { data, loading, error } = technicalCapabilitiesList.useList()
    return { technicalCapabilities: data, loading, error }
}
