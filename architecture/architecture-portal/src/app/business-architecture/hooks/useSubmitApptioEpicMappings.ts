import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const submitApptioEpicMappings = async (
    epicId: string,
    userInfo: { userEmail: string; userName: string }
): Promise<void> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.GET_APPTIO_EPIC_MAPPINGS(epicId),
        {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInfo })
        }
    )
    if (!res.ok) {
        throw new Error(
            `Failed to submit epic mappings: ${res.status} ${res.statusText}`
        )
    }
}
