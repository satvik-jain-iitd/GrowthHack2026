import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { fetchWithToken } from '@/utils/client'

export function useSubmitAcceptance(
    bvbId: string,
    playbookId: string,
    decision: 'APPROVED' | 'REJECTED'
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.SUBMIT_ACCEPTANCE(bvbId),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        approvedOrRejected: decision === 'APPROVED'
                    })
                }
            )

            if (!res.ok) {
                throw new Error('Failed to submit acceptance')
            }

            await queryClient.invalidateQueries({
                queryKey: ['playbook', playbookId]
            })

            return await res.json()
        }
    })
}

export function useSubmitForReview(bvbId: string, playbookId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.SUBMIT_FOR_REVIEW(bvbId),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            if (!res.ok) {
                throw new Error('Failed to submit for review')
            }
            await queryClient.invalidateQueries({
                queryKey: ['playbook', playbookId]
            })
            return await res.json()
        }
    })
}

export function useSubmitReview(
    processId: string,
    playbookId: string,
    reviewer: string,
    requestId?: string
) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            reviewFeedback,
            approvedOrRejected
        }: {
            reviewFeedback: string
            approvedOrRejected: 'APPROVED' | 'REJECTED' | 'ABSTAIN'
        }) => {
            const res = await fetchWithToken(API_ENDPOINTS.SUBMIT_REVIEW(), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processId,
                    reviewFeedback,
                    approvedOrRejected,
                    reviewer,
                    ...(requestId ? { requestId } : {})
                })
            })
            if (!res.ok) {
                throw new Error('Failed to submit review')
            }
            await queryClient.invalidateQueries({
                queryKey: ['playbook', playbookId]
            })
            return await res.json()
        }
    })
}

export function useSubmitDecision(
    processId: string,
    playbookId: string,
    reviewer: string,
    requestId?: string
) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            reviewFeedback,
            approvedOrRejected
        }: {
            reviewFeedback: string
            approvedOrRejected: 'APPROVED' | 'REJECTED' | 'ABSTAIN'
        }) => {
            const res = await fetchWithToken(API_ENDPOINTS.SUBMIT_APPROVAL(), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processId,
                    reviewFeedback,
                    approvedOrRejected,
                    reviewer,
                    ...(requestId ? { requestId } : {})
                })
            })
            if (!res.ok) {
                throw new Error('Failed to submit decision')
            }
            await queryClient.invalidateQueries({
                queryKey: ['playbook', playbookId]
            })
            return await res.json()
        }
    })
}
