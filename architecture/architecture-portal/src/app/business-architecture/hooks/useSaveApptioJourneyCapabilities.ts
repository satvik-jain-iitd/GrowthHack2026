import { API_ENDPOINTS } from '@/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export function useSaveApptioJourneyCapabilities() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            epicId,
            journeyId,
            userInfo,
            capabilities
        }: {
            epicId: string
            journeyId: string
            capabilities: { id: string; isAiRecommended?: boolean }[]
            userInfo: { userEmail: string; userName: string }
        }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.GET_APPTIO_JOURNEY_CAPABILITIES(
                    epicId,
                    journeyId
                ),
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userInfo,
                        capabilities
                    })
                }
            )
            if (!res.ok) {
                throw new Error(
                    `Failed to save journey capabilities: ${res.status} ${res.statusText}`
                )
            }
            await queryClient.invalidateQueries({
                queryKey: ['apptio_journey_capabilities', epicId, journeyId]
            })
            return await res.json()
        }
    })
}
