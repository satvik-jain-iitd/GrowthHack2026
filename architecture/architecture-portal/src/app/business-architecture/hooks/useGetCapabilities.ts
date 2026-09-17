/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { Capability } from '../types'
import { useQuery } from '@tanstack/react-query'
import { l1Order } from '../constants'
import { fetchWithToken } from '@/utils/client'

export const CAPABILITY_QUERY_KEY = ['capabilities']

export const fetchCapabilities = async (): Promise<Capability[]> => {
    const apiUrl = API_ENDPOINTS.GET_CAPABILITIES
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch capabilities list: ${res.status} ${res.statusText}`
        )
    }
    const { capability } = await res.json()
    return Array.isArray(capability) ? capability : []
}

export const useCapabilities = () => {
    const { data, isLoading, error } = useQuery<Capability[], Error>({
        queryKey: CAPABILITY_QUERY_KEY,
        queryFn: fetchCapabilities
    })

    const l1Capabilities =
        data?.filter(cap => Number(cap.capability_level) === 1) ?? []

    const sortedL1Capabilities = l1Order
        .map(id => l1Capabilities.find(o => o.capability_id === id))
        .filter(Boolean) as Capability[]

    const sortedCapabilites = [
        ...sortedL1Capabilities,
        ...(data?.filter(cap => !l1Order.includes(cap.capability_id)) ?? [])
    ]

    return { capability: sortedCapabilites, loading: isLoading, error }
}
