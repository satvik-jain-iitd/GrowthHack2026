import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { Playbook } from '@/types/Playbook'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// Mock context
const mockUser = { attributes: { email: 'userEmail@aexp.com' } }
jest.mock('@/context', () => ({
    useUserContext: () => mockUser
}))

// Mock hooks
const mockUsePlaybookRoles = jest.fn()
const mockAcceptance = { mutateAsync: jest.fn().mockResolvedValue(undefined) }
const mockForReview = { mutateAsync: jest.fn().mockResolvedValue(undefined) }
const mockReview = { mutateAsync: jest.fn().mockResolvedValue(undefined) }
const mockDecision = { mutateAsync: jest.fn().mockResolvedValue(undefined) }
jest.mock('@/hooks', () => ({
    usePlaybookRoles: (playbook: unknown) => mockUsePlaybookRoles(playbook),
    useSubmitAcceptance: () => mockAcceptance,
    useSubmitForReview: () => mockForReview,
    useSubmitReview: () => mockReview,
    useSubmitDecision: () => mockDecision
}))

// Mock FeedbackModal to expose onSubmit/onClose via buttons when open
jest.mock('./FeedbackModal', () => ({
    __esModule: true,
    default: ({
        open,
        onClose,
        onSubmit,
        submitLabel,
        showWarning,
        warningMessage
    }: {
        open: boolean
        onClose: () => void
        onSubmit: (value: string) => void
        submitLabel?: string
        showWarning?: boolean
        warningMessage?: string
    }) =>
        open ? (
            <div data-testid='feedback-modal'>
                {showWarning && (
                    <div data-testid='feedback-approval-warning'>
                        {warningMessage}
                    </div>
                )}
                <button
                    data-testid='feedback-submit'
                    onClick={() => onSubmit('test-feedback')}
                >
                    {submitLabel || 'Submit'}
                </button>
                <button data-testid='feedback-close' onClick={onClose}>
                    Close
                </button>
            </div>
        ) : (
            <div data-testid='feedback-modal-closed' />
        )
}))

import BvBWorkflowActionButtons from './BvBWorkflowActionButtons'

describe('BvBWorkflowActionButtons', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const basePlaybook = {
        playbook_id: 'playbook-1',
        add_da: {
            workflowData: {
                bvbId: 'bvb-1',
                reviews: [],
                approvals: []
            }
        }
    }

    it('renders Submit for Review when status is inProgress and user is architect', async () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(playbook.add_da as any).status = 'inProgress'
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: false,
            isDecider: false,
            isAdmin: false,
            isRequester: false,
            isArchitect: true
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        const btn = screen.getByTestId(BVB_TEST_IDS.submitForReviewBtn)
        expect(btn).toBeInTheDocument()

        // Click to open modal
        fireEvent.click(btn)
        expect(
            await screen.findByTestId(BVB_TEST_IDS.feedbackModal)
        ).toBeInTheDocument()

        // Submit modal should call submitForReview mutate
        fireEvent.click(screen.getByTestId(BVB_TEST_IDS.feedbackSubmit))
        expect(mockForReview.mutateAsync).toHaveBeenCalled()
    })

    it('renders review buttons when status is inReview and user is reviewer', async () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(playbook.add_da as any).status = 'inReview'
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: true,
            isDecider: false,
            isAdmin: false,
            isRequester: false,
            isArchitect: false
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        const agreeBtn = screen.getByTestId(BVB_TEST_IDS.agreeBtn)
        expect(agreeBtn).toBeInTheDocument()

        fireEvent.click(agreeBtn)
        expect(
            await screen.findByTestId(BVB_TEST_IDS.feedbackModal)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByTestId(BVB_TEST_IDS.feedbackSubmit))
        expect(mockReview.mutateAsync).toHaveBeenCalledWith(
            expect.objectContaining({ reviewFeedback: 'test-feedback' })
        )
    })

    it('renders decision buttons when status is awaitingApproval and user is decider', async () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(playbook.add_da as any).status = 'awaitingApproval'
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: false,
            isDecider: true,
            isAdmin: false,
            isRequester: false,
            isArchitect: false
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        const approveBtn = screen.getByTestId(BVB_TEST_IDS.approveDecisionBtn)
        expect(approveBtn).toBeInTheDocument()

        fireEvent.click(approveBtn)
        expect(
            await screen.findByTestId(BVB_TEST_IDS.feedbackModal)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByTestId(BVB_TEST_IDS.feedbackSubmit))
        expect(mockDecision.mutateAsync).toHaveBeenCalled()
    })

    it('shows the low approval warning in the decision modal when approval rate is below 75%', async () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addDa = playbook.add_da as any
        addDa.status = 'awaitingApproval'
        addDa.workflowData.actors = {
            reviewers: [
                'r1@aexp.com',
                'r2@aexp.com',
                'r3@aexp.com',
                'r4@aexp.com'
            ]
        }
        addDa.workflowData.reviews = [
            { reviewer: 'r1@aexp.com', approvedOrRejected: 'APPROVED' },
            { reviewer: 'r2@aexp.com', approvedOrRejected: 'APPROVED' },
            { reviewer: 'r3@aexp.com', approvedOrRejected: 'REJECTED' },
            { reviewer: 'r4@aexp.com', approvedOrRejected: 'PENDING' }
        ]
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: false,
            isDecider: true,
            isAdmin: false,
            isRequester: false,
            isArchitect: false
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        fireEvent.click(screen.getByTestId(BVB_TEST_IDS.approveDecisionBtn))

        expect(
            await screen.findByTestId(BVB_TEST_IDS.feedbackApprovalWarning)
        ).toHaveTextContent(/currently 50%/i)
    })

    it('does not show the low approval warning when approval rate is at or above 75%', async () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addDa = playbook.add_da as any
        addDa.status = 'awaitingApproval'
        addDa.workflowData.actors = {
            reviewers: [
                'r1@aexp.com',
                'r2@aexp.com',
                'r3@aexp.com',
                'r4@aexp.com'
            ]
        }
        addDa.workflowData.reviews = [
            { reviewer: 'r1@aexp.com', approvedOrRejected: 'APPROVED' },
            { reviewer: 'r2@aexp.com', approvedOrRejected: 'APPROVED' },
            { reviewer: 'r3@aexp.com', approvedOrRejected: 'APPROVED' },
            { reviewer: 'r4@aexp.com', approvedOrRejected: 'REJECTED' }
        ]
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: false,
            isDecider: true,
            isAdmin: false,
            isRequester: false,
            isArchitect: false
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        fireEvent.click(screen.getByTestId(BVB_TEST_IDS.approveDecisionBtn))

        expect(
            await screen.findByTestId(BVB_TEST_IDS.feedbackModal)
        ).toBeInTheDocument()
        expect(
            screen.queryByTestId(BVB_TEST_IDS.feedbackApprovalWarning)
        ).not.toBeInTheDocument()
    })

    it('does not show the low approval warning for the reviewer feedback flow', async () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addDa = playbook.add_da as any
        addDa.status = 'inReview'
        addDa.workflowData.actors = { reviewers: ['r1@aexp.com'] }
        addDa.workflowData.reviews = [
            { reviewer: 'r1@aexp.com', approvedOrRejected: 'PENDING' }
        ]
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: true,
            isDecider: false,
            isAdmin: false,
            isRequester: false,
            isArchitect: false
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        fireEvent.click(screen.getByTestId(BVB_TEST_IDS.agreeBtn))

        expect(
            await screen.findByTestId(BVB_TEST_IDS.feedbackModal)
        ).toBeInTheDocument()
        expect(
            screen.queryByTestId(BVB_TEST_IDS.feedbackApprovalWarning)
        ).not.toBeInTheDocument()
    })

    it('renders acceptance buttons when status is awaitingAcceptance and user is admin', async () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(playbook.add_da as any).status = 'awaitingAcceptance'
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: false,
            isDecider: false,
            isAdmin: true,
            isRequester: false,
            isArchitect: false
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        const approveBtn = screen.getByTestId(BVB_TEST_IDS.approveAcceptanceBtn)
        expect(approveBtn).toBeInTheDocument()

        fireEvent.click(approveBtn)
        expect(
            await screen.findByTestId(BVB_TEST_IDS.feedbackModal)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByTestId(BVB_TEST_IDS.feedbackSubmit))
        expect(mockAcceptance.mutateAsync).toHaveBeenCalled()
    })

    it('renders no action buttons when no matching role for status', () => {
        const playbook = JSON.parse(
            JSON.stringify(basePlaybook)
        ) as unknown as Playbook
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(playbook.add_da as any).status = 'inReview'
        mockUsePlaybookRoles.mockReturnValue({
            isReviewer: false,
            isDecider: false,
            isAdmin: false,
            isRequester: false,
            isArchitect: false
        })

        render(<BvBWorkflowActionButtons playbook={playbook} />)

        // No action buttons should be present (only closed modal placeholder)
        expect(
            screen.queryByTestId(BVB_TEST_IDS.submitForReviewBtn)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(BVB_TEST_IDS.agreeBtn)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(BVB_TEST_IDS.approveDecisionBtn)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(BVB_TEST_IDS.approveAcceptanceBtn)
        ).not.toBeInTheDocument()
    })
})
