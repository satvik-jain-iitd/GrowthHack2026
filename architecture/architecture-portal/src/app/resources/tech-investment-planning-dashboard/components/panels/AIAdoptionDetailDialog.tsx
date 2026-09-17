/* istanbul ignore file */
'use client'
import { useState, useMemo } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Flex,
    Portal,
    Tabs,
    Text
} from '@chakra-ui/react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LabelList,
    ResponsiveContainer
} from 'recharts'
import { useTheme } from 'next-themes'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import {
    JOURNEY_COLOR,
    CAP_COLOR
} from '@/app/resources/tech-investment-planning-dashboard/components/panels/chartColors'
import type {
    EpicSummaryRow,
    StrategicEpic
} from '@/app/resources/tech-investment-planning-dashboard/types'
import { SHOW_METRIC_DEBUG_INFO } from '@/app/resources/tech-investment-planning-dashboard/types'
import { formatMetricDebugInfo } from '@/app/resources/tech-investment-planning-dashboard/utils/metricDebug'

type SortMode = 'retention' | 'epicCount'

function retentionByDimension(
    rows: EpicSummaryRow[],
    epicMap: Map<string, StrategicEpic>,
    dimKey: 'requestingLOB' | 'investmentCategory' | 'demandGroup',
    hasRec: (r: EpicSummaryRow) => boolean,
    inScope: (r: EpicSummaryRow) => boolean,
    sortMode: SortMode
) {
    const groups = new Map<
        string,
        { has: number; total: number; rawTotal: number }
    >()
    for (const r of rows) {
        const epic = epicMap.get(r.epicId)
        const key = epic?.[dimKey] || 'Unknown'
        const g = groups.get(key) ?? { has: 0, total: 0, rawTotal: 0 }
        g.rawTotal++
        if (inScope(r)) {
            g.total++
            if (hasRec(r)) g.has++
        }
        groups.set(key, g)
    }
    return Array.from(groups.entries())
        .map(([name, { has, total, rawTotal }]) => ({
            name,
            pct: total > 0 ? Math.round((has / total) * 100) : 0,
            count: has,
            total,
            rawTotal
        }))
        .sort((a, b) =>
            sortMode === 'epicCount' ? b.total - a.total : b.pct - a.pct
        )
}

const SORT_OPTIONS: { mode: SortMode; label: string }[] = [
    { mode: 'retention', label: 'Retention %' },
    { mode: 'epicCount', label: 'Epic Count' }
]

function SortModeToggle({
    sortMode,
    setSortMode
}: {
    sortMode: SortMode
    setSortMode: (mode: SortMode) => void
}) {
    return (
        <Flex
            display='inline-flex'
            borderRadius='md'
            border='1px solid'
            borderColor='border.subtle'
            overflow='hidden'
        >
            {SORT_OPTIONS.map(({ mode, label }, i) => {
                const active = sortMode === mode
                return (
                    <Button
                        key={mode}
                        size='sm'
                        borderRadius='0'
                        borderLeftWidth={i > 0 ? '1px' : '0'}
                        borderLeftColor='border.subtle'
                        variant={active ? 'solid' : 'ghost'}
                        colorPalette={active ? 'blue' : 'gray'}
                        onClick={() => setSortMode(mode)}
                    >
                        {label}
                    </Button>
                )
            })}
        </Flex>
    )
}

const journeyHasRec = (r: EpicSummaryRow) =>
    r.recJourneyCount > 0 && r.recJourneyCount - r.removedJourneys > 0

const capHasRec = (r: EpicSummaryRow) =>
    r.recCapabilityCount > 0 && r.recCapabilityCount - r.removedCapabilities > 0

type BarDatum = {
    name: string
    pct: number
    count: number
    total: number
    rawTotal: number
}

const MAX_LABEL = 24

function truncate(s: string) {
    return s.length > MAX_LABEL ? s.slice(0, MAX_LABEL) + '…' : s
}

function CustomYTick({
    x,
    y,
    payload,
    dark
}: {
    x?: number
    y?: number
    payload?: { value: string }
    dark: boolean
}) {
    const full = payload?.value ?? ''
    const label = truncate(full)
    return (
        <text
            x={x}
            y={y}
            dy={4}
            textAnchor='end'
            fontSize={11}
            fill={dark ? '#d1d5db' : '#374151'}
        >
            {label.length < full.length && <title>{full}</title>}
            {label}
        </text>
    )
}

function RetentionBarChart({
    data,
    tooltipStyle,
    dark,
    barColor
}: {
    data: BarDatum[]
    tooltipStyle: React.CSSProperties
    dark: boolean
    barColor: string
}) {
    const height = Math.max(150, 200 + data.length * 36)
    return (
        <ResponsiveContainer width='100%' height={height}>
            <BarChart
                data={data}
                layout='vertical'
                margin={{ top: 4, right: 56, bottom: 4, left: 8 }}
            >
                <XAxis
                    type='number'
                    domain={[0, 100]}
                    tickFormatter={v => `${v}%`}
                    tick={{ fontSize: 11, fill: dark ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis
                    type='category'
                    dataKey='name'
                    width={200}
                    interval={0}
                    tick={props => <CustomYTick {...props} dark={dark} />}
                />
                <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: dark ? '#374151' : '#f3f4f6' }}
                    labelFormatter={(label: string) => label}
                    formatter={(value, _name, props) => {
                        const { count, total, pct, rawTotal } =
                            props.payload as BarDatum
                        const base = `${count} of ${total} epics (${pct}%)`
                        if (!SHOW_METRIC_DEBUG_INFO) return [base, 'Retained']
                        return [
                            `${base} — ${formatMetricDebugInfo(count, total, rawTotal)}`,
                            'Retained'
                        ]
                    }}
                    labelStyle={{ color: dark ? '#f9fafb' : '#111827' }}
                />
                <Bar dataKey='pct' fill={barColor} radius={[0, 4, 4, 0]}>
                    <LabelList
                        dataKey='pct'
                        position='right'
                        formatter={(v: number) => `${v}%`}
                        style={{
                            fontSize: 11,
                            fill: dark ? '#d1d5db' : '#374151'
                        }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

function DimensionSection({
    title,
    data,
    tooltipStyle,
    dark,
    barColor
}: {
    title: string
    data: BarDatum[]
    tooltipStyle: React.CSSProperties
    dark: boolean
    barColor: string
}) {
    return (
        <Box mb={6}>
            <Text
                fontWeight='semibold'
                fontSize='sm'
                color='text.emphasis'
                mb={2}
            >
                {title}
            </Text>
            {data.length === 0 ? (
                <Text fontSize='sm' color='text.subtle'>
                    No data
                </Text>
            ) : (
                <RetentionBarChart
                    data={data}
                    tooltipStyle={tooltipStyle}
                    dark={dark}
                    barColor={barColor}
                />
            )}
        </Box>
    )
}

export function AIAdoptionDetailDialog() {
    const [open, setOpen] = useState(false)
    const [sortMode, setSortMode] = useState<SortMode>('retention')
    const { filteredEpicRows, strategicEpics, systemExceptionsMode } =
        useDashboard()
    const { resolvedTheme } = useTheme()
    const dark = resolvedTheme === 'dark'
    const withExceptions = systemExceptionsMode === 'with_system_exceptions'

    const tooltipStyle: React.CSSProperties = dark
        ? {
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: 8
          }
        : {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8
          }

    const epicMap = useMemo(() => {
        const m = new Map<string, StrategicEpic>()
        for (const e of strategicEpics) m.set(String(e.id), e)
        return m
    }, [strategicEpics])

    const submitted = useMemo(
        () => filteredEpicRows.filter(r => r.status === 'submitted'),
        [filteredEpicRows]
    )

    const journeyByLOB = useMemo(
        () =>
            retentionByDimension(
                submitted,
                epicMap,
                'requestingLOB',
                journeyHasRec,
                r => withExceptions || r.recJourneyCount > 0,
                sortMode
            ),
        [submitted, epicMap, withExceptions, sortMode]
    )
    const journeyByCategory = useMemo(
        () =>
            retentionByDimension(
                submitted,
                epicMap,
                'investmentCategory',
                journeyHasRec,
                r => withExceptions || r.recJourneyCount > 0,
                sortMode
            ),
        [submitted, epicMap, withExceptions, sortMode]
    )
    const journeyByDemand = useMemo(
        () =>
            retentionByDimension(
                submitted,
                epicMap,
                'demandGroup',
                journeyHasRec,
                r => withExceptions || r.recJourneyCount > 0,
                sortMode
            ),
        [submitted, epicMap, withExceptions, sortMode]
    )

    const capByLOB = useMemo(
        () =>
            retentionByDimension(
                submitted,
                epicMap,
                'requestingLOB',
                capHasRec,
                r => withExceptions || r.recCapabilityCount > 0,
                sortMode
            ),
        [submitted, epicMap, withExceptions, sortMode]
    )
    const capByCategory = useMemo(
        () =>
            retentionByDimension(
                submitted,
                epicMap,
                'investmentCategory',
                capHasRec,
                r => withExceptions || r.recCapabilityCount > 0,
                sortMode
            ),
        [submitted, epicMap, withExceptions, sortMode]
    )
    const capByDemand = useMemo(
        () =>
            retentionByDimension(
                submitted,
                epicMap,
                'demandGroup',
                capHasRec,
                r => withExceptions || r.recCapabilityCount > 0,
                sortMode
            ),
        [submitted, epicMap, withExceptions, sortMode]
    )

    return (
        <>
            <Button size='sm' variant='outline' onClick={() => setOpen(true)}>
                See Breakdown
            </Button>

            <Dialog.Root
                open={open}
                onOpenChange={e => {
                    if (!e.open) setOpen(false)
                }}
                size='xl'
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content
                            maxW={{
                                base: 'calc(100vw - 24px)',
                                sm: '3xl',
                                lg: '5xl'
                            }}
                            maxH='90vh'
                            display='flex'
                            flexDir='column'
                        >
                            <Dialog.Header
                                borderBottomWidth='1px'
                                borderColor='border.subtle'
                            >
                                <Dialog.Title
                                    fontSize='lg'
                                    fontWeight='semibold'
                                    color='text.emphasis'
                                >
                                    AI Retention Breakdown
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size='sm' />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>

                            <Dialog.Body overflowY='auto' p={0}>
                                <Tabs.Root defaultValue='journeys'>
                                    <Flex
                                        justify='space-between'
                                        align='center'
                                        gap={3}
                                        flexWrap='wrap'
                                        px={6}
                                        pt={3}
                                    >
                                        <Tabs.List>
                                            <Tabs.Trigger value='journeys'>
                                                Journeys
                                            </Tabs.Trigger>
                                            <Tabs.Trigger value='capabilities'>
                                                Capabilities
                                            </Tabs.Trigger>
                                        </Tabs.List>
                                        <SortModeToggle
                                            sortMode={sortMode}
                                            setSortMode={setSortMode}
                                        />
                                    </Flex>

                                    <Tabs.Content
                                        value='journeys'
                                        px={{ base: 3, md: 6 }}
                                        pb={6}
                                    >
                                        <DimensionSection
                                            title='By Requesting LOB'
                                            data={journeyByLOB}
                                            tooltipStyle={tooltipStyle}
                                            dark={dark}
                                            barColor={JOURNEY_COLOR}
                                        />
                                        <DimensionSection
                                            title='By Investment Category'
                                            data={journeyByCategory}
                                            tooltipStyle={tooltipStyle}
                                            dark={dark}
                                            barColor={JOURNEY_COLOR}
                                        />
                                        <DimensionSection
                                            title='By Demand Group'
                                            data={journeyByDemand}
                                            tooltipStyle={tooltipStyle}
                                            dark={dark}
                                            barColor={JOURNEY_COLOR}
                                        />
                                    </Tabs.Content>

                                    <Tabs.Content
                                        value='capabilities'
                                        px={{ base: 3, md: 6 }}
                                        pb={6}
                                    >
                                        <DimensionSection
                                            title='By Requesting LOB'
                                            data={capByLOB}
                                            tooltipStyle={tooltipStyle}
                                            dark={dark}
                                            barColor={CAP_COLOR}
                                        />
                                        <DimensionSection
                                            title='By Investment Category'
                                            data={capByCategory}
                                            tooltipStyle={tooltipStyle}
                                            dark={dark}
                                            barColor={CAP_COLOR}
                                        />
                                        <DimensionSection
                                            title='By Demand Group'
                                            data={capByDemand}
                                            tooltipStyle={tooltipStyle}
                                            dark={dark}
                                            barColor={CAP_COLOR}
                                        />
                                    </Tabs.Content>
                                </Tabs.Root>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}
