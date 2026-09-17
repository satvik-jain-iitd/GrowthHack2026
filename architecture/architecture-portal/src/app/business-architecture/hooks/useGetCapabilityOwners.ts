/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { CapabilityOwner } from '@/app/business-architecture/types'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const CAPABILITY_OWNERS_QUERY_KEY = ['capability-owners']

export const fetchCapabilityOwners = async (): Promise<CapabilityOwner[]> => {
    const apiUrl = API_ENDPOINTS.GET_CAPABILITY_OWNERS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch capability owners list: ${res.status} ${res.statusText}`
        )
    }
    const { capability_owner } = await res.json()
    return Array.isArray(capability_owner) ? capability_owner : []
}

export const useCapabilityOwners = () => {
    const { data, isLoading, error } = useQuery<CapabilityOwner[], Error>({
        queryKey: CAPABILITY_OWNERS_QUERY_KEY,
        queryFn: fetchCapabilityOwners
    })
    return { capability_owners: data, loading: isLoading, error }
}
