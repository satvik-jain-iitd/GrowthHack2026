/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { Markets } from '@/app/company-domains/types'
import { fetchWithToken } from '@/utils/client'

export const useEditMarket = () => {
    const mutation = useMutation({
        mutationFn: async (requestBody: {
            api_endpoint_metadata_id: string
            actual_markets: Markets[]
        }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.ACTUAL_MARKETS_EDIT,
                {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' as RequestCredentials
                }
            )
            if (!res.ok) {
                throw new Error('Failed to edit actual market')
            }
            return await res.json()
        }
    })
    return mutation
}
