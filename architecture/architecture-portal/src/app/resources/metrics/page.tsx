/* istanbul ignore file */
import { redirect } from 'next/navigation'
import {
    DEFAULT_METRIC_VIEW,
    METRIC_SLUG_TO_VIEW
} from './constants/metricRoutes'
import { buildMetricsUrl, parseMetricsState } from './utils'

/**
 * Back-compat stub for the pre-permalink `/resources/metrics?metric=…` URLs.
 * The now-meaningless `metric` slug becomes the path; everything else is
 * re-canonicalised so the landing URL matches what the page itself would write.
 */
export default async function MetricsRedirect({
    searchParams
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const { metric, ...rest } = await searchParams
    const slug = Array.isArray(metric) ? metric[0] : metric
    const view = (slug && METRIC_SLUG_TO_VIEW[slug]) || DEFAULT_METRIC_VIEW

    const forwarded = new URLSearchParams()
    for (const [key, value] of Object.entries(rest)) {
        if (value === undefined) continue
        for (const item of Array.isArray(value) ? value : [value]) {
            forwarded.append(key, item)
        }
    }

    redirect(buildMetricsUrl(parseMetricsState(view, forwarded), forwarded))
}
