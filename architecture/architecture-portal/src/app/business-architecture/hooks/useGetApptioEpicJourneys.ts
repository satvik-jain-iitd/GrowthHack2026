import { API_ENDPOINTS } from '@/constants'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface ApptioEpicJourney {
    journeys: {
        journeyId: string
        journeyName: string
        journeyGroup: string
        isAIRecommended: boolean
    }[]
    isRecommended: string[]
}

export const APPTIO_EPIC_JOURNEYS_QUERY_KEY = (epicId: string) => [
    'apptio_epic_journeys',
    epicId
]

export const fetchApptioEpicJourneys = async (
    epicId: string
): Promise<ApptioEpicJourney> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.GET_APPTIO_EPIC_JOURNEYS(epicId)
    )
    if (!res.ok) {
        const errorRes = await res.json()
        throw new Error(
            `Failed to fetch apptio epic journeys: ${errorRes?.message}`
        )
    }
    const data = await res.json()
    return data as ApptioEpicJourney
}

export const useGetApptioEpicJourneys = (epicId: string) => {
    const { data, isLoading, error } = useQuery<ApptioEpicJourney, Error>({
        queryKey: APPTIO_EPIC_JOURNEYS_QUERY_KEY(epicId),
        queryFn: () => fetchApptioEpicJourneys(epicId),
        enabled: !!epicId
    })

    const allMappedJourneys = useMemo(() => {
        if (!data || !Array.isArray(data.journeys)) return []
        return data.journeys
    }, [data])

    const epicJourneys = useMemo(() => {
        if (!allMappedJourneys.length) return []
        const allAI =
            allMappedJourneys.length > 0 &&
            allMappedJourneys.every(j => j.isAIRecommended)
        return allAI ? allMappedJourneys.slice(0, 5) : allMappedJourneys
    }, [allMappedJourneys])

    const allAIRecommendedJourneys = useMemo(() => {
        if (!data || !Array.isArray(data.isRecommended)) return []
        return data.isRecommended
    }, [data])

    return { epicJourneys, allAIRecommendedJourneys, loading: isLoading, error }
}
