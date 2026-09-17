import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'
import { fetchMetamodelDetailsByIds } from './useMetamodelList'

/**
 * Landing pages receive ADR/BvB linkages as `{ id, name }` pairs where `id` is
 * the metamodel adrId/bvbId — not the portal document id the detail routes are
 * keyed on. The get-by-ids detail endpoints carry a fully-qualified
 * `displayUrl` (`.../adrs/{file_id}` for ADRs, `.../docs/{file_id}` for BvBs),
 * so these helpers resolve ids to that URL for link-aways.
 */

// architecture-metamodel caps ADR/BvB get-by-ids at 10 ids per request.
const ADRS_BY_IDS_BATCH_SIZE = 10
const BVBS_BY_IDS_BATCH_SIZE = 10

interface AdrDisplayUrlDto {
    id: string
    displayUrl: string | null
}

interface BvbDisplayUrlDto {
    id: string
    displayUrl: string | null
}

async function resolveDisplayUrls<
    TDto extends { id: string; displayUrl: string | null }
>(
    byIdsUrl: (ids: string[]) => string,
    ids: string[],
    batchSize: number
): Promise<Record<string, string>> {
    const details = await fetchMetamodelDetailsByIds<TDto>(
        byIdsUrl,
        ids,
        batchSize
    )
    const map: Record<string, string> = {}
    for (const detail of details) {
        if (detail.displayUrl) map[detail.id] = detail.displayUrl
    }
    return map
}

/** Sorted, de-duplicated ids so the query key is stable across renders. */
function stableIds(ids: string[]): string[] {
    return Array.from(new Set(ids.filter(Boolean))).sort()
}

export interface LinkedDisplayUrlKinds {
    adrIds?: string[]
    bvbIds?: string[]
}

export interface LinkedDisplayUrls {
    /** Maps an id to its resolved `displayUrl`, or null if unresolved. */
    adrDisplayUrl: (id: string) => string | null
    bvbDisplayUrl: (id: string) => string | null
    loading: boolean
}

/**
 * Resolves ADR/BvB ids to their metamodel `displayUrl`, caching each dataset in
 * React Query. Unresolved ids return null so callers can render a plain,
 * non-clickable tag rather than a broken link.
 */
export function useLinkedDisplayUrls({
    adrIds = [],
    bvbIds = []
}: LinkedDisplayUrlKinds): LinkedDisplayUrls {
    const adrKeyIds = useMemo(() => stableIds(adrIds), [adrIds])
    const bvbKeyIds = useMemo(() => stableIds(bvbIds), [bvbIds])

    const adrQuery = useQuery<Record<string, string>>({
        queryKey: ['metamodel', 'resolve', 'adr-display-urls', adrKeyIds],
        queryFn: () =>
            resolveDisplayUrls<AdrDisplayUrlDto>(
                API_ENDPOINTS.METAMODEL_GET_ADRS_BY_IDS,
                adrKeyIds,
                ADRS_BY_IDS_BATCH_SIZE
            ),
        enabled: adrKeyIds.length > 0
    })

    const bvbQuery = useQuery<Record<string, string>>({
        queryKey: ['metamodel', 'resolve', 'bvb-display-urls', bvbKeyIds],
        queryFn: () =>
            resolveDisplayUrls<BvbDisplayUrlDto>(
                API_ENDPOINTS.METAMODEL_GET_BVBS_BY_IDS,
                bvbKeyIds,
                BVBS_BY_IDS_BATCH_SIZE
            ),
        enabled: bvbKeyIds.length > 0
    })

    return useMemo(() => {
        const adrMap = adrQuery.data ?? {}
        const bvbMap = bvbQuery.data ?? {}
        return {
            adrDisplayUrl: (id: string) => adrMap[id] ?? null,
            bvbDisplayUrl: (id: string) => bvbMap[id] ?? null,
            loading: adrQuery.isLoading || bvbQuery.isLoading
        }
    }, [adrQuery.data, bvbQuery.data, adrQuery.isLoading, bvbQuery.isLoading])
}
