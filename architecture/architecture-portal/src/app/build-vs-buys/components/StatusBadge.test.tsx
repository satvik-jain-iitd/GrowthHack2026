import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import StatusBadge, { getStatusByTask, getStatusLabel } from './StatusBadge'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// ── getStatusByTask ────────────────────────────────────────────────────────

describe('getStatusByTask', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('when workflowData.status is PROCESS_STATE_COMPLETED', () => {
        it('returns "rejected" when adrRejected is true', () => {
            expect(
                getStatusByTask('anything', {
                    status: 'PROCESS_STATE_COMPLETED',
                    adrRejected: true
                })
            ).toBe('rejected')
        })

        it('returns "approved" when adrRejected is false', () => {
            expect(
                getStatusByTask('anything', {
                    status: 'PROCESS_STATE_COMPLETED',
                    adrRejected: false
                })
            ).toBe('approved')
        })

        it('returns "approved" when adrRejected is absent', () => {
            expect(
                getStatusByTask('anything', {
                    status: 'PROCESS_STATE_COMPLETED'
                })
            ).toBe('approved')
        })
    })

    describe('switch cases (non-completed status)', () => {
        const workflowData = { status: 'PROCESS_STATE_RUNNING' }

        it('returns "awaitingAcceptance" for WaitForBvBCriteriaMet', () => {
            expect(getStatusByTask('WaitForBvBCriteriaMet', workflowData)).toBe(
                'awaitingAcceptance'
            )
        })

        it('returns "inProgress" for WaitForADRSubmission', () => {
            expect(getStatusByTask('WaitForADRSubmission', workflowData)).toBe(
                'inProgress'
            )
        })

        it('returns "inReview" for WaitForReviewers', () => {
            expect(getStatusByTask('WaitForReviewers', workflowData)).toBe(
                'inReview'
            )
        })

        it('returns "awaitingApproval" for WaitForDeciders', () => {
            expect(getStatusByTask('WaitForDeciders', workflowData)).toBe(
                'awaitingApproval'
            )
        })

        it('returns undefined for an unknown task', () => {
            expect(
                getStatusByTask('SomeUnknownTask', workflowData)
            ).toBeUndefined()
        })
    })

    it('handles nullish workflowData gracefully and falls through to switch', () => {
        expect(
            getStatusByTask(
                'WaitForReviewers',
                {} as { [key: string]: string | boolean }
            )
        ).toBe('inReview')
    })
})

// ── getStatusLabel ─────────────────────────────────────────────────────────

describe('getStatusLabel', () => {
    it('returns "N/A" for an empty string', () => {
        expect(getStatusLabel('')).toBe('N/A')
    })

    it('inserts spaces before uppercase letters and capitalizes first char', () => {
        expect(getStatusLabel('awaitingAcceptance')).toBe('Awaiting Acceptance')
    })

    it('formats inProgress correctly', () => {
        expect(getStatusLabel('inProgress')).toBe('In Progress')
    })

    it('formats inReview correctly', () => {
        expect(getStatusLabel('inReview')).toBe('In Review')
    })

    it('formats awaitingApproval correctly', () => {
        expect(getStatusLabel('awaitingApproval')).toBe('Awaiting Approval')
    })

    it('formats approved correctly', () => {
        expect(getStatusLabel('approved')).toBe('Approved')
    })
})

// ── StatusBadge component ──────────────────────────────────────────────────

describe('StatusBadge', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders the formatted status label', () => {
        render(<StatusBadge status='inProgress' />)
        expect(
            screen.getByTestId(BVB_TEST_IDS.statusBadgeLabel)
        ).toHaveTextContent('In Progress')
    })

    it('renders without fullWidth prop (no wrapper present)', () => {
        render(<StatusBadge status='approved' />)
        // No wrapping Box should be rendered
        expect(
            screen.queryByTestId(BVB_TEST_IDS.statusBadgeWrapper)
        ).not.toBeInTheDocument()
        expect(
            screen.getByTestId(BVB_TEST_IDS.statusBadgeLabel)
        ).toHaveTextContent('Approved')
    })

    it('renders with fullWidth=true (wraps badge in a wrapper)', () => {
        render(<StatusBadge status='rejected' fullWidth />)
        expect(
            screen.getByTestId(BVB_TEST_IDS.statusBadgeWrapper)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(BVB_TEST_IDS.statusBadgeLabel)
        ).toHaveTextContent('Rejected')
    })

    it('renders "N/A" for an empty status string', () => {
        render(<StatusBadge status='' />)
        expect(
            screen.getByTestId(BVB_TEST_IDS.statusBadgeLabel)
        ).toHaveTextContent('N/A')
    })

    it.each([
        'awaitingAcceptance',
        'inProgress',
        'inReview',
        'awaitingApproval',
        'approved',
        'accepted',
        'rejected',
        'complete',
        'open',
        'unknownStatus'
    ])('renders without error for status "%s"', status => {
        expect(() => render(<StatusBadge status={status} />)).not.toThrow()
    })
})
