'use client'
import React, { useState } from 'react'
import { Box, Button, VStack } from '@chakra-ui/react'

import {
    IconPlusCircle,
    IconPieChart,
    IconBarChart
} from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ResponseCount } from '@/app/company-domains/types'

import ChartsContainer from './ChartsContainer'
import { DOMAIN_TEST_IDS } from '../../test-ids'

export default function DomainApiHeader({
    isAdd,
    domainName,
    statusCount,
    handleAdd
}: {
    isAdd: boolean
    domainName: string
    statusCount: ResponseCount
    handleAdd: () => void
}) {
    const [showBarChart, setShowBarChart] = useState(false)

    return (
        <Box width={'100%'} className={` ${styles.directoryHeaderContainer}`}>
            <Box
                className={`${styles.directoryTitle} ${styles.headerTitleSection}`}
            >
                <VStack alignItems='flex-start' gap={3} width='100%'>
                    <Box
                        as='h2'
                        textAlign='left'
                        className={styles.directoryTitleName}
                        data-testid={DOMAIN_TEST_IDS.headerText}
                    >
                        {`${domainName} APIs`}
                    </Box>

                    {!isAdd && (
                        <Button
                            onClick={handleAdd}
                            className={styles.addDomainApiButton}
                            style={{
                                color: '#006fcf'
                            }}
                            data-testid={DOMAIN_TEST_IDS.viewAllBtn}
                        >
                            <IconPlusCircle />
                            Add Company Domain API
                        </Button>
                    )}
                </VStack>
            </Box>
            {(+statusCount?.domainStatusCount?.dARB_Approved > 0 ||
                +statusCount?.domainStatusCount?.eARB_Approved > 0) && (
                <Box className={styles.headerChartsSection}>
                    <Box className={styles.headerChartArea}>
                        <div
                            className={`${styles.directoryChart} ${!showBarChart ? styles.pieChart : ''}`}
                        >
                            <ChartsContainer
                                showBarChart={showBarChart}
                                statusCount={statusCount}
                            />
                        </div>
                    </Box>
                    <Box className={styles.headerChartToggle}>
                        <div className={`${styles.iconButtonHeader}`}>
                            <IconPieChart
                                data-testid={DOMAIN_TEST_IDS.iconPieChart}
                                style={{ padding: '10px' }}
                                color={showBarChart ? 'brand' : 'white'}
                                onClick={() => setShowBarChart(false)}
                            />
                            <IconBarChart
                                data-testid={DOMAIN_TEST_IDS.iconBarChart}
                                style={{ padding: '10px' }}
                                color={showBarChart ? 'white' : 'brand'}
                                onClick={() => setShowBarChart(true)}
                            />
                        </div>
                    </Box>
                </Box>
            )}
        </Box>
    )
}
