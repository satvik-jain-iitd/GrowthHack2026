/* istanbul ignore file */
import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { HeaderData } from '../types'
import { HEIGHT } from '../constants'

export default function MetricsCard({
    metric,
    metricsData
}: {
    metric: {
        key: string | string[]
        title: string
        tooltip?: string
        countTooltip: string[] | never[]
    }
    metricsData: HeaderData | undefined
}) {
    if (!metricsData || !metric) {
        return null
    }

    return (
        <Box
            flex='1'
            height={HEIGHT}
            backgroundColor={{ _dark: '#2D3748', base: 'white' }}
            padding='1rem'
            borderRadius='8px'
        >
            <Flex
                direction='column'
                height='100%'
                justifyContent='center'
                alignItems='center'
                textAlign='center'
            >
                <VStack align='center' gap={10}>
                    <Text
                        style={{
                            fontSize: '16px',
                            fontWeight: 700
                        }}
                        color={{ _dark: 'white', base: '#53565A' }}
                    >
                        {metric.title}
                    </Text>
                    <p
                        style={{
                            fontSize: '48px',
                            fontWeight: 700,
                            color: '#33A0FF'
                        }}
                    >
                        {metricsData[metric.key as keyof typeof metricsData] ||
                            0}{' '}
                        {metric.key === 'percentage' ? '%' : ''}
                    </p>
                </VStack>
            </Flex>
        </Box>
    )
}
