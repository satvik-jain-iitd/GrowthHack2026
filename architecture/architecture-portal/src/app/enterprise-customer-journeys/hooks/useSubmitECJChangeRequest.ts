/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface ECJChangeRequest {
    requesterName: string
    requesterEmail: string
    journeyStatement: string
    journeyDesc: string
    changeDetails: string
}

export function useSubmitECJChangeRequest() {
    const mutation = useMutation({
        mutationFn: async (ecjChangeRequest: ECJChangeRequest) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.POST_ECJ_CHANGE_REQUEST,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...ecjChangeRequest })
                }
            )
            if (!res.ok) {
                throw new Error('Failed to create ECJ change request email')
            }
            return await res.json()
        }
    })
    return mutation
}
