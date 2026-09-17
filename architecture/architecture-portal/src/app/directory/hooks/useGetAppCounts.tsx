/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { AppCount } from '../types'
import { fetchWithToken } from '@/utils/client'

export const APP_COUNT_QUERY_KEY = ['appCounts']

export const fetchAppCounts = async (): Promise<AppCount> => {
    const apiUrl = API_ENDPOINTS.GET_APP_COUNT
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch application counts: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return json.data
        ? json.data.countData
        : { mapped: '0', com_dom_mapped: '0', ebcm_mapped: '0' }
}

export const useGetAppCounts = () => {
    const { data, isLoading, error } = useQuery<AppCount>({
        queryKey: APP_COUNT_QUERY_KEY,
        queryFn: fetchAppCounts
    })

    return { appCounts: data, loading: isLoading, error }
}
