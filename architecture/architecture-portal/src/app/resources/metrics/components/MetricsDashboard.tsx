/* istanbul ignore file */
import React, { useEffect, useState } from 'react'
import {
    Flex,
    Box,
    IconButton,
    useDisclosure,
    Text,
    Skeleton,
    Grid,
    GridItem
} from '@chakra-ui/react'
import { IconExpand } from '@americanexpress/dls-icons'
import PieChartWithLegend from './PieChartWithLegend'
import { useMetricsHeaderData } from '../hooks'
import { MetricsApiCount } from '../types/MetricsApiCount'
import {
    EtpEcmiCrossDomainApiRow,
    EtpEcmiCrossDomainSummary,
    EtpEcmiUnitCioGroupRow
} from '../types'
import { CHART_COLORS, HEADER_OBJECT, HEIGHT } from '../constants'
import MetricsActionBar from './MetricsActionBar'
import { Tooltip } from '@/components/ui'
import MetricsCard from './MetricCard'
import MetricsModal from './MetricsModal'
import { Domain } from '@/app/company-domains/types'

export default function MetricsDashboard({
    metricParams,
    groupedData,
    domainGroupedData,
    crossDomainRows = [],
    crossDomainSummary = null,
    handleGroupChange,
    handleSearch,
    companyDomains: domains
}: {
    metricParams: { view: string; selectedGroup: string; search: string }
    groupedData: MetricsApiCount[]
    domainGroupedData: MetricsApiCount[]
    // both shapes carry the API totals the chart sums, so grouped rows work as-is
    crossDomainRows?: (EtpEcmiCrossDomainApiRow | EtpEcmiUnitCioGroupRow)[]
    crossDomainSummary?: EtpEcmiCrossDomainSummary | null
    handleGroupChange: (a: string) => void
    handleSearch: (val: string) => void
    companyDomains: Domain[] | undefined
}) {
    const { view, selectedGroup } = metricParams || {}

    const { open, onOpen, onClose } = useDisclosure()
    const [chartData, setChartData] = useState<
        { value: number | string; title: string; color: string }[]
    >([])
    const [domainChart, setDomainChart] = useState<
        { value: number | string; title: string; color: string }[]
    >([])
    const [initiativeChart, setInitiativeChart] = useState<
        { value: number | string; title: string; color: string }[]
    >([])
    const [statusChart, setStatusChart] = useState<
        { value: number | string; title: string; color: string }[]
    >([])
    const { headerCount: metricsData, loading } = useMetricsHeaderData(view)

    const isECMIMetric = view === 'metric1'
    const isAPIMetric = view === 'metric2'
    const isCrossDomainMetric = view === 'metric3'
    const metrics = isECMIMetric
        ? HEADER_OBJECT?.metric1
        : isAPIMetric
          ? HEADER_OBJECT?.metric2
          : []
    const cardTextColor = { _dark: 'white', base: 'black' }

    const companyDomainsCount = domains?.filter(
        x => x.domain_category_nm !== 'Others'
    ).length

    useEffect(() => {
        if (!isCrossDomainMetric) return

        const totals = crossDomainRows.reduce(
            (acc, item) => {
                acc.identified += +(item.identified_apis || 0)
                acc.crossDomain += +(item.earb_approved_type_ab || 0)
                return acc
            },
            { identified: 0, crossDomain: 0 }
        )
        const { earbApproved, designCertified, prodCertified } =
            crossDomainSummary?.statusDistribution || {}

        setChartData([
            {
                title: 'Type A / B APIs',
                value: totals.crossDomain,
                color: CHART_COLORS[0]
            },
            {
                title: 'Uncertified APIs',
                value: Math.max(totals.identified - totals.crossDomain, 0),
                color: '#E53E3E'
            }
        ])
        setInitiativeChart([
            {
                title: 'ETP/ECMI with Identified Cross-Domain APIs',
                value: +(crossDomainSummary?.identifiedInitiatives || 0),
                color: CHART_COLORS[0]
            },
            {
                title: 'ETP/ECMI yet to Identify Cross-Domain APIs',
                value: +(crossDomainSummary?.notIdentifiedInitiatives || 0),
                color: '#9aa2ad'
            }
        ])
        setStatusChart([
            {
                title: 'EARB Approved',
                value: +(earbApproved || 0),
                color: '#F3780D'
            },
            {
                title: 'Design Certified',
                value: +(designCertified || 0),
                color: '#006FCF'
            },
            {
                title: 'Production Certified',
                value: +(prodCertified || 0),
                color: '#43A34C'
            }
        ])
    }, [isCrossDomainMetric, crossDomainRows, crossDomainSummary])

    useEffect(() => {
        if (selectedGroup === '' && metricsData) {
            const data =
                view === 'metric1'
                    ? [
                          {
                              title: 'ECMI Applications Mapped',
                              value: +(metricsData.mappedAppCount || 0),
                              color: CHART_COLORS[0]
                          },
                          {
                              title: 'ECMI Applications Not Mapped',
                              value:
                                  +(metricsData.appCount || 0) -
                                      +(metricsData.mappedAppCount || 0) || 0,
                              color: '#F3780D'
                          }
                      ]
                    : [
                          {
                              title: 'Production Certified APIs',
                              value: +(metricsData.prod_apis || 0),
                              color: CHART_COLORS[0]
                          },
                          {
                              title: 'Pending Production Certification',
                              value: Math.max(
                                  +(metricsData.earb_apis || 0) -
                                      +(metricsData.prod_apis || 0),
                                  0
                              ),
                              color: '#F3780D'
                          }
                      ]
            setChartData(data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metricsData, metricParams])

    useEffect(() => {
        if (selectedGroup && groupedData.length > 0) {
            const data = groupedData
                .map((item, index) => ({
                    title: isECMIMetric
                        ? item.ecmi || item.ownersvp || item.unitcio || ''
                        : item.domain || item.techowner || item.unitcio || '',
                    value: isECMIMetric
                        ? parseFloat(
                              parseFloat(
                                  (item.percentage || 0).toString()
                              ).toFixed(2)
                          )
                        : parseInt((item.prod_certified_apis || 0).toString()),
                    color: CHART_COLORS[index % CHART_COLORS.length],
                    view,
                    selectedGroup
                }))
                .filter(item => item.value > 0)

            setChartData(data)
            if (isAPIMetric && domainGroupedData.length > 0) {
                const domainData = domainGroupedData
                    .map((item, index) => ({
                        title: item.domain || '',
                        value: parseInt((item.earbTypeACumSum || 0).toString()),
                        color: CHART_COLORS[index % CHART_COLORS.length],
                        view,
                        selectedGroup
                    }))
                    .filter(item => item.value > 0)
                setDomainChart([
                    {
                        title: 'Company Domains with EARB Approved APIs',
                        value: domainData?.length || 0,
                        color: CHART_COLORS[0]
                    },
                    {
                        title: 'Company Domains pending EARB Approved APIs',
                        value: Math.max(
                            (companyDomainsCount || 0) - domainData?.length ||
                                0,
                            0
                        ),
                        color: '#FA700B'
                    }
                ])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metricParams, groupedData, domainGroupedData])

    return (
        <>
            {!isCrossDomainMetric && (
                <MetricsActionBar
                    metricParams={metricParams}
                    handleGroupChange={handleGroupChange}
                    handleSearch={handleSearch}
                />
            )}
            {loading && <Skeleton height='200px' width={'100%'} />}
            {!loading && (
                <Flex
                    direction={{ base: 'column', lg: 'row' }}
                    paddingTop='1rem'
                    paddingBottom={isCrossDomainMetric ? '0' : '1rem'}
                    paddingX='2rem'
                    gap='1rem'
                >
                    {!isCrossDomainMetric && (
                        <Flex
                            width={{
                                base: '100%',
                                lg: isECMIMetric ? '50%' : '40%'
                            }}
                            backgroundColor={{
                                base: 'white',
                                _dark: '#2D3748'
                            }}
                            height={HEIGHT}
                            gap={4}
                            direction='row'
                            borderRadius='8px'
                            position='relative'
                            paddingTop={'20px'}
                        >
                            <Box
                                className='metrics-header-title'
                                fontSize='20px'
                                fontWeight='bold'
                                color={cardTextColor}
                                top='8px'
                                left='20px'
                                position='absolute'
                            >
                                <Text>
                                    {isECMIMetric
                                        ? 'ECMI Applications Mapped'
                                        : 'Production Certified APIs'}
                                </Text>
                            </Box>

                            <IconButton
                                aria-label='Expand'
                                position='absolute'
                                top='8px'
                                right='8px'
                                size='sm'
                                background={'transparent'}
                                onClick={onOpen}
                            >
                                <IconExpand
                                    title='Expand icon'
                                    className='icon-blue-color'
                                    titleId='expand-icon-id'
                                />
                            </IconButton>
                            <PieChartWithLegend
                                selectedGroup={selectedGroup}
                                view={view}
                                chartData={chartData}
                            />
                        </Flex>
                    )}
                    {view === 'metric2' && (
                        <>
                            <Flex
                                width={{ base: '100%', lg: '30%' }}
                                backgroundColor={{
                                    base: 'white',
                                    _dark: '#2D3748'
                                }}
                                height={HEIGHT}
                                gap={4}
                                direction='row'
                                borderRadius='8px'
                                position='relative'
                                paddingTop={'20px'}
                            >
                                <Box
                                    className='metrics-header-title'
                                    fontSize='20px'
                                    fontWeight='bold'
                                    color={cardTextColor}
                                    top='8px'
                                    left='20px'
                                    position='absolute'
                                >
                                    <Text>
                                        Company Domains with EARB Approved APIs
                                    </Text>
                                </Box>
                                <PieChartWithLegend
                                    selectedGroup={selectedGroup}
                                    view={view}
                                    chartData={domainChart}
                                />
                            </Flex>
                            <Flex
                                direction='column'
                                w={{ base: '100%', lg: '30%' }}
                                flex='1'
                                h={HEIGHT}
                                bg={{
                                    base: 'white',
                                    _dark: '#2D3748'
                                }}
                                p='1rem'
                                borderRadius='8px'
                            >
                                <Grid
                                    templateColumns='2fr 1fr 1fr'
                                    rowGap='0.4rem'
                                    w='100%'
                                    alignItems='center'
                                >
                                    <GridItem />
                                    <GridItem justifySelf='center'>
                                        <Text
                                            fontSize='0.9rem'
                                            fontWeight='bold'
                                            alignItems='center'
                                        >
                                            APIs
                                        </Text>
                                    </GridItem>
                                    <GridItem justifySelf='center'>
                                        <Text
                                            fontSize='0.9rem'
                                            fontWeight='bold'
                                        >
                                            Operations
                                        </Text>
                                    </GridItem>
                                    {metrics.map((metric, index) => {
                                        const rowBg =
                                            index % 2 === 0
                                                ? {
                                                      base: '#F7F8F9',
                                                      _dark: '#2D3748'
                                                  }
                                                : {
                                                      base: 'white',
                                                      _dark: '#2D3748'
                                                  }
                                        return (
                                            <React.Fragment key={metric.title}>
                                                <GridItem bg={rowBg}>
                                                    <Tooltip
                                                        content={
                                                            metric?.tooltip ||
                                                            ''
                                                        }
                                                        openDelay={1000}
                                                    >
                                                        <Flex
                                                            align='center'
                                                            gap='0.5rem'
                                                        >
                                                            <Box
                                                                w='10px'
                                                                h='10px'
                                                                borderRadius='50%'
                                                                bg={
                                                                    'color' in
                                                                        metric &&
                                                                    metric.color
                                                                        ? metric.color
                                                                        : '#E2E8F0'
                                                                }
                                                            />
                                                            <Text fontSize='0.9rem'>
                                                                {metric.title}
                                                            </Text>
                                                        </Flex>
                                                    </Tooltip>
                                                </GridItem>
                                                <GridItem bg={rowBg}>
                                                    <Tooltip
                                                        content={
                                                            metric
                                                                .countTooltip[0]
                                                        }
                                                        openDelay={500}
                                                    >
                                                        <Text
                                                            fontSize='0.9rem'
                                                            textAlign='center'
                                                        >
                                                            {(metricsData?.[
                                                                metric
                                                                    .key[0] as keyof typeof metricsData
                                                            ] as
                                                                | number
                                                                | undefined) ??
                                                                0}
                                                        </Text>
                                                    </Tooltip>
                                                </GridItem>
                                                <GridItem bg={rowBg}>
                                                    <Tooltip
                                                        content={
                                                            metric
                                                                .countTooltip[1]
                                                        }
                                                        openDelay={500}
                                                    >
                                                        <Text
                                                            fontSize='0.9rem'
                                                            textAlign='center'
                                                        >
                                                            {(metricsData?.[
                                                                metric
                                                                    .key[1] as keyof typeof metricsData
                                                            ] as
                                                                | number
                                                                | undefined) ??
                                                                0}
                                                        </Text>
                                                    </Tooltip>
                                                </GridItem>
                                            </React.Fragment>
                                        )
                                    })}
                                </Grid>
                            </Flex>
                        </>
                    )}

                    {isCrossDomainMetric &&
                        [
                            {
                                title: 'ETP/ECMI with Cross-Domain APIs Identified',
                                data: initiativeChart
                            },
                            {
                                title: 'Cross-Domain APIs',
                                data: chartData
                            },
                            {
                                title: 'Cross-Domain Type A / B API Certification Status',
                                data: statusChart
                            }
                        ].map(card => (
                            <Flex
                                key={card.title}
                                width={{ base: '100%', lg: '33%' }}
                                backgroundColor={{
                                    base: 'white',
                                    _dark: '#2D3748'
                                }}
                                height={HEIGHT}
                                gap={4}
                                direction='row'
                                borderRadius='8px'
                                position='relative'
                                paddingTop={'20px'}
                            >
                                <Box
                                    className='metrics-header-title'
                                    fontSize='20px'
                                    fontWeight='bold'
                                    color={cardTextColor}
                                    top='8px'
                                    left='20px'
                                    position='absolute'
                                >
                                    <Text>{card.title}</Text>
                                </Box>
                                <PieChartWithLegend
                                    selectedGroup={selectedGroup}
                                    view={view}
                                    chartData={card.data}
                                />
                            </Flex>
                        ))}

                    {isECMIMetric && (
                        <Flex
                            direction={{
                                base: 'column',
                                lg: 'row'
                            }}
                            width={{
                                base: '100%',
                                lg: '50%'
                            }}
                            gap='1rem'
                        >
                            {metrics.map((metric, index) => (
                                <MetricsCard
                                    key={index}
                                    metric={metric}
                                    metricsData={metricsData}
                                />
                            ))}
                        </Flex>
                    )}
                </Flex>
            )}

            <MetricsModal
                view={view}
                isOpen={open}
                onClose={onClose}
                chartData={chartData}
                selectedGroup={selectedGroup}
            />
        </>
    )
}
