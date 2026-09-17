import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

/**
 * Standard paginated envelope returned by every architecture-metamodel list
 * endpoint.
 */
export interface MetamodelPage<T> {
    page: number
    pageSize: number
    total: number
    data: T[]
}

// Kept at 100 so a single value satisfies every metamodel endpoint's
// pageSize bounds (adrs/bvbs cap at 100; initiatives requires >= 20).
// The hook pages through the full dataset regardless of page size.
const DEFAULT_PAGE_SIZE = 100

// How many get-by-ids batches to fetch in parallel. Bounded so a large
// dataset (with a small per-request id cap) doesn't open hundreds of
// simultaneous connections.
const DEFAULT_CONCURRENCY = 5

/** Stable empty set so `pendingIds` keeps a referentially stable identity. */
const EMPTY_IDS: ReadonlySet<string> = new Set<string>()

/**
 * Server-side search/sort query params appended to a list endpoint. Empty and
 * `undefined` values are dropped so they never reach the URL.
 */
export type MetamodelListParams = Record<
    string,
    string | number | boolean | undefined
>

/** Stable empty params so query keys don't churn when none are supplied. */
const EMPTY_PARAMS: MetamodelListParams = {}

function appendParams(endpoint: string, params: MetamodelListParams): string {
    const entries = Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== ''
    )
    if (entries.length === 0) return endpoint
    const query = entries
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join('&')
    return `${endpoint}${endpoint.includes('?') ? '&' : '?'}${query}`
}

/**
 * Fetches every page of a metamodel list endpoint and concatenates the results.
 *
 * The metamodel API paginates responses, so we walk the pages (until
 * `page * pageSize >= total`) and return the combined list. `params` carries
 * any server-side search/sort the grid has applied.
 */
export async function fetchAllMetamodelPages<TDto>(
    endpoint: string,
    pageSize: number = DEFAULT_PAGE_SIZE,
    params: MetamodelListParams = EMPTY_PARAMS
): Promise<TDto[]> {
    const { data } = await fetchAllMetamodelPagesWithTotal<TDto>(
        endpoint,
        pageSize,
        params
    )
    return data
}

/**
 * As `fetchAllMetamodelPages`, but also surfaces the `total` the API reports so
 * a grid can label its row count from the server rather than the loaded rows.
 */
export async function fetchAllMetamodelPagesWithTotal<TDto>(
    endpoint: string,
    pageSize: number = DEFAULT_PAGE_SIZE,
    params: MetamodelListParams = EMPTY_PARAMS
): Promise<{ data: TDto[]; total: number }> {
    const all: TDto[] = []
    let page = 1
    let reportedTotal: number | null = null

    // Guard against a malformed `total` producing an infinite loop.
    for (;;) {
        const url = appendParams(endpoint, {
            ...params,
            page,
            pageSize
        })
        const res = await fetchWithToken(url)
        if (!res.ok) {
            throw new Error(
                `Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`
            )
        }

        const json: MetamodelPage<TDto> = await res.json()
        const rows = Array.isArray(json.data) ? json.data : []
        all.push(...rows)

        const effectivePageSize = json.pageSize || pageSize
        const total = typeof json.total === 'number' ? json.total : all.length
        if (typeof json.total === 'number') reportedTotal = json.total

        if (rows.length === 0 || page * effectivePageSize >= total) {
            break
        }
        page += 1
    }

    return { data: all, total: reportedTotal ?? all.length }
}

/**
 * Fetches full detail records for a set of ids via a metamodel get-by-ids
 * endpoint.
 *
 * Deployed list endpoints only return `id` + `name`, so grids enrich their
 * rows from the per-dataset detail endpoint, which accepts a comma-separated
 * id list capped at `batchSize`. Ids are de-duplicated, chunked to the cap,
 * and the chunks are fetched with bounded concurrency.
 */
export async function fetchMetamodelDetailsByIds<TDetail>(
    byIdsUrl: (ids: string[]) => string,
    ids: string[],
    batchSize: number,
    concurrency: number = DEFAULT_CONCURRENCY
): Promise<TDetail[]> {
    const uniqueIds = Array.from(
        new Set(ids.filter(id => id !== null && id !== undefined && id !== ''))
    )
    if (uniqueIds.length === 0) {
        return []
    }

    const chunks: string[][] = []
    for (let i = 0; i < uniqueIds.length; i += batchSize) {
        chunks.push(uniqueIds.slice(i, i + batchSize))
    }

    const details: TDetail[] = []
    let nextChunk = 0

    const runWorker = async (): Promise<void> => {
        while (nextChunk < chunks.length) {
            const chunk = chunks[nextChunk]
            nextChunk += 1
            const url = byIdsUrl(chunk)
            const res = await fetchWithToken(url)
            if (!res.ok) {
                throw new Error(
                    `Failed to fetch ${url}: ${res.status} ${res.statusText}`
                )
            }
            const json = await res.json()
            if (Array.isArray(json)) {
                details.push(...(json as TDetail[]))
            }
        }
    }

    const workerCount = Math.min(concurrency, chunks.length)
    await Promise.all(Array.from({ length: workerCount }, () => runWorker()))

    return details
}

export interface MetamodelListConfig<TListDto, TDetailDto, TRow> {
    /** React Query key for this dataset. */
    queryKey: readonly unknown[]
    /** Fully-qualified metamodel list endpoint (returns `id` + `name`). */
    listEndpoint: string
    /** Builds the get-by-ids detail URL for a chunk of ids. */
    byIdsUrl: (ids: string[]) => string
    /** Max ids per get-by-ids request (endpoint-specific cap). */
    batchSize: number
    /** Extracts the id from a list DTO (used to collect + join with details). */
    listId: (dto: TListDto) => string
    /** Extracts the id from a detail DTO (used to key the detail lookup). */
    detailId: (dto: TDetailDto) => string
    /**
     * Merges a list DTO with its detail DTO into the grid row shape. `detail`
     * is `undefined` when the detail lookup returned nothing for that id.
     */
    map: (listDto: TListDto, detail: TDetailDto | undefined) => TRow
    pageSize?: number
    concurrency?: number
}

export interface MetamodelListState<TRow> {
    data: TRow[]
    loading: boolean
    error: Error | null
    /** Row count the API reports for the active filters. */
    total: number
}

export interface MetamodelLazyListState<TRow> extends MetamodelListState<TRow> {
    /** True while detail records for the current page are being fetched. */
    enriching: boolean
    /**
     * Ids of visible rows whose detail record has not arrived yet, so the grid
     * can render placeholders instead of blanks. Only populated while the
     * detail query is in flight — a row the API never returns settles to its
     * empty values rather than a permanent placeholder.
     */
    pendingIds: ReadonlySet<string>
}

export interface MetamodelList<TRow, TListDto> {
    queryKey: readonly unknown[]
    /** React Query key holding the lightweight (`id` + `name`) list. */
    listQueryKey: readonly unknown[]
    /** Server + client fetcher used for both prefetch and `useQuery`. */
    fetchAll: (params?: MetamodelListParams) => Promise<TRow[]>
    /**
     * Fetches only the lightweight list pages (no get-by-ids enrichment).
     * Used to prefetch/hydrate the lazy grid without the expensive detail
     * fetch that `fetchAll` performs.
     */
    fetchList: (params?: MetamodelListParams) => Promise<TListDto[]>
    /** Client hook returning grid-ready state (eagerly enriches every row). */
    useList: (params?: MetamodelListParams) => MetamodelListState<TRow>
    /**
     * Client hook that loads the lightweight list immediately and enriches
     * only the rows whose ids are passed in `visibleIds` (lazy, page-by-page).
     */
    useLazyList: (
        visibleIds: string[],
        params?: MetamodelListParams
    ) => MetamodelLazyListState<TRow>
}

/**
 * Factory that builds the fetcher + hook pair every metamodel datagrid reuses.
 * Keeps prefetch (`page.tsx`) and the client `useQuery` in sync on one key.
 *
 * Two-phase fetch: page the lightweight list (`id` + `name`), then enrich each
 * row with its full detail record via the get-by-ids endpoint.
 */
export function createMetamodelList<TListDto, TDetailDto, TRow>(
    config: MetamodelListConfig<TListDto, TDetailDto, TRow>
): MetamodelList<TRow, TListDto> {
    const listQueryKey = [...config.queryKey, 'list']

    const fetchList = (
        params: MetamodelListParams = EMPTY_PARAMS
    ): Promise<TListDto[]> =>
        fetchAllMetamodelPages<TListDto>(
            config.listEndpoint,
            config.pageSize,
            params
        )

    const fetchListWithTotal = (
        params: MetamodelListParams = EMPTY_PARAMS
    ): Promise<{ data: TListDto[]; total: number }> =>
        fetchAllMetamodelPagesWithTotal<TListDto>(
            config.listEndpoint,
            config.pageSize,
            params
        )

    const fetchAll = async (
        params: MetamodelListParams = EMPTY_PARAMS
    ): Promise<TRow[]> => {
        const listDtos = await fetchAllMetamodelPages<TListDto>(
            config.listEndpoint,
            config.pageSize,
            params
        )

        const details = await fetchMetamodelDetailsByIds<TDetailDto>(
            config.byIdsUrl,
            listDtos.map(config.listId),
            config.batchSize,
            config.concurrency
        )

        const detailById = new Map<string, TDetailDto>()
        for (const detail of details) {
            detailById.set(config.detailId(detail), detail)
        }

        return listDtos.map(dto =>
            config.map(dto, detailById.get(config.listId(dto)))
        )
    }

    const useList = (params: MetamodelListParams = EMPTY_PARAMS) => {
        const { data, isLoading, error } = useQuery<TRow[]>({
            queryKey: [...config.queryKey, params],
            queryFn: () => fetchAll(params)
        })
        return {
            data: data ?? [],
            loading: isLoading,
            error: error as Error | null,
            total: data?.length ?? 0
        }
    }

    const useLazyList = (
        visibleIds: string[],
        params: MetamodelListParams = EMPTY_PARAMS
    ): MetamodelLazyListState<TRow> => {
        const listQuery = useQuery<{ data: TListDto[]; total: number }>({
            queryKey: [...listQueryKey, params],
            queryFn: () => fetchListWithTotal(params)
        })
        const listDtos = useMemo(
            () => listQuery.data?.data ?? [],
            [listQuery.data]
        )

        // Sorted + de-duplicated so the detail query key is stable per page.
        const ids = useMemo(
            () => Array.from(new Set(visibleIds.filter(Boolean))).sort(),
            [visibleIds]
        )

        const detailQuery = useQuery<TDetailDto[]>({
            queryKey: [...config.queryKey, 'details', ids],
            queryFn: () =>
                fetchMetamodelDetailsByIds<TDetailDto>(
                    config.byIdsUrl,
                    ids,
                    config.batchSize,
                    config.concurrency
                ),
            enabled: ids.length > 0
        })

        const detailById = useMemo(() => {
            const map = new Map<string, TDetailDto>()
            for (const detail of detailQuery.data ?? []) {
                map.set(config.detailId(detail), detail)
            }
            return map
        }, [detailQuery.data])

        const data = useMemo(
            () =>
                listDtos.map(dto =>
                    config.map(dto, detailById.get(config.listId(dto)))
                ),
            [listDtos, detailById]
        )

        const pendingIds = useMemo(
            () =>
                detailQuery.isFetching
                    ? new Set(ids.filter(id => !detailById.has(id)))
                    : EMPTY_IDS,
            [detailQuery.isFetching, ids, detailById]
        )

        return {
            data,
            loading: listQuery.isLoading,
            error: listQuery.error as Error | null,
            total: listQuery.data?.total ?? data.length,
            enriching: detailQuery.isFetching,
            pendingIds
        }
    }

    return {
        queryKey: config.queryKey,
        listQueryKey,
        fetchAll,
        fetchList,
        useList,
        useLazyList
    }
}
