import React from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Heading,
    HStack,
    Separator,
    Text,
    VStack
} from '@chakra-ui/react'
import { IconAccount, IconLocation } from '@americanexpress/dls-icons'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import type { CapabilityNode } from '@/app/business-architecture/types'
import { AIIcon } from '@/components/icons/AIIcon'
import { getCapabilityPathsForIds } from '../utils/capabilityTree'

type Props = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    journeys: CustomerJourney[]
    journeyCapabilities: { journey_id: string; capability_ids: string[] }[]
    capabilityHierarchy: CapabilityNode[]
    journeyAICapabilities?: { journey_id: string; capability_ids: string[] }[]
    confirmLabel?: string
    isConfirmLoading?: boolean
    onEditJourney?: (journeyId: string) => void
    headerText?: string
}

const LABEL_WIDTH = '200px'

function CapabilityL1Group({
    l1Name,
    items,
    aiCapabilityIdSet
}: {
    l1Name: string
    items: { segments: string[]; id: string }[]
    aiCapabilityIdSet: Set<string>
}) {
    return (
        <Box>
            <Text
                data-testid={`l1-group-name-${l1Name}`}
                fontSize='13px'
                fontWeight='700'
                mb={1}
            >
                {l1Name}:
            </Text>
            <VStack alignItems='flex-start' gap={1}>
                {items.map(({ segments, id }, i) => {
                    const isAI = aiCapabilityIdSet.has(id)
                    return (
                        <Text
                            key={i}
                            fontSize='13px'
                            color='fg.default'
                            as='span'
                            display='block'
                        >
                            {segments.slice(0, -1).join(' → ')}
                            {segments.length > 1 && ' → '}
                            <Box
                                as='span'
                                data-testid={`capability-leaf-${id}`}
                                display='inline-flex'
                                alignItems='center'
                                gap='3px'
                                fontWeight='600'
                                color={isAI ? '#C44B25' : '#006FCF'}
                                bg={isAI ? '#FEF1E7' : '#EAF3FF'}
                                px='4px'
                                py='1px'
                                borderRadius='4px'
                                verticalAlign='middle'
                            >
                                {isAI && (
                                    <AIIcon
                                        width={12}
                                        height={12}
                                        style={{ flexShrink: 0 }}
                                    />
                                )}
                                {segments[segments.length - 1]}
                            </Box>
                        </Text>
                    )
                })}
            </VStack>
        </Box>
    )
}

function JourneySection({
    journey,
    capabilityIds,
    capabilityHierarchy,
    aiCapabilityIdSet,
    onEditJourney
}: {
    journey: CustomerJourney
    capabilityIds: string[]
    capabilityHierarchy: CapabilityNode[]
    aiCapabilityIdSet: Set<string>
    onEditJourney?: (journeyId: string) => void
}) {
    const paths = getCapabilityPathsForIds(capabilityIds, capabilityHierarchy)

    // Group by L1, keeping path segments and ID together for AI badge styling
    const byL1 = new Map<
        string,
        { l1Name: string; items: { segments: string[]; id: string }[] }
    >()
    for (const { id, l1Id, path } of paths) {
        if (!byL1.has(l1Id)) {
            byL1.set(l1Id, { l1Name: path[0] ?? '', items: [] })
        }
        byL1.get(l1Id)!.items.push({ segments: path.slice(1), id })
    }

    return (
        <Box>
            {/* Journey row: label left, value right */}
            <HStack alignItems='flex-start' gap={4} mb={4}>
                <HStack
                    alignItems='center'
                    gap={2}
                    minWidth={LABEL_WIDTH}
                    width={LABEL_WIDTH}
                    flexShrink={0}
                >
                    <IconAccount
                        style={{
                            color: '#006FCF',
                            width: '16px',
                            height: '16px',
                            flexShrink: 0
                        }}
                    />
                    <Text
                        textWrap={'nowrap'}
                        fontSize='13px'
                        fontWeight='700'
                        color='#006FCF'
                    >
                        Enterprise Customer Journey:
                    </Text>
                </HStack>
                <Text
                    data-testid={`modal-journey-statement-${journey.journey_id}`}
                    fontSize='14px'
                    color='fg.default'
                    lineHeight='1.5'
                    flex='1'
                    minWidth={0}
                    ml={10}
                >
                    {journey.journey_statement}
                </Text>
                {onEditJourney && (
                    <Button
                        size='xs'
                        variant='outline'
                        colorPalette='blue'
                        flexShrink={0}
                        onClick={() => onEditJourney(journey.journey_id)}
                    >
                        Edit
                    </Button>
                )}
            </HStack>

            {/* Capability map row: label left, capabilities right */}
            <HStack alignItems='flex-start' gap={4}>
                <HStack
                    alignItems='center'
                    gap={2}
                    minWidth={LABEL_WIDTH}
                    width={LABEL_WIDTH}
                    flexShrink={0}
                >
                    <IconLocation
                        style={{
                            color: '#006FCF',
                            width: '16px',
                            height: '16px',
                            flexShrink: 0
                        }}
                    />
                    <Text
                        textWrap={'nowrap'}
                        fontSize='13px'
                        fontWeight='700'
                        color='#006FCF'
                    >
                        Enterprise Business Capabilities:
                    </Text>
                </HStack>
                <Box flex='1' minWidth={0}>
                    {byL1.size === 0 ? (
                        <Text
                            data-testid='no-capabilities-selected'
                            fontSize='13px'
                            color='text.subtle'
                            fontStyle='italic'
                            ml='10'
                        >
                            No Enterprise Business Capabilities selected
                        </Text>
                    ) : (
                        <VStack ml='10' alignItems='flex-start' gap={3}>
                            {Array.from(byL1.values()).map(
                                ({ l1Name, items }) => (
                                    <CapabilityL1Group
                                        key={l1Name}
                                        l1Name={l1Name}
                                        items={items}
                                        aiCapabilityIdSet={aiCapabilityIdSet}
                                    />
                                )
                            )}
                        </VStack>
                    )}
                </Box>
            </HStack>
        </Box>
    )
}

export function SubmitSummaryModal({
    isOpen,
    onClose,
    onConfirm,
    journeys,
    journeyCapabilities,
    capabilityHierarchy,
    journeyAICapabilities = [],
    confirmLabel = 'Submit Selections',
    headerText = 'Selection Summary',
    isConfirmLoading = false,
    onEditJourney
}: Props) {
    const capsByJourney = new Map(
        journeyCapabilities.map(jc => [jc.journey_id, jc.capability_ids])
    )
    const aiCapsByJourney = new Map(
        journeyAICapabilities.map(jc => [
            jc.journey_id,
            new Set(jc.capability_ids)
        ])
    )

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => {
                if (!e.open) onClose()
            }}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW='1200px' width='92vw' bg={'bg.muted'}>
                    <Dialog.Header px={8}>
                        <Heading size='2xl' fontWeight='700'>
                            {headerText}
                        </Heading>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body px={8} overflowY='auto' maxH='72vh'>
                        <VStack alignItems='stretch' gap={0}>
                            {journeys.map((journey, idx) => (
                                <Box key={journey.journey_id}>
                                    {idx > 0 && <Separator my={6} />}
                                    <JourneySection
                                        journey={journey}
                                        capabilityIds={
                                            capsByJourney.get(
                                                journey.journey_id
                                            ) ?? []
                                        }
                                        capabilityHierarchy={
                                            capabilityHierarchy
                                        }
                                        aiCapabilityIdSet={
                                            aiCapsByJourney.get(
                                                journey.journey_id
                                            ) ?? new Set()
                                        }
                                        onEditJourney={onEditJourney}
                                    />
                                </Box>
                            ))}
                        </VStack>
                    </Dialog.Body>
                    <Separator />
                    <Dialog.Footer
                        display='flex'
                        justifyContent='flex-start'
                        gap='12px'
                        py={4}
                        px={8}
                    >
                        <Button
                            colorPalette='blue'
                            onClick={onConfirm}
                            loading={isConfirmLoading}
                            loadingText={confirmLabel}
                        >
                            {confirmLabel}
                        </Button>
                        <Button variant='outline' onClick={onClose}>
                            Cancel
                        </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size='sm' />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
