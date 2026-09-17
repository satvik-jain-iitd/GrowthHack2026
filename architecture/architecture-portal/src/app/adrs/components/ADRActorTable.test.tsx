import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ADRActorTable from './ADRActorTable'
import { ADR } from '@/app/docs/hooks/useGetADR'

// Mock the AvatarTableRow component
jest.mock('@/components/ui', () => ({
    AvatarTableRow: ({ email }: { email: string }) => (
        <div data-testid='avatar-row'>{email}</div>
    )
}))

describe('ADRActorTable', () => {
    const mockADR: ADR = {
        adr_mtda_id: 'adr-123',
        adr_nm: 'test adr',
        rev_ctc_da: ['reviewer1@example.com', 'reviewer2@example.com'],
        aprv_ctc_da: ['approver1@example.com', 'approver2@example.com'],
        entrpr_archt_ctc_da: ['architect@example.com'],
        adr_req_email_ad_tx: 'requester@example.com',
        wkflow_sta_nm: 'UNDER REVIEW',
        wkflow_id: 'wkflow-123',
        wkflow_step_id: 'step-123',
        reviews: [
            {
                wkflow_id: 'wkflow-123',
                rev_email_ad_tx: 'reviewer1@example.com',
                rev_sta_nm: 'APPROVED',
                rev_fdbk_tx: 'Looks good',
                amex_act_req_id: 'req-1',
                rev_type_nm: 'REVIEW'
            },
            {
                wkflow_id: 'wkflow-123',
                rev_email_ad_tx: 'approver1@example.com',
                rev_sta_nm: 'APPROVED',
                rev_fdbk_tx: 'Approved',
                amex_act_req_id: 'req-2',
                rev_type_nm: 'APPROVAL'
            }
        ]
    }

    it('renders reviewers by default', async () => {
        render(<ADRActorTable adr={mockADR} />)

        expect(screen.getByText(/Test Adr Reviewers/)).toBeInTheDocument()
        expect(screen.getByText('reviewer1@example.com')).toBeInTheDocument()
        expect(screen.getByText('reviewer2@example.com')).toBeInTheDocument()
    })

    it('switches to deciders when DECIDERS segment is clicked', async () => {
        render(<ADRActorTable adr={mockADR} />)

        const decidersButton = screen.getByText('DECIDERS')
        fireEvent.click(decidersButton)

        await waitFor(() => {
            expect(screen.getByText(/Test Adr Deciders/)).toBeInTheDocument()
            expect(
                screen.getByText('approver1@example.com')
            ).toBeInTheDocument()
            expect(
                screen.getByText('approver2@example.com')
            ).toBeInTheDocument()
        })
    })

    it('displays review status for reviewers', () => {
        render(<ADRActorTable adr={mockADR} />)

        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })

    it('displays review status for deciders', () => {
        render(<ADRActorTable adr={mockADR} />)

        const decidersButton = screen.getByText('DECIDERS')
        fireEvent.click(decidersButton)

        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })

    it('shows "No reviewers found" when rev_ctc_da is empty', () => {
        const adrWithoutReviewers = {
            ...mockADR,
            rev_ctc_da: []
        }
        render(<ADRActorTable adr={adrWithoutReviewers} />)

        expect(screen.getByText('No reviewers found.')).toBeInTheDocument()
    })

    it('shows "No deciders found" when aprv_ctc_da is empty', async () => {
        const adrWithoutDeciders = {
            ...mockADR,
            aprv_ctc_da: []
        }
        render(<ADRActorTable adr={adrWithoutDeciders} />)

        const decidersButton = screen.getByText('DECIDERS')
        fireEvent.click(decidersButton)

        await waitFor(() => {
            expect(screen.getByText('No deciders found.')).toBeInTheDocument()
        })
    })

    it('handles ADR with no reviews array', () => {
        const adrWithoutReviews = {
            ...mockADR,
            reviews: undefined
        }
        render(<ADRActorTable adr={adrWithoutReviews} />)

        expect(screen.getByText('reviewer1@example.com')).toBeInTheDocument()
        expect(screen.getByText('reviewer2@example.com')).toBeInTheDocument()
    })

    it('capitalizes ADR name correctly', () => {
        const adrWithLowercaseName = {
            ...mockADR,
            adr_nm: 'my test adr name'
        }
        render(<ADRActorTable adr={adrWithLowercaseName} />)

        expect(
            screen.getByText(/My Test Adr Name Reviewers/)
        ).toBeInTheDocument()
    })

    it('renders feedback column headers', () => {
        render(<ADRActorTable adr={mockADR} />)

        expect(screen.getByText('Reviewers')).toBeInTheDocument()
        expect(screen.getByText('Review Status')).toBeInTheDocument()
        expect(screen.getByText('Feedback')).toBeInTheDocument()
    })

    it('matches review by email case-insensitively', () => {
        const adrWithMixedCase = {
            ...mockADR,
            rev_ctc_da: ['REVIEWER1@EXAMPLE.COM'],
            reviews: [
                {
                    wkflow_id: 'wkflow-123',
                    rev_email_ad_tx: 'reviewer1@example.com',
                    rev_sta_nm: 'APPROVED' as const,
                    rev_fdbk_tx: 'Good',
                    amex_act_req_id: 'req-1',
                    rev_type_nm: 'REVIEW' as const
                }
            ]
        }
        render(<ADRActorTable adr={adrWithMixedCase} />)

        expect(screen.getByText('APPROVED')).toBeInTheDocument()
    })
})
