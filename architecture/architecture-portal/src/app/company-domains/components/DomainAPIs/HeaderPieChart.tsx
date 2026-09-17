import React from 'react'
import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Label,
    Cell,
    Legend,
    Tooltip
} from 'recharts'
import styles from '../../domain-api-page.module.css'

const CustomLabel = ({
    viewBox,
    value
}: {
    viewBox?: { cx: number; cy: number }
    value: number
}) => {
    if (value <= 0) {
        return null
    }
    const { cx, cy } = viewBox || { cx: 0, cy: 0 }
    return (
        <g className={styles.customLabelPieChart}>
            <text x={cx} y={cy - 10} className={styles.customLabelValue}>
                {parseInt(value.toString())}
            </text>
            <text
                x={cx}
                y={cy + 10}
                className={styles.customLabelName}
                data-testid='chart-legend-domain'
            >
                Domain
            </text>
            <text
                x={cx}
                y={cy + 30}
                className={styles.customLabelName}
                data-testid='chart-legend-operations'
            >
                Operations
            </text>
        </g>
    )
}
export const CustomTooltip = ({
    active,
    payload
}: {
    active?: boolean
    payload?: [{ value: string; name: string }]
}) => {
    if (active && payload && payload.length) {
        return (
            <div>
                <p
                    className={styles.tooltipStyling}
                >{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        )
    }

    return null
}
const Bullet = ({
    color,
    fontWeight,
    value
}: {
    color: string
    fontWeight: number
    value: string
}) => {
    return (
        <div
            style={{
                color,
                fontWeight
            }}
        >
            {value}
        </div>
    )
}

const CustomizedLegend = (props: {
    payload?: { payload: { fill: string; value: string; name: string } }[]
}) => {
    const { payload } = props
    return (
        <ul className={styles.customLegendPieChart}>
            {payload?.map((entry, index) => (
                <li key={`item-${index}`} className={styles.customLegendBullet}>
                    <Bullet
                        color={entry.payload.fill}
                        fontWeight={600}
                        value={entry.payload.value}
                    />
                    <div
                        className={styles.customwrap}
                        data-testid={`chart-legend-${entry.payload.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        {entry.payload.name}
                    </div>
                </li>
            ))}
        </ul>
    )
}
function HeaderPieChart({
    chartData,
    Proposed
}: {
    chartData: { name: string; value: number; color: string }[]
    Proposed: number
}) {
    return (
        <ResponsiveContainer height={200}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey='value'
                    innerRadius={55}
                    outerRadius={80}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label
                        content={<CustomLabel value={Proposed} />}
                        position='center'
                    />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    align='right'
                    verticalAlign='middle'
                    layout='vertical'
                    content={<CustomizedLegend />}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default HeaderPieChart
