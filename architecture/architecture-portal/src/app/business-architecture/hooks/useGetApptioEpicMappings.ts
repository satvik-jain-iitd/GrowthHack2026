import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface ApptioMappingCapability {
    capability_id: string
    isAIRecommended: string
}

export interface ApptioEpicMapping {
    journeyId: string
    isAIRecommended: string
    capabilities: ApptioMappingCapability[]
}

export const APPTIO_EPIC_MAPPINGS_QUERY_KEY = (epicId: string) => [
    'apptio_epic_mappings',
    epicId
]

export const fetchApptioEpicMappings = async (
    epicId: string
): Promise<ApptioEpicMapping[]> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.GET_APPTIO_EPIC_MAPPINGS(epicId)
    )
    if (!res.ok) {
        throw new Error(
            `Failed to fetch epic mappings: ${res.status} ${res.statusText}`
        )
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
}

export const useGetApptioEpicMappings = (epicId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: APPTIO_EPIC_MAPPINGS_QUERY_KEY(epicId),
        queryFn: () => fetchApptioEpicMappings(epicId),
        enabled: !!epicId
    })

    return { mappings: data ?? [], isLoading, error }
}
