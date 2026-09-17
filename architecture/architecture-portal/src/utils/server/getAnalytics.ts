import { API_ENDPOINTS } from '@/constants'
import { Analytics } from '@/types/Analytics'
import { fetchArchitecture } from './fetchArchitecture'

export const getAnalytics = async (): Promise<Analytics> => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_ANALYTICS)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch analytics: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return data as Analytics
}
