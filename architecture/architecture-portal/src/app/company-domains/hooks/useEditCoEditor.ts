/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
export const useEditCoEditors = () => {
    const mutation = useMutation({
        mutationFn: async (requestBody: {
            api_metadata_id: string
            co_editors: string[]
        }) => {
            const res = await fetchWithToken(API_ENDPOINTS.EDIT_COEDITORS, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' as RequestCredentials
            })
            if (!res.ok) {
                let message = 'Failed to edit co editors'

                try {
                    const errorData = await res.json()
                    message = errorData?.message || message
                } catch (error) {
                    console.log(
                        '[EDIT_COEDITORS_ERR] Failed to parse error response',
                        { error }
                    )
                }

                throw new Error(message)
            }
            return await res.json()
        }
    })
    return mutation
}
