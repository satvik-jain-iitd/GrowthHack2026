/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface Body {
    consumerDomainId: string[]
    existingConsumerDomainId: string[]
    operationId?: string
    explorerApiId?: string
    email: string
}

export function usePutInitiativesConsumerApi(playbookId: string) {
    const mutation = useMutation({
        mutationFn: async (body: Body) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.PUT_INITIATIVE_CONSUMER_API(playbookId),
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...body })
                }
            )
            if (!res.ok) {
                const errorData = await res.json()
                if (errorData.data?.noChangesDetected) {
                    return {
                        noChangesDetected: true
                    }
                }
                console.log(
                    `Failed to update Consumer API: ${errorData.message || res.statusText}`,
                    {
                        isPutInitiativesConsumerApiError: true
                    }
                )
                throw new Error(
                    errorData.message || 'Failed to update Consumer API'
                )
            }
            return await res.json()
        }
    })
    return mutation
}
