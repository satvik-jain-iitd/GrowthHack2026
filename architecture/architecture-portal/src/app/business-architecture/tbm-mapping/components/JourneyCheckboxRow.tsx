import React, { memo } from 'react'
import { Checkbox, HStack, Text } from '@chakra-ui/react'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { AIIcon } from '@/components/icons/AIIcon'

type Props = {
    journey: CustomerJourney
    isChecked: boolean
    isAI: boolean
    onToggle: (id: string) => void
}

export const JourneyCheckboxRow = memo(function JourneyCheckboxRow({
    journey,
    isChecked,
    isAI,
    onToggle
}: Props) {
    return (
        <Checkbox.Root
            colorPalette={isAI && isChecked ? 'orange' : 'blue'}
            checked={isChecked}
            size='lg'
            onCheckedChange={() => onToggle(journey.journey_id)}
        >
            <Checkbox.HiddenInput />
            <Checkbox.Control
                style={{ width: '24px', height: '24px', minWidth: '24px' }}
            />
            <Checkbox.Label>
                <HStack gap={3} alignItems='center'>
                    <Text
                        data-testid={`journey-checkbox-label-${journey.journey_id}`}
                        fontSize='16px'
                        fontWeight='400'
                    >
                        {journey.journey_statement}
                    </Text>
                    {isAI && <AIIcon width={16} height={16} />}
                </HStack>
            </Checkbox.Label>
        </Checkbox.Root>
    )
})
