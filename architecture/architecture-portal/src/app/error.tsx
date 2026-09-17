/* istanbul ignore file */
'use client'
import React from 'react'
import { NoPrefetchLink as Link } from '@/components/ui'
import { Box, Button, Center, Text, VStack } from '@chakra-ui/react'
import { IconNeutral } from '@americanexpress/dls-icons'
import { ARCH_PORTAL_HELP_SLACK_URL } from '@/constants'

export default function Error() {
    return (
        <Center
            className='page-content'
            px={8}
            bgGradient='linear(to-br, gray.50, gray.100)'
        >
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
                <VStack gap={2} align='center'>
                    <Text
                        fontSize='xl'
                        color='fg.info'
                        alignItems='center'
                        display='flex'
                    >
                        <IconNeutral size='xl' style={{ marginRight: '8px' }} />
                        Something went wrong...
                    </Text>
                    <Text textAlign='center' color='fg.muted' fontSize='md'>
                        An unexpected error occurred while loading this page.
                        Please try again later. If the problem persists, let us
                        know over Slack:
                    </Text>
                    <Button
                        asChild
                        size='sm'
                        height='7'
                        variant='solid'
                        colorPalette='blue'
                        fontSize={14}
                        mr={1}
                    >
                        <Link target='_blank' href={ARCH_PORTAL_HELP_SLACK_URL}>
                            #arch-portal-help
                        </Link>
                    </Button>
                </VStack>
            </Box>
        </Center>
    )
}
