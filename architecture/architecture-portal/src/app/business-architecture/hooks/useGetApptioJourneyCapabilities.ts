import { API_ENDPOINTS } from '@/constants'
import { useQueries } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export type ApptioCapability = {
    capability_id: string
    name: string
    level: number
    isAIRecommended: boolean
}
export interface ApptioJourneyCapability {
    capabilities: ApptioCapability[] // changed from object to array
    isRecommended: string[]
    hasPreExisitngMappings?: boolean
}

export const APPTIO_JOURNEY_CAPABILITIES_QUERY_KEY = (
    epicId: string,
    journeyId: string
) => ['apptio_journey_capabilities', epicId, journeyId]

export const fetchApptioJourneyCapabilities = async (
    epicId: string,
    journeyId: string
): Promise<ApptioJourneyCapability> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.GET_APPTIO_JOURNEY_CAPABILITIES(epicId, journeyId)
    )
    if (!res.ok) {
        throw new Error(
            `Failed to fetch journey capabilities: ${res.status} ${res.statusText}`
        )
    }
    const data = await res.json()
    return data as ApptioJourneyCapability
}

export const useGetApptioJourneyCapabilities = (
    epicId: string,
    journeyIds: string[]
) => {
    const results = useQueries({
        queries: journeyIds.map(journeyId => ({
            queryKey: APPTIO_JOURNEY_CAPABILITIES_QUERY_KEY(epicId, journeyId),
            queryFn: () => fetchApptioJourneyCapabilities(epicId, journeyId),
            enabled: !!epicId && !!journeyId
        }))
    })

    const isLoading = results.some(r => r.isLoading)
    const data = new Map<string, ApptioCapability[]>()
    for (let i = 0; i < journeyIds.length; i++) {
        const capabilities = results[i]?.data?.capabilities
        data.set(journeyIds[i], Array.isArray(capabilities) ? capabilities : [])
    }

    const aiRecommendedCapabilities = new Map<string, string[]>()
    for (let i = 0; i < journeyIds.length; i++) {
        const recommended = results[i]?.data?.isRecommended
        aiRecommendedCapabilities.set(
            journeyIds[i],
            Array.isArray(recommended) ? recommended : []
        )
    }

    const hasPreExistingMappings = new Map<string, boolean>()
    for (let i = 0; i < journeyIds.length; i++) {
        const hasMappings = results[i]?.data?.hasPreExisitngMappings
        hasPreExistingMappings.set(journeyIds[i], !!hasMappings)
    }

    return {
        journeyCapabilitiesMap: data,
        isLoading,
        aiRecommendedCapabilities,
        hasPreExistingMappings
    }
}
