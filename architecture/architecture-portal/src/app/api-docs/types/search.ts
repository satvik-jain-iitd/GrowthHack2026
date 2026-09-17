type SearchEntryKind = 'domain' | 'api' | 'operation'

interface SearchIndexEntry {
    kind: SearchEntryKind
    id: string
    domainId: string
    apiId?: string
    name: string
    nameN: string
    description: string
    descriptionN: string
    uri?: string
    uriN?: string
    method?: string
    status?: string
    order: number
}

interface SearchIndex {
    entries: SearchIndexEntry[]
    byId: Map<string, SearchIndexEntry>
    apisByDomain: Map<string, SearchIndexEntry[]>
    operationsByApi: Map<string, SearchIndexEntry[]>
    domainOrder: Map<string, number>
}

interface ParsedQuery {
    method?: string
    tokens: string[]
    raw: string
}

interface OperationResult {
    entry: SearchIndexEntry
    score: number
    direct: boolean
}

interface ApiResultGroup {
    entry: SearchIndexEntry
    score: number
    direct: boolean
    /** Capped at MAX_OPS_PER_API. */
    operations: OperationResult[]
    /** Full sorted list, used by the "show all" expander without re-scoring. */
    allOperations: OperationResult[]
    totalOperations: number
}

interface DomainResultGroup {
    entry: SearchIndexEntry
    score: number
    direct: boolean
    /** Capped at MAX_APIS_PER_DOMAIN. */
    apis: ApiResultGroup[]
    allApis: ApiResultGroup[]
    totalApis: number
}

interface GroupedSearchResults {
    groups: DomainResultGroup[]
    totalGroups: number
}

type SearchRow =
    | { type: 'domain'; key: string; navId: string; group: DomainResultGroup }
    | { type: 'api'; key: string; navId: string; group: ApiResultGroup }
    | {
          type: 'operation'
          key: string
          navId: string
          result: OperationResult
      }
    | { type: 'expandApis'; key: string; domainId: string; hidden: number }
    | { type: 'expandOps'; key: string; apiId: string; hidden: number }

export type {
    SearchEntryKind,
    SearchIndexEntry,
    SearchIndex,
    ParsedQuery,
    OperationResult,
    ApiResultGroup,
    DomainResultGroup,
    GroupedSearchResults,
    SearchRow
}
