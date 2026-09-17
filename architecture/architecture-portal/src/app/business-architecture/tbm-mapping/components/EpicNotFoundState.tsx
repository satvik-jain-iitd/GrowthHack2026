'use client'
import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { IconWarning } from '@americanexpress/dls-icons'

type Props = {
    epicId: string
}

export function EpicNotFoundState({ epicId }: Props) {
    return (
        <Center px={8} py={16}>
            <Box
                maxW='2xl'
                w='full'
                p={8}
                borderRadius='2xl'
                boxShadow='md'
                bg='bg.subtle'
                border='1px solid'
                borderColor='border'
            >
                <VStack gap={3} align='center'>
                    <Text
                        data-testid='epic-not-found-heading'
                        fontSize='xl'
                        color='fg.info'
                        alignItems='center'
                        display='flex'
                    >
                        <IconWarning size='xl' style={{ marginRight: '8px' }} />
                        Epic Not Found
                    </Text>
                    <Text
                        data-testid='epic-not-found-message'
                        textAlign='center'
                        color='fg.muted'
                        fontSize='md'
                    >
                        No journey data is available for epic{' '}
                        <strong>{epicId}</strong>. The epic may have been
                        removed or the ID is incorrect.
                    </Text>
                </VStack>
            </Box>
        </Center>
    )
}
