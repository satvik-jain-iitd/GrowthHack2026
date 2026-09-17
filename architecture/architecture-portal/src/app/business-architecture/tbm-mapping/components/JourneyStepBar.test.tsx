import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { JourneyStepBar } from './JourneyStepBar'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

jest.mock('@americanexpress/dls-icons', () => ({
    IconCheck: () => <span data-testid='icon-check' />
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeJourney = (id: string, label: string): CustomerJourney => ({
    journey_id: id,
    journey_statement: label,
    journey_grp_tx: 'Group',
    customer_tx: [],
    market: [],
    product: []
})

const j1 = makeJourney('j1', 'Buy online')
const j2 = makeJourney('j2', 'Return item')
const j3 = makeJourney('j3', 'Open account')

describe('JourneyStepBar', () => {
    it('renders the journey statement for each journey', () => {
        render(<JourneyStepBar journeys={[j1, j2, j3]} currentIndex={0} />)
        expect(screen.getByTestId('step-label-j1')).toHaveTextContent(
            'Buy online'
        )
        expect(screen.getByTestId('step-label-j2')).toHaveTextContent(
            'Return item'
        )
        expect(screen.getByTestId('step-label-j3')).toHaveTextContent(
            'Open account'
        )
    })

    it('renders step numbers for future journeys (idx > currentIndex)', () => {
        render(<JourneyStepBar journeys={[j1, j2, j3]} currentIndex={0} />)
        // j2 is index 1 → step number "2", j3 is index 2 → step number "3"
        expect(screen.getByTestId('step-number-1')).toHaveTextContent('2')
        expect(screen.getByTestId('step-number-2')).toHaveTextContent('3')
    })

    it('renders a check icon for completed journeys (idx < currentIndex)', () => {
        render(<JourneyStepBar journeys={[j1, j2, j3]} currentIndex={1} />)
        // j1 (index 0) is completed — should show check icon
        expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    })

    it('does not render a check icon when no journeys are completed', () => {
        render(<JourneyStepBar journeys={[j1, j2]} currentIndex={0} />)
        expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument()
    })

    it('renders multiple check icons when multiple journeys are completed', () => {
        render(<JourneyStepBar journeys={[j1, j2, j3]} currentIndex={2} />)
        // j1 and j2 are both completed
        expect(screen.getAllByTestId('icon-check')).toHaveLength(2)
    })

    it('renders the step number for the active journey (not a check icon)', () => {
        render(<JourneyStepBar journeys={[j1, j2]} currentIndex={0} />)
        // Active journey (index 0 = j1) shows step number "1"
        expect(screen.getByTestId('step-number-0')).toHaveTextContent('1')
        expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument()
    })

    it('renders correctly with a single journey at index 0', () => {
        render(<JourneyStepBar journeys={[j1]} currentIndex={0} />)
        expect(screen.getByTestId('step-label-j1')).toHaveTextContent(
            'Buy online'
        )
        expect(screen.getByTestId('step-number-0')).toHaveTextContent('1')
    })
})
