/* istanbul ignore file */
'use client'
import React, { useMemo, useState } from 'react'
import {
    Box,
    HStack,
    Text,
    Highlight,
    InputGroup,
    Input,
    VStack
} from '@chakra-ui/react'
import Image from 'next/image'
import { CustomerJourneyHeader } from './CustomerJourneyHeader'
import { IconSearch } from '@americanexpress/dls-icons'
import { useCustomerJourneys } from '@/app/business-architecture/hooks'
import { JourneyCardView } from './JourneyCardView'

export const CustomerJourneysIndex = () => {
    const { customer_journey, loading } = useCustomerJourneys()
    const [search, setSearch] = useState('')

    const filteredJourneys = customer_journey?.filter(
        journey => !journey.user_proposed
    )

    const groupedJourneys = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .replaceAll('-', '')
            .replaceAll(' ', '')
            .toLowerCase()
        const journeys = (filteredJourneys ?? []).filter(journey => {
            if (!normalizedSearch) return true

            return (
                journey.journey_statement
                    .trim()
                    .replaceAll('-', '')
                    .replaceAll(' ', '')
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                journey.journey_grp_tx
                    .trim()
                    .replaceAll('-', '')
                    .replaceAll(' ', '')
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                journey.journey_desc
                    ?.trim()
                    .replaceAll('-', '')
                    .replaceAll(' ', '')
                    .toLowerCase()
                    .includes(normalizedSearch)
            )
        })

        const groups = new Map<string, typeof journeys>()

        for (const journey of journeys) {
            const groupName = journey.journey_grp_tx || 'Other'
            const group = groups.get(groupName)

            if (group) {
                group.push(journey)
            } else {
                groups.set(groupName, [journey])
            }
        }

        return Array.from(groups.entries())
            .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
            .map(([groupName, groupJourneys]) => ({
                groupName,
                journeys: [...groupJourneys].sort((journeyA, journeyB) =>
                    journeyA.journey_statement.localeCompare(
                        journeyB.journey_statement
                    )
                )
            }))
    }, [filteredJourneys, search])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Box minWidth='100%'>
            <CustomerJourneyHeader />
            <Box
                backgroundColor={{
                    base: 'surface.white',
                    _dark: 'surface.default.offwhite'
                }}
                width='100%'
                height='100%'
                px={2}
            >
                <HStack justifyContent='space-between' alignItems='flex-start'>
                    <Box
                        maxWidth={{ base: '100%', md: '40%' }}
                        alignSelf='center'
                    >
                        <Text
                            fontSize='24px'
                            fontWeight='400'
                            verticalAlign='top'
                            mb={5}
                            mt={3}
                        >
                            <Highlight
                                query='Enterprise Customer Journeys'
                                styles={{
                                    fontWeight: 'bold',
                                    color: 'text.brand'
                                }}
                            >
                                Enterprise Customer Journeys
                            </Highlight>{' '}
                            is the Architecture inventory of top-level customer
                            journeys and personas representing end-to-end
                            experiences across the enterprise.
                        </Text>
                        <InputGroup
                            flex='1'
                            endElement={<IconSearch />}
                            backgroundColor='transparent'
                            width='100%'
                        >
                            <Input
                                variant='subtle'
                                borderRadius='lg'
                                border='1px solid'
                                borderColor='border.emphasis'
                                width='100%'
                                placeholder='Search for a customer journey'
                                id='customerJourneySearch'
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                background='surface.white'
                            />
                        </InputGroup>
                    </Box>
                    <Box
                        alignItems='flex-end'
                        maxW='680px'
                        paddingTop={0}
                        marginTop={4}
                    >
                        <Image
                            src='/business-architecture/customerJourneysHero.png'
                            alt='hero image'
                            width={0}
                            height={0}
                            sizes='100vw'
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '75%',
                                float: 'right'
                            }}
                        />
                    </Box>
                </HStack>
            </Box>
            <VStack align='stretch' gap={6} mt={8} px={2}>
                {groupedJourneys.length === 0 ? (
                    <Box
                        p={6}
                        border='1px solid'
                        borderColor='border.subtle'
                        borderRadius='xl'
                        background='surface.white'
                    >
                        <Text fontSize='16px' color='text.subtle'>
                            No customer journeys match your search.
                        </Text>
                    </Box>
                ) : (
                    <JourneyCardView journeys={groupedJourneys} />
                )}
            </VStack>
        </Box>
    )
}
