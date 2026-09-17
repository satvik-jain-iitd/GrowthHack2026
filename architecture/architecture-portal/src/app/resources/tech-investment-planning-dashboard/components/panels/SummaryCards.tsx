'use client'
import { SimpleGrid } from '@chakra-ui/react'
import { MetricCard } from '@/app/resources/tech-investment-planning-dashboard/components/shared/MetricCard'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import { SHOW_METRIC_DEBUG_INFO } from '@/app/resources/tech-investment-planning-dashboard/types'
import { formatMetricDebugInfo } from '@/app/resources/tech-investment-planning-dashboard/utils/metricDebug'

export function SummaryCards() {
    const { filteredMetrics, filteredEpicRows, systemExceptionsMode } =
        useDashboard()
    const metrics = filteredMetrics
    const withExceptions = systemExceptionsMode === 'with_system_exceptions'

    const submittedCount = filteredEpicRows.filter(
        r => r.status === 'submitted'
    ).length

    const submittedWithJourneyRec = filteredEpicRows.filter(
        r =>
            r.status === 'submitted' &&
            (withExceptions || r.recJourneyCount > 0)
    )
    const journeyRetainedCount = submittedWithJourneyRec.filter(
        r => r.recJourneyCount - r.removedJourneys >= 1
    ).length
    const ecjAdoptionPct =
        submittedWithJourneyRec.length > 0
            ? (journeyRetainedCount / submittedWithJourneyRec.length) * 100
            : 0

    const submittedWithCapRec = filteredEpicRows.filter(
        r =>
            r.status === 'submitted' &&
            (withExceptions || r.recCapabilityCount > 0)
    )
    const capRetainedCount = submittedWithCapRec.filter(
        r => r.recCapabilityCount - r.removedCapabilities >= 1
    ).length
    const ebcAdoptionPct =
        submittedWithCapRec.length > 0
            ? (capRetainedCount / submittedWithCapRec.length) * 100
            : 0

    const journeyRetentionNumerator = submittedWithJourneyRec.reduce(
        (sum, row) =>
            sum +
            (row.recJourneyCount > 0
                ? row.recJourneyCount - row.removedJourneys
                : 0),
        0
    )
    const capRetentionNumerator = submittedWithCapRec.reduce(
        (sum, row) =>
            sum +
            (row.recCapabilityCount > 0
                ? row.recCapabilityCount - row.removedCapabilities
                : 0),
        0
    )
    const journeyRetentionDenominator = submittedWithJourneyRec.reduce(
        (sum, row) => sum + row.recJourneyCount,
        0
    )
    const capRetentionDenominator = submittedWithCapRec.reduce(
        (sum, row) => sum + row.recCapabilityCount,
        0
    )

    const ecjAdoptionTooltip =
        (withExceptions
            ? 'Of all Saved Strategic Epics, the percentage that retained at least one AI-recommended ECJ; a Saved Strategic Epic with no AI-recommended ECJ counts as not retained. Formula: (Epics with ≥1 AI ECJ retained) ÷ (All Saved Strategic Epics).'
            : 'Of all Saved Strategic Epics that had at least one AI-recommended ECJ, the percentage that retained at least one. Formula: (Epics with ≥1 AI ECJ retained) ÷ (Epics with any AI ECJ recommendation).') +
        (SHOW_METRIC_DEBUG_INFO
            ? ` ${formatMetricDebugInfo(journeyRetainedCount, submittedWithJourneyRec.length, submittedCount)}`
            : '')

    const ebcAdoptionTooltip =
        (withExceptions
            ? 'Of all Saved Strategic Epics, the percentage that retained at least one AI-recommended EBC; a Saved Strategic Epic with no AI-recommended EBC counts as not retained. Formula: (Epics with ≥1 AI EBC retained) ÷ (All Saved Strategic Epics).'
            : 'Of all Saved Strategic Epics that had at least one AI-recommended EBC, the percentage that retained at least one. Formula: (Epics with ≥1 AI EBC retained) ÷ (Epics with any AI EBC recommendation).') +
        (SHOW_METRIC_DEBUG_INFO
            ? ` ${formatMetricDebugInfo(capRetainedCount, submittedWithCapRec.length, submittedCount)}`
            : '')

    const ecjRetentionTooltip =
        (withExceptions
            ? 'For each Saved Strategic Epic: calculate (AI-recommended ECJs − Removed ECJs) / AI-recommended ECJs; a Saved Strategic Epic with no AI-recommended ECJ scores 0%. The Retention Rate is the average across all Saved Strategic Epics.'
            : 'For each Saved Strategic Epic with an AI-recommended ECJ: calculate (AI-recommended ECJs − Removed ECJs) / AI-recommended ECJs. The Retention Rate is the average of these ratios across all epics with an AI-recommended ECJ.') +
        ' A rate of 100% means users kept all AI-suggested ECJs.' +
        (SHOW_METRIC_DEBUG_INFO
            ? ` ${formatMetricDebugInfo(journeyRetentionNumerator, journeyRetentionDenominator, journeyRetentionDenominator)}`
            : '')

    const ebcRetentionTooltip =
        (withExceptions
            ? 'For each Saved Strategic Epic: calculate (AI-recommended EBCs − Removed EBCs) / AI-recommended EBCs; a Saved Strategic Epic with no AI-recommended EBC scores 0%. The Retention Rate is the average across all Saved Strategic Epics.'
            : 'For each Saved Strategic Epic with an AI-recommended EBC: calculate (AI-recommended EBCs − Removed EBCs) / AI-recommended EBCs. The Retention Rate is the average of these ratios across all epics with an AI-recommended EBC.') +
        ' A rate of 100% means users kept all AI-suggested EBCs.' +
        (SHOW_METRIC_DEBUG_INFO
            ? ` ${formatMetricDebugInfo(capRetentionNumerator, capRetentionDenominator, capRetentionDenominator)}`
            : '')

    return (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={4}>
            <MetricCard
                label='Strategic Epics Initiated'
                value={metrics.totalEpicsInitiated}
                subtitle='Total Strategic Epics where the AI planning flow was started'
                tooltip='A Strategic Epic (SE) is counted as Initiated once the user comes to portal for mapping ECJs and EBCs.'
                color='blue'
            />
            {/* <MetricCard
                label='Strategic Epics Abandoned'
                value={metrics.abandoned}
                subtitle='Started but not saved to Apptio'
                tooltip='A Strategic Epic is Abandoned when the user started the flow but never completed a successful submission to Apptio. Formula: Initiated − Saved.'
                color='amber'
            /> */}
            <MetricCard
                label='Strategic Epics Saved'
                value={metrics.submitted}
                subtitle='Successfully saved to Apptio'
                tooltip='A Strategic Epic is counted as Saved when the user successfully submitted their ECJ and EBC selections to Apptio. This is the primary success metric.'
                color='green'
            />
            <MetricCard
                label='ECJ Adoption Rate'
                value={`${ecjAdoptionPct.toFixed(1)}%`}
                subtitle='Saved epics with ECJ recs that kept ≥1 AI ECJ'
                tooltip={ecjAdoptionTooltip}
                color='green'
            />
            <MetricCard
                label='EBC Adoption Rate'
                value={`${ebcAdoptionPct.toFixed(1)}%`}
                subtitle='Saved epics with EBC recs that kept ≥1 AI EBC'
                tooltip={ebcAdoptionTooltip}
                color='blue'
            />
            <MetricCard
                label='ECJ Retention Rate'
                value={`${(metrics.journeyRetentionRate * 100).toFixed(1)}%`}
                subtitle='Avg. AI-recommended ECJs kept per saved epic'
                tooltip={ecjRetentionTooltip}
                color='cyan'
            />
            <MetricCard
                label='EBC Retention Rate'
                value={`${(metrics.capabilityRetentionRate * 100).toFixed(1)}%`}
                subtitle='Avg. AI-recommended EBCs kept per saved epic'
                tooltip={ebcRetentionTooltip}
                color='green'
            />
        </SimpleGrid>
    )
}
