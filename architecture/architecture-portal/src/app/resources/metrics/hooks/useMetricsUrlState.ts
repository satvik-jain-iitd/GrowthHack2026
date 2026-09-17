/* istanbul ignore file */
'use client'
import { useCallback, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useNavigation } from '@/hooks'
import {
    DEFAULT_METRIC_VIEW,
    METRIC_ID_TO_VIEW,
    MetricViewId,
    metricsPathFor
} from '../constants/metricRoutes'
import { buildMetricsUrl, MetricsUrlState, parseMetricsState } from '../utils'

/**
 * The URL is the source of truth for every persisted selection on the metrics
 * page, so that refresh, deep-link and Back all restore the same view.
 *
 * Query-param changes go through `window.history.pushState`, which Next patches
 * to re-render `useSearchParams` consumers without an RSC round-trip. Routing
 * them through `useNavigation()` would refetch the page payload on every filter
 * click and leave the global spinner stuck, since its `startNavigation` only
 * resolves when the pathname changes.
 */
export function useMetricsUrlState() {
    const params = useParams<{ metricId: string }>()
    const searchParams = useSearchParams()
    const { push } = useNavigation()

    const view: MetricViewId =
        METRIC_ID_TO_VIEW[params?.metricId ?? ''] ?? DEFAULT_METRIC_VIEW

    const search = searchParams?.toString() ?? ''
    const state = useMemo(
        () => parseMetricsState(view, new URLSearchParams(search)),
        [view, search]
    )

    /**
     * One call is one history entry, so a single interaction can change several
     * params atomically. Reads `window.location.search` rather than the hook
     * value because `pushState` updates location synchronously while
     * `useSearchParams` only catches up after the transition commits — so
     * back-to-back calls in one tick compose instead of clobbering each other.
     */
    const setParams = useCallback(
        (
            patch: Partial<MetricsUrlState>,
            opts?: { history?: 'push' | 'replace' }
        ) => {
            const live = new URLSearchParams(window.location.search)
            const url = buildMetricsUrl(
                { ...parseMetricsState(view, live), ...patch, view },
                live
            )
            if (
                url === `${window.location.pathname}${window.location.search}`
            ) {
                return
            }
            if (opts?.history === 'replace') {
                window.history.replaceState(null, '', url)
            } else {
                window.history.pushState(null, '', url)
            }
        },
        [view]
    )

    // Tab switch is a real navigation; the query-less path resets every owned
    // param to its default in a single history entry.
    const setMetricView = useCallback(
        (next: MetricViewId) => {
            if (next !== view) push(metricsPathFor(next))
        },
        [push, view]
    )

    return { view, state, setParams, setMetricView }
}
