import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const STRATEGIC_EPIC_QUERY_KEY = ['strategic-epic']

export const fetchStrategicEpicById = async (epicId: string) => {
    const apiUrl = API_ENDPOINTS.GET_STRATEGIC_EPIC(epicId)
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch strategic epic data: ${res.status} ${res.statusText}`
        )
    }
    return await res.json()
}

export const useGetStrategicEpicById = (epicId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: [...STRATEGIC_EPIC_QUERY_KEY, epicId],
        queryFn: () => fetchStrategicEpicById(epicId),
        enabled: !!epicId
    })
    return { strategic_epic: data?.items[0], loading: isLoading, error }
}
