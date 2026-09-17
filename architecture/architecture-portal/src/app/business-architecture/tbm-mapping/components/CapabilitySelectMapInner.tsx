/* istanbul ignore file */
'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Grid, HStack, VStack } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import {
    APPTIO_EPIC_MAPPINGS_QUERY_KEY,
    type ApptioEpicMapping
} from '@/app/business-architecture/hooks/useGetApptioEpicMappings'
import {
    useCapabilities,
    useCapabilityOwners,
    useCustomerJourneys
} from '@/app/business-architecture/hooks'
import { useUserContext } from '@/context'
import {
    useActiveJourneyId,
    useGetAllJourneyAICapabilities,
    useGetAllJourneyCapabilities
} from './CapabilitySelectionContext'
import type { CapabilitySelectionStore } from './CapabilitySelectionContext'
import { CapabilitySelectCard } from './CapabilitySelectCard'
import { CapabilityLoadingSpinner } from './CapabilityLoadingSpinner'
import { JourneyCapabilityHeader } from './JourneyCapabilityHeader'
import { JourneySidebar } from './JourneySidebar'
import { SubmitSummaryModal } from './SubmitSummaryModal'
import { useModalState } from '../hooks/useModalState'
import type { useCapabilityHierarchy } from '../hooks/useCapabilityHierarchy'
import { CapabilityFilterBar } from '@/app/business-architecture/components/CapabilityFilterBar'
import { useCapabilityFilters } from '@/app/business-architecture/hooks/useCapabilityFilters'

type Props = {
    epicId: string
    selectedJourneys: CustomerJourney[]
    onBack?: () => void
    onSubmitComplete?: () => void
    onSessionExpired?: () => void
    store: CapabilitySelectionStore
    capabilityHierarchy: ReturnType<typeof useCapabilityHierarchy>
    loading: boolean
    aiAncestorsByJourney: Map<string, string[]>
    savedMappings: ApptioEpicMapping[]
    hasPreExistingMappings: Map<string, boolean>
}

export function CapabilitySelectMapInner({
    epicId,
    selectedJourneys,
    onBack,
    onSubmitComplete,
    onSessionExpired,
    store,
    capabilityHierarchy,
    loading,
    aiAncestorsByJourney,
    savedMappings,
    hasPreExistingMappings
}: Props) {
    const queryClient = useQueryClient()
    const userContext = useUserContext()
    const activeJourneyId = useActiveJourneyId()
    const getAllJourneyCapabilities = useGetAllJourneyCapabilities()
    const getAllJourneyAICapabilities = useGetAllJourneyAICapabilities()

    const { capability = [] } = useCapabilities()
    const { capability_owners = [] } = useCapabilityOwners()
    const { customer_journey = [] } = useCustomerJourneys()

    const {
        capabilityFilter,
        updateFilter,
        clearFilters,
        hasContentFilter,
        filteredHierarchy,
        matchedCapabilityIds,
        autoExpandedIds,
        allCustomers,
        capabilityLevel,
        setCapabilityLevel,
        setExpansionMode,
        maxLevel
    } = useCapabilityFilters({
        capability,
        capabilityHierarchy,
        capabilityOwners: capability_owners,
        customerJourneys: customer_journey
    })

    // Determine which journeys have been saved
    const savedJourneyIds = useMemo(
        () => new Set(savedMappings.map(m => m.journeyId)),
        [savedMappings]
    )

    // Find the first unsaved journey index
    const firstUnsavedIndex = useMemo(() => {
        const idx = selectedJourneys.findIndex(
            j => !savedJourneyIds.has(j.journey_id)
        )
        return idx === -1 ? 0 : idx
    }, [selectedJourneys, savedJourneyIds])

    const allJourneysSaved = useMemo(
        () =>
            selectedJourneys.length > 0 &&
            selectedJourneys.every(j => savedJourneyIds.has(j.journey_id)),
        [selectedJourneys, savedJourneyIds]
    )

    const [currentJourneyIndex, setCurrentJourneyIndex] =
        useState(firstUnsavedIndex)
    const [highestReachedIndex, setHighestReachedIndex] = useState(
        allJourneysSaved ? selectedJourneys.length - 1 : firstUnsavedIndex
    )

    // Update starting index when mappings load
    const initializedRef = React.useRef(false)
    useEffect(() => {
        if (initializedRef.current) return
        if (savedMappings.length > 0 || !loading) {
            initializedRef.current = true
            setCurrentJourneyIndex(firstUnsavedIndex)
            setHighestReachedIndex(
                allJourneysSaved
                    ? selectedJourneys.length - 1
                    : firstUnsavedIndex
            )
        }
    }, [
        firstUnsavedIndex,
        allJourneysSaved,
        savedMappings.length,
        loading,
        selectedJourneys.length
    ])

    const currentJourney = selectedJourneys[currentJourneyIndex]
    const isLastJourney = currentJourneyIndex === selectedJourneys.length - 1

    useEffect(() => {
        const journey = selectedJourneys[currentJourneyIndex]
        if (journey) {
            store.setActiveJourney(journey.journey_id)
        }
    }, [currentJourneyIndex, selectedJourneys, store])

    const handleJourneySelect = useCallback(
        (journeyId: string) => {
            const idx = selectedJourneys.findIndex(
                j => j.journey_id === journeyId
            )
            if (idx !== -1) setCurrentJourneyIndex(idx)
        },
        [selectedJourneys]
    )

    const handleAdvanceJourney = useCallback(() => {
        setCurrentJourneyIndex(prev => {
            const next = prev + 1
            setHighestReachedIndex(h => Math.max(h, next))
            return next
        })
    }, [])

    const handleSaveSuccess = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: APPTIO_EPIC_MAPPINGS_QUERY_KEY(epicId)
        })
    }, [queryClient, epicId])

    const {
        modalMode,
        setModalMode,
        isJourneyModalLoading,
        isFinalLoading,
        sessionExpired,
        modalSnapshot,
        aiModalSnapshot,
        handleSaveAndNext,
        handleJourneyModalConfirm,
        handleFinalConfirm,
        handleSubmitAll,
        handleEditJourney
    } = useModalState({
        epicId,
        currentJourneyId: currentJourney?.journey_id ?? '',
        isLastJourney,
        onSubmitComplete,
        onJourneySelect: handleJourneySelect,
        onAdvanceJourney: handleAdvanceJourney,
        onSaveSuccess: handleSaveSuccess,
        getAllJourneyCapabilities,
        getAllJourneyAICapabilities,
        user: {
            userEmail: userContext?.attributes?.email ?? '',
            userName: userContext?.attributes?.fullName ?? ''
        }
    })

    const activeAiAncestorIds = useMemo(
        () =>
            activeJourneyId
                ? (aiAncestorsByJourney.get(activeJourneyId) ?? [])
                : [],
        [activeJourneyId, aiAncestorsByJourney]
    )

    const [expandedL1s, setExpandedL1s] = useState<Set<string>>(
        () => new Set(capabilityHierarchy.map(cap => cap.capability_id))
    )
    const l1ExpansionInitializedRef = React.useRef(false)

    useEffect(() => {
        if (l1ExpansionInitializedRef.current) return
        if (loading) return
        if (capabilityHierarchy.length === 0) return

        l1ExpansionInitializedRef.current = true
        setExpandedL1s(
            new Set(capabilityHierarchy.map(cap => cap.capability_id))
        )
    }, [loading, capabilityHierarchy])

    const handleToggleL1 = useCallback((id: string) => {
        setExpandedL1s(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])

    const journeyModalJourneys = currentJourney ? [currentJourney] : []
    const journeyModalCaps = modalSnapshot.filter(
        jc => jc.journey_id === currentJourney?.journey_id
    )
    const journeyModalAICaps = aiModalSnapshot.filter(
        jc => jc.journey_id === currentJourney?.journey_id
    )

    // Build final modal data from saved mappings
    const finalModalCaps = useMemo(
        () =>
            selectedJourneys.map(j => {
                const mapping = savedMappings.find(
                    m => m.journeyId === j.journey_id
                )
                return {
                    journey_id: j.journey_id,
                    capability_ids: mapping
                        ? mapping.capabilities.map(c => c.capability_id)
                        : getAllJourneyCapabilities()
                              .map(j =>
                                  j.journey_id === j.journey_id
                                      ? j.capability_ids
                                      : []
                              )
                              .flat()
                }
            }),
        [getAllJourneyCapabilities, savedMappings, selectedJourneys]
    )
    const finalModalAICaps = useMemo(
        () =>
            savedMappings.map(m => ({
                journey_id: m.journeyId,
                capability_ids: m.capabilities
                    .filter(c => c.isAIRecommended === 'true')
                    .map(c => c.capability_id)
            })),
        [savedMappings]
    )

    if (loading) {
        return (
            <CapabilityLoadingSpinner text='Loading Enterprise Customer Journeys...' />
        )
    }

    if (sessionExpired) {
        onSessionExpired?.()
        return null
    }

    return (
        <>
            <HStack alignItems='stretch' gap={0} width='100%'>
                {selectedJourneys.length > 0 && (
                    <JourneySidebar
                        journeys={selectedJourneys}
                        highestReachedIndex={highestReachedIndex}
                        onJourneySelect={handleJourneySelect}
                    />
                )}
                <Box flex='1' mx='auto' px={0} mb={12} borderRadius='17px'>
                    <VStack px={8} marginTop={3}>
                        <JourneyCapabilityHeader
                            journeyStatement={
                                currentJourney?.journey_statement ?? ''
                            }
                            onBack={onBack}
                            onSaveAndNext={handleSaveAndNext}
                            onSubmitAll={handleSubmitAll}
                            isLastJourney={isLastJourney}
                            allJourneysVisited={allJourneysSaved}
                            preExistingMappings={hasPreExistingMappings.get(
                                currentJourney?.journey_id ?? ''
                            )}
                        />
                        <Box width='100%' mx={0} px={0} borderRadius='17px'>
                            <CapabilityFilterBar
                                capabilityFilter={capabilityFilter}
                                updateFilter={updateFilter}
                                clearFilters={clearFilters}
                                hasContentFilter={hasContentFilter}
                                allCustomers={allCustomers}
                                customerJourneys={customer_journey}
                                showLevelControl={true}
                                minLevel={2}
                                maxLevel={maxLevel}
                                capabilityLevel={capabilityLevel}
                                onLevelDecrement={() => {
                                    setExpansionMode('level')
                                    const newLevel = Math.max(
                                        2,
                                        Number(capabilityLevel) - 1
                                    )
                                    setCapabilityLevel(newLevel.toString())
                                }}
                                onLevelIncrement={() => {
                                    setExpansionMode('level')
                                    const newLevel = Math.min(
                                        maxLevel,
                                        Number(capabilityLevel) + 1
                                    )
                                    setCapabilityLevel(newLevel.toString())
                                }}
                                showCustomerFilter={false}
                                showJourneyFilter={false}
                            />
                        </Box>
                        <Grid
                            templateColumns={{
                                lg: 'repeat(7, 1fr)',
                                md: 'repeat(2, 1fr)',
                                sm: 'repeat(1, 1fr)'
                            }}
                            gap={5}
                            position='relative'
                            width='100%'
                        >
                            {filteredHierarchy.map(cap => (
                                <CapabilitySelectCard
                                    key={cap.capability_id}
                                    capability={cap}
                                    isExpanded={
                                        expandedL1s.has(cap.capability_id) ||
                                        (hasContentFilter &&
                                            autoExpandedIds.has(
                                                cap.capability_id
                                            ))
                                    }
                                    onToggleExpand={handleToggleL1}
                                    defaultExpanded={activeAiAncestorIds}
                                    activeJourneyId={activeJourneyId ?? ''}
                                    isFilterMatch={matchedCapabilityIds.has(
                                        cap.capability_id
                                    )}
                                    hasContentFilter={hasContentFilter}
                                    autoExpandedIds={autoExpandedIds}
                                    matchedCapabilityIds={matchedCapabilityIds}
                                />
                            ))}
                        </Grid>
                    </VStack>
                </Box>
            </HStack>

            {/* Per-journey summary modal */}
            <SubmitSummaryModal
                isOpen={modalMode === 'journey'}
                onClose={() => setModalMode(null)}
                onConfirm={handleJourneyModalConfirm}
                journeys={journeyModalJourneys}
                journeyCapabilities={journeyModalCaps}
                journeyAICapabilities={journeyModalAICaps}
                capabilityHierarchy={capabilityHierarchy}
                confirmLabel='Save'
                headerText='Review Selections'
                isConfirmLoading={isJourneyModalLoading}
            />

            {/* Full summary modal — shown after last journey is confirmed */}
            <SubmitSummaryModal
                isOpen={modalMode === 'final'}
                onClose={() => setModalMode(null)}
                onConfirm={handleFinalConfirm}
                journeys={selectedJourneys}
                journeyCapabilities={finalModalCaps}
                journeyAICapabilities={finalModalAICaps}
                capabilityHierarchy={capabilityHierarchy}
                onEditJourney={handleEditJourney}
                isConfirmLoading={isFinalLoading}
            />
        </>
    )
}
