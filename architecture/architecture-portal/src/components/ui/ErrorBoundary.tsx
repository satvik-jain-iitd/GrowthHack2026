/* istanbul ignore file */
'use client'
import { ErrorBoundary } from 'react-error-boundary'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { NoPrefetchLink as Link } from '@/components/ui'
import { ARCH_PORTAL_HELP_SLACK_URL } from '@/constants/urls'

/* eslint-disable @typescript-eslint/no-explicit-any */
function ErrorFallback({ error }: any) {
    console.log(`ErrorBoundary caught an error: ${error}`, {
        message: error.message,
        stack: error.stack,
        isErrorBoundaryError: true
    })
    return (
        <Box
            display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='center'
            gap={4}
            p={8}
            borderRadius='lg'
            bg='red.50'
            borderWidth='1px'
            borderColor='red.200'
        >
            <Heading size='md' color='red.900'>
                Something went wrong
            </Heading>
            <Text color='red.700' textAlign='center'>
                An unexpected error has occurred. Please reach out to our help
                channel on Slack for assistance, and please report the following
                error message.
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
        </Box>
    )
}

export default function Page({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            {children}
        </ErrorBoundary>
    )
}
