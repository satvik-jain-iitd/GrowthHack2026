import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { JourneyCapabilityHeader } from './JourneyCapabilityHeader'
import {
    CapabilitySelectionStore,
    CapabilitySelectionProvider
} from './CapabilitySelectionContext'

// Mock SelectionStatusBar to expose minimal test hooks
jest.mock('./SelectionStatusBar', () => ({
    SelectionStatusBar: ({
        onBack,
        onSaveAndNext,
        onSubmitAll,
        isLastJourney,
        allJourneysVisited
    }: {
        onBack?: () => void
        onSaveAndNext: () => void
        onSubmitAll?: () => void
        isLastJourney: boolean
        allJourneysVisited?: boolean
    }) => (
        <div data-testid='status-bar'>
            {onBack && (
                <button data-testid='back-btn' onClick={onBack}>
                    Back
                </button>
            )}
            <button data-testid='save-next-btn' onClick={onSaveAndNext}>
                {isLastJourney ? 'Review Selections' : 'Review Selections'}
            </button>
            {allJourneysVisited && onSubmitAll && (
                <button data-testid='submit-all-btn' onClick={onSubmitAll}>
                    Submit All
                </button>
            )}
        </div>
    )
}))

function renderHeader(
    overrides: Partial<
        React.ComponentProps<typeof JourneyCapabilityHeader>
    > = {}
) {
    const store = new CapabilitySelectionStore()
    return render(
        <CapabilitySelectionProvider store={store}>
            <JourneyCapabilityHeader
                journeyStatement='Buy something online'
                onSaveAndNext={jest.fn()}
                onSubmitAll={jest.fn()}
                isLastJourney={false}
                allJourneysVisited={false}
                {...overrides}
            />
        </CapabilitySelectionProvider>
    )
}

describe('JourneyCapabilityHeader', () => {
    it('renders the journey statement', () => {
        renderHeader()
        expect(screen.getByTestId('journey-statement')).toHaveTextContent(
            'Buy something online'
        )
    })

    it('renders the instructions text', () => {
        renderHeader()
        expect(
            screen.getByTestId('capability-instructions')
        ).toBeInTheDocument()
    })

    it('renders the SelectionStatusBar', () => {
        renderHeader()
        expect(screen.getByTestId('status-bar')).toBeInTheDocument()
    })

    it('clicking Back calls onBack when provided', () => {
        const onBack = jest.fn()
        renderHeader({ onBack })
        fireEvent.click(screen.getByTestId('back-btn'))
        expect(onBack).toHaveBeenCalledTimes(1)
    })

    it('clicking save-next-btn calls onSaveAndNext', () => {
        const onSaveAndNext = jest.fn()
        renderHeader({ onSaveAndNext })
        fireEvent.click(screen.getByTestId('save-next-btn'))
        expect(onSaveAndNext).toHaveBeenCalledTimes(1)
    })
})
