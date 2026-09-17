'use client'
import React, { PropsWithChildren, FC } from 'react'
import { useAuthBlueSso } from 'use-authblue-sso'
import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react'
import { useUserContext } from '@/context/UserContext'
import { showAdmin } from '@/app/admin/utils'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'
import { ARCH_PORTAL_HELP_SLACK_URL } from '@/constants'
import { NoPrefetchLink } from '@/components/ui/NoPrefetchLink'

export const FeatureManagementGuard: FC<PropsWithChildren> = ({ children }) => {
    const { isLoaded } = useAuthBlueSso()
    const user = useUserContext()
    const userHasAccess = showAdmin(user?.groups || [])

    if (!isLoaded) {
        return (
            <Center
                minHeight='400px'
                width='100%'
                data-testid={FEATURE_MANAGEMENT_TEST_IDS.guardLoading}
            >
                <Spinner size='lg' />
            </Center>
        )
    }

    if (!userHasAccess) {
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
                            data-testid={
                                FEATURE_MANAGEMENT_TEST_IDS.guardAccessDenied
                            }
                            fontSize='xl'
                            color='fg.info'
                        >
                            Access Denied
                        </Text>
                        <Text textAlign='center' color='fg.muted' fontSize='md'>
                            You do not have permission to view this page. Please
                            reach out to{' '}
                            <NoPrefetchLink
                                target='_blank'
                                href={ARCH_PORTAL_HELP_SLACK_URL}
                            >
                                #arch-portal-help
                            </NoPrefetchLink>{' '}
                            if you believe this is an error.
                        </Text>
                    </VStack>
                </Box>
            </Center>
        )
    }

    return <>{children}</>
}
