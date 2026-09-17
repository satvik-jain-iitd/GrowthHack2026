import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { Playbook } from '@/types/Playbook'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// Polyfill ResizeObserver for jsdom used by @zag-js/dom-query/segment-group
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
;(
    global as unknown as { ResizeObserver?: typeof ResizeObserver }
).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

// Mock AvatarTableRow to simplify rendering and make email visible
jest.mock('@/components/ui', () => ({
    __esModule: true,
    AvatarTableRow: ({ email }: { email: string }) => (
        <div data-testid={`avatar-${email}`}>{email}</div>
    )
}))

// Mock IconFeedback so the Icon used in FeedbackPopover renders a predictable element
jest.mock('@americanexpress/dls-icons', () => ({
    IconFeedback: () => <span data-testid='icon-feedback'>FB</span>
}))

import BvBWorkflowActorTable from './BvBWorkflowActorTable'

describe('BvBWorkflowActorTable', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders headings and description using playbook name', () => {
        const playbook = {
            playbook_nm: 'My Playbook',
            add_da: { workflowData: {} }
        } as unknown as Playbook
        render(<BvBWorkflowActorTable playbook={playbook} />)

        expect(
            screen.getByTestId(BVB_TEST_IDS.actorTableHeading)
        ).toHaveTextContent('My Playbook Assessment Reviewers')
        expect(
            screen.getByTestId(BVB_TEST_IDS.actorTableDescription)
        ).toHaveTextContent(/These are the current selected reviewers for/i)
    })

    it('shows empty state when there are no reviewers', () => {
        const playbook = {
            playbook_nm: 'Empty Playbook',
            add_da: { workflowData: { actors: { reviewers: [] } } }
        } as unknown as Playbook
        render(<BvBWorkflowActorTable playbook={playbook} />)

        expect(
            screen.getByTestId(BVB_TEST_IDS.actorTableEmptyState)
        ).toHaveTextContent('No REVIEWERS found.')
    })

    it('renders reviewer row with status and feedback icon when review exists', () => {
        const playbook = {
            playbook_nm: 'Review Playbook',
            add_da: {
                workflowData: {
                    actors: { reviewers: ['user'] },
                    reviews: [
                        {
                            reviewer: 'user',
                            approvedOrRejected: 'APPROVED',
                            reviewFeedback: 'Looks good'
                        }
                    ]
                }
            }
        } as unknown as Playbook

        render(<BvBWorkflowActorTable playbook={playbook} />)

        // Avatar row should render the email
        expect(
            screen.getByTestId(BVB_TEST_IDS.avatarRow('user'))
        ).toBeInTheDocument()
        // Status cell should contain APPROVED
        expect(
            screen.getByTestId(BVB_TEST_IDS.actorStatusCell('user'))
        ).toHaveTextContent('APPROVED')
        // Feedback icon should be present
        expect(
            screen.getByTestId(BVB_TEST_IDS.iconFeedback)
        ).toBeInTheDocument()
    })

    it('switches to DECIDERS and renders deciders with approvals', async () => {
        const playbook = {
            playbook_nm: 'Decider Playbook',
            add_da: {
                workflowData: {
                    actors: { reviewers: [], deciders: ['user'] },
                    approvals: [
                        {
                            reviewer: 'user',
                            approvedOrRejected: 'REJECTED',
                            reviewFeedback: ''
                        }
                    ]
                }
            }
        } as unknown as Playbook

        render(<BvBWorkflowActorTable playbook={playbook} />)

        // Click the DECIDERS segment using its test-id
        const decidersSegment = screen.getByTestId(BVB_TEST_IDS.decidersSegment)
        fireEvent.click(decidersSegment)

        // Column header should update to Deciders
        expect(
            await screen.findByTestId(BVB_TEST_IDS.actorTableColumnHeader)
        ).toHaveTextContent('Deciders')
        // Avatar row for decider should be present
        expect(
            await screen.findByTestId(BVB_TEST_IDS.avatarRow('user'))
        ).toBeInTheDocument()
        // Approval status should be shown
        expect(
            screen.getByTestId(BVB_TEST_IDS.actorStatusCell('user'))
        ).toHaveTextContent('REJECTED')
        // No feedback icon when reviewFeedback is empty
        expect(
            screen.queryByTestId(BVB_TEST_IDS.iconFeedback)
        ).not.toBeInTheDocument()
    })
})
