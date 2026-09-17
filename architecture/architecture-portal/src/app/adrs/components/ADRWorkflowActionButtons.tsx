import { Box, Button } from '@chakra-ui/react'
import { ADR } from '@/app/docs/hooks/useGetADR'
import { useUserContext } from '@/context'
import { useADRRoles } from '@/app/adrs/hooks/useADRRoles'
import React, { useState } from 'react'
import FeedbackModal from '@/app/build-vs-buys/components/bvb-workflow/FeedbackModal'
import {
    useSubmitADRForReview,
    useSubmitADRReview,
    ADRReviewInput,
    useSubmitADRApproval
} from '@/app/adrs/hooks/useADRWorkflowActions'

type ADRWorkflowActionButtonsProps = {
    adr: ADR
    fileId: string
}
export default function ADRWorkflowActionButtons({
    adr,
    fileId
}: ADRWorkflowActionButtonsProps) {
    const user = useUserContext()
    const { isReviewer, isDecider, isRequester, isArchitect } = useADRRoles(adr)
    const [modalOpen, setModalOpen] = React.useState(false)

    // Check if the current user has already submitted their review or approval
    const userEmail = user?.attributes.email || ''
    const hasUserAlreadyReviewed = adr.reviews?.some(
        review =>
            review.rev_email_ad_tx === userEmail &&
            review.rev_sta_nm !== 'PENDING'
    )
    const [modalConfig, setModalConfig] = useState<
        | {
              type: 'review'
              decision: 'APPROVED' | 'REJECTED' | 'ABSTAIN'
              label: string
              title: string
          }
        | {
              type: 'decision'
              decision: 'APPROVED' | 'REJECTED'
              label: string
              title: string
          }
        | {
              type: 'submitForReview'
              label: string
              title: string
          }
        | null
    >(null)

    const handleOpenModal = (config?: {
        decision?: 'APPROVED' | 'REJECTED' | 'ABSTAIN'
        label?: string
        title?: string
    }) => {
        if (adr.wkflow_sta_nm === 'UNDER REVIEW' && config?.decision) {
            setModalConfig({
                type: 'review',
                decision: config.decision,
                label: config.label || 'Submit',
                title: config.title || 'Provide Feedback'
            })
        } else if (
            adr.wkflow_sta_nm === 'AWAITING APPROVAL' &&
            config?.decision &&
            (config.decision === 'APPROVED' || config.decision === 'REJECTED')
        ) {
            setModalConfig({
                type: 'decision',
                decision: config.decision,
                label: config.label || 'Submit',
                title: config.title || 'Provide Feedback'
            })
        } else if (adr.wkflow_sta_nm === 'IN PROGRESS') {
            setModalConfig({
                type: 'submitForReview',
                label: config?.label || 'Submit for Review',
                title: config?.title || 'Submit for Review'
            })
        }
        setModalOpen(true)
    }

    const submitForReviewMutation = useSubmitADRForReview(
        adr.adr_mtda_id,
        fileId,
        user?.attributes.email || ''
    )
    const submitReviewMutation = useSubmitADRReview(
        adr.adr_mtda_id,
        user?.attributes.email || '',
        fileId
    )

    const submitApprovalMutation = useSubmitADRApproval(
        adr.adr_mtda_id,
        user?.attributes.email || '',
        fileId
    )
    const handleCloseModal = () => {
        setModalOpen(false)
        setModalConfig(null)
    }

    const handleSubmit = async (feedback: string) => {
        if (modalConfig?.type === 'submitForReview') {
            await submitForReviewMutation.mutateAsync()
        }

        if (modalConfig?.type === 'review') {
            await submitReviewMutation.mutateAsync({
                approvedOrRejected: modalConfig.decision,
                reviewFeedback: feedback
            } as ADRReviewInput)
        }

        if (modalConfig?.type === 'decision') {
            await submitApprovalMutation.mutateAsync({
                approvedOrRejected: modalConfig.decision,
                reviewFeedback: feedback
            } as ADRReviewInput)
        }
    }

    let buttons = null
    if (adr.wkflow_sta_nm === 'IN PROGRESS' && (isArchitect || isRequester)) {
        buttons = (
            <Button
                onClick={async e => {
                    e.stopPropagation()
                    handleOpenModal({
                        label: 'Submit for Review',
                        title: 'Submit for Review Confirmation'
                    })
                }}
                size='lg'
                colorPalette='blue'
                variant='outline'
                width='180px'
            >
                Submit for Review
            </Button>
        )
    } else if (
        adr.wkflow_sta_nm === 'UNDER REVIEW' &&
        isReviewer &&
        !hasUserAlreadyReviewed
    ) {
        buttons = (
            <>
                <Button
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal({
                            label: 'Abstain',
                            decision: 'ABSTAIN',
                            title: 'Abstain Feedback'
                        })
                    }}
                    size='lg'
                    colorPalette='blue'
                    variant='outline'
                    width='120px'
                >
                    Abstain
                </Button>
                <Button
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal({
                            label: 'Disagree',
                            decision: 'REJECTED',
                            title: 'Review Feedback'
                        })
                    }}
                    size='lg'
                    colorPalette='red'
                    variant='outline'
                    width='120px'
                >
                    Disagree
                </Button>
                <Button
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal({
                            label: 'Agree',
                            decision: 'APPROVED',
                            title: 'Review Feedback'
                        })
                    }}
                    size='lg'
                    colorPalette='green'
                    variant='outline'
                    width='120px'
                >
                    Agree
                </Button>
            </>
        )
    } else if (
        adr.wkflow_sta_nm === 'AWAITING APPROVAL' &&
        isDecider &&
        !hasUserAlreadyReviewed
    ) {
        buttons = (
            <>
                <Button
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal({
                            decision: 'APPROVED',
                            label: 'Approve',
                            title: 'Approval Feedback'
                        })
                    }}
                    size='lg'
                    colorPalette='green'
                    variant='outline'
                    width='120px'
                >
                    Approve
                </Button>
                <Button
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal({
                            decision: 'REJECTED',
                            label: 'Reject',
                            title: 'Rejection Feedback'
                        })
                    }}
                    size='lg'
                    colorPalette='red'
                    variant='outline'
                    width='120px'
                >
                    Reject
                </Button>
            </>
        )
    }
    return (
        <Box onClick={e => e.stopPropagation()}>
            <Box display='flex' alignItems='center' gap={1} ml={2}>
                {buttons}
            </Box>
            <FeedbackModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSubmit={async feedback => {
                    await handleSubmit(feedback)
                    handleCloseModal()
                }}
                title={modalConfig?.title}
                submitLabel={modalConfig?.label}
                showFeedback={
                    modalConfig?.type === 'review' ||
                    modalConfig?.type === 'decision'
                }
                decision={
                    modalConfig?.type === 'review' ||
                    modalConfig?.type === 'decision'
                        ? modalConfig.decision
                        : undefined
                }
            />
        </Box>
    )
}
