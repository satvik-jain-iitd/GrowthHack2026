/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { Reviewer } from '@/app/company-domains/types'
import { fetchWithToken } from '@/utils/client'

export const fetchReviewer = async (domainId: string): Promise<Reviewer> => {
    const apiUrl = API_ENDPOINTS.GET_REVIEWER(domainId)
    const fetchReviewersOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' as RequestCredentials
    }
    const res = await fetchWithToken(apiUrl, fetchReviewersOptions)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return json.data
}

export const useGetReviewer = (domainId: string) => {
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['reviewers', domainId],
        queryFn: () => fetchReviewer(domainId)
    })

    return { data, isLoading, error, status }
}
