/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { ApiMetadata } from '@/app/company-domains/types'
import { fetchWithToken } from '@/utils/client'

export const fetchApiWithEndPointDetails = async (
    domainId: string
): Promise<ApiMetadata[]> => {
    const apiUrl = API_ENDPOINTS.GET_API_WITH_ENDPOINT_DETAILS(domainId)
    const fetchOptionsApi = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' as RequestCredentials
    }
    const res = await fetchWithToken(apiUrl, fetchOptionsApi)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return json.data
}

export const useDomainApiWithEndpointDetails = (domainId: string) => {
    const { data, isLoading, error, status, refetch } = useQuery<ApiMetadata[]>(
        {
            queryKey: ['fetchApiEndpointWithDetails', domainId],
            queryFn: () => fetchApiWithEndPointDetails(domainId)
        }
    )

    return {
        data,
        isLoading,
        error,
        status: { status: status, statusText: error?.message },
        refresh: refetch
    }
}
