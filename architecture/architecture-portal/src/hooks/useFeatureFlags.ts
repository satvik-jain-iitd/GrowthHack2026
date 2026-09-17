/* istanbul ignore file */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { useUserContext } from '@/context'
import { FeatureFlag } from '@/types/FeatureFlag'
import { AuditLogEntry } from '@/types/AuditLog'
import { FEATURE_FLAG_QUERY_KEY } from './useFeatureFlag'

const FEATURE_FLAGS_QUERY_KEY = ['feature-flags']

const fetchFeatureFlags = async (): Promise<FeatureFlag[]> => {
    const res = await fetchWithToken(API_ENDPOINTS.GET_FEATURE_FLAGS)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch feature flags: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return (data ?? []) as FeatureFlag[]
}

export const useFeatureFlags = () => {
    return useQuery<FeatureFlag[]>({
        queryKey: FEATURE_FLAGS_QUERY_KEY,
        queryFn: fetchFeatureFlags
    })
}

export const useSetFeatureFlag = () => {
    const queryClient = useQueryClient()
    const user = useUserContext()
    const emailId = user?.attributes?.email

    return useMutation({
        mutationFn: async ({
            name,
            value
        }: {
            name: string
            value: boolean
        }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.PUT_FEATURE_FLAG(name),
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value, emailId })
                }
            )
            if (!res.ok) {
                throw new Error(`Failed to update feature flag "${name}"`)
            }
            return res.json()
        },
        onSuccess: (_data, { name }) => {
            queryClient.invalidateQueries({ queryKey: FEATURE_FLAGS_QUERY_KEY })
            queryClient.invalidateQueries({
                queryKey: FEATURE_FLAG_QUERY_KEY(name)
            })
        }
    })
}

export const useDeleteFeatureFlag = () => {
    const queryClient = useQueryClient()
    const user = useUserContext()
    const emailId = user?.attributes?.email

    return useMutation({
        mutationFn: async ({ name }: { name: string }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.DELETE_FEATURE_FLAG(name),
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailId })
                }
            )
            if (!res.ok) {
                throw new Error(`Failed to delete feature flag "${name}"`)
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FEATURE_FLAGS_QUERY_KEY })
        }
    })
}

const fetchFeatureFlagAuditLogs = async (
    name: string
): Promise<AuditLogEntry[]> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.GET_FEATURE_FLAG_AUDIT_LOGS(name)
    )
    if (!res.ok) {
        throw new Error(`Failed to fetch audit logs for feature flag "${name}"`)
    }
    const { data } = await res.json()
    return (data ?? []) as AuditLogEntry[]
}

export const useFeatureFlagAuditLogs = (name: string) => {
    return useQuery<AuditLogEntry[]>({
        queryKey: ['feature-flag-audit-logs', name],
        queryFn: () => fetchFeatureFlagAuditLogs(name),
        enabled: !!name
    })
}
