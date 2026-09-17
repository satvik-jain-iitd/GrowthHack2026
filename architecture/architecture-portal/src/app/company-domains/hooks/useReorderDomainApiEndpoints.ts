/* istanbul ignore file */
import { useCallback } from 'react'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const useReorderDomainApiEndpoints = () => {
    const mutation = useMutation({
        mutationFn: async (request: {
            domainId: string
            api_metadata_id: string
            payload: { api_endpoint_metadata_id: string; seq_no: number }
        }) => {
            const url = API_ENDPOINTS.REORDER_DOMAIN_API_ENDPOINTS(
                request.domainId,
                request.api_metadata_id
            )

            const response = await fetchWithToken(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request.payload)
            })

            const data = await response.json()
            if (!response.ok) {
                const errorMessage =
                    data?.status === 400
                        ? 'Session expired. Please log in again.'
                        : data?.message
                throw new Error(
                    errorMessage || 'Failed to reorder domain API endpoints'
                )
            }
            return data
        }
    })

    const reorderDomainApiEndpoints = useCallback(
        async (
            domainId: string,
            api_metadata_id: string,
            payload: { api_endpoint_metadata_id: string; seq_no: number }
        ) => {
            try {
                return await mutation.mutateAsync({
                    domainId,
                    api_metadata_id,
                    payload
                })
            } catch (error) {
                console.error('Error reordering domain API endpoints:', error)
                throw error
            }
        },
        [mutation]
    )

    return { reorderDomainApiEndpoints }
}
