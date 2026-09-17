import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { fetchWithToken } from '@/utils/client'

export type ADRAuditHistoryEntry = {
    aud_ts: string
    new_da: {
        adr_id: string
        workflow_identifier: string
    }
    action_nm: string
    creat_user_email_ad_tx: string
}

/**
 * Fetches the audit history for a given ADR by its ID.
 * @param {string} adrId - The ID of the ADR to fetch audit history for.
 */
export function useGetADRAuditHistory(adrId: string) {
    return useQuery<ADRAuditHistoryEntry[]>({
        queryKey: ['adr-audit-history', adrId],
        queryFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.GET_ADR_AUDIT_HISTORY(adrId)
            )
            if (!res.ok) throw new Error('Failed to fetch ADR audit history')
            return res.json()
        },
        staleTime: 30 * 60 * 1000, // 30 minutes (This gets manually invalidated upon Portal updates)
        gcTime: 30 * 60 * 1000 // 30 minutes
    })
}
