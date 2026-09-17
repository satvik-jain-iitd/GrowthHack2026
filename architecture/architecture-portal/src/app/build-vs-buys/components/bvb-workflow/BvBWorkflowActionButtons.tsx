import React from 'react'
import { Box, Button } from '@chakra-ui/react'
import { getStatusByTask } from '@/app/build-vs-buys/components/StatusBadge'
import { Playbook } from '@/types/Playbook'
import { useState } from 'react'
import FeedbackModal from './FeedbackModal'
import {
    usePlaybookRoles,
    useSubmitAcceptance,
    useSubmitDecision,
    useSubmitForReview,
    useSubmitReview
} from '@/hooks'
import { useUserContext } from '@/context'
import { Review } from '@/types/Review'

type BvBWorkflowActionButtonsProps = {
    playbook: Playbook
}

function getStatus(data: object) {
    const jsonContent = JSON.parse(JSON.stringify(data))
    if (jsonContent.workflowData && jsonContent.workflowData?.currentTask) {
        return getStatusByTask(
            jsonContent.workflowData?.currentTask?.step,
            jsonContent.workflowData
        )
    }
    return jsonContent.status
}

export default function BvBWorkflowActionButtons({
    playbook
}: BvBWorkflowActionButtonsProps) {
    const { isReviewer, isDecider, isAdmin, isRequester, isArchitect } =
        usePlaybookRoles(playbook)
    const user = useUserContext()
    const status = getStatus(playbook.add_da)
    const [modalOpen, setModalOpen] = useState(false)
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
              type: 'acceptance'
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

    const workflowData = JSON.parse(
        JSON.stringify(playbook.add_da)
    ).workflowData
    const bvbId = workflowData.bvbId

    const acceptanceDecision =
        modalConfig &&
        modalConfig.type === 'acceptance' &&
        'decision' in modalConfig &&
        modalConfig.decision === 'APPROVED'
            ? 'APPROVED'
            : 'REJECTED'
    const acceptanceMutation = useSubmitAcceptance(
        workflowData.bvbId,
        playbook.playbook_id,
        acceptanceDecision
    )

    const submitForReviewMutation = useSubmitForReview(
        workflowData.bvbId,
        playbook.playbook_id
    )

    const submitReviewMutation = useSubmitReview(
        workflowData.bvbId,
        playbook.playbook_id,
        user?.attributes.email || '',
        workflowData.reviews.find(
            (r: Review) => r.reviewer === user?.attributes.email
        )?.requestId || undefined
    )

    const submitDecisionMutation = useSubmitDecision(
        bvbId,
        playbook.playbook_id,
        user?.attributes.email || '',
        workflowData.approvals.find(
            (r: Review) => r.reviewer === user?.attributes.email
        )?.requestId || undefined
    )

    const reviewers: string[] = workflowData.actors?.reviewers ?? []
    const reviews: Review[] = workflowData.reviews ?? []
    const approvedCount = reviews.filter(
        (r: Review) => r.approvedOrRejected === 'APPROVED'
    ).length
    const approvalRate =
        reviewers.length === 0 ? 0 : approvedCount / reviewers.length
    const showLowApprovalWarning = approvalRate < 0.75

    const handleOpenModal = (
        type: 'review' | 'decision' | 'acceptance' | 'submitForReview',
        config?: {
            decision?: 'APPROVED' | 'REJECTED' | 'ABSTAIN'
            label?: string
            title?: string
        }
    ) => {
        if (type === 'review' && config?.decision) {
            setModalConfig({
                type,
                decision: config.decision as
                    | 'APPROVED'
                    | 'REJECTED'
                    | 'ABSTAIN',
                label: config.label || 'Submit',
                title: config.title || 'Provide Feedback'
            })
        } else if (
            (type === 'decision' || type === 'acceptance') &&
            config?.decision &&
            (config.decision === 'APPROVED' || config.decision === 'REJECTED')
        ) {
            setModalConfig({
                type,
                decision: config.decision,
                label: config.label || 'Submit',
                title: config.title || 'Provide Feedback'
            })
        } else if (type === 'submitForReview') {
            setModalConfig({
                type,
                label: config?.label || 'Submit for Review',
                title: config?.title || 'Submit Playbook for Review'
            })
        }
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setModalConfig(null)
    }
    const handleSubmit = async (feedback: string) => {
        if (!modalConfig) return
        if (modalConfig.type === 'review') {
            if (user?.attributes.email && modalConfig.decision) {
                await submitReviewMutation.mutateAsync({
                    reviewFeedback: feedback,
                    approvedOrRejected: modalConfig.decision
                })
            }
        } else if (modalConfig.type === 'decision') {
            if (user?.attributes.email && modalConfig.decision) {
                await submitDecisionMutation.mutateAsync({
                    reviewFeedback: feedback,
                    approvedOrRejected: modalConfig.decision
                })
            }
        } else if (modalConfig.type === 'acceptance') {
            await acceptanceMutation.mutateAsync()
        } else if (modalConfig.type === 'submitForReview') {
            await submitForReviewMutation.mutateAsync()
        }
    }

    let buttons = null
    if (status === 'inProgress' && (isArchitect || isRequester)) {
        buttons = (
            <Button
                data-testid='submit-for-review-btn'
                onClick={async e => {
                    e.stopPropagation()
                    handleOpenModal('submitForReview', {
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
    } else if (status === 'inReview' && isReviewer) {
        buttons = (
            <>
                <Button
                    data-testid='abstain-btn'
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal('review', {
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
                    data-testid='disagree-btn'
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal('review', {
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
                    data-testid='agree-btn'
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal('review', {
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
    } else if (status === 'awaitingApproval' && isDecider) {
        buttons = (
            <>
                <Button
                    data-testid='approve-decision-btn'
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal('decision', {
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
                    data-testid='reject-decision-btn'
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal('decision', {
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
    } else if (status === 'awaitingAcceptance' && isAdmin) {
        buttons = (
            <>
                <Button
                    data-testid='approve-acceptance-btn'
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal('acceptance', {
                            decision: 'APPROVED',
                            label: 'Approve',
                            title: 'Confirm Acceptance Approval'
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
                    data-testid='reject-acceptance-btn'
                    onClick={e => {
                        e.stopPropagation()
                        handleOpenModal('acceptance', {
                            decision: 'REJECTED',
                            label: 'Reject',
                            title: 'Confirm Acceptance Rejection'
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
            <Box
                display='flex'
                alignItems='center'
                gap={1}
                ml={2}
                data-testid='action-buttons-container'
            >
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
                showWarning={
                    modalConfig?.type === 'decision' && showLowApprovalWarning
                }
                warningMessage={`Reviewer approval rate is below 75% (currently ${Math.round(
                    approvalRate * 100
                )}%). Please consider this before submitting your decision.`}
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
