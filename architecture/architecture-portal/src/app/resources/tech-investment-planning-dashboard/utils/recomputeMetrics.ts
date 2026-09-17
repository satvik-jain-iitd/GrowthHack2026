/* istanbul ignore file */
import type {
    DerivedMetrics,
    EpicDetailData,
    EpicSummaryRow,
    JourneyFrequency,
    CapabilityFrequency,
    SystemExceptionsMode
} from '@/app/resources/tech-investment-planning-dashboard/types'
import { DEFAULT_SYSTEM_EXCEPTIONS_MODE } from '@/app/resources/tech-investment-planning-dashboard/types'

export function recomputeMetrics(
    filteredRows: EpicSummaryRow[],
    epicDetails: Record<string, EpicDetailData>,
    totalEpicsInitiated: number,
    mode: SystemExceptionsMode = DEFAULT_SYSTEM_EXCEPTIONS_MODE
): DerivedMetrics {
    const withExceptions = mode === 'with_system_exceptions'
    let abandoned = 0
    let submitted = 0
    let noChange = 0
    let delta = 0
    let noRec = 0
    let totalAddedJourneys = 0
    let totalAddedCapabilities = 0
    let totalRemovedJourneys = 0
    let totalRemovedCapabilities = 0
    let epicsWithAdditions = 0
    let epicsWithRemovals = 0
    let totalKeptAiJourneys = 0
    let totalKeptAiCapabilities = 0
    let mapLevel3 = 0
    let mapLevel4 = 0
    let recLevel3 = 0
    let recLevel4 = 0
    let journeyRetentionSum = 0
    let journeyRetentionCount = 0
    let capabilityRetentionSum = 0
    let capabilityRetentionCount = 0
    let totalEpicsInRecommendations = 0

    const recJourneyFreq = new Map<
        string,
        { statement: string; epicCount: number }
    >()
    const recCapFreq = new Map<
        string,
        { name: string; level: number; epicCount: number }
    >()
    const savedJourneyFreq = new Map<
        string,
        { statement: string; epicCount: number }
    >()
    const savedCapFreq = new Map<
        string,
        { name: string; level: number; epicCount: number }
    >()

    const journeyRankRetention = [0, 0, 0, 0, 0]

    for (const row of filteredRows) {
        const detail = epicDetails[row.epicId]

        if (row.status === 'submitted') submitted++
        else abandoned++

        if (row.aiMatch === 'no_change') noChange++
        else if (row.aiMatch === 'delta') delta++
        else if (row.aiMatch === 'no_rec') noRec++

        totalRemovedJourneys += row.removedJourneys
        totalRemovedCapabilities += row.removedCapabilities

        if (withExceptions || row.recJourneyCount > 0) {
            totalAddedJourneys += row.addedJourneys
            const keptAiJourneys = row.savedJourneyCount - row.addedJourneys
            totalKeptAiJourneys += keptAiJourneys > 0 ? keptAiJourneys : 0
        }
        if (withExceptions || row.recCapabilityCount > 0) {
            totalAddedCapabilities += row.addedCapabilities
            const keptAiCapabilities =
                row.savedCapabilityCount - row.addedCapabilities
            totalKeptAiCapabilities +=
                keptAiCapabilities > 0 ? keptAiCapabilities : 0
        }

        if (row.addedJourneys > 0 || row.addedCapabilities > 0)
            epicsWithAdditions++
        if (
            row.status === 'submitted' &&
            (row.removedJourneys > 0 || row.removedCapabilities > 0)
        )
            epicsWithRemovals++

        if (row.recJourneyCount > 0 || row.recCapabilityCount > 0)
            totalEpicsInRecommendations++

        if (!detail) continue

        // Capability level distributions from saved and recommended
        if (withExceptions || row.recCapabilityCount > 0) {
            for (const cap of detail.savedCapabilities) {
                if (cap.capabilityLevel === 3) mapLevel3++
                else if (cap.capabilityLevel === 4) mapLevel4++
            }
            for (const cap of detail.recCapabilities) {
                if (cap.capabilityLevel === 3) recLevel3++
                else if (cap.capabilityLevel === 4) recLevel4++
            }
        }

        // Retention rates: per submitted epic
        if (row.status === 'submitted') {
            if (withExceptions) {
                // Every submitted epic enters the average; no recs means 0% retained
                const keptJ =
                    row.recJourneyCount > 0
                        ? (row.recJourneyCount - row.removedJourneys) /
                          row.recJourneyCount
                        : 0
                journeyRetentionSum += keptJ
                journeyRetentionCount++

                const keptC =
                    row.recCapabilityCount > 0
                        ? (row.recCapabilityCount - row.removedCapabilities) /
                          row.recCapabilityCount
                        : 0
                capabilityRetentionSum += keptC
                capabilityRetentionCount++
            } else {
                if (row.recJourneyCount > 0) {
                    const keptJ = row.recJourneyCount - row.removedJourneys
                    journeyRetentionSum += keptJ / row.recJourneyCount
                    journeyRetentionCount++
                }
                if (row.recCapabilityCount > 0) {
                    const keptC =
                        row.recCapabilityCount - row.removedCapabilities
                    capabilityRetentionSum += keptC / row.recCapabilityCount
                    capabilityRetentionCount++
                }
            }
        }

        // Top recommended journeys/capabilities frequency
        for (const j of detail.recJourneys) {
            const entry = recJourneyFreq.get(j.journeyId)
            if (entry) entry.epicCount++
            else
                recJourneyFreq.set(j.journeyId, {
                    statement: j.journeyStatement,
                    epicCount: 1
                })
        }
        for (const c of detail.recCapabilities) {
            const entry = recCapFreq.get(c.capabilityId)
            if (entry) entry.epicCount++
            else
                recCapFreq.set(c.capabilityId, {
                    name: c.capabilityName,
                    level: c.capabilityLevel,
                    epicCount: 1
                })
        }

        // Top saved journeys/capabilities frequency
        for (const j of detail.savedJourneys) {
            const entry = savedJourneyFreq.get(j.journeyId)
            if (entry) entry.epicCount++
            else
                savedJourneyFreq.set(j.journeyId, {
                    statement: j.journeyStatement,
                    epicCount: 1
                })
        }
        for (const c of detail.savedCapabilities) {
            const entry = savedCapFreq.get(c.capabilityId)
            if (entry) entry.epicCount++
            else
                savedCapFreq.set(c.capabilityId, {
                    name: c.capabilityName,
                    level: c.capabilityLevel,
                    epicCount: 1
                })
        }

        // Journey rank retention: use first 5 recommended journeys (recommendation order)
        const savedJourneyIds = new Set(
            detail.savedJourneys.map(j => j.journeyId)
        )
        const rankedJourneys = detail.recJourneys.slice(0, 5)
        for (let i = 0; i < rankedJourneys.length; i++) {
            if (savedJourneyIds.has(rankedJourneys[i].journeyId)) {
                journeyRankRetention[i]++
            }
        }
    }

    const topRecJourneys: JourneyFrequency[] = Array.from(
        recJourneyFreq.entries()
    )
        .map(([journeyId, d]) => ({
            journeyId,
            journeyStatement: d.statement,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    const topRecCapabilities: CapabilityFrequency[] = Array.from(
        recCapFreq.entries()
    )
        .map(([capabilityId, d]) => ({
            capabilityId,
            capabilityName: d.name,
            capabilityLevel: d.level,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    const topSavedJourneys: JourneyFrequency[] = Array.from(
        savedJourneyFreq.entries()
    )
        .map(([journeyId, d]) => ({
            journeyId,
            journeyStatement: d.statement,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    const topSavedCapabilities: CapabilityFrequency[] = Array.from(
        savedCapFreq.entries()
    )
        .map(([capabilityId, d]) => ({
            capabilityId,
            capabilityName: d.name,
            capabilityLevel: d.level,
            epicCount: d.epicCount
        }))
        .sort((a, b) => b.epicCount - a.epicCount)
        .slice(0, 10)

    return {
        totalEpicsInitiated,
        totalEpicsInRecommendations,
        abandoned,
        submitted,
        noChange,
        delta,
        noRec,
        totalAddedJourneys,
        totalAddedCapabilities,
        totalRemovedJourneys,
        totalRemovedCapabilities,
        epicsWithAdditions,
        epicsWithRemovals,
        totalKeptAiJourneys,
        totalKeptAiCapabilities,
        capLevelDistMapping: { level3: mapLevel3, level4: mapLevel4 },
        capLevelDistRec: { level3: recLevel3, level4: recLevel4 },
        journeyRetentionRate:
            journeyRetentionCount > 0
                ? journeyRetentionSum / journeyRetentionCount
                : 0,
        capabilityRetentionRate:
            capabilityRetentionCount > 0
                ? capabilityRetentionSum / capabilityRetentionCount
                : 0,
        topRecJourneys,
        topRecCapabilities,
        topSavedJourneys,
        topSavedCapabilities,
        journeyRankRetention
    }
}
