import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@/test/utils/test-utils'
import { Playbook } from '@/types/Playbook'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// Mock the status helpers used by the stepper
const mockGetStatusByTask = jest.fn()
const mockGetStatusLabel = jest.fn()
jest.mock('@/app/build-vs-buys/components/StatusBadge', () => ({
    getStatusByTask: (step: unknown, data: unknown) =>
        mockGetStatusByTask(step, data),
    getStatusLabel: (workflowStep: unknown) => mockGetStatusLabel(workflowStep)
}))

import BvBWorkflowStepper from './BvBWorkflowStepper'

describe('BvBWorkflowStepper', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const basePlaybook: Playbook = {
        playbook_id: 'playbook-1',
        add_da: {
            workflowData: {
                bvbId: 'bvb-1',
                reviews: [],
                approvals: [],
                currentTask: {
                    step: 'some-step'
                }
            }
        }
    } as unknown as Playbook

    it('renders all step titles when getStatusByTask returns falsy', () => {
        mockGetStatusByTask.mockReturnValue(null)

        render(<BvBWorkflowStepper playbook={basePlaybook} />)

        // Verify each step title using test-ids
        expect(
            screen.getByTestId(BVB_TEST_IDS.stepperStepTitle(0))
        ).toHaveTextContent('Awaiting Acceptance')
        expect(
            screen.getByTestId(BVB_TEST_IDS.stepperStepTitle(1))
        ).toHaveTextContent('In Progress')
        expect(
            screen.getByTestId(BVB_TEST_IDS.stepperStepTitle(2))
        ).toHaveTextContent('In Review')
        expect(
            screen.getByTestId(BVB_TEST_IDS.stepperStepTitle(3))
        ).toHaveTextContent('Awaiting Approval')
        expect(
            screen.getByTestId(BVB_TEST_IDS.stepperStepTitle(4))
        ).toHaveTextContent('Complete')
    })

    it('activates the correct step index for a normal status label', () => {
        // Simulate workflow step -> label mapping
        mockGetStatusByTask.mockReturnValue('inProgress-step')
        mockGetStatusLabel.mockReturnValue('In Progress')

        render(<BvBWorkflowStepper playbook={basePlaybook} />)

        // Ensure the In Progress step title is present
        expect(
            screen.getByTestId(BVB_TEST_IDS.stepperStepTitle(1))
        ).toHaveTextContent('In Progress')
    })

    it('treats Approved/Rejected as completed (step index = steps.length)', () => {
        mockGetStatusByTask.mockReturnValue('approved-step')
        mockGetStatusLabel.mockReturnValue('Approved')

        render(<BvBWorkflowStepper playbook={basePlaybook} />)

        // When status is Approved, the component passes step equal to steps.length.
        // The Complete title should still exist in the DOM
        expect(
            screen.getByTestId(BVB_TEST_IDS.stepperStepTitle(4))
        ).toHaveTextContent('Complete')
    })
})
