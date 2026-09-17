'use client'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { TBM_MAPPING_HELP_SLACK_URL } from '@/constants'
import { useScrollContext } from '@/context'
import { IconAccount } from '@americanexpress/dls-icons'
import { Box, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    useActiveJourneyId,
    useJourneySelectedCount
} from './CapabilitySelectionContext'
import SlackHelpButton from './SlackHelpButton'

// Matches the id set on <EbaHeader> in EbaHeader.tsx
const EBA_HEADER_ID = 'eba-header'
const FOOTER_ID = 'global-footer'

type Props = {
    journeys: CustomerJourney[]
    highestReachedIndex: number
    onJourneySelect: (journeyId: string) => void
}

function JourneyRow({
    journey,
    idx,
    highestReachedIndex,
    isNavigating,
    onJourneyClick
}: {
    journey: CustomerJourney
    idx: number
    highestReachedIndex: number
    isNavigating: boolean
    onJourneyClick: (id: string) => void
}) {
    const activeJourneyId = useActiveJourneyId()
    const count = useJourneySelectedCount(journey.journey_id)
    const isActive = journey.journey_id === activeJourneyId
    const isPending = idx > highestReachedIndex
    // Show active styling optimistically as soon as the row is clicked
    const showAsActive = isActive || isNavigating

    return (
        <Box
            px={3}
            py={2}
            width='100%'
            borderRadius='md'
            backgroundColor={showAsActive ? '#EAF3FF' : 'transparent'}
            cursor={isPending ? 'default' : 'pointer'}
            pointerEvents={isPending ? 'none' : 'auto'}
            opacity={isPending ? 0.5 : 1}
            _hover={
                isPending
                    ? {}
                    : {
                          backgroundColor: showAsActive ? '#EAF3FF' : 'gray.50'
                      }
            }
            onClick={() => onJourneyClick(journey.journey_id)}
        >
            <HStack gap={2} alignItems='flex-start'>
                <Text
                    data-testid={`sidebar-journey-${journey.journey_id}`}
                    fontSize='13px'
                    fontWeight={showAsActive ? '600' : '400'}
                    color={isPending ? 'gray.400' : '#006FCF'}
                    lineHeight='1.4'
                    flex='1'
                >
                    {journey.journey_statement}
                </Text>
                {isNavigating && !isActive && (
                    <Spinner
                        size='xs'
                        color='#006FCF'
                        borderWidth='1.5px'
                        flexShrink={0}
                        mt='2px'
                    />
                )}
            </HStack>
            {count > 0 && (
                <Text
                    data-testid={`sidebar-count-${journey.journey_id}`}
                    fontSize='11px'
                    color={showAsActive ? '#006FCF' : 'text.subtle'}
                    mt={0.5}
                >
                    {count} selected
                </Text>
            )}
        </Box>
    )
}

export function JourneySidebar({
    journeys,
    highestReachedIndex,
    onJourneySelect
}: Props) {
    const activeJourneyId = useActiveJourneyId()
    const [pendingId, setPendingId] = useState<string | null>(null)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const { scrollRef } = useScrollContext()

    // Clear pendingId when the active journey changes (e.g. via Save & Next)
    useEffect(() => {
        setPendingId(null)
    }, [activeJourneyId])

    // Mutate styles on scroll to avoid re-renders on the hot path.
    // Uses a passive scroll listener for synchronous updates each frame.
    useEffect(() => {
        const sidebarElement = sidebarRef.current
        const scrollContainer = scrollRef.current
        if (!sidebarElement || !scrollContainer) return

        const ebaHeader = document.getElementById(EBA_HEADER_ID)
        const footer = document.getElementById(FOOTER_ID)

        const update = () => {
            const scrollTop = scrollContainer.scrollTop
            const viewportHeight = scrollContainer.clientHeight
            const ebaHeaderHeight = ebaHeader?.offsetHeight ?? 0
            const footerHeight = footer?.offsetHeight ?? 0
            const totalHeight = scrollContainer.scrollHeight

            const topOffset = Math.max(0, ebaHeaderHeight - scrollTop)
            const footerVisible = Math.max(
                0,
                scrollTop + viewportHeight - (totalHeight - footerHeight)
            )

            sidebarElement.style.top = `${topOffset}px`
            sidebarElement.style.height = `calc(100vh - ${topOffset}px - ${footerVisible}px)`
        }

        scrollContainer.addEventListener('scroll', update, { passive: true })
        update()

        return () => scrollContainer.removeEventListener('scroll', update)
    }, [])

    const handleJourneyClick = useCallback(
        (id: string) => {
            if (id === activeJourneyId || id === pendingId) return
            setPendingId(id)
            onJourneySelect(id)
        },
        [activeJourneyId, pendingId, onJourneySelect]
    )

    return (
        <Box
            ref={sidebarRef}
            position='sticky'
            top='0px'
            height='100vh'
            width='260px'
            minWidth='260px'
            borderRight='1px solid'
            borderColor='border.subtle'
            backgroundColor='surface.foreground'
            display='flex'
            flexDirection='column'
            overflow='hidden'
            alignSelf='flex-start'
        >
            {/* Scrollable top content */}
            <Box flex='1' overflowY='auto' px={4} pt={6}>
                <HStack gap={2} mb={5} alignItems='center'>
                    <IconAccount
                        style={{
                            color: '#006FCF',
                            width: '20px',
                            height: '20px',
                            flexShrink: 0
                        }}
                    />
                    <Text
                        data-testid='sidebar-header'
                        fontWeight='700'
                        fontSize='14px'
                        color='#006FCF'
                    >
                        Enterprise Customer Journeys Selected
                    </Text>
                </HStack>
                <VStack alignItems='flex-start' gap={0}>
                    {journeys.map((j, idx) => (
                        <JourneyRow
                            key={j.journey_id}
                            journey={j}
                            idx={idx}
                            highestReachedIndex={highestReachedIndex}
                            isNavigating={
                                pendingId === j.journey_id &&
                                pendingId !== activeJourneyId
                            }
                            onJourneyClick={handleJourneyClick}
                        />
                    ))}
                </VStack>
            </Box>

            <Box
                px={4}
                pb={4}
                flexShrink={0}
                display='flex'
                justifyContent='center'
            >
                <SlackHelpButton
                    href={TBM_MAPPING_HELP_SLACK_URL}
                    iconSrc='/slack-icon-size_256.png'
                    iconAlt='Slack Help Link'
                    label='Need Help?'
                />
            </Box>
        </Box>
    )
}
