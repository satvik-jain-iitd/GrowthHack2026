import React from 'react'
import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { IconCheck } from '@americanexpress/dls-icons'

export function SubmissionComplete() {
    return (
        <Center className='page-content' px={8}>
            <Box
                maxW='2xl'
                w='full'
                p={10}
                borderRadius='2xl'
                boxShadow='md'
                bg='bg.subtle'
                border='1px solid'
                borderColor='border'
            >
                <VStack gap={4} align='center'>
                    <Text
                        data-testid='submission-complete-heading'
                        fontSize='2xl'
                        fontWeight='700'
                        color='green.600'
                        alignItems='center'
                        display='flex'
                    >
                        <IconCheck size='xl' style={{ marginRight: '10px' }} />
                        Submission Complete
                    </Text>
                    <Text
                        data-testid='submission-complete-message'
                        textAlign='center'
                        color='fg.muted'
                        fontSize='md'
                    >
                        Your Enterprise Business Capability selections have been
                        submitted successfully. You may now close this tab and
                        return to Apptio.
                    </Text>
                </VStack>
            </Box>
        </Center>
    )
}
