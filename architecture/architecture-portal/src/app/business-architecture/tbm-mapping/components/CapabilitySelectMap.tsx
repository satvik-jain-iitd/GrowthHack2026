/*istanbul ignore file*/
'use client'
import { useCallback, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import {
    useCapabilities,
    useGetApptioEpicMappings
} from '@/app/business-architecture/hooks'
import { EbaHeader } from '@/app/business-architecture/components/EbaHeader'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { useCapabilityHierarchy } from '../hooks/useCapabilityHierarchy'
import { useCapabilitySelection } from '../hooks/useCapabilitySelection'
import {
    CapabilitySelectionStore,
    CapabilitySelectionProvider
} from './CapabilitySelectionContext'
import { CapabilitySelectMapInner } from './CapabilitySelectMapInner'
import { SessionExpiredState } from './SessionExpiredState'

type CapabilitySelectMapProps = {
    epicId?: string
    selectedJourneys?: CustomerJourney[]
    onBack?: () => void
    onSubmitComplete?: () => void
    epicName?: string
}

export function CapabilitySelectMap({
    epicId = '',
    selectedJourneys = [],
    onBack,
    onSubmitComplete,
    epicName
}: CapabilitySelectMapProps = {}) {
    const { capability = [], loading } = useCapabilities()
    const { mappings, isLoading: mappingsLoading } =
        useGetApptioEpicMappings(epicId)

    const [orderedJourneys] = useState(() => {
        const saved = selectedJourneys.filter(j =>
            mappings.some(m => m.journeyId === j.journey_id)
        )
        const unsaved = selectedJourneys.filter(
            j => !mappings.some(m => m.journeyId === j.journey_id)
        )
        return [...saved, ...unsaved]
    })

    const store = useMemo(() => new CapabilitySelectionStore(), [])

    const capabilityHierarchy = useCapabilityHierarchy(capability)

    const {
        aiAncestorsByJourney,
        capabilitiesLoading,
        hasPreExistingMappings
    } = useCapabilitySelection(
        epicId,
        orderedJourneys,
        store,
        capabilityHierarchy
    )

    const [sessionExpired, setSessionExpired] = useState(false)
    const handleSessionExpired = useCallback(() => setSessionExpired(true), [])

    if (sessionExpired) {
        return <SessionExpiredState />
    }

    return (
        <CapabilitySelectionProvider store={store}>
            <Box>
                <EbaHeader
                    title='Enterprise Business Capability Selection'
                    subtitle='Select the Enterprise Business Capabilities that apply to each of your chosen Enterprise Customer Journeys.'
                    epicName={epicName}
                />
                <CapabilitySelectMapInner
                    epicId={epicId}
                    selectedJourneys={orderedJourneys}
                    onBack={onBack}
                    onSubmitComplete={onSubmitComplete}
                    onSessionExpired={handleSessionExpired}
                    store={store}
                    capabilityHierarchy={capabilityHierarchy}
                    loading={loading || capabilitiesLoading || mappingsLoading}
                    aiAncestorsByJourney={aiAncestorsByJourney}
                    savedMappings={mappings}
                    hasPreExistingMappings={hasPreExistingMappings}
                />
            </Box>
        </CapabilitySelectionProvider>
    )
}

export default CapabilitySelectMap
