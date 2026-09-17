import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface CapabilityCompanyDomain {
    company_domain_id: string
    domain_nm: string
    playbook_id: string
}

export const CAPABILITY_COMPANY_DOMAINS_QUERY_KEY = (capabilityId: string) => [
    'capability_company_domains',
    capabilityId
]

export const fetchCapabilityCompanyDomains = async (
    capabilityId: string
): Promise<CapabilityCompanyDomain[]> => {
    const res = await fetchWithToken(
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

export const useGetCapabilityCompanyDomains = (capabilityId: string) => {
    const { data, isLoading, error } = useQuery<
        CapabilityCompanyDomain[],
        Error
    >({
        queryKey: CAPABILITY_COMPANY_DOMAINS_QUERY_KEY(capabilityId),
        queryFn: () => fetchCapabilityCompanyDomains(capabilityId),
        enabled: !!capabilityId
    })

    return { companyDomains: data ?? [], loading: isLoading, error }
}
