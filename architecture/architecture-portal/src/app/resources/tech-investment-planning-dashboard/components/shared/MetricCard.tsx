'use client'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/Tooltip'

interface Props {
    label: string
    value: number | string
    subtitle?: string
    tooltip?: string
    color?:
        | 'blue'
        | 'green'
        | 'amber'
        | 'red'
        | 'purple'
        | 'cyan'
        | 'indigo'
        | 'orange'
}

const colorMap = {
    blue: {
        color: { base: 'blue.600', _dark: 'blue.300' },
        bg: { base: 'blue.50', _dark: 'blue.900' },
        border: { base: 'blue.200', _dark: 'blue.800' }
    },
    green: {
        color: { base: 'green.600', _dark: 'green.400' },
        bg: { base: 'green.50', _dark: 'green.900' },
        border: { base: 'green.200', _dark: 'green.800' }
    },
    amber: {
        color: { base: 'orange.500', _dark: 'orange.400' },
        bg: { base: 'orange.50', _dark: 'orange.900' },
        border: { base: 'orange.200', _dark: 'orange.800' }
    },
    cyan: {
        color: { base: 'cyan.600', _dark: 'cyan.300' },
        bg: { base: 'cyan.50', _dark: 'cyan.900' },
        border: { base: 'cyan.200', _dark: 'cyan.800' }
    },
    purple: {
        color: { base: 'purple.600', _dark: 'purple.400' },
        bg: { base: 'purple.50', _dark: 'purple.900' },
        border: { base: 'purple.200', _dark: 'purple.800' }
    },
    red: {
        color: { base: 'red.600', _dark: 'red.400' },
        bg: { base: 'red.50', _dark: 'red.900' },
        border: { base: 'red.200', _dark: 'red.800' }
    },
    orange: {
        color: { base: 'orange.600', _dark: 'orange.400' },
        bg: { base: 'orange.50', _dark: 'orange.900' },
        border: { base: 'orange.200', _dark: 'orange.800' }
    },
    indigo: {
        color: { base: 'blue.700', _dark: 'blue.300' },
        bg: { base: 'blue.50', _dark: 'blue.950' },
        border: { base: 'blue.300', _dark: 'blue.700' }
    }
}

export function MetricCard({
    label,
    value,
    subtitle,
    tooltip,
    color = 'blue'
}: Props) {
    const c = colorMap[color]
    return (
        <Box
            borderRadius='xl'
            border='1px solid'
            borderColor={c.border}
            bg={c.bg}
            p={5}
            display='flex'
            flexDirection='column'
            gap={1}
            color={c.color}
        >
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </Text>
            <Flex align='center' gap={1}>
                <Text
                    fontSize='sm'
                    fontWeight='medium'
                    color={{ base: 'gray.700', _dark: 'gray.200' }}
                >
                    {label}
                </Text>
                {tooltip && (
                    <Tooltip content={tooltip} showArrow>
                        <Text
                            as='span'
                            fontSize='xs'
                            color='gray.400'
                            cursor='help'
                            ml={1}
                        >
                            ℹ
                        </Text>
                    </Tooltip>
                )}
            </Flex>
            {subtitle && (
                <Text fontSize='xs' color='gray.500'>
                    {subtitle}
                </Text>
            )}
        </Box>
    )
}
