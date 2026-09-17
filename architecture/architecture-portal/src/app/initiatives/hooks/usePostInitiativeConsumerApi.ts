/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface Body {
    consumerDomainId: string[]
    operationId?: string
    applicationId?: string
    explorerApiId?: string
    method?: string
    email: string
}

export function usePostInitiativeConsumerApi(playbookId: string) {
    const mutation = useMutation({
        mutationFn: async (body: Body) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.POST_INITIATIVE_CONSUMER_API(playbookId),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...body })
                }
            )
            if (!res.ok) {
                const errorData = await res.json()
                console.log(
                    `Failed to add Consumer API: ${errorData.message || res.statusText}`,
                    {
                        isPostInitiativesConsumerApiError: true
                    }
                )
                throw new Error(
                    errorData.message || 'Failed to add Consumer API'
                )
            }
            return await res.json()
        }
    })
    return mutation
}
