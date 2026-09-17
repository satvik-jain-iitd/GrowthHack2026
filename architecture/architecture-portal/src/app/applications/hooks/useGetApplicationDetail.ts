/* istanbul ignore file */
import { Application } from '@/app/company-domains/types'
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const APPLICATION_QUERY_KEY = (id: string) => ['application_details', id]

export const fetchApplicationDetail = async (
    id: string
): Promise<Application> => {
    const apiUrl = API_ENDPOINTS.GET_APPLICATION_BY_CENTRAL_ID(id)
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch application detail: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    const { application } = data || {}
    return application
}

export function useGetApplicationDetail(id: string) {
    return useQuery<Application, Error>({
        queryKey: APPLICATION_QUERY_KEY(id),
        queryFn: () => fetchApplicationDetail(id),
        enabled: !!id
    })
}
