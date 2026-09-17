/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { PilotGroup } from '@/types/PilotGroup'
import { fetchWithToken } from '@/utils/client'

export const PILOT_GROUP_QUERY_KEY = (id: string) => ['pilot-group', id]

const fetchPilotGroup = async (id: string): Promise<PilotGroup | null> => {
    if (!id) return null
    const res = await fetchWithToken(API_ENDPOINTS.GET_PILOT_GROUP(id))
    if (!res.ok) return null
    const { data } = await res.json()
    return data as PilotGroup
}

export const usePilotGroup = (id: string) => {
    const {
        data: pilotGroup,
        isLoading,
        error
    } = useQuery<PilotGroup | null>({
        queryKey: PILOT_GROUP_QUERY_KEY(id),
        queryFn: () => fetchPilotGroup(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10 // 10 minutes
    })

    return { pilotGroup, isLoading, error }
}
