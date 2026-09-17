/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export function useSubmitProposedJourney() {
    const mutation = useMutation({
        mutationFn: async (journeyStatement: string) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.POST_PROPOSED_JOURNEY,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        journey_statement: journeyStatement
                    })
                }
            )
            if (!res.ok) {
                let message = 'Failed to submit proposed journey'
                try {
                    const errorData = await res.json()
                    if (
                        typeof errorData?.message === 'string' &&
                        errorData.message.trim()
                    ) {
                        message = errorData.message
                    }
                } catch {
                    // Ignore JSON parse errors and keep fallback message.
                }
                throw new Error(message)
            }
            return await res.json()
        }
    })
    return mutation
}
