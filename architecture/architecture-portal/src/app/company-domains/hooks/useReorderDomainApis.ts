/* istanbul ignore file */
import { useCallback } from 'react'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const useReorderDomainApis = () => {
    const mutation = useMutation({
        mutationFn: async (request: {
            domainId: string
            api_endpoint_metadata_id: string
            payload: { api_metadata_id: string; seq_no: number }
        }) => {
            const url = API_ENDPOINTS.REORDER_DOMAIN_APIS(
                request.domainId,
                request.api_endpoint_metadata_id
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
                throw new Error(errorMessage || 'Failed to reorder domain APIs')
            }
            return data
        }
    })

    const reorderDomainApis = useCallback(
        async (
            domainId: string,
            api_endpoint_metadata_id: string,
            payload: { api_metadata_id: string; seq_no: number }
        ) => {
            try {
                return await mutation.mutateAsync({
                    domainId,
                    api_endpoint_metadata_id,
                    payload
                })
            } catch (error) {
                console.error('Error reordering domain APIs:', error)
                throw error
            }
        },
        [mutation]
    )

    return { reorderDomainApis }
}
