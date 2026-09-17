import { render, screen } from '@/test/utils/test-utils'
import { SubmissionFunnelChart } from '@/app/resources/tech-investment-planning-dashboard/components/panels/SubmissionFunnelChart'

jest.mock('../../context/DashboardContext')
jest.mock('next-themes', () => ({
    useTheme: () => ({ resolvedTheme: 'light' })
}))

import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
const mockUseDashboard = useDashboard as jest.Mock

const zeroMetrics = {
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
    totalEpicsInRecommendations: 0
}

describe('SubmissionFunnelChart', () => {
    beforeEach(() => {
        mockUseDashboard.mockReturnValue({
            metrics: zeroMetrics,
            epicRows: [],
            epicDetails: {},
            epicActors: {},
            strategicEpicsCount: null
        })
    })

    it('renders without crashing with zero metrics', () => {
        expect(() => render(<SubmissionFunnelChart />)).not.toThrow()
    })

    it('renders chart title "Submission Funnel"', () => {
        render(<SubmissionFunnelChart />)
        expect(screen.getByText('Submission Funnel')).toBeInTheDocument()
    })
})
