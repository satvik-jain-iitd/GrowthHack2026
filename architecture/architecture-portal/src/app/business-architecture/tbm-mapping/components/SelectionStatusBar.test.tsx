import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import {
    CapabilitySelectionStore,
    CapabilitySelectionProvider
} from './CapabilitySelectionContext'
import { SelectionStatusBar } from './SelectionStatusBar'

function renderBar(
    overrides: {
        onBack?: () => void
        onSaveAndNext?: () => void
        onSubmitAll?: () => void
        isLastJourney?: boolean
        allJourneysVisited?: boolean
    } = {},
    store = new CapabilitySelectionStore()
) {
    const onSaveAndNext = overrides.onSaveAndNext ?? jest.fn()
    const onBack = overrides.onBack
    const isLastJourney = overrides.isLastJourney ?? false
    const allJourneysVisited = overrides.allJourneysVisited ?? false
    const onSubmitAll = overrides.onSubmitAll
    return render(
        <CapabilitySelectionProvider store={store}>
            <SelectionStatusBar
                onBack={onBack}
                onSaveAndNext={onSaveAndNext}
                onSubmitAll={onSubmitAll}
                isLastJourney={isLastJourney}
                allJourneysVisited={allJourneysVisited}
            />
        </CapabilitySelectionProvider>
    )
}

function storeWithSelections() {
    const store = new CapabilitySelectionStore()
    store.initJourneys(['j1'])
    store.setActiveJourney('j1')
    store.toggle('c1')
    return store
}

describe('SelectionStatusBar', () => {
    it('does not render Back button when onBack is not provided', () => {
        renderBar()
        expect(
            screen.queryByTestId('back-to-journeys-btn')
        ).not.toBeInTheDocument()
    })

    it('renders Back button when onBack is provided', () => {
        renderBar({ onBack: jest.fn() })
        expect(screen.getByTestId('back-to-journeys-btn')).toBeInTheDocument()
    })

    it('clicking Back calls onBack', () => {
        const onBack = jest.fn()
        renderBar({ onBack })
        fireEvent.click(screen.getByTestId('back-to-journeys-btn'))
        expect(onBack).toHaveBeenCalledTimes(1)
    })

    it('renders "Review Selections" button whether or not last journey', () => {
        renderBar({ isLastJourney: false })
        expect(screen.getByTestId('review-selections-btn')).toBeInTheDocument()
    })

    it('renders "Review Selections" when last journey', () => {
        renderBar({ isLastJourney: true })
        expect(screen.getByTestId('review-selections-btn')).toBeInTheDocument()
    })

    it('clicking Review Selections calls onSaveAndNext', () => {
        const store = storeWithSelections()
        const onSaveAndNext = jest.fn()
        renderBar({ onSaveAndNext }, store)
        fireEvent.click(screen.getByTestId('review-selections-btn'))
        expect(onSaveAndNext).toHaveBeenCalledTimes(1)
    })

    it('renders "Submit All" button when allJourneysVisited=true, not last journey, and onSubmitAll provided', () => {
        renderBar({
            isLastJourney: false,
            allJourneysVisited: true,
            onSubmitAll: jest.fn()
        })
        expect(screen.getByTestId('submit-all-btn')).toBeInTheDocument()
    })

    it('does not render "Submit All" when allJourneysVisited=false', () => {
        renderBar({
            isLastJourney: false,
            allJourneysVisited: false,
            onSubmitAll: jest.fn()
        })
        expect(screen.queryByTestId('submit-all-btn')).not.toBeInTheDocument()
    })

    it('disables "Review Selections" when no capabilities are selected for the active journey', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        store.setActiveJourney('j1')
        renderBar({}, store)
        expect(screen.getByTestId('review-selections-btn')).toBeDisabled()
    })

    it('enables "Review Selections" when capabilities are selected for the active journey', () => {
        const store = storeWithSelections()
        renderBar({}, store)
        expect(screen.getByTestId('review-selections-btn')).not.toBeDisabled()
    })

    it('disables "Submit All" when not all journeys have selections', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1', 'j2'])
        store.setActiveJourney('j1')
        store.toggle('c1') // j1 has selection, j2 does not
        renderBar({ allJourneysVisited: true, onSubmitAll: jest.fn() }, store)
        expect(screen.getByTestId('submit-all-btn')).toBeDisabled()
    })

    it('enables "Submit All" when all journeys have at least one selection', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1', 'j2'])
        store.setActiveJourney('j1')
        store.toggle('c1')
        store.setActiveJourney('j2')
        store.toggle('c2')
        renderBar({ allJourneysVisited: true, onSubmitAll: jest.fn() }, store)
        expect(screen.getByTestId('submit-all-btn')).not.toBeDisabled()
    })
})
