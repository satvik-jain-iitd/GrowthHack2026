import { render, screen } from '@/test/utils/test-utils'
import { SummaryCards } from '@/app/resources/tech-investment-planning-dashboard/components/panels/SummaryCards'
import type { EpicSummaryRow } from '@/app/resources/tech-investment-planning-dashboard/types'

function makeRow(overrides: Partial<EpicSummaryRow> = {}): EpicSummaryRow {
    return {
        epicId: 'E-001',
        epicName: 'Test Epic',
        status: 'submitted',
        aiMatch: 'no_change',
        addedJourneys: 0,
        addedCapabilities: 0,
        removedJourneys: 0,
        removedCapabilities: 0,
        savedJourneyCount: 0,
        savedCapabilityCount: 0,
        recJourneyCount: 0,
        recCapabilityCount: 0,
        ...overrides
    }
}

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

function makeContext(overrides: Record<string, unknown> = {}) {
    const metrics = (overrides.metrics as typeof zeroMetrics) ?? zeroMetrics
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
        setSystemExceptionsMode: jest.fn(),
        ...overrides
    }
}

describe('SummaryCards', () => {
    beforeEach(() => {
        mockUseDashboard.mockReturnValue(makeContext())
    })

    it('renders all cards by label', () => {
        render(<SummaryCards />)
        expect(
            screen.getByText('Strategic Epics Initiated')
        ).toBeInTheDocument()
        expect(screen.getByText('Strategic Epics Saved')).toBeInTheDocument()
        expect(screen.getByText('ECJ Adoption Rate')).toBeInTheDocument()
        expect(screen.getByText('EBC Adoption Rate')).toBeInTheDocument()
        expect(screen.getByText('ECJ Retention Rate')).toBeInTheDocument()
        expect(screen.getByText('EBC Retention Rate')).toBeInTheDocument()
    })

    it('displays correct values from metrics', () => {
        mockUseDashboard.mockReturnValue(
            makeContext({
                metrics: {
                    ...zeroMetrics,
                    totalEpicsInitiated: 42,
                    submitted: 37,
                    capabilityRetentionRate: 0.75
                }
            })
        )
        render(<SummaryCards />)
        expect(screen.getByText('42')).toBeInTheDocument()
        expect(screen.getByText('37')).toBeInTheDocument()
        expect(screen.getByText('75.0%')).toBeInTheDocument()
    })

    it('computes ECJ Adoption Rate correctly', () => {
        mockUseDashboard.mockReturnValue(
            makeContext({
                filteredEpicRows: [
                    makeRow({ recJourneyCount: 2, removedJourneys: 0 }),
                    makeRow({ recJourneyCount: 1, removedJourneys: 1 }),
                    makeRow({ recJourneyCount: 0 }),
                    makeRow({ status: 'abandoned', recJourneyCount: 2 })
                ]
            })
        )
        render(<SummaryCards />)
        expect(screen.getByText('50.0%')).toBeInTheDocument()
    })

    it('computes EBC Adoption Rate correctly', () => {
        mockUseDashboard.mockReturnValue(
            makeContext({
                filteredEpicRows: [
                    makeRow({ recCapabilityCount: 3, removedCapabilities: 0 }),
                    makeRow({ recCapabilityCount: 2, removedCapabilities: 0 }),
                    makeRow({ recCapabilityCount: 1, removedCapabilities: 1 })
                ]
            })
        )
        render(<SummaryCards />)
        expect(screen.getByText('66.7%')).toBeInTheDocument()
    })

    it('displays ECJ Retention Rate from journeyRetentionRate', () => {
        mockUseDashboard.mockReturnValue(
            makeContext({
                metrics: { ...zeroMetrics, journeyRetentionRate: 0.6 }
            })
        )
        render(<SummaryCards />)
        expect(screen.getByText('60.0%')).toBeInTheDocument()
    })

    it('widens ECJ Adoption Rate denominator when systemExceptionsMode is with_system_exceptions', () => {
        mockUseDashboard.mockReturnValue(
            makeContext({
                systemExceptionsMode: 'with_system_exceptions',
                filteredEpicRows: [
                    makeRow({ recJourneyCount: 2, removedJourneys: 0 }),
                    makeRow({ recJourneyCount: 0 })
                ]
            })
        )
        render(<SummaryCards />)
        expect(screen.getByText('50.0%')).toBeInTheDocument()
    })

    it('shows 0.0% for both adoption cards when no epics have recs', () => {
        mockUseDashboard.mockReturnValue(makeContext({ filteredEpicRows: [] }))
        render(<SummaryCards />)
        const zeros = screen.getAllByText('0.0%')
        expect(zeros.length).toBeGreaterThanOrEqual(2)
    })

    it('renders without crashing with zero metrics', () => {
        expect(() => render(<SummaryCards />)).not.toThrow()
    })
})
