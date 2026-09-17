'use client'
import { useEffect, useRef, useState } from 'react'
import { useGetApptioJourneyCapabilities } from '@/app/business-architecture/hooks'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { buildParentMap, collectAncestors } from '../utils/capabilityTree'
import type { useCapabilityHierarchy } from './useCapabilityHierarchy'
import type { CapabilitySelectionStore } from '../components/CapabilitySelectionContext'

export function useCapabilitySelection(
    epicId: string,
    selectedJourneys: CustomerJourney[],
    store: CapabilitySelectionStore,
    capabilityHierarchy: ReturnType<typeof useCapabilityHierarchy>
) {
    const journeyIds = selectedJourneys.map(j => j.journey_id)

    const {
        journeyCapabilitiesMap,
        aiRecommendedCapabilities,
        isLoading: capabilitiesLoading,
        hasPreExistingMappings
    } = useGetApptioJourneyCapabilities(epicId, journeyIds)

    const [aiAncestorsByJourney, setAiAncestorsByJourney] = useState(
        () => new Map<string, string[]>()
    )

    const seededRef = useRef(false)

    useEffect(() => {
        if (capabilityHierarchy.length === 0 || selectedJourneys.length === 0)
            return
        if (capabilitiesLoading) return
        if (seededRef.current) return
        seededRef.current = true

        store.initJourneys(journeyIds)

        const parentMap = buildParentMap(capabilityHierarchy)
        const nextMap = new Map<string, string[]>()

        for (const journey of selectedJourneys) {
            const capabilities =
                journeyCapabilitiesMap.get(journey.journey_id) ?? []
            const aiIds = journey.user_proposed
                ? new Set<string>()
                : new Set(
                      aiRecommendedCapabilities?.get(journey.journey_id) ?? []
                  )
            const allIds = new Set(capabilities.map(c => c.capability_id))
            const ancestors = collectAncestors(allIds, parentMap)
            store.initSelectedForJourney(journey.journey_id, allIds, aiIds)
            nextMap.set(journey.journey_id, Array.from(ancestors))
        }

        setAiAncestorsByJourney(nextMap)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        capabilityHierarchy.length,
        selectedJourneys.length,
        capabilitiesLoading
    ])

    return { aiAncestorsByJourney, capabilitiesLoading, hasPreExistingMappings }
}
