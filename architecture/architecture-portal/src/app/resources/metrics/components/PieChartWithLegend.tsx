/* istanbul ignore file */
import { HEIGHT } from '../constants'
import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import styles from '../metrics.module.css'
import { useState } from 'react'

export const CustomToolTip = ({
    active,
    payload,
    view,
    selectedGroup,
    isCellHovered
}: {
    active?: boolean
    payload?: { name: string; value: string }[]
    view?: string
    selectedGroup?: string
    isCellHovered?: number
}) => {
    const isVisible =
        active && payload && payload.length && isCellHovered !== -1
    const showPercentage = view === 'metric1' && selectedGroup !== ''
    return (
        <div
            className='custom-tooltip'
            style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
            {isVisible && (
                <>
                    <p
                        className={styles.chartTooltip}
                    >{`${payload[0].name} : ${payload[0].value}${showPercentage ? '%' : ''}`}</p>
                </>
            )}
        </div>
    )
}

export default function PieChartWithLegend({
    view,
    selectedGroup,
    chartData,
    isModal
}: {
    view: string
    selectedGroup: string
    chartData: Array<{ value: number | string; title: string; color: string }>
    isModal?: boolean
}) {
    const [isCellHovered, setIsCellHovered] = useState(-1)
    if (!chartData || chartData.length === 0) {
        return null
    }
    const getLabel = ({ value, title }: { value: string; title: string }) => {
        if (view === 'metric1' && selectedGroup !== '') {
            return `${title} ${value}%`
        }
        if (selectedGroup !== '' && view === 'metric2') {
            return `${title} ${value}`
        }
        return value
    }

    return (
        <>
            <Box
                width={isModal ? '100%' : '40%'}
                height={isModal ? '30vw' : HEIGHT}
                onMouseLeave={() => setIsCellHovered(-1)}
            >
                <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey='value'
                            nameKey='title'
                            label={
                                isModal
                                    ? (param1: {
                                          value: string
                                          title: string
                                      }) => getLabel(param1)
                                    : undefined
                            }
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className={
                                        isCellHovered === -1
                                            ? ''
                                            : isCellHovered === index
                                              ? styles.pieCell
                                              : styles.pieCellNotActive
                                    }
                                    onMouseEnter={() => setIsCellHovered(index)}
                                    onMouseLeave={() => setIsCellHovered(-1)}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={
                                <CustomToolTip
                                    view={view}
                                    selectedGroup={selectedGroup}
                                    isCellHovered={isCellHovered}
                                />
                            }
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
            <SimpleGrid
                templateColumns='repeat(auto-fill, minmax(200px, 1fr))'
                gap={4}
                maxHeight='100%'
                width='60%'
                overflowY='auto'
                margin='1rem'
                paddingTop='20px'
            >
                {chartData
                    ?.filter(item => item.value)
                    .map((entry, index) => (
                        <HStack
                            key={`legend-${index}`}
                            alignItems='center'
                            gap='8px'
                            width={'100%'}
                        >
                            <Box
                                width='16px'
                                height='16px'
                                backgroundColor={entry.color}
                            />
                            <HStack
                                width='100%'
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <span>{entry.title}</span>
                                <span
                                    style={{
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        marginRight: '8px'
                                    }}
                                >
                                    {entry.value}{' '}
                                    {view === 'metric1' && selectedGroup !== ''
                                        ? '%'
                                        : ''}
                                </span>
                            </HStack>
                        </HStack>
                    ))}
            </SimpleGrid>
        </>
    )
}
