// These UUIDs are a permanent public URL contract. Never regenerate them.
export const METRIC_IDS = {
    metric2: '2370f164-af18-411b-92e1-5f5213b07c82', // Type-A/B EARB Approved APIs
    metric1: '9e86444a-51e0-4c88-9d01-bb4ad231d56c', // ECMI Apps to Domain Mapping
    metric3: '592d0dbb-70a5-4b0b-8631-c171d917643f' // ETP/ECMI Cross Domain APIs
} as const

export type MetricViewId = keyof typeof METRIC_IDS

export const DEFAULT_METRIC_VIEW: MetricViewId = 'metric2'

export const METRIC_ID_TO_VIEW = Object.fromEntries(
    Object.entries(METRIC_IDS).map(([view, id]) => [id, view])
) as Record<string, MetricViewId | undefined>

// legacy `?metric=` slugs, kept so shared links keep resolving
export const METRIC_SLUG_TO_VIEW: Record<string, MetricViewId | undefined> = {
    'domain-apis': 'metric2',
    'ecmi-apps': 'metric1',
    'cross-domain-apis': 'metric3'
}

export const metricsPathFor = (view: MetricViewId) =>
    `/resources/metrics/${METRIC_IDS[view]}`
