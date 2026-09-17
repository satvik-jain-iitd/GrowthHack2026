import { recomputeMetrics } from '@/app/resources/tech-investment-planning-dashboard/utils/recomputeMetrics'
import type {
    EpicDetailData,
    EpicSummaryRow
} from '@/app/resources/tech-investment-planning-dashboard/types'

function makeRow(overrides: Partial<EpicSummaryRow> = {}): EpicSummaryRow {
    return {
        epicId: 'E-1',
        epicName: 'Epic',
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

function makeDetail(overrides: Partial<EpicDetailData> = {}): EpicDetailData {
    return {
        epicId: 'E-1',
        epicName: 'Epic',
        savedJourneys: [],
        savedCapabilities: [],
        recJourneys: [],
        recCapabilities: [],
        timeSpentMs: null,
        ...overrides
    }
}

// Retention-rate accumulation only runs for rows with a matching epicDetails
// entry (recomputeMetrics `continue`s early otherwise), so these fixtures
// always need a detail per row even though its contents aren't exercised.
const abDetails: Record<string, EpicDetailData> = {
    A: makeDetail({ epicId: 'A' }),
    B: makeDetail({ epicId: 'B' })
}

describe('recomputeMetrics', () => {
    it('defaults to without_system_exceptions mode when no mode is passed', () => {
        const rows = [
            makeRow({ epicId: 'A', recJourneyCount: 2, removedJourneys: 0 }),
            makeRow({ epicId: 'B', recJourneyCount: 0 })
        ]
        const result = recomputeMetrics(rows, abDetails, rows.length)
        expect(result.journeyRetentionRate).toBe(1)
    })

    describe('journey/capability retention rate', () => {
        it('excludes zero-rec epics in without_system_exceptions mode', () => {
            const rows = [
                makeRow({
                    epicId: 'A',
                    recJourneyCount: 2,
                    removedJourneys: 0
                }),
                makeRow({ epicId: 'B', recJourneyCount: 0 })
            ]
            const result = recomputeMetrics(
                rows,
                abDetails,
                rows.length,
                'without_system_exceptions'
            )
            expect(result.journeyRetentionRate).toBe(1)
        })

        it('counts zero-rec epics as 0% retained in with_system_exceptions mode', () => {
            const rows = [
                makeRow({
                    epicId: 'A',
                    recJourneyCount: 2,
                    removedJourneys: 0
                }),
                makeRow({ epicId: 'B', recJourneyCount: 0 })
            ]
            const result = recomputeMetrics(
                rows,
                abDetails,
                rows.length,
                'with_system_exceptions'
            )
            expect(result.journeyRetentionRate).toBe(0.5)
        })

        it('averages partial retention with a mix of scored and zero-rec epics', () => {
            const rows = [
                makeRow({
                    epicId: 'A',
                    recCapabilityCount: 4,
                    removedCapabilities: 1
                }),
                makeRow({ epicId: 'B', recCapabilityCount: 0 })
            ]
            const result = recomputeMetrics(
                rows,
                abDetails,
                rows.length,
                'with_system_exceptions'
            )
            expect(result.capabilityRetentionRate).toBeCloseTo(0.375)
        })

        it('ignores abandoned epics for retention rate regardless of mode', () => {
            const rows = [
                makeRow({
                    epicId: 'A',
                    status: 'abandoned',
                    recJourneyCount: 2,
                    removedJourneys: 2
                })
            ]
            const details = { A: makeDetail({ epicId: 'A' }) }
            const withoutResult = recomputeMetrics(
                rows,
                details,
                rows.length,
                'without_system_exceptions'
            )
            const withResult = recomputeMetrics(
                rows,
                details,
                rows.length,
                'with_system_exceptions'
            )
            expect(withoutResult.journeyRetentionRate).toBe(0)
            expect(withResult.journeyRetentionRate).toBe(0)
        })
    })

    describe('totalKeptAi*/totalAdded* gating', () => {
        it('excludes zero-rec epics from added/kept totals in without_system_exceptions mode', () => {
            const rows = [
                makeRow({
                    epicId: 'A',
                    recJourneyCount: 2,
                    savedJourneyCount: 3,
                    addedJourneys: 1
                }),
                makeRow({
                    epicId: 'B',
                    recJourneyCount: 0,
                    savedJourneyCount: 1,
                    addedJourneys: 5
                })
            ]
            const result = recomputeMetrics(
                rows,
                {},
                rows.length,
                'without_system_exceptions'
            )
            expect(result.totalAddedJourneys).toBe(1)
            expect(result.totalKeptAiJourneys).toBe(2)
        })

        it('includes zero-rec epics in added/kept totals in with_system_exceptions mode', () => {
            const rows = [
                makeRow({
                    epicId: 'A',
                    recJourneyCount: 2,
                    savedJourneyCount: 3,
                    addedJourneys: 1
                }),
                makeRow({
                    epicId: 'B',
                    recJourneyCount: 0,
                    savedJourneyCount: 1,
                    addedJourneys: 5
                })
            ]
            const result = recomputeMetrics(
                rows,
                {},
                rows.length,
                'with_system_exceptions'
            )
            expect(result.totalAddedJourneys).toBe(6)
            // Row B kept = savedJourneyCount(1) - addedJourneys(5) = -4, clamped to 0
            expect(result.totalKeptAiJourneys).toBe(2)
        })
    })

    describe('capability level distribution gating', () => {
        const details: Record<string, EpicDetailData> = {
            A: makeDetail({
                epicId: 'A',
                savedCapabilities: [
                    {
                        capabilityId: 'c1',
                        capabilityName: 'Cap1',
                        capabilityLevel: 3,
                        recommended: true,
                        saved: true
                    }
                ],
                recCapabilities: [
                    {
                        capabilityId: 'c1',
                        capabilityName: 'Cap1',
                        capabilityLevel: 3,
                        recommended: true,
                        saved: true
                    }
                ]
            }),
            B: makeDetail({
                epicId: 'B',
                savedCapabilities: [
                    {
                        capabilityId: 'c2',
                        capabilityName: 'Cap2',
                        capabilityLevel: 4,
                        recommended: false,
                        saved: true
                    }
                ]
            })
        }

        it('excludes zero-rec epics from capLevelDist in without_system_exceptions mode', () => {
            const rows = [
                makeRow({ epicId: 'A', recCapabilityCount: 2 }),
                makeRow({ epicId: 'B', recCapabilityCount: 0 })
            ]
            const result = recomputeMetrics(
                rows,
                details,
                rows.length,
                'without_system_exceptions'
            )
            expect(result.capLevelDistMapping).toEqual({
                level3: 1,
                level4: 0
            })
            expect(result.capLevelDistRec).toEqual({ level3: 1, level4: 0 })
        })

        it('includes zero-rec epics in capLevelDist in with_system_exceptions mode', () => {
            const rows = [
                makeRow({ epicId: 'A', recCapabilityCount: 2 }),
                makeRow({ epicId: 'B', recCapabilityCount: 0 })
            ]
            const result = recomputeMetrics(
                rows,
                details,
                rows.length,
                'with_system_exceptions'
            )
            expect(result.capLevelDistMapping).toEqual({
                level3: 1,
                level4: 1
            })
            expect(result.capLevelDistRec).toEqual({ level3: 1, level4: 0 })
        })
    })
})
