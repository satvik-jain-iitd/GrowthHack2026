import { act, renderHook } from '@testing-library/react'
import { useMetricsUrlState } from './useMetricsUrlState'
import { METRIC_IDS } from '../constants/metricRoutes'

const mockPush = jest.fn()
const mockLiveSearchParams = () => new URLSearchParams(window.location.search)

jest.mock('next/navigation', () => ({
    useParams: () => ({ metricId: mockMetricId }),
    useSearchParams: () => mockLiveSearchParams()
}))
jest.mock('@/hooks', () => ({
    useNavigation: () => ({ push: mockPush, replace: jest.fn() })
}))

let mockMetricId = METRIC_IDS.metric2

const METRIC2_PATH = `/resources/metrics/${METRIC_IDS.metric2}`

const goto = (url: string) => window.history.replaceState(null, '', url)

const currentUrl = () => window.location.pathname + window.location.search

beforeEach(() => {
    mockMetricId = METRIC_IDS.metric2
    mockPush.mockClear()
    goto(METRIC2_PATH)
})

describe('setParams', () => {
    it('keeps burrReport through a category filter change', () => {
        goto(`${METRIC2_PATH}?view=list&burrReport=true`)
        const { result } = renderHook(() => useMetricsUrlState())

        act(() => result.current.setParams({ categoryFilter: 'viewAll' }))

        expect(currentUrl()).toContain('burrReport=true')
        expect(currentUrl()).toContain('filter=viewAll')
        expect(currentUrl()).toContain('view=list')
    })

    it('keeps burrReport through a heatmap toggle and back', () => {
        goto(`${METRIC2_PATH}?view=list&burrReport=true`)
        const { result } = renderHook(() => useMetricsUrlState())

        act(() => result.current.setParams({ heatmap: false }))
        expect(currentUrl()).toContain('burrReport=true')
        expect(currentUrl()).toContain('heatmap=false')

        act(() => result.current.setParams({ heatmap: true }))
        expect(currentUrl()).toContain('burrReport=true')
        expect(currentUrl()).not.toContain('heatmap=')
    })

    it('round-trips the BUR toggle itself through the URL', () => {
        goto(`${METRIC2_PATH}?view=list&burrReport=true`)
        const { result } = renderHook(() => useMetricsUrlState())
        expect(result.current.state.burrReport).toBe(true)

        act(() => result.current.setParams({ burrReport: false }))
        expect(currentUrl()).not.toContain('burrReport')

        act(() => result.current.setParams({ burrReport: true }))
        expect(currentUrl()).toContain('burrReport=true')
    })

    it('keeps burrReport through a group change and a search', () => {
        goto(`${METRIC2_PATH}?view=list&burrReport=true`)
        const { result } = renderHook(() => useMetricsUrlState())

        act(() =>
            result.current.setParams({
                selectedGroup: 'unitCIO',
                displayView: 'listView',
                search: ''
            })
        )
        expect(currentUrl()).toContain('burrReport=true')
        expect(currentUrl()).toContain('group=unitcio')

        act(() => result.current.setParams({ search: 'payments' }))
        expect(currentUrl()).toContain('burrReport=true')
        expect(currentUrl()).toContain('search=payments')
    })

    it('composes back-to-back calls in one tick instead of clobbering', () => {
        goto(`${METRIC2_PATH}?view=list&burrReport=true`)
        const { result } = renderHook(() => useMetricsUrlState())

        act(() => {
            result.current.setParams({ categoryFilter: 'viewAll' })
            result.current.setParams({ search: 'auth' })
        })

        expect(currentUrl()).toContain('filter=viewAll')
        expect(currentUrl()).toContain('search=auth')
        expect(currentUrl()).toContain('burrReport=true')
    })

    it('drops burrReport when the view can no longer show it', () => {
        goto(`${METRIC2_PATH}?view=list&burrReport=true`)
        const { result } = renderHook(() => useMetricsUrlState())

        act(() => result.current.setParams({ displayView: 'cardView' }))

        expect(currentUrl()).not.toContain('burrReport')
    })

    it('pushes history for a real change and skips a no-op', () => {
        goto(`${METRIC2_PATH}?view=list`)
        const { result } = renderHook(() => useMetricsUrlState())
        const before = window.history.length

        act(() => result.current.setParams({ displayView: 'listView' }))
        expect(window.history.length).toBe(before)

        act(() => result.current.setParams({ displayView: 'cardView' }))
        expect(window.history.length).toBe(before + 1)
    })

    it('routes a tab switch through the router, not pushState', () => {
        goto(`${METRIC2_PATH}?view=list&burrReport=true`)
        const { result } = renderHook(() => useMetricsUrlState())

        act(() => result.current.setMetricView('metric1'))

        expect(mockPush).toHaveBeenCalledWith(
            `/resources/metrics/${METRIC_IDS.metric1}`
        )
        expect(currentUrl()).toContain(METRIC_IDS.metric2)
    })
})
