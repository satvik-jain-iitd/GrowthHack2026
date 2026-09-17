/* istanbul ignore file */
import React from 'react'
import { JourneyCard } from './JourneyCard'
import {
    Box,
    Collapsible,
    Grid,
    HStack,
    Text,
    useCollapsible
} from '@chakra-ui/react'
import { CustomerJourney } from '../CustomerJourneyDetails'
import { IconChevronDown } from '@americanexpress/dls-icons'

interface JourneyGroup {
    groupName: string
    journeys: CustomerJourney[]
}

export const JourneyCardView = ({
    journeys
}: {
    journeys: JourneyGroup[] | undefined
}) => {
    const collapsible = useCollapsible()

    return (
        <Box width='100%' marginTop={{ base: '10px', sm: '10px' }}>
            <Box marginBottom='10px'>
                {journeys?.map(group => (
                    <>
                        <Collapsible.Root width='100%'>
                            <Collapsible.Trigger
                                paddingY='3'
                                display='flex'
                                gap='2'
                                alignItems='center'
                                onClick={() =>
                                    collapsible.setOpen(!collapsible.open)
                                }
                                _hover={{ cursor: 'pointer' }}
                                width='97%'
                                padding={2}
                            >
                                <HStack
                                    justifyContent='space-between'
                                    width='100%'
                                    border='2px solid #C8C9C7'
                                    borderRadius='md'
                                    padding={2}
                                >
                                    <Text
                                        font='BentonSans'
                                        fontSize='16px'
                                        fontWeight={700}
                                        lineHeight={'24px'}
                                        color={{
                                            base: '#53565A',
                                            _dark: 'white'
                                        }}
                                        marginLeft={2}
                                    >
                                        {group.groupName}
                                    </Text>
                                    <Collapsible.Indicator
                                        transition='transform 0.2s'
                                        _open={{ transform: 'rotate(90deg)' }}
                                        paddingBottom={1}
                                    >
                                        <IconChevronDown
                                            isFilled
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                fontSize: '24px'
                                            }}
                                        />
                                    </Collapsible.Indicator>
                                </HStack>
                            </Collapsible.Trigger>
                            <Collapsible.Content>
                                <Grid
                                    templateColumns={{
                                        lg: 'repeat(4, 1fr)',
                                        md: 'repeat(3, 1fr)',
                                        sm: 'repeat(1, 1fr)'
                                    }}
                                    gap='3'
                                >
                                    {group.journeys?.map(journey => (
                                        <JourneyCard
                                            key={journey.journey_id}
                                            title={journey.journey_statement}
                                            journeyId={journey.journey_id}
                                            link={
                                                journey.journey_link ||
                                                '/' +
                                                    'enterprise-customer-journeys/' +
                                                    journey.journey_id
                                            }
                                        />
                                    ))}
                                </Grid>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    </>
                ))}
            </Box>
        </Box>
    )
}
