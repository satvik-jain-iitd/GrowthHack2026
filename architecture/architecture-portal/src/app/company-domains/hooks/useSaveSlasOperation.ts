/* istanbul ignore file */

import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const useSaveSlasOperation = () => {
    const mutation = useMutation({
        mutationFn: async ({
            domainId,
            api_metadata_id,
            api_endpoint_metadata_id,
            slas
        }: {
            domainId: string
            api_metadata_id: string
            api_endpoint_metadata_id: string
            slas: {
                response_time: number | null
                average_rps: number | null
                peak_rps: number | null
                error_rate: number | null
                availability: number | null
            }
        }) => {
            const url = API_ENDPOINTS.PATCH_OPERATION_SLAS(
                domainId,
                api_metadata_id,
                api_endpoint_metadata_id
            )
            const response = await fetchWithToken(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ slas }),
                credentials: 'include' as RequestCredentials
            })
            if (!response.ok) {
                throw new Error('Failed to save SLAs')
            }
            return response.json()
        }
    })

    return mutation
}
