import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer
} from 'recharts'
import styles from '../../domain-api-page.module.css'

const CustomLegend = ({ Proposed }: { Proposed: number }) => {
    if (Proposed <= 0) {
        return null
    }

    return (
        <div className={styles.customLegendBarChart}>
            <div className={styles.customLegendValue}>{Proposed}</div>
            <p
                className={styles.customLegendName}
                data-testid='chart-legend-domain'
            >
                Domain
            </p>
            <p
                className={styles.customLegendName}
                data-testid='chart-legend-operations'
            >
                Operations
            </p>
        </div>
    )
}
export const CustomTooltip = ({
    active,
    payload,
    label
}: {
    active?: boolean
    payload?: { value: string }[]
    label?: string
}) => {
    if (active && payload && payload.length) {
        return (
            <div>
                <p
                    className={styles.tooltipStyling}
                >{`${label}: ${payload[0].value}`}</p>
            </div>
        )
    }

    return null
}

function HeaderBarChart({
    chartData,
    Proposed
}: {
    chartData: { name: string; value: number; color: string }[]
    Proposed: number
}) {
    return (
        <>
            <ResponsiveContainer height={200}>
                <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{
                        top: 20,
                        left: 55,
                        bottom: 5
                    }}
                >
                    <CartesianGrid horizontal={false} stroke='#444' />
                    <XAxis type='number' tick={{ fill: '#fff' }} />
                    <YAxis
                        type='category'
                        dataKey='name'
                        tick={{ fill: '#fff' }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend
                        layout='vertical'
                        verticalAlign='top'
                        align='right'
                        content={<CustomLegend Proposed={Proposed} />}
                    />

                    <Bar dataKey='value' barSize={40}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}

export default HeaderBarChart
