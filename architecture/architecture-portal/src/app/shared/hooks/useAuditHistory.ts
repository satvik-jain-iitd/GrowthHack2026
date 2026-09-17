import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { ChangeEventListResponse, EntityType } from '../types/metamodel'
import { fetchWithToken } from '@/utils/client'

export const AUDIT_HISTORY_KEY = (entityType: EntityType, entityId: string) => [
    'audit_history',
    entityType,
    entityId
]

function auditHistoryUrl(
    entityType: EntityType,
    entityId: string,
    page?: number,
    pageSize?: number
): string {
    const base =
        entityType === 'initiative'
            ? API_ENDPOINTS.METAMODEL_GET_INITIATIVE_AUDIT_HISTORY(entityId)
            : API_ENDPOINTS.METAMODEL_GET_APPLICATION_AUDIT_HISTORY(entityId)
    const params = new URLSearchParams()
    if (page != null) params.set('page', String(page))
    if (pageSize != null) params.set('pageSize', String(pageSize))
    const qs = params.toString()
    return qs ? `${base}?${qs}` : base
}

export function useAuditHistory(
    entityType: EntityType,
    entityId: string,
    page?: number,
    pageSize?: number,
    enabled = true
) {
    return useQuery<ChangeEventListResponse, Error>({
        queryKey: [...AUDIT_HISTORY_KEY(entityType, entityId), page, pageSize],
        queryFn: async () => {
            const res = await fetchWithToken(
                auditHistoryUrl(entityType, entityId, page, pageSize)
            )
            if (res.status === 404)
                return { page: 1, pageSize: 50, total: 0, data: [] }
            if (!res.ok)
                throw new Error(
                    `Failed to fetch audit history: ${res.status} ${res.statusText}`
                )
            return res.json()
        },
        enabled: !!entityId && enabled
    })
}
