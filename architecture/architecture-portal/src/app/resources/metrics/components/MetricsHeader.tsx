/* istanbul ignore file */
import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import metricStyles from '../metrics.module.css'

function MetricsHeader() {
    return (
        <Flex
            className={metricStyles.metricsHeader}
            background='var(--directory-title-container-color)'
            alignItems='center'
            justifyContent='space-between'
        >
            <Box pt='20px' className='applications-directory-title-box'>
                <Text
                    whiteSpace='nowrap'
                    className={metricStyles.directoryTitle}
                >
                    Company Domain and API Metrics
                </Text>
                <Box className={metricStyles.directorySubTitle}>
                    <Text>
                        A comprehensive visualization for tracking and analyzing
                        Company Domain metrics in American Express. Gain
                        actionable insights by selecting different metrics and
                        grouping options.
                    </Text>
                </Box>
            </Box>
        </Flex>
    )
}

export default MetricsHeader
