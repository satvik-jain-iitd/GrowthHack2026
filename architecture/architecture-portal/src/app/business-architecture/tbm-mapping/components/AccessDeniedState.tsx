'use client'
import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { IconWarning } from '@americanexpress/dls-icons'

export function AccessDeniedState() {
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
                        data-testid='access-denied-heading'
                        fontSize='xl'
                        color='fg.info'
                        alignItems='center'
                        display='flex'
                    >
                        <IconWarning size='xl' style={{ marginRight: '8px' }} />
                        You do not have access to this page
                    </Text>
                    <Text
                        data-testid='access-denied-message'
                        textAlign='center'
                        color='fg.muted'
                        fontSize='md'
                    >
                        You must raise an iiq request to view this page. Please
                        contact your administrator for more information.
                    </Text>
                </VStack>
            </Box>
        </Center>
    )
}
