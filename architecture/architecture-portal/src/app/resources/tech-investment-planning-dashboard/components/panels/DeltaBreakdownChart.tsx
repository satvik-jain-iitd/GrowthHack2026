/* istanbul ignore file */
'use client'
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
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
    JOURNEY_COLOR_DARK,
    CAP_COLOR,
    CAP_COLOR_MUTED,
    CAP_COLOR_DARK
} from '@/app/resources/tech-investment-planning-dashboard/components/panels/chartColors'

export function DeltaBreakdownChart() {
    const { filteredMetrics: metrics } = useDashboard()
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
            category: 'ECJs',
            'AI rec. kept': metrics.totalKeptAiJourneys,
            'Added by user': metrics.totalAddedJourneys
            // 'Removed (AI rec.)': metrics.totalRemovedJourneys
        },
        {
            category: 'EBCs',
            'AI rec. kept': metrics.totalKeptAiCapabilities,
            'Added by user': metrics.totalAddedCapabilities
            // 'Removed (AI rec.)': metrics.totalRemovedCapabilities
        }
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
                    User Changes vs AI Recommendations
                </Text>
                <Tooltip
                    content="Compares the volume of AI-recommended items users kept vs items users added themselves. 'AI rec. kept' = items from the AI recommendation list that were saved. 'Added by user' = items not in the AI recommendations that the user manually added. Higher 'AI rec. kept' bars indicate strong AI adoption."
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
                Total ECJs and EBCs across all Saved Strategic Epics, split by
                source: AI-recommended (kept) vs user-added
            </Text>
            <ResponsiveContainer width='100%' height={300}>
                <BarChart
                    data={data}
                    margin={{ left: 0, right: 16, top: 24, bottom: 4 }}
                >
                    <CartesianGrid
                        strokeDasharray='3 3'
                        stroke={dark ? '#374151' : '#e5e7eb'}
                    />
                    <XAxis
                        dataKey='category'
                        stroke={dark ? '#6b7280' : '#9ca3af'}
                        tick={{
                            fill: dark ? '#d1d5db' : '#374151',
                            fontSize: 12
                        }}
                    />
                    <YAxis
                        stroke={dark ? '#6b7280' : '#9ca3af'}
                        tick={{
                            fill: dark ? '#9ca3af' : '#6b7280',
                            fontSize: 11
                        }}
                    />
                    <RechartsTooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: dark ? '#f9fafb' : '#111827' }}
                        formatter={v =>
                            typeof v === 'number' ? v.toLocaleString() : v
                        }
                    />
                    <Legend
                        content={() => (
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 16,
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    marginTop: 4
                                }}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 12,
                                        color: dark ? '#d1d5db' : '#374151'
                                    }}
                                >
                                    <svg width={12} height={12}>
                                        <rect
                                            width={12}
                                            height={12}
                                            rx={2}
                                            fill={JOURNEY_COLOR}
                                        />
                                    </svg>
                                    ECJs – AI rec. kept
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 12,
                                        color: dark ? '#d1d5db' : '#374151'
                                    }}
                                >
                                    <svg width={12} height={12}>
                                        <rect
                                            width={12}
                                            height={12}
                                            rx={2}
                                            fill={JOURNEY_COLOR_MUTED}
                                        />
                                    </svg>
                                    ECJs – Added by user
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 12,
                                        color: dark ? '#d1d5db' : '#374151'
                                    }}
                                >
                                    <svg width={12} height={12}>
                                        <rect
                                            width={12}
                                            height={12}
                                            rx={2}
                                            fill={CAP_COLOR}
                                        />
                                    </svg>
                                    EBCs – AI rec. kept
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 12,
                                        color: dark ? '#d1d5db' : '#374151'
                                    }}
                                >
                                    <svg width={12} height={12}>
                                        <rect
                                            width={12}
                                            height={12}
                                            rx={2}
                                            fill={CAP_COLOR_MUTED}
                                        />
                                    </svg>
                                    EBCs – Added by user
                                </span>
                            </div>
                        )}
                    />
                    <Bar dataKey='AI rec. kept' radius={[4, 4, 0, 0]}>
                        {data.map((_, i) => (
                            <Cell
                                key={i}
                                fill={i === 0 ? JOURNEY_COLOR : CAP_COLOR}
                            />
                        ))}
                        <LabelList
                            dataKey='AI rec. kept'
                            position='top'
                            content={({ x, y, width, value, index }) => {
                                const fill = dark
                                    ? index === 0
                                        ? JOURNEY_COLOR_MUTED
                                        : CAP_COLOR_MUTED
                                    : index === 0
                                      ? JOURNEY_COLOR_DARK
                                      : CAP_COLOR_DARK
                                return (
                                    <text
                                        x={Number(x) + Number(width) / 2}
                                        y={Number(y) - 6}
                                        textAnchor='middle'
                                        fill={fill}
                                        fontSize={11}
                                    >
                                        {typeof value === 'number'
                                            ? value.toLocaleString()
                                            : String(value)}
                                    </text>
                                )
                            }}
                        />
                    </Bar>
                    <Bar dataKey='Added by user' radius={[4, 4, 0, 0]}>
                        {data.map((_, i) => (
                            <Cell
                                key={i}
                                fill={
                                    i === 0
                                        ? JOURNEY_COLOR_MUTED
                                        : CAP_COLOR_MUTED
                                }
                            />
                        ))}
                        <LabelList
                            dataKey='Added by user'
                            position='top'
                            content={({ x, y, width, value, index }) => {
                                const fill = dark
                                    ? index === 0
                                        ? JOURNEY_COLOR_MUTED
                                        : CAP_COLOR_MUTED
                                    : index === 0
                                      ? JOURNEY_COLOR_DARK
                                      : CAP_COLOR_DARK
                                return (
                                    <text
                                        x={Number(x) + Number(width) / 2}
                                        y={Number(y) - 6}
                                        textAnchor='middle'
                                        fill={fill}
                                        fontSize={11}
                                    >
                                        {typeof value === 'number'
                                            ? value.toLocaleString()
                                            : String(value)}
                                    </text>
                                )
                            }}
                        />
                    </Bar>
                    {/* <Bar
                        dataKey='Removed (AI rec.)'
                        fill='#ef4444'
                        radius={[4, 4, 0, 0]}
                    >
                        <LabelList
                            dataKey='Removed (AI rec.)'
                            position='top'
                            style={{
                                fill: dark ? '#fca5a5' : '#ef4444',
                                fontSize: 11
                            }}
                            formatter={(v: unknown) =>
                                typeof v === 'number'
                                    ? v.toLocaleString()
                                    : String(v)
                            }
                        />
                    </Bar> */}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    )
}
