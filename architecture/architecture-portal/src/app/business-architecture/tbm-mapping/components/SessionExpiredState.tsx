'use client'
import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Text,
    VStack
} from '@chakra-ui/react'
import { IconWarning } from '@americanexpress/dls-icons'
import { EbaHeader } from '@/app/business-architecture/components/EbaHeader'

export function SessionExpiredState() {
    return (
        <Flex direction='column' minH='100vh'>
            <EbaHeader title='Architecture Portal' />
            <Center px={8} py={16} flex='1'>
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
                    <VStack gap={4} align='center'>
                        <Text
                            data-testid='session-expired-heading'
                            fontSize='xl'
                            color='fg.info'
                            alignItems='center'
                            display='flex'
                        >
                            <IconWarning
                                size='xl'
                                style={{ marginRight: '8px' }}
                            />
                            Session Expired
                        </Text>
                        <Text
                            data-testid='session-expired-message'
                            textAlign='center'
                            color='fg.muted'
                            fontSize='md'
                        >
                            Your session has expired. Please refresh the page or
                            close this tab and come back to continue.
                        </Text>
                        <HStack gap={4} mt={2}>
                            <Button
                                data-testid='refresh-page-btn'
                                colorPalette='blue'
                                size='sm'
                                onClick={() => window.location.reload()}
                            >
                                Refresh Page
                            </Button>
                            <Button
                                data-testid='close-tab-btn'
                                colorPalette='blue'
                                variant='outline'
                                size='sm'
                                onClick={() => window.close()}
                            >
                                Close Tab
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Center>
        </Flex>
    )
}
