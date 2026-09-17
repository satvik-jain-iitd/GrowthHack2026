/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { ConsumerApiInitiative } from '@/app/initiatives/types'
import { fetchWithToken } from '@/utils/client'

export function useGetInitiativeConsumerApi(playbookId: string | undefined) {
    const query = useQuery({
        queryKey: ['initiativeConsumerApi', playbookId],
        enabled: !!playbookId,
        queryFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.GET_INITIATIVE_CONSUMER_API(playbookId!),
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (!res.ok) {
                const errorData = await res.json()
                console.log(
                    `Failed to get Consumer API: ${errorData.message || res.statusText}`,
                    {
                        isGetInitiativesConsumerApiError: true
                    }
                )
                throw new Error(
                    errorData.message || 'Failed to get Consumer API'
                )
            }
            const response: {
                data: ConsumerApiInitiative[]
                success: boolean
            } = await res.json()
            return response.data as ConsumerApiInitiative[]
        }
    })
    return { ...query, refresh: query.refetch }
}
