'use client'
import React from 'react'
import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import { useUserContext } from '@/context'
import { BuildBuyForm } from '@/app/onboarding-form/components/BuildBuyForm'
import { NeedHelp } from '@/app/onboarding-form/components/NeedHelp'

export default function BvBOnboarding() {
    const user = useUserContext()
    const { adsId = '', email = '' } = user?.attributes ?? {}

    return (
        <Grid templateColumns='repeat(12, 1fr)' gap='6' w='100%'>
            <GridItem colSpan={{ base: 12, lg: 8 }}>
                <Box maxW='1000px' width='100%' mx='auto' p={6}>
                    <Heading
                        data-testid='onboarding-heading'
                        size='3xl'
                        mb={4}
                        color={{ base: '#00175a', _dark: '#1a88e9ff' }}
                    >
                        Build vs. Buy Onboarding Request
                    </Heading>
                    <Text
                        data-testid='onboarding-instruction-text'
                        paddingBottom={'30px'}
                        color='fg.muted'
                        textStyle='sm'
                    >
                        If this is your first time onboarding, please follow the
                        instructions in the Need Help section.
                    </Text>
                    <BuildBuyForm
                        adsId={adsId}
                        email={email}
                        activeFormDisplayText='BuildBuy'
                    >
                        {({ firstField, restFields, onSubmit }) => (
                            <Box as='form' onSubmit={onSubmit}>
                                <Grid
                                    templateColumns={{
                                        base: '1fr',
                                        md: 'repeat(2, 1fr)'
                                    }}
                                    gap={6}
                                >
                                    <GridItem colSpan={2}>
                                        {firstField}
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        {restFields}
                                    </GridItem>
                                </Grid>
                            </Box>
                        )}
                    </BuildBuyForm>
                </Box>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 4 }}>
                <NeedHelp isBvB />
            </GridItem>
        </Grid>
    )
}
