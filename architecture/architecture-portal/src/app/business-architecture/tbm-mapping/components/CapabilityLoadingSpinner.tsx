'use client'
import { Box, ProgressCircle, Text, VStack } from '@chakra-ui/react'

export function CapabilityLoadingSpinner({ text }: { text?: string } = {}) {
    return (
        <Box
            minHeight='400px'
            width='100%'
            display='flex'
            alignItems='center'
            justifyContent='center'
        >
            <VStack gap={4}>
                <ProgressCircle.Root value={null} size='lg'>
                    <ProgressCircle.Circle>
                        <ProgressCircle.Track />
                        <ProgressCircle.Range />
                    </ProgressCircle.Circle>
                </ProgressCircle.Root>
                <Text data-testid='loading-text' fontWeight='700'>
                    {text || 'Loading Enterprise Business Capabilities...'}
                </Text>
            </VStack>
        </Box>
    )
}
