/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { PTBInitiative } from '../types'
import { fetchWithToken } from '@/utils/client'

export const PTB_INITIATIVE_QUERY_KEY = (id: string) => ['ptb_initiative', id]

export const fetchPTBInitiative = async (
    id: string
): Promise<PTBInitiative> => {
    const apiUrl = API_ENDPOINTS.GET_PTB_INITIATIVE(id)
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbook: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return data
}

export function usePTBInitiative(initiativeId: string) {
    return useQuery<PTBInitiative, Error>({
        queryKey: PTB_INITIATIVE_QUERY_KEY(initiativeId),
        queryFn: () => fetchPTBInitiative(initiativeId),
        enabled: !!initiativeId
    })
}
