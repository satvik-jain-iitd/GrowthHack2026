/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { AllDomainApisResponse } from '@/app/initiatives/types'
import { fetchWithToken } from '@/utils/client'

export const GET_ALL_DOMAIN_APIS = () => ['domain_apis']

export const fetchAllDomainApis = async (): Promise<AllDomainApisResponse> => {
    const apiUrl = API_ENDPOINTS.GET_ALL_DOMAIN_APIS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch domain APIs: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return data
}

export function useGetAllDomainApis(isEnabled: boolean) {
    return useQuery<AllDomainApisResponse, Error>({
        queryKey: GET_ALL_DOMAIN_APIS(),
        queryFn: () => fetchAllDomainApis(),
        enabled: isEnabled
    })
}
