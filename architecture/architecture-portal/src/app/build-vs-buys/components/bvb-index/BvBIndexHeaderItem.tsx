import React from 'react'
import { VStack, Text } from '@chakra-ui/react'

export default function BvBIndexHeaderItem({
    label,
    children
}: {
    label?: string
    children: React.ReactNode
}) {
    return (
        <VStack
            width='100%'
            px='15px'
            pb='10px'
            borderRight='1px solid #e0e0e0'
            _first={{ px: '0 15px 10px 0' }}
            _last={{ px: '0 0 10px 15px', borderRight: 'none' }}
            align='stretch'
            gap={0}
        >
            {label && (
                <Text
                    whiteSpace={'nowrap'}
                    as='span'
                    color='fg.muted'
                    fontSize='sm'
                >
                    {label}
                </Text>
            )}
            {children}
        </VStack>
    )
}
