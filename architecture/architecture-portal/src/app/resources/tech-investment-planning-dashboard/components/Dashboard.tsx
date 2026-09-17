/* istanbul ignore file */
'use client'
import { useEffect, useMemo, useState } from 'react'
import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { useCsvProcessor } from '@/app/resources/tech-investment-planning-dashboard/hooks/useCsvProcessor'
import { DashboardProvider } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import { LoadingScreen } from '@/app/resources/tech-investment-planning-dashboard/components/LoadingScreen'
import { SummaryCards } from '@/app/resources/tech-investment-planning-dashboard/components/panels/SummaryCards'
import { RetentionRateChart } from '@/app/resources/tech-investment-planning-dashboard/components/panels/RetentionRateChart'
import { AIAdoptionChart } from '@/app/resources/tech-investment-planning-dashboard/components/panels/AIAdoptionChart'
import { EpicDetailTable } from '@/app/resources/tech-investment-planning-dashboard/components/panels/EpicDetailTable'
import { TopItemsDialog } from '@/app/resources/tech-investment-planning-dashboard/components/panels/TopItemsDialog'
import { SystemExceptionsToggle } from '@/app/resources/tech-investment-planning-dashboard/components/panels/SystemExceptionsToggle'
import { FilterBar } from '@/app/resources/tech-investment-planning-dashboard/components/FilterBar'
import type {
    DashboardFilters,
    StrategicEpic,
    SystemExceptionsMode
} from '@/app/resources/tech-investment-planning-dashboard/types'
import {
    EMPTY_FILTERS,
    DEFAULT_SYSTEM_EXCEPTIONS_MODE
} from '@/app/resources/tech-investment-planning-dashboard/types'
import { recomputeMetrics } from '@/app/resources/tech-investment-planning-dashboard/utils/recomputeMetrics'
import { usePilotGroup } from '@/hooks/usePilotGroup'
import { getPilotGroupId } from '@/constants/pilotGroups'
import { useUserDetails } from '@/app/company-domains/hooks/useUserDetails'
import { CDAAS_URL } from '@/constants'
import brotliPromise from 'brotli-dec-wasm'
import { notFound } from 'next/navigation'
import { JourneyRankRetentionChart } from '@/app/resources/tech-investment-planning-dashboard/components/panels/JourneyRankRetentionChart'
import { DeltaBreakdownChart } from '@/app/resources/tech-investment-planning-dashboard/components/panels/DeltaBreakdownChart'

const CDN_BASE = `${CDAAS_URL}/enterprise-architecture/planning_process`

// Epics belonging to these LOBs are test data and must never appear in the dashboard
const EXCLUDED_LOBS = new Set(['LOB A'])
const MAPPING_URL = `${CDN_BASE}/mappings.csv.br`
const JOURNEY_REC_URL = `${CDN_BASE}/journey_ai_recommendations.csv.br`
const CAP_REC_URL = `${CDN_BASE}/capabilities_ai_recommendations.csv.br`
const HISTORY_URL = `${CDN_BASE}/history.csv.br`
const STRATEGIC_EPICS_URL = `${CDN_BASE}/StrategicEpics.json.br`

export function ApptioDashboard() {
    const [strategicEpics, setStrategicEpics] = useState<StrategicEpic[]>([])
    const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS)
    const [systemExceptionsMode, setSystemExceptionsMode] =
        useState<SystemExceptionsMode>(DEFAULT_SYSTEM_EXCEPTIONS_MODE)

    const { loggedInUserEmail } = useUserDetails()
    const pilotGroupId = getPilotGroupId(
        'PLANNING_PROCESS_DASHBOARD_PILOT_GROUP'
    )
    const { pilotGroup, isLoading } = usePilotGroup(pilotGroupId)
    const apptioPilotGroupMembers = pilotGroup?.members || []

    useEffect(() => {
        if (
            !isLoading &&
            loggedInUserEmail &&
            apptioPilotGroupMembers &&
            apptioPilotGroupMembers.length > 0 &&
            !apptioPilotGroupMembers.some(
                member => member === loggedInUserEmail.toLowerCase()
            )
        ) {
            notFound()
        }
    }, [isLoading, loggedInUserEmail, apptioPilotGroupMembers])

    const { phase, pct, metrics, epicRows, epicDetails, epicActors, error } =
        useCsvProcessor(MAPPING_URL, JOURNEY_REC_URL, CAP_REC_URL, HISTORY_URL)

    useEffect(() => {
        Promise.all([fetch(STRATEGIC_EPICS_URL), brotliPromise])
            .then(async ([res, brotli]) => {
                const compressed = new Uint8Array(await res.arrayBuffer())
                const decompressed = brotli.decompress(compressed)
                const text = new TextDecoder().decode(decompressed)
                const data: StrategicEpic[] = JSON.parse(text)
                setStrategicEpics(Array.isArray(data) ? data : [])
            })
            .catch(() => setStrategicEpics([]))
    }, [])

    const cleanedStrategicEpics = useMemo(
        () =>
            strategicEpics.filter(e => {
                if (EXCLUDED_LOBS.has(e.requestingLOB)) return false
                if (EXCLUDED_LOBS.has(e.sponsoringLOB)) return false
                if (
                    e.impactedLOB &&
                    e.impactedLOB
                        .split(',')
                        .map(s => s.trim())
                        .some(lob => EXCLUDED_LOBS.has(lob))
                )
                    return false
                return true
            }),
        [strategicEpics]
    )

    const strategicEpicsCount =
        cleanedStrategicEpics.length > 0 ? cleanedStrategicEpics.length : null

    const filteredEpicIds = useMemo(() => {
        const {
            createdBy,
            planningCycle,
            createdDateFrom,
            createdDateTo,
            requestingLOB,
            impactedLOB,
            sponsoringLOB,
            investmentCategory,
            demandGroup
        } = filters

        const hasFilter =
            createdBy.length > 0 ||
            planningCycle.length > 0 ||
            createdDateFrom !== null ||
            createdDateTo !== null ||
            requestingLOB.length > 0 ||
            impactedLOB.length > 0 ||
            sponsoringLOB.length > 0 ||
            investmentCategory.length > 0 ||
            demandGroup.length > 0

        if (!hasFilter) return null

        const ids = new Set<string>()
        for (const epic of cleanedStrategicEpics) {
            if (createdBy.length > 0 && !createdBy.includes(epic.createdBy))
                continue
            if (planningCycle.length > 0) {
                const epicCycles = Array.isArray(epic.planningCycle)
                    ? epic.planningCycle
                    : []
                if (!planningCycle.some(c => epicCycles.includes(c))) continue
            }
            if (createdDateFrom !== null || createdDateTo !== null) {
                const epicDate = epic.createdDate
                    ? new Date(epic.createdDate)
                    : null
                if (!epicDate) continue
                if (createdDateFrom && epicDate < createdDateFrom) continue
                if (createdDateTo && epicDate > createdDateTo) continue
            }
            if (
                requestingLOB.length > 0 &&
                !requestingLOB.includes(epic.requestingLOB)
            )
                continue
            if (
                sponsoringLOB.length > 0 &&
                !sponsoringLOB.includes(epic.sponsoringLOB)
            )
                continue
            if (
                investmentCategory.length > 0 &&
                !investmentCategory.includes(epic.investmentCategory)
            )
                continue
            if (
                demandGroup.length > 0 &&
                !demandGroup.includes(epic.demandGroup)
            )
                continue
            if (impactedLOB.length > 0) {
                const epicLOBs = epic.impactedLOB
                    ? epic.impactedLOB.split(',').map(s => s.trim())
                    : []
                if (!impactedLOB.some(lob => epicLOBs.includes(lob))) continue
            }
            ids.add(String(epic.id))
        }
        return ids
    }, [cleanedStrategicEpics, filters])

    const cleanedEpicIds = useMemo(
        () => new Set(cleanedStrategicEpics.map(e => String(e.id))),
        [cleanedStrategicEpics]
    )

    const cleanedEpicRows = useMemo(
        () => (epicRows ?? []).filter(r => cleanedEpicIds.has(r.epicId)),
        [epicRows, cleanedEpicIds]
    )

    const filteredEpicRows = useMemo(() => {
        if (!filteredEpicIds) return cleanedEpicRows
        return cleanedEpicRows.filter(r => filteredEpicIds.has(r.epicId))
    }, [filteredEpicIds, cleanedEpicRows])

    const filteredMetrics = useMemo(() => {
        if (!metrics || !epicRows) return metrics
        if (!filteredEpicIds)
            return recomputeMetrics(
                cleanedEpicRows,
                epicDetails ?? {},
                cleanedEpicRows.length,
                systemExceptionsMode
            )
        return recomputeMetrics(
            filteredEpicRows,
            epicDetails ?? {},
            cleanedEpicRows.length,
            systemExceptionsMode
        )
    }, [
        filteredEpicIds,
        filteredEpicRows,
        cleanedEpicRows,
        epicDetails,
        metrics,
        epicRows,
        systemExceptionsMode
    ])

    if (phase !== 'done' || !metrics) {
        return <LoadingScreen phase={phase} pct={pct} error={error} />
    }

    return (
        <DashboardProvider
            value={{
                metrics,
                filteredMetrics: filteredMetrics ?? metrics,
                epicRows: cleanedEpicRows,
                filteredEpicRows,
                epicDetails,
                epicActors,
                strategicEpics: cleanedStrategicEpics,
                strategicEpicsCount,
                filters,
                setFilters,
                systemExceptionsMode,
                setSystemExceptionsMode
            }}
        >
            <Box px={{ base: 3, md: 6 }} py={4}>
                {/* Header */}
                <Flex
                    justify='space-between'
                    align='flex-start'
                    gap={3}
                    flexWrap='wrap'
                    mb={6}
                >
                    <Box>
                        <Text
                            fontSize='2xl'
                            fontWeight='bold'
                            color='text.emphasis'
                        >
                            Tech Investment Planning Dashboard
                        </Text>
                        <Text color='text.subtle' fontSize='sm' mt={0.5}>
                            AI suggestion adoption analytics across epics
                        </Text>
                    </Box>
                    <Flex align='center' gap={3} flexWrap='wrap'>
                        <SystemExceptionsToggle />
                        <TopItemsDialog />
                    </Flex>
                </Flex>

                {/* Row 1: Summary KPIs */}
                <Box mb={6}>
                    <SummaryCards />
                </Box>

                {/* Global Filters */}
                <FilterBar />

                {/* Row 2: Journey Rank Retention + AI Adoption */}
                <Grid
                    templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                    gap={6}
                    mb={6}
                >
                    {/* <JourneyRankRetentionChart /> */}
                    <AIAdoptionChart />
                    <RetentionRateChart />
                </Grid>

                {/* Row 3: Retention Rate + Delta Breakdown */}
                <Grid
                    templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                    gap={6}
                    mb={6}
                >
                    <JourneyRankRetentionChart />
                    <DeltaBreakdownChart />
                </Grid>

                {/* Row 4: Epic Detail Table */}
                <EpicDetailTable />
            </Box>
        </DashboardProvider>
    )
}
