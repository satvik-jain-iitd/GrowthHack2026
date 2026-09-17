/* istanbul ignore file */

import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { SubDomain } from '../types/domains'
import { fetchWithToken } from '@/utils/client'

export const SUB_DOMAIN_QUERY_KEY = ['sub-domains']

export const fetchSubDomains = async (): Promise<SubDomain[]> => {
    const apiUrl = API_ENDPOINTS.GET_SUB_DOMAINS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
}

export const useGetSubDomains = () => {
    const { data, isLoading, error, refetch } = useQuery<SubDomain[]>({
        queryKey: SUB_DOMAIN_QUERY_KEY,
        queryFn: fetchSubDomains
    })

    return { subDomains: data, loading: isLoading, error, refetch }
}
