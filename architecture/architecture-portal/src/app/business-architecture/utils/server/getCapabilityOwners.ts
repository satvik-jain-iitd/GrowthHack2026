import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import type { CapabilityOwner } from '@/app/business-architecture/types'

export const getCapabilityOwners = async (): Promise<CapabilityOwner[]> => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_CAPABILITY_OWNERS)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch capability owners list: ${res.status} ${res.statusText}`
        )
    }
    const { capability_owner } = await res.json()
    return Array.isArray(capability_owner) ? capability_owner : []
}
