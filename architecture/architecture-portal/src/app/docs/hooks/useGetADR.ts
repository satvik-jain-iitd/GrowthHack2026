import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export type ADR = {
    adr_mtda_id: string
    adr_nm: string
    adr_type_nm: string
    rev_ctc_da: string[]
    aprv_ctc_da: string[]
    entrpr_archt_ctc_da: string[]
    adr_req_email_ad_tx: string
    wkflow_sta_nm: string
    wkflow_id: string
    wkflow_step_id: string
    reviews?: {
        wkflow_id: string
        rev_email_ad_tx: string
        rev_sta_nm: 'APPROVED' | 'REJECTED' | 'PENDING' | 'ABSTAIN'
        rev_fdbk_tx: string
        amex_act_req_id: string
        rev_type_nm: 'REVIEW' | 'APPROVAL'
    }[]
}
/**
 * Fetches an ADR by repo and path using the GET_ADR endpoint with query params.
 * @param {string} fileId - The ID of the ADR file to fetch.
 */
export function useGetADR(fileId: string) {
    return useQuery<ADR>({
        queryKey: ['adr', fileId],
        queryFn: async () => {
            const res = await fetchWithToken(API_ENDPOINTS.GET_ADR(fileId))
            if (!res.ok) throw new Error('Failed to fetch ADR')
            return res.json()
        },
        staleTime: 30 * 60 * 1000, // 30 minutes (This gets manually invalidated upon Portal updates)
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: 1
    })
}
