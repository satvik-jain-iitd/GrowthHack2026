/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const FEATURE_FLAGS = {
    SHOW_API_SCORE_IN_METRICS: 'api-design-score',
    MAINTENANCE_MODE: 'maintenance-mode',
    API_SCORE_AGGREGATE_METRICS: 'api-score-aggregate', // true for median, false for average
    CROSS_DOMAIN_API_METRICS: 'cross-domain-api-metrics'
}

export const FEATURE_FLAG_QUERY_KEY = (name: string) => ['feature-flag', name]

interface FeatureFlagResponse {
    success: boolean
    message?: string
    status?: number
    data?: {
        name?: string
        value?: boolean
    }
}

export const fetchFeatureFlag = async (name: string): Promise<boolean> => {
    if (!name) return false

    const res = await fetchWithToken(API_ENDPOINTS.GET_FEATURE_FLAG(name))

    if (!res.ok) {
        throw new Error(
            `Failed to fetch feature flag "${name}": ${res.status} ${res.statusText}`
        )
    }

    const payload = (await res.json()) as FeatureFlagResponse
    return payload.data?.value ?? false
}

export const useFeatureFlag = (name: string, defaultValue = false) => {
    const { data, isLoading, error } = useQuery<boolean>({
        queryKey: FEATURE_FLAG_QUERY_KEY(name),
        queryFn: () => fetchFeatureFlag(name),
        enabled: !!name,
        staleTime: 1000 * 60 * 5
    })

    return {
        value: data ?? defaultValue,
        loading: isLoading,
        error
    }
}

export const useMaintenanceModeVisible = () => {
    const { value, loading, error } = useFeatureFlag(
        FEATURE_FLAGS.MAINTENANCE_MODE
    )
    return value === true && !loading && !error
}
