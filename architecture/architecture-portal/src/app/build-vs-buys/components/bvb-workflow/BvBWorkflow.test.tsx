import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// Mock usePlaybook hook
const mockUsePlaybook = jest.fn()
jest.mock('@/hooks', () => ({
    usePlaybook: (...args: unknown[]) => mockUsePlaybook(...(args as unknown[]))
}))

// Mock child components to keep tests focused and fast
jest.mock('./stepper/BvBWorkflowStepper', () => ({
    __esModule: true,
    default: () => <div data-testid='bvb-stepper'>Stepper</div>
}))
jest.mock('./BvBWorkflowActorTable', () => ({
    __esModule: true,
    default: () => <div data-testid='bvb-actor-table'>Actor Table</div>
}))
jest.mock('./BvBWorkflowActionButtons', () => ({
    __esModule: true,
    default: () => <div data-testid='bvb-action-buttons'>Actions</div>
}))
jest.mock('./StatusText', () => ({
    __esModule: true,
    default: ({ data }: { data?: { status?: string } }) => (
        <div data-testid='status-text'>Status: {data?.status ?? 'unknown'}</div>
    )
}))

import BvBWorkflow from './BvBWorkflow'

describe('BvBWorkflow', () => {
    const mockPlaybook = {
        id: 'playbook-1',
        add_da: {
            workflowData: {
                steps: [{ id: 's1' }]
            },
            status: 'in-progress'
        }
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders header, status text and action buttons when playbook is available', () => {
        mockUsePlaybook.mockReturnValue({
            data: mockPlaybook,
            isLoading: false
        })
        render(<BvBWorkflow playbookId='playbook-1' />)

        expect(
            screen.getByTestId(BVB_TEST_IDS.workflowStatusText)
        ).toHaveTextContent('in-progress')
        expect(
            screen.getByTestId(BVB_TEST_IDS.workflowViewDetails)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(BVB_TEST_IDS.workflowActionButtons)
        ).toBeInTheDocument()
    })

    it('does not render when loading or no playbook', () => {
        mockUsePlaybook.mockReturnValue({ data: null, isLoading: true })
        const { container, rerender } = render(
            <BvBWorkflow playbookId='playbook-1' />
        )
        // When loading, component returns null -> no root stack
        expect(container).toBeEmptyDOMElement()

        // Also when not loading but no playbook
        mockUsePlaybook.mockReturnValue({ data: null, isLoading: false })
        rerender(<BvBWorkflow playbookId='playbook-1' />)
        expect(container).toBeEmptyDOMElement()
    })

    it('expands to show stepper and actor table when View Details is clicked', async () => {
        mockUsePlaybook.mockReturnValue({
            data: mockPlaybook,
            isLoading: false
        })
        render(<BvBWorkflow playbookId='playbook-1' />)

        // Click the View Details trigger using its test-id
        const trigger = screen.getByTestId(BVB_TEST_IDS.workflowViewDetails)
        fireEvent.click(trigger)

        expect(
            await screen.findByTestId(BVB_TEST_IDS.workflowStepper)
        ).toBeInTheDocument()
        expect(
            await screen.findByTestId(BVB_TEST_IDS.workflowActorTable)
        ).toBeInTheDocument()
    })
})
