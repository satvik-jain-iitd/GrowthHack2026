import { buildMetricsUrl, MetricsUrlState, parseMetricsState } from './utils'
import {
    DEFAULT_METRIC_VIEW,
    METRIC_ID_TO_VIEW,
    METRIC_IDS,
    METRIC_SLUG_TO_VIEW,
    MetricViewId,
    metricsPathFor
} from './constants/metricRoutes'

const parse = (view: MetricViewId, query = '') =>
    parseMetricsState(view, new URLSearchParams(query))

const METRIC2_PATH = `/resources/metrics/${METRIC_IDS.metric2}`
const METRIC1_PATH = `/resources/metrics/${METRIC_IDS.metric1}`
const METRIC3_PATH = `/resources/metrics/${METRIC_IDS.metric3}`

describe('metricRoutes', () => {
    it('maps every uuid back to its view', () => {
        expect(METRIC_ID_TO_VIEW).toEqual({
            [METRIC_IDS.metric2]: 'metric2',
            [METRIC_IDS.metric1]: 'metric1',
            [METRIC_IDS.metric3]: 'metric3'
        })
    })

    it('covers all three views with legacy slugs', () => {
        expect(Object.values(METRIC_SLUG_TO_VIEW).sort()).toEqual([
            'metric1',
            'metric2',
            'metric3'
        ])
    })

    it('builds the permalink path for a view', () => {
        expect(metricsPathFor('metric3')).toBe(METRIC3_PATH)
        expect(metricsPathFor(DEFAULT_METRIC_VIEW)).toBe(METRIC2_PATH)
    })
})

describe('parseMetricsState', () => {
    it('returns metric2 defaults for empty params', () => {
        expect(parse('metric2')).toEqual({
            view: 'metric2',
            selectedGroup: 'domain',
            displayView: 'cardView',
            heatmap: true,
            burrReport: false,
            categoryFilter: 'withContributions',
            apiTypeFilter: 'all',
            apiOperation: ['apis'],
            initiativeType: 'all',
            crossDomainGroupBy: '',
            search: ''
        })
    })

    it('returns metric1 defaults for empty params', () => {
        expect(parse('metric1')).toMatchObject({
            selectedGroup: '',
            displayView: 'cardView',
            heatmap: true
        })
    })

    it('reads the metric2 group map', () => {
        expect(parse('metric2', 'group=unitcio').selectedGroup).toBe('unitCIO')
        expect(parse('metric2', 'group=techowner').selectedGroup).toBe(
            'techOwner'
        )
        expect(parse('metric2', 'group=none').selectedGroup).toBe('')
    })

    it('reads the metric1 group map', () => {
        expect(parse('metric1', 'group=ecmi').selectedGroup).toBe('ecmi')
        expect(parse('metric1', 'group=ownersvp').selectedGroup).toBe(
            'ownerSVP'
        )
    })

    it('reads the metric3 group into crossDomainGroupBy', () => {
        expect(parse('metric3', 'group=unitcio')).toMatchObject({
            selectedGroup: '',
            crossDomainGroupBy: 'unitCIO'
        })
    })

    it('falls back to defaults for unrecognised values', () => {
        expect(parse('metric2', 'group=bogus').selectedGroup).toBe('domain')
        expect(parse('metric1', 'group=bogus').selectedGroup).toBe('')
        expect(parse('metric2', 'view=bogus').displayView).toBe('cardView')
        expect(parse('metric2', 'type=bogus').apiTypeFilter).toBe('all')
        expect(parse('metric3', 'itype=bogus').initiativeType).toBe('all')
    })

    it('treats an absent heatmap param as on and heatmap=false as off', () => {
        expect(parse('metric2', 'view=list').heatmap).toBe(true)
        expect(parse('metric2', 'view=list&heatmap=true').heatmap).toBe(true)
        expect(parse('metric2', 'view=list&heatmap=false').heatmap).toBe(false)
    })

    it('honours heatmap=false for group=unitcio without an explicit view', () => {
        expect(parse('metric2', 'group=unitcio&heatmap=false').heatmap).toBe(
            false
        )
    })

    it('reads burrReport in the heatmap view, ignores it elsewhere', () => {
        expect(parse('metric2', 'view=list&burrReport=true').burrReport).toBe(
            true
        )
        // a stored preference, still set while the heatmap is switched off
        expect(
            parse('metric2', 'view=list&heatmap=false&burrReport=true')
                .burrReport
        ).toBe(true)
        expect(parse('metric2', 'burrReport=true').burrReport).toBe(false)
        expect(parse('metric1', 'burrReport=true').burrReport).toBe(false)
    })

    it('ignores heatmap outside metric2 list view', () => {
        expect(parse('metric2', 'heatmap=false').heatmap).toBe(true)
        expect(parse('metric1', 'heatmap=false').heatmap).toBe(true)
    })

    it('parses a multi-value show param', () => {
        expect(
            parse('metric2', 'view=list&show=apis,operations').apiOperation
        ).toEqual(['apis', 'operations'])
        expect(
            parse('metric2', 'view=list&show=operations').apiOperation
        ).toEqual(['operations'])
        expect(parse('metric2', 'view=list&show=bogus').apiOperation).toEqual([
            'apis'
        ])
    })

    it('ignores show when the tab has no grouping', () => {
        expect(
            parse('metric2', 'group=none&show=operations').apiOperation
        ).toEqual(['apis'])
    })

    it('reads the category filter only for the domain grouping', () => {
        expect(parse('metric2', 'filter=viewAll').categoryFilter).toBe(
            'viewAll'
        )
        expect(
            parse('metric2', 'group=unitcio&filter=viewAll').categoryFilter
        ).toBe('withContributions')
    })

    it('keeps category names containing spaces intact', () => {
        expect(
            parse(
                'metric2',
                `filter=${encodeURIComponent('Customer Servicing')}`
            ).categoryFilter
        ).toBe('Customer Servicing')
    })

    it('reads search on every tab', () => {
        expect(parse('metric3', 'search=cross').search).toBe('cross')
        expect(parse('metric1', 'search=payments').search).toBe('payments')
    })

    it('tolerates a null param source', () => {
        expect(parseMetricsState('metric2', null).selectedGroup).toBe('domain')
    })
})

describe('buildMetricsUrl', () => {
    it('omits every param at its default', () => {
        expect(buildMetricsUrl(parse('metric2'))).toBe(METRIC2_PATH)
        expect(buildMetricsUrl(parse('metric1'))).toBe(METRIC1_PATH)
        expect(buildMetricsUrl(parse('metric3'))).toBe(METRIC3_PATH)
    })

    it('writes heatmap=false but never heatmap=true', () => {
        expect(buildMetricsUrl(parse('metric2', 'view=list'))).toBe(
            `${METRIC2_PATH}?view=list`
        )
        expect(
            buildMetricsUrl(parse('metric2', 'view=list&heatmap=false'))
        ).toBe(`${METRIC2_PATH}?view=list&heatmap=false`)
    })

    it('suppresses view and heatmap for metric1', () => {
        const state: MetricsUrlState = {
            ...parse('metric1', 'group=unitcio'),
            displayView: 'listView',
            heatmap: false
        }
        expect(buildMetricsUrl(state)).toBe(`${METRIC1_PATH}?group=unitcio`)
    })

    it('suppresses heatmap in card view', () => {
        const state: MetricsUrlState = { ...parse('metric2'), heatmap: false }
        expect(buildMetricsUrl(state)).toBe(METRIC2_PATH)
    })

    it('writes group=none when metric2 grouping is cleared', () => {
        const state: MetricsUrlState = {
            ...parse('metric2'),
            selectedGroup: ''
        }
        expect(buildMetricsUrl(state)).toBe(`${METRIC2_PATH}?group=none`)
    })

    it('preserves passthrough params it does not own', () => {
        const passthrough = new URLSearchParams('view=list&metric=domain-apis')
        const url = buildMetricsUrl(
            parse('metric2', 'group=unitcio'),
            passthrough
        )
        expect(url).toContain('metric=domain-apis')
        expect(url).not.toContain('view=list')
    })

    it('writes burrReport only where it applies', () => {
        expect(
            buildMetricsUrl(parse('metric2', 'view=list&burrReport=true'))
        ).toBe(`${METRIC2_PATH}?view=list&burrReport=true`)
        expect(buildMetricsUrl({ ...parse('metric2'), burrReport: true })).toBe(
            METRIC2_PATH
        )
    })

    it('canonicalises the show param order', () => {
        const state: MetricsUrlState = {
            ...parse('metric2', 'view=list'),
            apiOperation: ['operations', 'apis']
        }
        expect(buildMetricsUrl(state)).toContain('show=apis%2Coperations')
    })

    it('writes itype only for metric3', () => {
        expect(buildMetricsUrl(parse('metric3', 'itype=etp'))).toBe(
            `${METRIC3_PATH}?itype=etp`
        )
        expect(
            buildMetricsUrl({ ...parse('metric2'), initiativeType: 'etp' })
        ).toBe(METRIC2_PATH)
    })

    it.each([
        ['metric2', 'group=unitcio&view=list&heatmap=false&search=payments'],
        ['metric2', 'view=list&burrReport=true&filter=viewAll'],
        ['metric2', 'view=list&filter=viewAll&show=apis%2Coperations'],
        ['metric2', 'group=none&type=b'],
        ['metric1', 'group=ownersvp&type=b&search=auth'],
        ['metric3', 'group=unitcio&itype=ecmi&search=cross']
    ])('round-trips %s ?%s', (view, query) => {
        const state = parse(view as MetricViewId, query)
        const rebuilt = buildMetricsUrl(state)
        expect(
            parseMetricsState(
                view as MetricViewId,
                new URLSearchParams(rebuilt.split('?')[1] || '')
            )
        ).toEqual(state)
    })
})
