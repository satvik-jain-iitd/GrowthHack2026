/* istanbul ignore file */
import { IconDownload } from '@americanexpress/dls-icons'
import { Box, Button, Table } from '@chakra-ui/react'
import { useRef } from 'react'
import {
    BarChart,
    Bar,
    LabelList,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import {
    downloadDBFootprintChart,
    downloadDBFootprintTable
} from '../utils/DBFootprintDownloadUtils'
import { DBFootprintTableProps } from '../utils/types'

const renderChartTooltip = ({
    active,
    payload,
    label
}: {
    active?: boolean
    payload?: Array<{
        name?: string
        value?: number | string
        color?: string
        payload?: {
            databaseVersion?: string
        }
    }>
    label?: string | number
}) => {
    if (!active || !payload || payload.length === 0) {
        return null
    }

    return (
        <div
            style={{
                backgroundColor: '#1f2937',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '10px 12px'
            }}
        >
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                Database Technology: {label}
            </div>
            {payload.map(item => (
                <div key={item.name} style={{ color: item.color }}>
                    {item.name}: {item.value}
                </div>
            ))}
        </div>
    )
}

export default function DBFootprintTable({ data }: DBFootprintTableProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const tableElementRef = useRef<HTMLDivElement>(null)

    const sortedConsolidated = [...data.consolidated].sort((a, b) => {
        const totalA =
            a.noOfInstancesInProd + a.noOfInstancesInTest + a.noOfInstancesInDev
        const totalB =
            b.noOfInstancesInProd + b.noOfInstancesInTest + b.noOfInstancesInDev
        return totalB - totalA
    })

    const chartData = Object.values(
        data.consolidated.reduce(
            (acc, row) => {
                const technology = row.databaseTechnology?.trim() || '-'

                if (!acc[technology]) {
                    acc[technology] = {
                        name: technology,
                        prod: 0,
                        test: 0,
                        dev: 0,
                        total: 0
                    }
                }

                acc[technology].prod += row.noOfInstancesInProd
                acc[technology].test += row.noOfInstancesInTest
                acc[technology].dev += row.noOfInstancesInDev
                acc[technology].total +=
                    row.noOfInstancesInProd +
                    row.noOfInstancesInTest +
                    row.noOfInstancesInDev

                return acc
            },
            {} as Record<
                string,
                {
                    name: string
                    prod: number
                    test: number
                    dev: number
                    total: number
                }
            >
        )
    ).sort((a, b) => b.prod + b.test + b.dev - (a.prod + a.test + a.dev))

    const handleDownloadChart = async () => {
        await downloadDBFootprintChart({
            companyDomainName: data.company_domain_name,
            chartContainerElement: chartContainerRef.current
        })
    }

    const handleDownloadTable = async () => {
        await downloadDBFootprintTable({
            companyDomainName: data.company_domain_name,
            tableElement: tableElementRef.current
        })
    }

    return (
        <Box
            ref={chartContainerRef}
            p='16px'
            backgroundColor={{ base: 'white', _dark: '#27272a' }}
            color={{ base: '#1f2937', _dark: 'white' }}
            borderRadius='8px'
        >
            <Box fontWeight='600' mb='8px' data-db-footprint-chart-domain>
                Company Domain: {data.company_domain_name}
            </Box>
            {chartData.length > 0 && (
                <Box
                    mt='20px'
                    h='320px'
                    color={{ base: '#1f2937', _dark: 'white' }}
                >
                    <Box
                        fontWeight='600'
                        mb='10px'
                        data-db-footprint-chart-title
                    >
                        DB Footprint by Technology
                    </Box>
                    <Box h='100%'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 40,
                                    right: 20,
                                    left: 0,
                                    bottom: 40
                                }}
                            >
                                <CartesianGrid
                                    stroke='currentColor'
                                    strokeOpacity={0.2}
                                    strokeDasharray='3 3'
                                />
                                <XAxis
                                    dataKey='name'
                                    angle={-20}
                                    textAnchor='end'
                                    interval={0}
                                    height={60}
                                    tick={{ fill: 'currentColor' }}
                                    axisLine={{ stroke: 'currentColor' }}
                                    tickLine={{ stroke: 'currentColor' }}
                                />
                                <YAxis
                                    tick={{ fill: 'currentColor' }}
                                    axisLine={{ stroke: 'currentColor' }}
                                    tickLine={{ stroke: 'currentColor' }}
                                />
                                <Tooltip
                                    cursor={{
                                        fill: 'rgba(71, 85, 105, 0.35)',
                                        stroke: 'rgba(71, 85, 105, 0.6)'
                                    }}
                                    content={renderChartTooltip}
                                />
                                <Legend
                                    wrapperStyle={{ color: 'currentColor' }}
                                />
                                <Bar
                                    dataKey='prod'
                                    name='Prod'
                                    stackId='instances'
                                    fill='#006FCF'
                                />
                                <Bar
                                    dataKey='test'
                                    name='Test'
                                    stackId='instances'
                                    fill='#2987D9'
                                />
                                <Bar
                                    dataKey='dev'
                                    name='Dev'
                                    stackId='instances'
                                    fill='#56A1E3'
                                >
                                    <LabelList
                                        dataKey='total'
                                        position='top'
                                        fill='currentColor'
                                        fontWeight={700}
                                        fontSize={13}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>
            )}
            {chartData.length > 0 && (
                <Box
                    mb='68px'
                    display='flex'
                    gap='12px'
                    justifyContent='flex-end'
                >
                    <Button onClick={handleDownloadChart} colorPalette='blue'>
                        <IconDownload className='iconDownload' color='white' />
                        Download Chart
                    </Button>
                </Box>
            )}
            <Box ref={tableElementRef}>
                <Table.ScrollArea>
                    <Table.Root
                        size='sm'
                        minW='900px'
                        color={{ base: '#1f2937', _dark: 'white' }}
                    >
                        <Table.Header>
                            <Table.Row
                                backgroundColor={{
                                    base: '#DDE9F4',
                                    _dark: '#53565a'
                                }}
                            >
                                <Table.ColumnHeader
                                    color={{ base: 'black', _dark: 'white' }}
                                >
                                    Database Technology
                                </Table.ColumnHeader>
                                <Table.ColumnHeader
                                    color={{ base: 'black', _dark: 'white' }}
                                >
                                    Database Version
                                </Table.ColumnHeader>
                                <Table.ColumnHeader
                                    textAlign='right'
                                    color={{ base: 'black', _dark: 'white' }}
                                >
                                    Instances In Prod
                                </Table.ColumnHeader>
                                <Table.ColumnHeader
                                    textAlign='right'
                                    color={{ base: 'black', _dark: 'white' }}
                                >
                                    Instances In Test
                                </Table.ColumnHeader>
                                <Table.ColumnHeader
                                    textAlign='right'
                                    color={{ base: 'black', _dark: 'white' }}
                                >
                                    Instances In Dev
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {sortedConsolidated?.length > 0 ? (
                                sortedConsolidated.map((row, index) => (
                                    <Table.Row
                                        key={`${row.databaseTechnology}-${index}`}
                                    >
                                        <Table.Cell
                                            color={{
                                                base: '#1f2937',
                                                _dark: 'white'
                                            }}
                                        >
                                            {row.databaseTechnology}
                                        </Table.Cell>
                                        <Table.Cell
                                            color={{
                                                base: '#1f2937',
                                                _dark: 'white'
                                            }}
                                        >
                                            {row.databaseVersion || '-'}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='right'
                                            color={{
                                                base: '#1f2937',
                                                _dark: 'white'
                                            }}
                                        >
                                            {row.noOfInstancesInProd}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='right'
                                            color={{
                                                base: '#1f2937',
                                                _dark: 'white'
                                            }}
                                        >
                                            {row.noOfInstancesInTest}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='right'
                                            color={{
                                                base: '#1f2937',
                                                _dark: 'white'
                                            }}
                                        >
                                            {row.noOfInstancesInDev}
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={5}
                                        color={{
                                            base: '#1f2937',
                                            _dark: 'white'
                                        }}
                                    >
                                        No DB footprint data found.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Box>
            {chartData.length > 0 && (
                <Box
                    mt='12px'
                    display='flex'
                    gap='12px'
                    justifyContent='flex-end'
                >
                    <Button onClick={handleDownloadTable} colorPalette='blue'>
                        <IconDownload className='iconDownload' color='white' />
                        Download Table
                    </Button>
                </Box>
            )}
        </Box>
    )
}
