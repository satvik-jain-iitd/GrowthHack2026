import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export function useSubmitADRForReview(
    adrId: string,
    fileId: string,
    user: string
) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.SUBMIT_ADR_FOR_REVIEW(adrId),
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user })
                }
            )

            if (!res.ok) {
                throw new Error('Failed to submit ADR for review')
            }

            await queryClient.invalidateQueries({
                queryKey: ['adr', fileId]
            })
            await queryClient.invalidateQueries({
                queryKey: ['adr-audit-history', adrId]
            })

            return await res.json()
        }
    })
}

export type ADRReviewInput = {
    approvedOrRejected: 'APPROVED' | 'REJECTED' | 'PENDING' | 'ABSTAIN'
    reviewFeedback: string
}

export function useSubmitADRReview(
    adrId: string,
    reviewer: string,
    fileId: string
) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            approvedOrRejected,
            reviewFeedback
        }: ADRReviewInput) => {
            const res = await fetchWithToken(API_ENDPOINTS.SUBMIT_ADR_REVIEW, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adrId,
                    review: {
                        reviewer,
                        approvedOrRejected,
                        reviewFeedback
                    }
                })
            })

            if (!res.ok) {
                throw new Error('Failed to submit ADR review')
            }

            await queryClient.invalidateQueries({
                queryKey: ['adr', fileId]
            })
            await queryClient.invalidateQueries({
                queryKey: ['adr-audit-history', adrId]
            })

            return await res.json()
        }
    })
}

export function useSubmitADRApproval(
    adrId: string,
    reviewer: string,
    fileId: string
) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            approvedOrRejected,
            reviewFeedback
        }: ADRReviewInput) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.SUBMIT_ADR_APPROVAL,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        adrId,
                        review: {
                            reviewer,
                            approvedOrRejected,
                            reviewFeedback
                        }
                    })
                }
            )

            if (!res.ok) {
                throw new Error('Failed to submit ADR review')
            }

            await queryClient.invalidateQueries({
                queryKey: ['adr', fileId]
            })
            await queryClient.invalidateQueries({
                queryKey: ['adr-audit-history', adrId]
            })

            return await res.json()
        }
    })
}
