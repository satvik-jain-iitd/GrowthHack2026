import React from 'react'
import { Accordion, Badge, Box, Text, VStack } from '@chakra-ui/react'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { JourneyCheckboxRow } from './JourneyCheckboxRow'

type Props = {
    groupedJourneys: [string, CustomerJourney[]][]
    aiRecommendedIds: Set<string>
    selectedIds: Set<string>
    onToggle: (id: string) => void
}

export function JourneyGroupList({
    groupedJourneys,
    aiRecommendedIds,
    selectedIds,
    onToggle
}: Props) {
    return (
        <Box
            width='100%'
            maxHeight='480px'
            overflowY='auto'
            border='1px solid'
            borderColor='border.subtle'
            borderRadius='lg'
            p={4}
            bg={'bg.muted'}
        >
            <Accordion.Root multiple>
                {groupedJourneys.map(([groupName, journeys]) => (
                    <Accordion.Item
                        key={groupName}
                        value={groupName}
                        border='none'
                        mb={4}
                    >
                        <Accordion.ItemTrigger
                            _hover={{ cursor: 'pointer', bg: 'transparent' }}
                            py={1}
                            px={0}
                        >
                            <Accordion.ItemIndicator color='#006FCF' />
                            <Text
                                data-testid={`journey-group-name-${groupName}`}
                                fontWeight='700'
                                fontSize='16px'
                                color={{ base: '#00175a', _dark: 'blue.300' }}
                                textTransform='uppercase'
                                letterSpacing='0.05em'
                            >
                                {groupName}
                            </Text>
                            {journeys.filter(j => selectedIds.has(j.journey_id))
                                .length > 0 && (
                                <Badge
                                    colorPalette='blue'
                                    variant='solid'
                                    borderRadius='full'
                                    px={2}
                                    fontSize='sm'
                                    ml={2}
                                >
                                    {
                                        journeys.filter(j =>
                                            selectedIds.has(j.journey_id)
                                        ).length
                                    }
                                </Badge>
                            )}
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent pt={2} px={0}>
                            <Accordion.ItemBody p={0}>
                                <VStack alignItems='flex-start' gap={2}>
                                    {journeys.map(
                                        journey =>
                                            !journey.user_proposed && (
                                                <JourneyCheckboxRow
                                                    key={journey.journey_id}
                                                    journey={journey}
                                                    isChecked={selectedIds.has(
                                                        journey.journey_id
                                                    )}
                                                    isAI={aiRecommendedIds.has(
                                                        journey.journey_id
                                                    )}
                                                    onToggle={onToggle}
                                                />
                                            )
                                    )}
                                </VStack>
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </Box>
    )
}
