/* istanbul ignore file */
import React from 'react'
import { Metadata } from 'next'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import { OnboardingForm, NeedHelp } from '@/app/onboarding-form/components'
import { PLAYBOOK_TYPE_IDS } from '@/constants'

export const metadata: Metadata = {
    title: 'Onboarding Request'
}

export default async function OnboardingRequest({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const defaultType = (await searchParams).type as string | undefined
    return (
        <Box className='page-content'>
            <Grid templateColumns='repeat(12, 1fr)' gap='6' w='100%'>
                <GridItem colSpan={{ base: 12, lg: 8 }}>
                    <OnboardingForm defaultType={defaultType} />
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 4 }}>
                    <NeedHelp
                        isBvB={defaultType === PLAYBOOK_TYPE_IDS.BUILD_VS_BUY}
                    />
                </GridItem>
            </Grid>
        </Box>
    )
}
