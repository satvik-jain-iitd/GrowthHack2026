/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export function useCheckExistingTypeAApi(
    playbookId: string,
    explorerApiId: string,
    method: string
) {
    return useQuery({
        queryKey: ['explorerApi', playbookId, explorerApiId, method],
        enabled: !!playbookId && !!explorerApiId && !!method,
        queryFn: async () => {
            const url = new URL(
                API_ENDPOINTS.GET_EXISTING_TYPE_A_API(
                    playbookId,
                    explorerApiId,
                    method
                )
            )
            const res = await fetchWithToken(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) {
                const errorData = await res.json()
                console.log(
                    `Failed to fetch existing Type A / B API: ${errorData.message || res.statusText}`,
                    {
                        isCheckExistingTypeAApiError: true
                    }
                )
                throw new Error(
                    errorData.message ||
                        'Failed to fetch existing Type A / B API'
                )
            }
            const { data } = await res.json()
            return data?.operationId as string | undefined
        }
    })
}
