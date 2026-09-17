import { AUTH_BLUE_API_URL } from '@/constants'
import { fetchWithToken } from '@/utils/client'

/**
 * Checks whether the user's AuthBlue session is still valid.
 * Returns true if the session is active, false if expired or unreachable.
 */
export async function checkSessionValid(): Promise<boolean> {
    try {
        const res = await fetchWithToken(
            `${AUTH_BLUE_API_URL}/v1/session?refreshNeeded=true`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        )
        return res.ok
    } catch {
        return false
    }
}
