'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import {
    CUSTOMER_JOURNEYS_QUERY_KEY,
    useCustomerJourneys,
    useGetApptioEpicJourneys,
    saveApptioEpicJourneys
} from '@/app/business-architecture/hooks'
import { useUserContext } from '@/context'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { EbaHeader } from '@/app/business-architecture/components/EbaHeader'
import type { JourneyFormState } from '../types'
import { checkSessionValid } from '../utils/checkSessionValid'
import { AIJourneyRecommendBanner } from './AIJourneyRecommendBanner'
import { EpicNotFoundState } from './EpicNotFoundState'
import { SessionExpiredState } from './SessionExpiredState'
import { JourneySearchBar } from './JourneySearchBar'
import { JourneyGroupList } from './JourneyGroupList'
import { CreateJourneyButton } from './CreateJourneyButton'
import { allowedLobProposedJourney } from '../constants'
import { useSubmitProposedJourney } from '../../hooks/useProposeJourney'

type Props = {
    epicId: string
    onNext: (
        selectedJourneys: CustomerJourney[],
        state: JourneyFormState
    ) => void
    initialState?: JourneyFormState
    isNextPending?: boolean
    epicName?: string
    projectId?: number
}

export function JourneySelectStep({
    epicId,
    onNext,
    initialState,
    isNextPending,
    epicName,
    projectId
}: Props) {
    // Full browsable journey list
    const { customer_journey = [] } = useCustomerJourneys()
    const queryClient = useQueryClient()
    const userContext = useUserContext()
    const userEmail = userContext?.attributes?.email ?? ''
    const userName = userContext?.attributes?.fullName ?? ''
    const {
        mutateAsync: submitProposedJourney,
        isPending: isSubmittingProposedJourney
    } = useSubmitProposedJourney()

    // Pre-selected (saved or AI-recommended) journeys for this epic
    const { epicJourneys, allAIRecommendedJourneys, error } =
        useGetApptioEpicJourneys(epicId)

    // Build AI-recommended IDs from the real API flag
    const aiRecommendedIds = useMemo(
        () => new Set(allAIRecommendedJourneys),
        [allAIRecommendedJourneys]
    )

    // All epic journey IDs (saved + AI-recommended) are pre-selected
    const epicJourneyIds = useMemo(
        () => new Set(epicJourneys.map(j => j.journeyId)),
        [epicJourneys]
    )

    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => initialState?.selectedIds ?? new Set()
    )
    const [userProposedJourneyId, setUserProposedJourneyId] = useState<
        string | null
    >(null)
    const [userProposedJourneyTag, setUserProposedJourneyTag] = useState<{
        id: string
        label: string
    } | null>(null)
    const [searchTerm, setSearchTerm] = useState(
        () => initialState?.searchTerm ?? ''
    )

    // Once epic journeys load, initialise selectedIds (only if not restored from savedState)
    const initialised = useRef(!!initialState)
    useEffect(() => {
        if (!initialised.current && epicJourneys.length > 0) {
            setSelectedIds(epicJourneyIds)
            initialised.current = true
        }
    }, [epicJourneys, epicJourneyIds, initialState])

    const handleToggle = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])

    const handleRemoveJourney = useCallback((id: string) => {
        setSelectedIds(prev => {
            if (!prev.has(id)) return prev
            const next = new Set(prev)
            next.delete(id)
            return next
        })
        setUserProposedJourneyId(prev => (prev === id ? null : prev))
        setUserProposedJourneyTag(prev => (prev?.id === id ? null : prev))
    }, [])

    const handleClear = useCallback(() => {
        setSelectedIds(new Set())
        setUserProposedJourneyId(null)
        setUserProposedJourneyTag(null)
        setSearchTerm('')
    }, [])

    const [isSaving, setIsSaving] = useState(false)
    const [sessionExpired, setSessionExpired] = useState(false)

    const handleNext = useCallback(async () => {
        const journeyData = Array.from(selectedIds).map(id => ({
            id,
            isAiRecommended: aiRecommendedIds.has(id) || undefined
        }))

        setIsSaving(true)
        try {
            const isValid = await checkSessionValid()
            if (!isValid) {
                setSessionExpired(true)
                return
            }

            await saveApptioEpicJourneys(epicId, journeyData, {
                userEmail,
                userName
            })
            toast.success('Enterprise Customer Journeys saved successfully')
            const journeys = customer_journey.filter(j =>
                selectedIds.has(j.journey_id)
            )
            if (
                userProposedJourneyTag &&
                selectedIds.has(userProposedJourneyTag.id) &&
                !journeys.some(j => j.journey_id === userProposedJourneyTag.id)
            ) {
                journeys.push({
                    journey_id: userProposedJourneyTag.id,
                    journey_statement: userProposedJourneyTag.label,
                    journey_grp_tx: 'Other',
                    customer_tx: [],
                    market: [],
                    product: [],
                    reviewed: false,
                    ai_generated: false,
                    user_proposed: true
                } as CustomerJourney)
            }
            onNext(journeys, { selectedIds, searchTerm })
        } catch {
            toast.error(
                'Failed to save Enterprise Customer Journeys, please try again.'
            )
        } finally {
            setIsSaving(false)
        }
    }, [
        onNext,
        selectedIds,
        searchTerm,
        customer_journey,
        aiRecommendedIds,
        epicId,
        userEmail,
        userName,
        userProposedJourneyTag
    ])

    // Group journeys by journey_grp_tx, filtered by search term
    const groupedJourneys = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase()
        const filtered = normalized
            ? customer_journey.filter(
                  j =>
                      j.journey_statement.toLowerCase().includes(normalized) ||
                      j.journey_grp_tx?.toLowerCase().includes(normalized)
              )
            : customer_journey

        const groups = new Map<string, typeof filtered>()
        for (const journey of filtered) {
            const group = journey.journey_grp_tx || 'Other'
            const existing = groups.get(group)
            if (existing) existing.push(journey)
            else groups.set(group, [journey])
        }

        return Array.from(groups.entries()).sort(([a], [b]) =>
            a.localeCompare(b)
        )
    }, [customer_journey, searchTerm])

    // All selected journeys as flat tags (AI first, then manual) for the search bar
    const selectedJourneyTags = useMemo(() => {
        const tags = customer_journey
            .filter(
                j =>
                    selectedIds.has(j.journey_id) ||
                    userProposedJourneyId === j.journey_id
            )
            .map(j => ({
                id: j.journey_id,
                label: j.journey_statement,
                isAI: aiRecommendedIds.has(j.journey_id),
                isUserProposed:
                    j.user_proposed || userProposedJourneyId === j.journey_id
            }))

        if (
            userProposedJourneyTag &&
            selectedIds.has(userProposedJourneyTag.id) &&
            !tags.some(tag => tag.id === userProposedJourneyTag.id)
        ) {
            tags.push({
                id: userProposedJourneyTag.id,
                label: userProposedJourneyTag.label,
                isAI: false,
                isUserProposed: true
            })
        }

        return tags.sort((a, b) => (a.isAI === b.isAI ? 0 : a.isAI ? -1 : 1))
    }, [
        customer_journey,
        selectedIds,
        aiRecommendedIds,
        userProposedJourneyId,
        userProposedJourneyTag
    ])

    const handleProposedJourneySave = async (statement: string) => {
        try {
            const response = await submitProposedJourney(statement)
            const proposedJourneyId = response?.journey_id

            if (!proposedJourneyId || typeof proposedJourneyId !== 'string') {
                throw new Error('Missing proposed journey id in API response')
            }

            setSelectedIds(new Set([proposedJourneyId]))
            setUserProposedJourneyId(proposedJourneyId)
            setUserProposedJourneyTag({
                id: proposedJourneyId,
                label: statement
            })
            await queryClient.invalidateQueries({
                queryKey: CUSTOMER_JOURNEYS_QUERY_KEY
            })
        } catch (e) {
            console.error(e)
            toast.error(e instanceof Error ? e.message : 'Unknown error')
        }
    }

    if (error && error.message.includes('No epic data')) {
        return (
            <Box>
                <EbaHeader
                    title='Enterprise Customer Journeys'
                    subtitle='Explore enterprise customer journeys at American Express'
                    subtitleNoWrap
                />
                <EpicNotFoundState epicId={epicId} />
            </Box>
        )
    }

    if (sessionExpired) {
        return <SessionExpiredState />
    }

    return (
        <Box>
            <EbaHeader
                title='Enterprise Customer Journeys'
                subtitle='Explore enterprise customer journeys at American Express'
                subtitleNoWrap
                epicName={epicName}
            />

            <AIJourneyRecommendBanner />

            <Box width='99.5%' mx='auto' px={0} mb={12}>
                <VStack px={8} alignItems='flex-start' gap={4}>
                    <HStack width='100%'>
                        <JourneySearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onNext={handleNext}
                            onClear={handleClear}
                            canNext={selectedIds.size > 0}
                            selectedJourneys={selectedJourneyTags}
                            onRemoveJourney={handleRemoveJourney}
                            isLoading={isNextPending || isSaving}
                        />
                        {selectedJourneyTags.length === 0 &&
                            projectId &&
                            allowedLobProposedJourney.includes(projectId) && (
                                <CreateJourneyButton
                                    disabled={
                                        userProposedJourneyId !== null ||
                                        isSubmittingProposedJourney
                                    }
                                    onSave={handleProposedJourneySave}
                                />
                            )}
                    </HStack>
                    {userProposedJourneyId ||
                    selectedJourneyTags.some(
                        journey => journey.isUserProposed
                    ) ? (
                        <Box
                            width='100%'
                            border='1px solid'
                            borderColor='border.emphasis'
                            borderRadius='md'
                            background='surface.white'
                            px={4}
                            py={3}
                        >
                            <Text fontSize='14px' color='text.default'>
                                To view the list of Enterprise Customer
                                Journeys, please remove the proposed Customer
                                Journey.
                            </Text>
                        </Box>
                    ) : (
                        <JourneyGroupList
                            groupedJourneys={groupedJourneys}
                            aiRecommendedIds={aiRecommendedIds}
                            selectedIds={selectedIds}
                            onToggle={handleToggle}
                        />
                    )}
                </VStack>
            </Box>
        </Box>
    )
}
