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
    Cell,
    LabelList
} from 'recharts'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from 'next-themes'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'

export function SubmissionFunnelChart() {
    const { metrics } = useDashboard()
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

    const data = [
        {
            name: 'Epics with Recommendations',
            value: metrics.totalEpicsInRecommendations,
            fill: '#64748b'
        },
        {
            name: 'Flow Initiated',
            value: metrics.totalEpicsInitiated,
            fill: '#3b82f6'
        },
        {
            name: 'Saved to Apptio',
            value: metrics.submitted,
            fill: '#22c55e'
        },
        { name: 'Abandoned', value: metrics.abandoned, fill: '#f59e0b' }
    ]

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
                    Submission Funnel
                </Text>
                <Tooltip
                    content="This funnel shows the volume of Strategic Epics at each stage of the AI planning process. 'Epics with Recommendations' = total SEs in the AI recommendation dataset. 'Flow Initiated' = users who opened the planning tool. 'Saved to Apptio' = successful submissions. 'Abandoned' = initiated but never saved. Use this to identify drop-off points."
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
                How Strategic Epics progress from AI recommendation generation
                through to being saved in Apptio
            </Text>
            <ResponsiveContainer width='100%' height={260}>
                <BarChart
                    data={data}
                    layout='vertical'
                    margin={{ left: 8, right: 40, top: 4, bottom: 4 }}
                >
                    <CartesianGrid
                        strokeDasharray='3 3'
                        stroke={dark ? '#374151' : '#e5e7eb'}
                        horizontal={false}
                    />
                    <XAxis
                        type='number'
                        stroke={dark ? '#6b7280' : '#9ca3af'}
                        tick={{
                            fill: dark ? '#9ca3af' : '#6b7280',
                            fontSize: 11
                        }}
                    />
                    <YAxis
                        type='category'
                        dataKey='name'
                        width={160}
                        stroke={dark ? '#6b7280' : '#9ca3af'}
                        tick={{
                            fill: dark ? '#d1d5db' : '#374151',
                            fontSize: 11
                        }}
                    />
                    <RechartsTooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: dark ? '#f9fafb' : '#111827' }}
                        itemStyle={{ color: '#93c5fd' }}
                        formatter={v => [
                            typeof v === 'number' ? v.toLocaleString() : v,
                            'Epics'
                        ]}
                    />
                    <Bar dataKey='value' radius={[0, 4, 4, 0]}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                        ))}
                        <LabelList
                            dataKey='value'
                            position='right'
                            style={{
                                fill: dark ? '#d1d5db' : '#374151',
                                fontSize: 12
                            }}
                            formatter={(v: unknown) =>
                                typeof v === 'number'
                                    ? v.toLocaleString()
                                    : String(v)
                            }
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    )
}
