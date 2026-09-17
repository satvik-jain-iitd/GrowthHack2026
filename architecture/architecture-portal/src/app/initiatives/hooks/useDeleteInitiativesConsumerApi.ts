/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface Body {
    consumerDomainId: string[]
    operationId?: string
    explorerApiId?: string
    email: string
}

export function useDeleteInitiativesConsumerApi(playbookId: string) {
    const mutation = useMutation({
        mutationFn: async (body: Body) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.DELETE_INITIATIVE_CONSUMER_API(playbookId),
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...body })
                }
            )
            if (!res.ok) {
                const errorData = await res.json()
                console.log(
                    `Failed to delete Consumer API: ${errorData.message || res.statusText}`,
                    {
                        isDeleteInitiativesConsumerApiError: true
                    }
                )
                throw new Error(
                    errorData.message || 'Failed to delete Consumer API'
                )
            }
            return await res.json()
        }
    })
    return mutation
}
