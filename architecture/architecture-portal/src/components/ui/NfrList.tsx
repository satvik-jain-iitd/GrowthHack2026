/* istanbul ignore file */
import { Box, Flex, Text } from '@chakra-ui/react'

export interface OperationNfrs {
    response_time?: string
    average_rps?: string
    peak_rps?: string
    error_rate?: string
    availability?: string
}

const NFR_FIELDS = [
    {
        key: 'response_time',
        label: 'Response Time',
        format: (value: string) => `${value} ms`,
        shortLabel: 'Response Time',
        shortFormat: (value: string) => `${value} ms`
    },
    {
        key: 'average_rps',
        label: 'Average RPS',
        format: (value: string) => `${value} requests/second`,
        shortLabel: 'Avg RPS',
        shortFormat: (value: string) => `${value}/s`
    },
    {
        key: 'peak_rps',
        label: 'Peak RPS',
        format: (value: string) => `${value} requests/second`,
        shortLabel: 'Peak RPS',
        shortFormat: (value: string) => `${value}/s`
    },
    {
        key: 'error_rate',
        label: 'Error Rate',
        format: (value: string) => `${value}% errors`,
        shortLabel: 'Error Rate',
        shortFormat: (value: string) => `${value}%`
    },
    {
        key: 'availability',
        label: 'Availability',
        format: (value: string) => `${value}% uptime per month`,
        shortLabel: 'Availability',
        shortFormat: (value: string) => `${value}%`
    }
] as const

export function NfrList({
    slas,
    variant = 'list'
}: {
    slas?: OperationNfrs | null
    variant?: 'list' | 'badges'
}) {
    if (variant === 'badges') {
        return (
            <Flex wrap='wrap' gap={2}>
                {NFR_FIELDS.map(({ key, shortLabel, shortFormat }) => {
                    const value = slas?.[key]
                    return (
                        <Box
                            key={shortLabel}
                            borderWidth='1px'
                            borderColor='#D4DEE9'
                            borderRadius='full'
                            px={2}
                            py='2px'
                            fontSize='0.7em'
                            lineHeight='1.6'
                            whiteSpace='nowrap'
                            opacity={value ? 1 : 0.55}
                        >
                            <Text
                                as='span'
                                fontWeight={600}
                                color='#686565'
                                _dark={{ color: 'gray.400' }}
                            >
                                {shortLabel}
                            </Text>{' '}
                            {value ? shortFormat(value) : 'N/A'}
                        </Box>
                    )
                })}
            </Flex>
        )
    }

    const items = NFR_FIELDS.map(({ key, label, format }) => {
        const value = slas?.[key]
        return { label, value: value ? format(value) : 'N/A' }
    })

    return (
        <ul>
            {items.map(({ label, value }) => (
                <li key={label}>
                    <Text fontWeight={500} as='span'>
                        {label}:{' '}
                    </Text>
                    {value}
                </li>
            ))}
        </ul>
    )
}
