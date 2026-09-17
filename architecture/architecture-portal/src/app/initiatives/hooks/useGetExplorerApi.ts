/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export function useGetExplorerApi(search: string, page: number) {
    return useQuery({
        queryKey: ['explorerApi', search, page],
        enabled: !!search,
        queryFn: async () => {
            const url = new URL(API_ENDPOINTS.GET_EXPLORER_API)
            url.searchParams.append('query', search)
            url.searchParams.append('page', page.toString())
            const res = await fetchWithToken(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) {
                const errorData = await res.json()
                console.log(
                    `Failed to fetch Explorer API: ${errorData.message || res.statusText}`,
                    {
                        isGetExplorerApiError: true
                    }
                )
                throw new Error(
                    errorData.message || 'Failed to fetch Explorer API'
                )
            }
            return await res.json()
        }
    })
}
