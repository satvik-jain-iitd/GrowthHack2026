/* istanbul ignore file */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { fetchWithToken } from '@/utils/client'

// Standardized cache key for delegate-owner data.
const delegateOwnerKey = (domainId?: string) =>
    domainId ? ['delegate-owner', domainId] : ['delegate-owner']

export const useDelegateOwner = () => {
    const queryClient = useQueryClient()

    interface DelegateOwner {
        domainId: string
        payload?: Record<string, unknown>
    }

    const addDelegateOwnerMutation = useMutation({
        mutationFn: async ({ domainId, payload }: DelegateOwner) => {
            const response = await fetchWithToken(
                API_ENDPOINTS.ADD_DELEGATE_OWNER(domainId),
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const result = await response.json()
            if (!response.ok) {
                const errorMessage =
                    result?.status === 400 &&
                    result?.message === 'Invalid cookie Token'
                        ? 'Session expired. Please log in again.'
                        : result?.message
                throw new Error(errorMessage || 'Failed to add delegate owner')
            }
            return result.data
        },
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: delegateOwnerKey(variables.domainId)
            })
        }
    })

    const getDelegateOwnerMutation = useMutation({
        mutationFn: async (domainId: string) => {
            const response = await fetchWithToken(
                API_ENDPOINTS.GET_DELEGATE_OWNER(domainId),
                {
                    method: 'GET',
                    credentials: 'include'
                }
            )
            if (!response.ok) {
                throw new Error('Failed to fetch delegate owner')
            }

            const { data } = await response.json()
            return data
        },
        onSuccess: (data, domainId) => {
            queryClient.setQueryData(delegateOwnerKey(domainId), data)
        }
    })

    // Expose helpers plus full mutation objects for status/error handling.
    return {
        addDelegateOwner: (
            domainId: string,
            payload: Record<string, unknown> = {}
        ) => addDelegateOwnerMutation.mutateAsync({ domainId, payload }),
        getDelegateOwner: getDelegateOwnerMutation.mutateAsync,
        addDelegateOwnerMutation,
        getDelegateOwnerMutation
    }
}
