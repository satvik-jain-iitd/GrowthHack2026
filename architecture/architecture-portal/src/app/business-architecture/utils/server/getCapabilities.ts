import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { Capability } from '@/app/business-architecture/types'

export const getCapabilities = async (): Promise<Capability[]> => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_CAPABILITIES)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch capabilities list: ${res.status} ${res.statusText}`
        )
    }
    const { capability } = await res.json()
    return Array.isArray(capability) ? capability : []
}
