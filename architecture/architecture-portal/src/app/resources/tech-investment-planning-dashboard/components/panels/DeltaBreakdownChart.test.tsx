import { render, screen } from '@/test/utils/test-utils'
import { DeltaBreakdownChart } from '@/app/resources/tech-investment-planning-dashboard/components/panels/DeltaBreakdownChart'

jest.mock('../../context/DashboardContext')
jest.mock('next-themes', () => ({
    useTheme: () => ({ resolvedTheme: 'light' })
}))

import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
const mockUseDashboard = useDashboard as jest.Mock

function makeMetrics(overrides = {}) {
    return {
        totalEpicsInitiated: 0,
        abandoned: 0,
        submitted: 0,
        noChange: 0,
        delta: 0,
        noRec: 0,
        epicsWithRemovals: 0,
        epicsWithAdditions: 0,
        totalAddedJourneys: 0,
        totalAddedCapabilities: 0,
        totalRemovedJourneys: 0,
        totalRemovedCapabilities: 0,
        totalKeptAiJourneys: 0,
        totalKeptAiCapabilities: 0,
        capLevelDistMapping: { level3: 0, level4: 0 },
        capLevelDistRec: { level3: 0, level4: 0 },
        journeyRetentionRate: 0,
        capabilityRetentionRate: 0,
        topRecJourneys: [],
        topRecCapabilities: [],
        topSavedJourneys: [],
        topSavedCapabilities: [],
        totalEpicsInRecommendations: 0,
        ...overrides
    }
}

function makeContext(metricOverrides = {}) {
    const metrics = makeMetrics(metricOverrides)
    return {
        metrics,
        filteredMetrics: metrics,
        epicRows: [],
        filteredEpicRows: [],
        epicDetails: {},
        epicActors: {},
        strategicEpics: [],
        strategicEpicsCount: null,
        systemExceptionsMode: 'without_system_exceptions',
        setSystemExceptionsMode: jest.fn()
    }
}

describe('DeltaBreakdownChart', () => {
    beforeEach(() => {
        mockUseDashboard.mockReturnValue(makeContext())
    })

    it('renders title "User Changes vs AI Recommendations"', () => {
        render(<DeltaBreakdownChart />)
        expect(
            screen.getByText('User Changes vs AI Recommendations')
        ).toBeInTheDocument()
    })

    it('renders without crashing with zero metrics', () => {
        expect(() => render(<DeltaBreakdownChart />)).not.toThrow()
    })
})
