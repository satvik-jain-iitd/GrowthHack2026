export type Review = {
    requestId?: string
    reviewer: string
    approvedOrRejected: 'APPROVED' | 'REJECTED' | 'ABSTAIN' | 'PENDING'
    reviewFeedback: string
}
