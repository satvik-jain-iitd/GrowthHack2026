/* istanbul ignore file */

import { Box, Text } from '@chakra-ui/react'

export function MetricsCard({
    label,
    value,
    isIntro
}: {
    label: string
    value: string
    isIntro: boolean
}) {
    return (
        <Box
            key={label}
            bg={isIntro ? 'white' : '#F7F8F9'}
            borderRadius='xl'
            p='1.5em'
            flex='1'
            display='flex'
            flexDirection='row'
            alignItems='center'
            minW='100px'
            _dark={{
                bg: '#21252c'
            }}
        >
            <Text fontSize='2xl' fontWeight='400' color='#016dcc'>
                {value}
            </Text>
            <Text fontSize='md' fontWeight='400' textAlign='center' ml='0.5em'>
                {label}
            </Text>
        </Box>
    )
}
