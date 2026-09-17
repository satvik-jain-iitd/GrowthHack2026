/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const PTB_BVB_QUERY_KEY = () => ['ptb_bvb']

export const fetchPTBBVB = async (): Promise<
    { id: string; title: string }[]
> => {
    const apiUrl = API_ENDPOINTS.GET_PTB_BVB
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbook: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return data
}

export function useGetPTBBvb() {
    return useQuery<{ id: string; title: string }[], Error>({
        queryKey: PTB_BVB_QUERY_KEY(),
        queryFn: () => fetchPTBBVB(),
        enabled: true
    })
}
