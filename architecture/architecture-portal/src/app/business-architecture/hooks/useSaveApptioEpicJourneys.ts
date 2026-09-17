import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const saveApptioEpicJourneys = async (
    epicId: string,
    journeyData: { id: string; isAiRecommended?: boolean }[],
    userInfo: { userEmail: string; userName: string }
): Promise<void> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.GET_APPTIO_EPIC_JOURNEYS(epicId),
        {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInfo, journeyData })
        }
    )
    if (!res.ok) {
        throw new Error(
            `Failed to save apptio epic journeys: ${res.status} ${res.statusText}`
        )
    }
}
