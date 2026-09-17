/* istanbul ignore file */
'use client'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts'
import { Box, Text, Flex } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from 'next-themes'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import { AIAdoptionDetailDialog } from '@/app/resources/tech-investment-planning-dashboard/components/panels/AIAdoptionDetailDialog'
import {
    JOURNEY_COLOR,
    CAP_COLOR,
    NEUTRAL_COLOR
} from '@/app/resources/tech-investment-planning-dashboard/components/panels/chartColors'
import { SHOW_METRIC_DEBUG_INFO } from '@/app/resources/tech-investment-planning-dashboard/types'
import { formatMetricDebugInfo } from '@/app/resources/tech-investment-planning-dashboard/utils/metricDebug'

export function AIAdoptionChart() {
    const {
        filteredEpicRows,
        filteredMetrics: metrics,
        systemExceptionsMode
    } = useDashboard()
    const { resolvedTheme } = useTheme()
    const dark = resolvedTheme === 'dark'
    const withExceptions = systemExceptionsMode === 'with_system_exceptions'

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

    const submitted = filteredEpicRows.filter(r => r.status === 'submitted')

    const journeyScope = submitted.filter(
        r => withExceptions || r.recJourneyCount > 0
    )
    const journeyHas = journeyScope.filter(
        r => r.recJourneyCount > 0 && r.recJourneyCount - r.removedJourneys > 0
    ).length
    const journeyData = [
        {
            name: 'Has saved recs',
            value: journeyHas,
            num: journeyHas,
            den: journeyScope.length,
            total: submitted.length
        },
        {
            name: 'No saved recs',
            value: journeyScope.length - journeyHas,
            num: journeyHas,
            den: journeyScope.length,
            total: submitted.length
        }
    ]

    const capScope = submitted.filter(
        r => withExceptions || r.recCapabilityCount > 0
    )
    const capHas = capScope.filter(
        r =>
            r.recCapabilityCount > 0 &&
            r.recCapabilityCount - r.removedCapabilities > 0
    ).length
    const capData = [
        {
            name: 'Has saved recs',
            value: capHas,
            num: capHas,
            den: capScope.length,
            total: submitted.length
        },
        {
            name: 'No saved recs',
            value: capScope.length - capHas,
            num: capHas,
            den: capScope.length,
            total: submitted.length
        }
    ]

    void metrics

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
                    AI Suggestion Adoption
                </Text>
                <Flex align='center' gap={2}>
                    <AIAdoptionDetailDialog />
                    <Tooltip
                        content="For each Saved Strategic Epic, 'adoption' means at least one AI-recommended ECJ or EBC was retained in the final submission. Inner ring = ECJ adoption rate. Outer ring = EBC adoption rate. Gray slices = epics with no AI recs retained."
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
            </Flex>
            <Text color='text.subtle' fontSize='xs' mb={4}>
                Share of Saved Strategic Epics where the user kept at least one
                AI-recommended ECJ (inner ring) or EBC (outer ring)
            </Text>
            <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                    <Pie
                        data={journeyData}
                        cx='50%'
                        cy='50%'
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey='value'
                        name='Journeys'
                    >
                        {journeyData.map((_, i) => (
                            <Cell
                                key={i}
                                fill={i === 0 ? JOURNEY_COLOR : NEUTRAL_COLOR}
                            />
                        ))}
                    </Pie>
                    <Pie
                        data={capData}
                        cx='50%'
                        cy='50%'
                        innerRadius={92}
                        outerRadius={122}
                        paddingAngle={2}
                        dataKey='value'
                        name='Capabilities'
                    >
                        {capData.map((_, i) => (
                            <Cell
                                key={i}
                                fill={i === 0 ? CAP_COLOR : NEUTRAL_COLOR}
                            />
                        ))}
                    </Pie>
                    <RechartsTooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: dark ? '#f9fafb' : '#111827' }}
                        formatter={(v, name, props) => {
                            const base =
                                typeof v === 'number' ? v.toLocaleString() : v
                            if (!SHOW_METRIC_DEBUG_INFO) return [base, name]
                            const datum = props.payload as {
                                num: number
                                den: number
                                total: number
                            }
                            return [
                                `${base} (${formatMetricDebugInfo(datum.num, datum.den, datum.total)})`,
                                name
                            ]
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <Flex direction='column' gap={1} align='center' mt={2}>
                <Flex gap={4} justify='center' flexWrap='wrap'>
                    <Flex align='center' gap={2}>
                        <Box
                            w={3}
                            h={3}
                            borderRadius='full'
                            bg={JOURNEY_COLOR}
                        />
                        <Text fontSize='xs' color='text.subtle'>
                            ECJs – has saved recs
                        </Text>
                    </Flex>
                    <Flex align='center' gap={2}>
                        <Box
                            w={3}
                            h={3}
                            borderRadius='full'
                            bg={NEUTRAL_COLOR}
                        />
                        <Text fontSize='xs' color='text.subtle'>
                            No saved recs
                        </Text>
                    </Flex>
                </Flex>
                <Flex gap={4} justify='center' flexWrap='wrap'>
                    <Flex align='center' gap={2}>
                        <Box w={3} h={3} borderRadius='full' bg={CAP_COLOR} />
                        <Text fontSize='xs' color='text.subtle'>
                            EBCs – has saved recs
                        </Text>
                    </Flex>
                    <Flex align='center' gap={2}>
                        <Box
                            w={3}
                            h={3}
                            borderRadius='full'
                            bg={NEUTRAL_COLOR}
                        />
                        <Text fontSize='xs' color='text.subtle'>
                            No saved recs
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Text fontSize='xs' color='text.subtle' textAlign='center' mt={1}>
                Inner ring = ECJs · Outer ring = EBCs
            </Text>
        </Box>
    )
}
