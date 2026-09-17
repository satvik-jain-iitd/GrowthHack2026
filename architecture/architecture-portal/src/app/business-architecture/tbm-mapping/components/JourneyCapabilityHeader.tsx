'use client'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { SelectionStatusBar } from './SelectionStatusBar'
import PreExistingMappingsDisclaimer from './PreExistingMappingsDisclaimer'
import { AICheckBoxIcon } from '@/components/icons/AICheckBoxIcon'

type Props = {
    journeyStatement: string
    onBack?: () => void
    onSaveAndNext: () => void
    onSubmitAll: () => void
    isLastJourney: boolean
    allJourneysVisited: boolean
    preExistingMappings?: boolean
}

export function JourneyCapabilityHeader({
    journeyStatement,
    onBack,
    onSaveAndNext,
    onSubmitAll,
    isLastJourney,
    allJourneysVisited,
    preExistingMappings
}: Props) {
    return (
        <VStack
            alignItems='flex-start'
            width='100%'
            marginX={2}
            marginBottom={2}
            marginTop={1}
            gap={1}
        >
            {preExistingMappings && <PreExistingMappingsDisclaimer />}
            <Text
                data-testid='journey-statement'
                fontWeight='600'
                fontSize='22px'
            >
                {journeyStatement}
            </Text>
            <HStack justifyContent='space-between' width='100%'>
                <Box display={'flex'} alignItems={'center'}>
                    <Text
                        pr={1}
                        data-testid='capability-instructions'
                        fontSize='16px'
                    >
                        Expand a capability group to select Enterprise Business
                        Capabilities. (
                    </Text>
                    <AICheckBoxIcon />
                    <Text pl={1}> = AI Selected )</Text>
                </Box>

                <SelectionStatusBar
                    onBack={onBack}
                    onSaveAndNext={onSaveAndNext}
                    onSubmitAll={onSubmitAll}
                    isLastJourney={isLastJourney}
                    allJourneysVisited={allJourneysVisited}
                />
            </HStack>
        </VStack>
    )
}
