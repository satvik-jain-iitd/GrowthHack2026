/* istanbul ignore file */
'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    LabelList
} from 'recharts'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from 'next-themes'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import {
    JOURNEY_COLOR,
    JOURNEY_COLOR_MUTED,
    JOURNEY_COLOR_DARK
} from '@/app/resources/tech-investment-planning-dashboard/components/panels/chartColors'
import { SHOW_METRIC_DEBUG_INFO } from '@/app/resources/tech-investment-planning-dashboard/types'
import { formatMetricDebugInfo } from '@/app/resources/tech-investment-planning-dashboard/utils/metricDebug'

export function JourneyRankRetentionChart() {
    const {
        filteredMetrics: metrics,
        filteredEpicRows,
        systemExceptionsMode
    } = useDashboard()
    const { resolvedTheme } = useTheme()
    const dark = resolvedTheme === 'dark'
    const withExceptions = systemExceptionsMode === 'with_system_exceptions'

    const submittedTotal = filteredEpicRows.filter(
        r => r.status === 'submitted'
    ).length
    const submittedCount = filteredEpicRows.filter(
        r =>
            r.status === 'submitted' &&
            (withExceptions || r.recJourneyCount > 0)
    ).length

    const tooltipStyle = dark
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

    const data = [1, 2, 3, 4, 5].map((rank, i) => {
        const count = metrics.journeyRankRetention[i] ?? 0
        const pct =
            submittedCount > 0 ? Math.round((count / submittedCount) * 100) : 0
        return { label: `Rank ${rank}`, count, pct }
    })

    return (
        <Box
            bg='surface.foreground'
            border='1px solid'
            borderColor='border.subtle'
            borderRadius='xl'
            p={5}
        >
            <Flex align='center' justify='space-between' mb={1}>
                <Text fontWeight='semibold' color='text.emphasis'>
                    Enterprise Customer Journey Rank Retention
                </Text>
                <Tooltip
                    content='AI recommends ECJs in ranked order. Rank 1 is the most relevant recommendation. This chart shows how many Saved Strategic Epics retained each ranked ECJ. A steep drop from Rank 1 to Rank 2 suggests users mostly accept only the top recommendation.'
                    showArrow
                >
                    <Text
                        as='span'
                        fontSize='sm'
                        color='gray.400'
                        cursor='help'
                    >
                        ℹ
                    </Text>
                </Tooltip>
            </Flex>
            <Text color='text.subtle' fontSize='xs' mb={4}>
                How many Strategic Epics retained the AI-recommended ECJ at each
                rank position (Rank 1 = highest confidence)
            </Text>
            <ResponsiveContainer width='100%' height={270}>
                <BarChart
                    data={data}
                    margin={{ left: 0, right: 16, top: 24, bottom: 20 }}
                >
                    <CartesianGrid
                        strokeDasharray='3 3'
                        stroke={dark ? '#374151' : '#e5e7eb'}
                    />
                    <XAxis
                        dataKey='label'
                        stroke={dark ? '#6b7280' : '#9ca3af'}
                        tick={{
                            fill: dark ? '#d1d5db' : '#374151',
                            fontSize: 12
                        }}
                        label={{
                            value: 'ECJ Rank',
                            position: 'insideBottom',
                            offset: -2,
                            style: {
                                fill: dark ? '#9ca3af' : '#6b7280',
                                fontSize: 11
                            }
                        }}
                    />
                    <YAxis
                        stroke={dark ? '#6b7280' : '#9ca3af'}
                        tick={{
                            fill: dark ? '#9ca3af' : '#6b7280',
                            fontSize: 11
                        }}
                        allowDecimals={false}
                    />
                    <RechartsTooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: dark ? '#f9fafb' : '#111827' }}
                        itemStyle={{ color: JOURNEY_COLOR_MUTED }}
                        formatter={(v, name, props) => {
                            if (!SHOW_METRIC_DEBUG_INFO) return [v, name]
                            const datum = props.payload as { count: number }
                            return [
                                `${v} (${formatMetricDebugInfo(datum.count, submittedCount, submittedTotal)})`,
                                name
                            ]
                        }}
                    />
                    <Bar
                        dataKey='count'
                        fill={JOURNEY_COLOR}
                        radius={[4, 4, 0, 0]}
                    >
                        <LabelList
                            dataKey='count'
                            position='top'
                            content={({ x, y, width, value, index }) => {
                                const pct =
                                    typeof index === 'number'
                                        ? (data[index]?.pct ?? 0)
                                        : 0
                                const label = `${typeof value === 'number' ? value.toLocaleString() : value} (${pct}%)`
                                return (
                                    <text
                                        x={Number(x) + Number(width) / 2}
                                        y={Number(y) - 6}
                                        textAnchor='middle'
                                        fill={
                                            dark
                                                ? JOURNEY_COLOR_MUTED
                                                : JOURNEY_COLOR_DARK
                                        }
                                        fontSize={11}
                                    >
                                        {label}
                                    </text>
                                )
                            }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    )
}
