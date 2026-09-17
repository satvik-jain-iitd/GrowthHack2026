/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { BAChangeRequest } from '@/app/business-architecture/types'
import { fetchWithToken } from '@/utils/client'

export function useSubmitBAChangeRequest() {
    const mutation = useMutation({
        mutationFn: async (baChangeRequest: BAChangeRequest) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.POST_BA_CHANGE_REQUEST,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...baChangeRequest })
                }
            )
            if (!res.ok) {
                throw new Error('Failed to create ba change request email')
            }
            return await res.json()
        }
    })
    return mutation
}
