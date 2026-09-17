/* istanbul ignore file */
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { Analytics } from '@/types/Analytics'
import { fetchWithToken } from '@/utils/client'

export const ANALYTICS_QUERY_KEY = ['analytics']

export const fetchAnalytics = async (): Promise<Analytics> => {
    const apiUrl = API_ENDPOINTS.GET_ANALYTICS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch analytics: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return data as Analytics
}

export const useAnalytics = () => {
    const { data, isLoading, error } = useQuery<Analytics>({
        queryKey: ANALYTICS_QUERY_KEY,
        queryFn: fetchAnalytics
    })

    return { analytics: data, loading: isLoading, error }
}

export const usePlaybookAnalytics = (playbookId: string) => {
    const { analytics, loading, error } = useAnalytics()
    const playbook = useMemo(() => {
        const playbooks = analytics?.playbooks ?? []
        return playbooks.find(x => x.playbook_id === playbookId)
    }, [analytics, playbookId])
    return { playbook, loading, error }
}
