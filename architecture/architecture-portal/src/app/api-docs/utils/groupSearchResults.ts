import {
    INHERIT_FACTOR,
    MAX_APIS_PER_DOMAIN,
    MAX_GROUPS,
    MAX_OPS_PER_API
} from '@/app/api-docs/constants/search'
import {
    ApiResultGroup,
    DomainResultGroup,
    GroupedSearchResults,
    OperationResult,
    ParsedQuery,
    SearchIndex,
    SearchIndexEntry,
    SearchRow
} from '@/app/api-docs/types/search'
import { getStatusRank } from './getStatusRank'
import { scoreSearchEntry } from './scoreSearchEntry'

const EMPTY: GroupedSearchResults = { groups: [], totalGroups: 0 }

const pushTo = <T>(map: Map<string, T[]>, key: string, value: T) => {
    const list = map.get(key)
    if (list) list.push(value)
    else map.set(key, [value])
}

const byDirectThenScoreThenOrder = (
    aDirect: boolean,
    aScore: number,
    aOrder: number,
    bDirect: boolean,
    bScore: number,
    bOrder: number
) => Number(bDirect) - Number(aDirect) || bScore - aScore || aOrder - bOrder

export function groupSearchResults(
    index: SearchIndex,
    query: ParsedQuery,
    scope?: ReadonlySet<string>
): GroupedSearchResults {
    if (!query.tokens.length) return EMPTY

    const domainHits = new Map<string, number>()
    const apiHits = new Map<string, number>()
    const operationHits = new Map<string, number>()
    const directApisByDomain = new Map<string, SearchIndexEntry[]>()
    const directOpsByApi = new Map<string, SearchIndexEntry[]>()
    const candidateDomains = new Set<string>()

    for (const entry of index.entries) {
        // An empty scope means every company domain.
        if (scope?.size && !scope.has(entry.domainId)) continue
        const score = scoreSearchEntry(entry, query)
        if (!score) continue
        candidateDomains.add(entry.domainId)
        if (entry.kind === 'domain') {
            domainHits.set(entry.id, score)
        } else if (entry.kind === 'api') {
            apiHits.set(entry.id, score)
            pushTo(directApisByDomain, entry.domainId, entry)
        } else {
            operationHits.set(entry.id, score)
            if (entry.apiId) pushTo(directOpsByApi, entry.apiId, entry)
        }
    }

    if (!candidateDomains.size) return EMPTY

    const groups: DomainResultGroup[] = []

    candidateDomains.forEach(domainId => {
        const domainEntry = index.byId.get(domainId)
        if (!domainEntry) return
        const domainDirect = domainHits.has(domainId)
        const domainScore = domainHits.get(domainId) ?? 0

        const apiEntries = new Map<string, SearchIndexEntry>()
        ;(directApisByDomain.get(domainId) || []).forEach(api =>
            apiEntries.set(api.id, api)
        )
        if (domainDirect) {
            ;(index.apisByDomain.get(domainId) || []).forEach(api =>
                apiEntries.set(api.id, api)
            )
        }
        // Ancestors of direct operation hits, whether or not the API matched.
        ;(index.apisByDomain.get(domainId) || []).forEach(api => {
            if ((directOpsByApi.get(api.id) || []).length) {
                apiEntries.set(api.id, api)
            }
        })

        const apiGroups: ApiResultGroup[] = []
        apiEntries.forEach(apiEntry => {
            const apiDirect = apiHits.has(apiEntry.id)
            const apiScore = apiDirect
                ? (apiHits.get(apiEntry.id) as number)
                : domainDirect
                  ? domainScore * INHERIT_FACTOR
                  : 0

            const operationEntries = new Map<string, SearchIndexEntry>()
            ;(directOpsByApi.get(apiEntry.id) || []).forEach(op =>
                operationEntries.set(op.id, op)
            )
            if (apiDirect || domainDirect) {
                ;(index.operationsByApi.get(apiEntry.id) || []).forEach(op =>
                    operationEntries.set(op.id, op)
                )
            }

            const allOperations: OperationResult[] = []
            operationEntries.forEach(op => {
                const direct = operationHits.has(op.id)
                allOperations.push({
                    entry: op,
                    score: direct
                        ? (operationHits.get(op.id) as number)
                        : apiScore * INHERIT_FACTOR,
                    direct
                })
            })
            // Operations alone carry a status, so they get their own
            // comparator rather than widening the shared helper.
            allOperations.sort(
                (a, b) =>
                    Number(b.direct) - Number(a.direct) ||
                    b.score - a.score ||
                    getStatusRank(a.entry.status) -
                        getStatusRank(b.entry.status) ||
                    a.entry.order - b.entry.order
            )

            apiGroups.push({
                entry: apiEntry,
                score: apiScore,
                direct: apiDirect,
                operations: allOperations.slice(0, MAX_OPS_PER_API),
                allOperations,
                totalOperations: allOperations.length
            })
        })

        // An API that is only an ancestor of a hit has no score of its own, so
        // rank it by its best child instead of dropping it to the bottom.
        const apiSortScore = (api: ApiResultGroup) =>
            Math.max(api.score, api.allOperations[0]?.score ?? 0)

        apiGroups.sort((a, b) =>
            byDirectThenScoreThenOrder(
                a.direct,
                apiSortScore(a),
                a.entry.order,
                b.direct,
                apiSortScore(b),
                b.entry.order
            )
        )

        const groupScore = apiGroups.reduce(
            (acc, api) => Math.max(acc, apiSortScore(api)),
            domainScore
        )

        groups.push({
            entry: domainEntry,
            score: groupScore,
            direct: domainDirect,
            apis: apiGroups.slice(0, MAX_APIS_PER_DOMAIN),
            allApis: apiGroups,
            totalApis: apiGroups.length
        })
    })

    groups.sort(
        (a, b) =>
            b.score - a.score ||
            (index.domainOrder.get(a.entry.id) ?? 0) -
                (index.domainOrder.get(b.entry.id) ?? 0)
    )

    return { groups: groups.slice(0, MAX_GROUPS), totalGroups: groups.length }
}

export function flattenSearchRows(
    grouped: GroupedSearchResults,
    expanded: ReadonlySet<string>
): SearchRow[] {
    const rows: SearchRow[] = []

    grouped.groups.forEach(group => {
        const domainId = group.entry.id
        rows.push({
            type: 'domain',
            key: `domain:${domainId}`,
            navId: domainId,
            group
        })

        const expandApisKey = `expandApis:${domainId}`
        const apisExpanded = expanded.has(expandApisKey)
        const apis = apisExpanded ? group.allApis : group.apis

        apis.forEach(api => {
            const apiId = api.entry.id
            rows.push({
                type: 'api',
                key: `api:${domainId}/${apiId}`,
                navId: apiId,
                group: api
            })

            const expandOpsKey = `expandOps:${domainId}/${apiId}`
            const opsExpanded = expanded.has(expandOpsKey)
            const operations = opsExpanded ? api.allOperations : api.operations

            operations.forEach(result => {
                rows.push({
                    type: 'operation',
                    key: `operation:${domainId}/${apiId}/${result.entry.id}`,
                    navId: result.entry.id,
                    result
                })
            })

            const hiddenOps = api.totalOperations - operations.length
            if (hiddenOps > 0) {
                rows.push({
                    type: 'expandOps',
                    key: expandOpsKey,
                    apiId,
                    hidden: hiddenOps
                })
            }
        })

        const hiddenApis = group.totalApis - apis.length
        if (hiddenApis > 0) {
            rows.push({
                type: 'expandApis',
                key: expandApisKey,
                domainId,
                hidden: hiddenApis
            })
        }
    })

    return rows
}
