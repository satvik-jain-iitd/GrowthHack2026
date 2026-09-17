import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import type { ApptioEpicJourney } from '@/app/business-architecture/hooks/useGetApptioEpicJourneys'

export const getApptioEpicJourneys = async (
    epicId: string
): Promise<ApptioEpicJourney> => {
    const res = await fetchArchitecture(
        API_ENDPOINTS.GET_APPTIO_EPIC_JOURNEYS(epicId)
    )
    if (!res.ok) {
        const errorRes = await res.json()
        throw new Error(
            `Failed to fetch apptio epic journeys: ${errorRes?.message}`
        )
    }
    return (await res.json()) as ApptioEpicJourney
}
