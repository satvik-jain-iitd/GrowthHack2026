import { VStack, Text } from '@chakra-ui/react'
import React from 'react'
import { AvatarTableRow } from '@/components/ui'

export default function BvBIndexBodyItem({
    label,
    value,
    icon
}: {
    label: string
    value: string[] | undefined
    icon: React.ReactNode
}) {
    if (!value || value.length === 0) {
        return null
    }
    return (
        <VStack gap={3} align='stretch'>
            <Text
                as='span'
                fontWeight='bold'
                fontSize='sm'
                color='fg.muted'
                display='flex'
                alignItems='center'
                gap={1}
            >
                {icon} {label}
            </Text>
            {value.map(val => (
                <React.Fragment key={val}>
                    <AvatarTableRow email={val} />
                </React.Fragment>
            ))}
        </VStack>
    )
}
