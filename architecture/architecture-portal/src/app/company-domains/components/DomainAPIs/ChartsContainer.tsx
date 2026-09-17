import React, { useMemo } from 'react'
import HeaderPieChart from './HeaderPieChart'
import HeaderBarChart from './HeaderBarChart'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ResponseCount } from '@/app/company-domains/types'

const name_mapping = {
    eARB_Approved: 'EARB Approved Operations',
    dARB_Approved: 'ARB Approved Operations',
    design_Certified: 'Design Certified Operations',
    prod_Certified: 'Production Certified Operations'
}

const COLORS = {
    eARB_Approved: '#F9A94E',
    dARB_Approved: '#FFF846',
    design_Certified: '#2196F3',
    prod_Certified: '#4CAF50'
}

function ChartsContainer({
    showBarChart,
    statusCount
}: {
    showBarChart: boolean
    statusCount: ResponseCount
}) {
    const rawChartstatusCount = useMemo(() => {
        const ops = statusCount?.domainStatusCount?.operations || {}
        return Object.keys(name_mapping)
            .filter(key => ops[key as keyof typeof ops] > 0)
            .map(key => ({
                name: name_mapping[key as keyof typeof name_mapping],
                value: Number(ops[key as keyof typeof ops]),
                color: COLORS[key as keyof typeof COLORS]
            }))
    }, [statusCount])
    const totalCount = statusCount?.domainStatusCount?.operations?.total || 0

    return (
        <div className={styles.headerSize}>
            {!showBarChart && (
                <HeaderPieChart
                    chartData={rawChartstatusCount}
                    Proposed={totalCount}
                />
            )}
            {showBarChart && (
                <HeaderBarChart
                    chartData={rawChartstatusCount}
                    Proposed={totalCount}
                />
            )}
        </div>
    )
}

export default ChartsContainer
