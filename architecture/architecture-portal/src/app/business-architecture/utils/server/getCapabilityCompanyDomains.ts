import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import type { CapabilityCompanyDomain } from '@/app/business-architecture/hooks/useGetCapabilityCompanyDomains'

export const getCapabilityCompanyDomains = async (
    capabilityId: string
): Promise<CapabilityCompanyDomain[]> => {
    const res = await fetchArchitecture(
        API_ENDPOINTS.GET_CAPABILITY_COMPANY_DOMAINS(capabilityId)
    )
    if (!res.ok) {
        throw new Error(
            `Failed to fetch company domains for capability: ${res.status} ${res.statusText}`
        )
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
}
