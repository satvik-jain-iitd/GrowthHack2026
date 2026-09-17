import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { AptioForm } from './AptioForm'

// ---------------------------------------------------------------------------
// Mock child steps so we test only AptioForm's step-state machine.
// All values are inlined — jest.mock factories are hoisted and cannot reference
// variables defined in the outer module scope.
// ---------------------------------------------------------------------------

jest.mock('@/context/ScrollContext', () => ({
    useScrollContext: () => ({
        scrollTo: jest.fn(),
        scrollRef: { current: null },
        getScrollY: jest.fn()
    })
}))

jest.mock('./JourneySelectStep', () => ({
    JourneySelectStep: ({
        onNext,
        initialState
    }: {
        epicId: string
        onNext: (...args: unknown[]) => void
        initialState?: { searchTerm?: string }
        isNextPending?: boolean
    }) => (
        <div>
            <div data-testid='step1'>
                {initialState?.searchTerm && (
                    <span data-testid='restored-search'>
                        {initialState.searchTerm}
                    </span>
                )}
            </div>
            <button
                data-testid='btn-next'
                onClick={() =>
                    onNext(
                        [
                            {
                                journey_id: 'j1',
                                journey_statement: 'Buy online',
                                journey_grp_tx: 'Shopping',
                                customer_tx: [],
                                market: [],
                                product: []
                            }
                        ],
                        { selectedIds: new Set(['j1']), searchTerm: 'buy' }
                    )
                }
            >
                Next
            </button>
        </div>
    )
}))

jest.mock('./CapabilitySelectMap', () => ({
    CapabilitySelectMap: ({
        onBack,
        onSubmitComplete
    }: {
        epicId?: string
        onBack: () => void
        onSubmitComplete?: () => void
    }) => (
        <div>
            <div data-testid='step2' />
            <button data-testid='btn-back' onClick={onBack}>
                Back
            </button>
            {onSubmitComplete && (
                <button data-testid='btn-submit' onClick={onSubmitComplete}>
                    Submit
                </button>
            )}
        </div>
    )
}))

jest.mock('./SubmissionComplete', () => ({
    SubmissionComplete: () => <div data-testid='step3' />
}))

describe('AptioForm', () => {
    it('renders JourneySelectStep (step 1) on initial mount', () => {
        render(<AptioForm epicId='EPIC-1' />)
        expect(screen.getByTestId('step1')).toBeInTheDocument()
        expect(screen.queryByTestId('step2')).not.toBeInTheDocument()
    })

    it('renders CapabilitySelectMap (step 2) after onNext fires', async () => {
        render(<AptioForm epicId='EPIC-1' />)
        fireEvent.click(screen.getByTestId('btn-next'))
        await waitFor(() => {
            expect(screen.getByTestId('step2')).toBeInTheDocument()
            expect(screen.queryByTestId('step1')).not.toBeInTheDocument()
        })
    })

    it('clicking Back returns to step 1', async () => {
        render(<AptioForm epicId='EPIC-1' />)
        fireEvent.click(screen.getByTestId('btn-next'))
        await waitFor(() => screen.getByTestId('step2'))
        fireEvent.click(screen.getByTestId('btn-back'))
        await waitFor(() => {
            expect(screen.getByTestId('step1')).toBeInTheDocument()
            expect(screen.queryByTestId('step2')).not.toBeInTheDocument()
        })
    })

    it('restores saved journey state when returning to step 1', async () => {
        render(<AptioForm epicId='EPIC-1' />)
        // Go to step 2
        fireEvent.click(screen.getByTestId('btn-next'))
        await waitFor(() => screen.getByTestId('step2'))
        // Go back to step 1
        fireEvent.click(screen.getByTestId('btn-back'))
        await waitFor(() => {
            // The saved searchTerm 'buy' should be passed back as initialState
            expect(screen.getByTestId('restored-search')).toHaveTextContent(
                'buy'
            )
        })
    })

    it('renders SubmissionComplete (step 3) after onSubmitComplete fires', async () => {
        render(<AptioForm epicId='EPIC-1' />)
        fireEvent.click(screen.getByTestId('btn-next'))
        await waitFor(() => screen.getByTestId('step2'))
        fireEvent.click(screen.getByTestId('btn-submit'))
        await waitFor(() => {
            expect(screen.getByTestId('step3')).toBeInTheDocument()
            expect(screen.queryByTestId('step2')).not.toBeInTheDocument()
        })
    })
})
