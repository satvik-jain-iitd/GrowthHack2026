'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    LabelList,
    Legend
} from 'recharts'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from 'next-themes'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import {
    JOURNEY_COLOR,
    JOURNEY_COLOR_MUTED,
    JOURNEY_COLOR_DARK,
    CAP_COLOR,
    CAP_COLOR_MUTED,
    CAP_COLOR_DARK
} from '@/app/resources/tech-investment-planning-dashboard/components/panels/chartColors'

export function RetentionRateChart() {
    const { filteredEpicRows: epicRows } = useDashboard()
    const { resolvedTheme } = useTheme()
    const dark = resolvedTheme === 'dark'

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

    const submitted = epicRows.filter(r => r.status === 'submitted')
    const data = [1, 2, 3, 4, 5].map(n => ({
        label: `≥${n}`,
        journeys: submitted.filter(
            r =>
                r.recJourneyCount > 0 &&
                r.recJourneyCount - r.removedJourneys >= n
        ).length,
        caps: submitted.filter(
            r =>
                r.recCapabilityCount > 0 &&
                r.recCapabilityCount - r.removedCapabilities >= n
        ).length
    }))

    const labelFormatter = (v: unknown) =>
        typeof v === 'number' ? v.toLocaleString() : String(v)

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
                    ECJ &amp; EBC Count Retention
                </Text>
                <Tooltip
                    content='X-axis shows the minimum count threshold N (1–5). Y-axis counts how many Saved Strategic Epics retained at least that many AI-recommended items. Use this to understand how deeply users adopt AI suggestions — a steep drop from ≥1 to ≥2 indicates most users keep only one recommendation.'
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
                Number of Strategic Epics that retained at least N
                AI-recommended ECJs (green) or EBCs (blue)
            </Text>
            <ResponsiveContainer width='100%' height={290}>
                <BarChart
                    data={data}
                    margin={{ left: 0, right: 16, top: 4, bottom: 20 }}
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
                            value: 'AI Recommendations Retained (≥N)',
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
                    />
                    <Legend
                        formatter={value => (
                            <span
                                style={{
                                    color: dark ? '#d1d5db' : '#374151',
                                    fontSize: 12
                                }}
                            >
                                {value}
                            </span>
                        )}
                    />
                    <Bar
                        dataKey='journeys'
                        name='AI ECJs Kept'
                        fill={JOURNEY_COLOR}
                        radius={[4, 4, 0, 0]}
                    >
                        <LabelList
                            dataKey='journeys'
                            position='top'
                            style={{
                                fill: dark
                                    ? JOURNEY_COLOR_MUTED
                                    : JOURNEY_COLOR_DARK,
                                fontSize: 11
                            }}
                            formatter={labelFormatter}
                        />
                    </Bar>
                    <Bar
                        dataKey='caps'
                        name='AI EBCs Kept'
                        fill={CAP_COLOR}
                        radius={[4, 4, 0, 0]}
                    >
                        <LabelList
                            dataKey='caps'
                            position='top'
                            style={{
                                fill: dark ? CAP_COLOR_MUTED : CAP_COLOR_DARK,
                                fontSize: 11
                            }}
                            formatter={labelFormatter}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    )
}
