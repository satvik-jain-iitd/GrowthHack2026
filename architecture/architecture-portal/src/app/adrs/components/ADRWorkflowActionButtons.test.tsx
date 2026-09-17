import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ADRWorkflowActionButtons from './ADRWorkflowActionButtons'
import { useUserContext } from '@/context'
import { useADRRoles } from '@/app/adrs/hooks/useADRRoles'
import {
    useSubmitADRForReview,
    useSubmitADRReview,
    useSubmitADRApproval
} from '@/app/adrs/hooks/useADRWorkflowActions'
import { ADR } from '@/app/docs/hooks/useGetADR'

// Mock dependencies
jest.mock('@/context')
jest.mock('@/app/adrs/hooks/useADRRoles')
jest.mock('@/app/adrs/hooks/useADRWorkflowActions')
jest.mock('@/app/build-vs-buys/components/bvb-workflow/FeedbackModal', () => ({
    __esModule: true,
    default: ({
        open,
        onClose,
        onSubmit,
        title,
        submitLabel
    }: {
        open: boolean
        onClose: () => void
        onSubmit: (feedback: string) => void
        title: string
        submitLabel: string
    }) =>
        open ? (
            <div data-testid='feedback-modal'>
                <div>{title}</div>
                <button onClick={() => onSubmit('Test feedback')}>
                    {submitLabel}
                </button>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null
}))

const mockUseUserContext = useUserContext as jest.MockedFunction<
    typeof useUserContext
>
const mockUseADRRoles = useADRRoles as jest.MockedFunction<typeof useADRRoles>
const mockUseSubmitADRForReview = useSubmitADRForReview as jest.MockedFunction<
    typeof useSubmitADRForReview
>
const mockUseSubmitADRReview = useSubmitADRReview as jest.MockedFunction<
    typeof useSubmitADRReview
>
const mockUseSubmitADRApproval = useSubmitADRApproval as jest.MockedFunction<
    typeof useSubmitADRApproval
>

describe('ADRWorkflowActionButtons', () => {
    const mockADR: ADR = {
        adr_mtda_id: 'adr-123',
        adr_nm: 'test adr',
        rev_ctc_da: ['reviewerEmail@aexp.com'],
        aprv_ctc_da: ['approverEmail@aexp.com'],
        entrpr_archt_ctc_da: ['eaArchitectEmail@aexp.com'],
        adr_req_email_ad_tx: 'requesterEmail@aexp.com',
        wkflow_sta_nm: 'IN PROGRESS',
        wkflow_id: 'wkflow-123',
        wkflow_step_id: 'step-123',
        reviews: []
    }

    const mockMutateAsync = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'userEmail@aexp.com' }
        } as ReturnType<typeof useUserContext>)
        mockUseSubmitADRForReview.mockReturnValue({
            mutateAsync: mockMutateAsync
        } as Partial<ReturnType<typeof useSubmitADRForReview>> as ReturnType<
            typeof useSubmitADRForReview
        >)
        mockUseSubmitADRReview.mockReturnValue({
            mutateAsync: mockMutateAsync
        } as Partial<ReturnType<typeof useSubmitADRReview>> as ReturnType<
            typeof useSubmitADRReview
        >)
        mockUseSubmitADRApproval.mockReturnValue({
            mutateAsync: mockMutateAsync
        } as Partial<ReturnType<typeof useSubmitADRApproval>> as ReturnType<
            typeof useSubmitADRApproval
        >)
    })

    it('shows "Submit for Review" button when status is IN PROGRESS and user is architect', () => {
        mockUseADRRoles.mockReturnValue({
            isRequester: false,
            isReviewer: false,
            isDecider: false,
            isArchitect: true,
            isAdmin: false
        })

        render(<ADRWorkflowActionButtons adr={mockADR} fileId='file-123' />)

        expect(screen.getByText('Submit for Review')).toBeInTheDocument()
    })

    it('shows "Submit for Review" button when status is IN PROGRESS and user is requester', () => {
        mockUseADRRoles.mockReturnValue({
            isRequester: true,
            isReviewer: false,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        render(<ADRWorkflowActionButtons adr={mockADR} fileId='file-123' />)

        expect(screen.getByText('Submit for Review')).toBeInTheDocument()
    })

    it('shows review buttons when status is UNDER REVIEW and user is reviewer', () => {
        const adrUnderReview = { ...mockADR, wkflow_sta_nm: 'UNDER REVIEW' }
        mockUseADRRoles.mockReturnValue({
            isRequester: false,
            isReviewer: true,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        render(
            <ADRWorkflowActionButtons adr={adrUnderReview} fileId='file-123' />
        )

        expect(screen.getByText('Abstain')).toBeInTheDocument()
        expect(screen.getByText('Disagree')).toBeInTheDocument()
        expect(screen.getByText('Agree')).toBeInTheDocument()
    })

    it('shows approval buttons when status is AWAITING APPROVAL and user is decider', () => {
        const adrAwaitingApproval = {
            ...mockADR,
            wkflow_sta_nm: 'AWAITING APPROVAL'
        }
        mockUseADRRoles.mockReturnValue({
            isRequester: false,
            isReviewer: false,
            isDecider: true,
            isArchitect: false,
            isAdmin: false
        })

        render(
            <ADRWorkflowActionButtons
                adr={adrAwaitingApproval}
                fileId='file-123'
            />
        )

        expect(screen.getByText('Approve')).toBeInTheDocument()
        expect(screen.getByText('Reject')).toBeInTheDocument()
    })

    it('does not show buttons when user has no relevant role', () => {
        mockUseADRRoles.mockReturnValue({
            isRequester: false,
            isReviewer: false,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        const { container } = render(
            <ADRWorkflowActionButtons adr={mockADR} fileId='file-123' />
        )

        expect(container.querySelector('button')).not.toBeInTheDocument()
    })

    it('opens modal when Submit for Review is clicked', () => {
        mockUseADRRoles.mockReturnValue({
            isRequester: true,
            isReviewer: false,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        render(<ADRWorkflowActionButtons adr={mockADR} fileId='file-123' />)

        const submitButton = screen.getByText('Submit for Review')
        fireEvent.click(submitButton)

        expect(screen.getByTestId('feedback-modal')).toBeInTheDocument()
    })

    it('opens modal when Agree is clicked', () => {
        const adrUnderReview = { ...mockADR, wkflow_sta_nm: 'UNDER REVIEW' }
        mockUseADRRoles.mockReturnValue({
            isRequester: false,
            isReviewer: true,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        render(
            <ADRWorkflowActionButtons adr={adrUnderReview} fileId='file-123' />
        )

        const agreeButton = screen.getByText('Agree')
        fireEvent.click(agreeButton)

        expect(screen.getByTestId('feedback-modal')).toBeInTheDocument()
        expect(screen.getByText('Review Feedback')).toBeInTheDocument()
    })

    it('submits review when modal submit is clicked', async () => {
        const adrUnderReview = { ...mockADR, wkflow_sta_nm: 'UNDER REVIEW' }
        mockUseADRRoles.mockReturnValue({
            isRequester: false,
            isReviewer: true,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        mockMutateAsync.mockResolvedValue({})

        render(
            <ADRWorkflowActionButtons adr={adrUnderReview} fileId='file-123' />
        )

        const agreeButton = screen.getByText('Agree')
        fireEvent.click(agreeButton)

        const modal = screen.getByTestId('feedback-modal')
        const submitButton = modal.querySelector('button')!
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                approvedOrRejected: 'APPROVED',
                reviewFeedback: 'Test feedback'
            })
        })
    })

    it('submits approval when Approve is clicked', async () => {
        const adrAwaitingApproval = {
            ...mockADR,
            wkflow_sta_nm: 'AWAITING APPROVAL'
        }
        mockUseADRRoles.mockReturnValue({
            isRequester: false,
            isReviewer: false,
            isDecider: true,
            isArchitect: false,
            isAdmin: false
        })

        mockMutateAsync.mockResolvedValue({})

        render(
            <ADRWorkflowActionButtons
                adr={adrAwaitingApproval}
                fileId='file-123'
            />
        )

        const approveButton = screen.getByText('Approve')
        fireEvent.click(approveButton)

        const modal = screen.getByTestId('feedback-modal')
        const submitButton = modal.querySelector('button')!
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                approvedOrRejected: 'APPROVED',
                reviewFeedback: 'Test feedback'
            })
        })
    })

    it('closes modal when Close is clicked', () => {
        mockUseADRRoles.mockReturnValue({
            isRequester: true,
            isReviewer: false,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        render(<ADRWorkflowActionButtons adr={mockADR} fileId='file-123' />)

        const submitButton = screen.getByText('Submit for Review')
        fireEvent.click(submitButton)

        expect(screen.getByTestId('feedback-modal')).toBeInTheDocument()

        const closeButton = screen.getByText('Close')
        fireEvent.click(closeButton)

        expect(screen.queryByTestId('feedback-modal')).not.toBeInTheDocument()
    })

    it('stops event propagation when buttons are clicked', () => {
        mockUseADRRoles.mockReturnValue({
            isRequester: true,
            isReviewer: false,
            isDecider: false,
            isArchitect: false,
            isAdmin: false
        })

        const handleClick = jest.fn()
        render(
            <div onClick={handleClick}>
                <ADRWorkflowActionButtons adr={mockADR} fileId='file-123' />
            </div>
        )

        const submitButton = screen.getByText('Submit for Review')
        fireEvent.click(submitButton)

        // The parent onClick should not be called
        expect(handleClick).not.toHaveBeenCalled()
    })
})
