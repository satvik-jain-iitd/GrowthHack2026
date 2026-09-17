import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

type ContributorResponse = {
    data: string[]
    success: boolean
}
/**
 * Fetches contributors for a given repo and file path using the GET_CONTRIBUTORS endpoint.
 * @param {string} repo - The repository name.
 * @param {string} filePath - The file path within the repo.
 */
export function useGetContributors(repo: string, filePath: string) {
    return useQuery<ContributorResponse>({
        queryKey: ['contributors', repo, filePath],
        queryFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.GET_CONTRIBUTORS(repo, filePath)
            )
            if (!res.ok) throw new Error('Failed to fetch contributors')
            return res.json()
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000 // 30 minutes
    })
}
