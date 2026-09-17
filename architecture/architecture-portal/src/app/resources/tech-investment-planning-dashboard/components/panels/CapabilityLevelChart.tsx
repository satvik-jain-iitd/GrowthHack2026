'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from 'next-themes'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import {
    CAP_COLOR,
    CAP_COLOR_MUTED
} from '@/app/resources/tech-investment-planning-dashboard/components/panels/chartColors'

export function CapabilityLevelChart() {
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
            name: 'AI Recommended',
            'Level 3': metrics.capLevelDistRec.level3,
            'Level 4': metrics.capLevelDistRec.level4
        },
        {
            name: 'User Saved',
            'Level 3': metrics.capLevelDistMapping.level3,
            'Level 4': metrics.capLevelDistMapping.level4
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
                    EBC Level Distribution
                </Text>
                <Tooltip
                    content='Compares the mix of EBC maturity levels between what AI recommended and what users actually saved. Level 3 EBCs are more foundational; Level 4 are more advanced. A gap between AI recommendations and user submissions may indicate user preference for a different maturity tier.'
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
                Distribution of Level 3 vs Level 4 EBCs: AI-recommended vs
                user-submitted
            </Text>
            <ResponsiveContainer width='100%' height={260}>
                <BarChart
                    data={data}
                    margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
                >
                    <CartesianGrid
                        strokeDasharray='3 3'
                        stroke={dark ? '#374151' : '#e5e7eb'}
                    />
                    <XAxis
                        dataKey='name'
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
                        tickFormatter={(v: number) =>
                            `${(v / 1000).toFixed(0)}k`
                        }
                    />
                    <RechartsTooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: dark ? '#f9fafb' : '#111827' }}
                        formatter={v =>
                            typeof v === 'number' ? v.toLocaleString() : v
                        }
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
                    <Bar dataKey='Level 3' stackId='a' fill={CAP_COLOR_MUTED} />
                    <Bar
                        dataKey='Level 4'
                        stackId='a'
                        fill={CAP_COLOR}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    )
}
