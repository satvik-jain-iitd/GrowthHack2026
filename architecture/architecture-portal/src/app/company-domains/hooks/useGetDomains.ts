import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { Domain } from '../types/domains'

export const DOMAIN_QUERY_KEY = ['domains']

export const fetchDomains = async (): Promise<Domain[]> => {
    const apiUrl = API_ENDPOINTS.GET_DOMAINS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
}

export const useGetDomains = () => {
    const { data, isLoading, error, refetch } = useQuery<Domain[]>({
        queryKey: DOMAIN_QUERY_KEY,
        queryFn: fetchDomains,
        refetchOnMount: false
    })

    return { domains: data, loading: isLoading, error, refetch }
}
