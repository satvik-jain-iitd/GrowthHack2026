/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { useQuery } from '@tanstack/react-query'

export const API_DOMAIN_TARGETS_QUERY_KEY = ['apiDomainTargets']

const fetchApiDomainTargets = async (): Promise<Record<string, number>> => {
    const res = await fetchWithToken(API_ENDPOINTS.GET_API_DOMAIN_TARGETS, {
        credentials: 'include'
    })
    if (!res.ok) {
        throw new Error('Failed to fetch API targets')
    }
    const payload = await res.json()
    const targets = Array.isArray(payload?.data) ? payload.data : []
    return targets.reduce(
        (
            acc: Record<string, number>,
            item: {
                company_domain_id?: string
                domainapitarget?: string | number
            }
        ) => {
            const domainId = item.company_domain_id
            const target = Number(item.domainapitarget)
            if (domainId && Number.isFinite(target)) {
                acc[domainId] = target
            }
            return acc
        },
        {}
    )
}

export const useGetApiDomainTargets = () => {
    return useQuery({
        queryKey: API_DOMAIN_TARGETS_QUERY_KEY,
        queryFn: fetchApiDomainTargets
    })
}
