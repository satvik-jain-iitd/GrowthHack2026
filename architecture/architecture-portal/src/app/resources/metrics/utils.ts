import { MetricViewId, metricsPathFor } from './constants/metricRoutes'

type ParamSource = { get(name: string): string | null } | null | undefined

const METRIC2_GROUP_MAP = {
    none: '',
    domain: 'domain',
    unitcio: 'unitCIO',
    techowner: 'techOwner'
} as const

const METRIC1_GROUP_MAP = {
    ecmi: 'ecmi',
    unitcio: 'unitCIO',
    ownersvp: 'ownerSVP'
} as const

const METRIC2_GROUP_PARAM_MAP: Record<string, string> = {
    '': 'none',
    domain: 'domain',
    unitCIO: 'unitcio',
    techOwner: 'techowner'
}

const METRIC1_GROUP_PARAM_MAP: Record<string, string> = {
    ecmi: 'ecmi',
    unitCIO: 'unitcio',
    ownerSVP: 'ownersvp'
}

const OWNED_PARAM_KEYS = [
    'group',
    'view',
    'heatmap',
    'burrReport',
    'filter',
    'type',
    'show',
    'itype',
    'search'
]

const API_TYPE_FILTERS = ['all', 'a', 'b'] as const
const INITIATIVE_TYPES = ['all', 'etp', 'ecmi'] as const
const API_OPERATIONS = ['apis', 'operations'] as const

export type DisplayViewValue = 'cardView' | 'listView'
export type ApiTypeFilter = (typeof API_TYPE_FILTERS)[number]
export type InitiativeType = (typeof INITIATIVE_TYPES)[number]

export interface MetricsUrlState {
    view: MetricViewId
    selectedGroup: string
    displayView: DisplayViewValue
    heatmap: boolean
    burrReport: boolean
    categoryFilter: string
    apiTypeFilter: ApiTypeFilter
    apiOperation: string[]
    initiativeType: InitiativeType
    crossDomainGroupBy: '' | 'unitCIO'
    search: string
}

// `group=unitcio` always renders as a list, so the heatmap toggle has to key off
// the same coercion the table applies rather than the raw `view` param.
const isEffectiveListView = (state: MetricsUrlState) =>
    state.displayView === 'listView' || state.selectedGroup === 'unitCIO'

const heatmapApplies = (state: MetricsUrlState) =>
    state.view === 'metric2' && isEffectiveListView(state)

// Deliberately not gated on `heatmap` being on: the BUR choice is a preference
// that should still be there when the heatmap is switched back on.
const burrReportApplies = heatmapApplies

const categoryFilterApplies = (state: MetricsUrlState) =>
    state.view === 'metric2' && state.selectedGroup === 'domain'

const apiTypeFilterApplies = (state: MetricsUrlState) =>
    state.view === 'metric1' || state.view === 'metric2'

const apiOperationApplies = (state: MetricsUrlState) =>
    state.view === 'metric2' && state.selectedGroup !== ''

const canonicalApiOperation = (values: string[]) => {
    const selected = API_OPERATIONS.filter(option => values.includes(option))
    return selected.length ? [...selected] : ['apis']
}

const isDefaultApiOperation = (values: string[]) =>
    values.length === 1 && values[0] === 'apis'

export function parseMetricsState(
    view: MetricViewId,
    searchParams: ParamSource
): MetricsUrlState {
    const get = (key: string) => searchParams?.get(key) ?? ''

    const groupParam = get('group')
    let selectedGroup = ''
    let crossDomainGroupBy: MetricsUrlState['crossDomainGroupBy'] = ''
    if (view === 'metric2') {
        selectedGroup =
            groupParam in METRIC2_GROUP_MAP
                ? METRIC2_GROUP_MAP[
                      groupParam as keyof typeof METRIC2_GROUP_MAP
                  ]
                : 'domain'
    } else if (view === 'metric1') {
        selectedGroup =
            groupParam in METRIC1_GROUP_MAP
                ? METRIC1_GROUP_MAP[
                      groupParam as keyof typeof METRIC1_GROUP_MAP
                  ]
                : ''
    } else {
        crossDomainGroupBy = groupParam === 'unitcio' ? 'unitCIO' : ''
    }

    const apiTypeParam = get('type') as ApiTypeFilter
    const initiativeParam = get('itype') as InitiativeType

    const state: MetricsUrlState = {
        view,
        selectedGroup,
        displayView:
            view === 'metric2' && get('view') === 'list'
                ? 'listView'
                : 'cardView',
        heatmap: true,
        burrReport: false,
        categoryFilter: 'withContributions',
        apiTypeFilter: API_TYPE_FILTERS.includes(apiTypeParam)
            ? apiTypeParam
            : 'all',
        apiOperation: ['apis'],
        initiativeType:
            view === 'metric3' && INITIATIVE_TYPES.includes(initiativeParam)
                ? initiativeParam
                : 'all',
        crossDomainGroupBy,
        search: get('search')
    }

    if (!apiTypeFilterApplies(state)) state.apiTypeFilter = 'all'
    if (heatmapApplies(state)) state.heatmap = get('heatmap') !== 'false'
    if (burrReportApplies(state))
        state.burrReport = get('burrReport') === 'true'
    if (categoryFilterApplies(state) && get('filter')) {
        state.categoryFilter = get('filter')
    }
    if (apiOperationApplies(state) && get('show')) {
        state.apiOperation = canonicalApiOperation(get('show').split(','))
    }

    return state
}

/**
 * Rebuilds the whole query string from `state`, leaving any key outside
 * OWNED_PARAM_KEYS untouched in `passthrough`.
 */
export function buildMetricsUrl(
    state: MetricsUrlState,
    passthrough?: URLSearchParams
): string {
    const params = new URLSearchParams(passthrough?.toString() ?? '')
    OWNED_PARAM_KEYS.forEach(key => params.delete(key))

    const { view } = state

    if (view === 'metric2') {
        const groupParam = METRIC2_GROUP_PARAM_MAP[state.selectedGroup]
        if (groupParam && groupParam !== 'domain') {
            params.set('group', groupParam)
        }
    } else if (view === 'metric1') {
        const groupParam = METRIC1_GROUP_PARAM_MAP[state.selectedGroup]
        if (groupParam) params.set('group', groupParam)
    } else if (state.crossDomainGroupBy === 'unitCIO') {
        params.set('group', 'unitcio')
    }

    if (view === 'metric2' && state.displayView === 'listView') {
        params.set('view', 'list')
    }
    if (heatmapApplies(state) && !state.heatmap) {
        params.set('heatmap', 'false')
    }
    if (burrReportApplies(state) && state.burrReport) {
        params.set('burrReport', 'true')
    }
    if (
        categoryFilterApplies(state) &&
        state.categoryFilter !== 'withContributions'
    ) {
        params.set('filter', state.categoryFilter)
    }
    if (apiTypeFilterApplies(state) && state.apiTypeFilter !== 'all') {
        params.set('type', state.apiTypeFilter)
    }
    if (
        apiOperationApplies(state) &&
        !isDefaultApiOperation(state.apiOperation)
    ) {
        params.set('show', canonicalApiOperation(state.apiOperation).join(','))
    }
    if (view === 'metric3' && state.initiativeType !== 'all') {
        params.set('itype', state.initiativeType)
    }
    if (state.search) params.set('search', state.search)

    const queryString = params.toString()
    const pathname = metricsPathFor(view)
    return queryString ? `${pathname}?${queryString}` : pathname
}
