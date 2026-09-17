import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { Domain } from '@/app/company-domains/types/domains'

export const getDomains = async (): Promise<Domain[]> => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_DOMAINS)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch domains: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
}
