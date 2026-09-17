import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { JourneyGroupList } from './JourneyGroupList'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

jest.mock('@/components/icons/AIIcon', () => ({
    AIIcon: () => <span data-testid='ai-icon' />
}))

const j1: CustomerJourney = {
    journey_id: 'j1',
    journey_statement: 'Buy online',
    journey_grp_tx: 'Shopping',
    customer_tx: [],
    market: [],
    product: []
}
const j2: CustomerJourney = {
    journey_id: 'j2',
    journey_statement: 'Return item',
    journey_grp_tx: 'Shopping',
    customer_tx: [],
    market: [],
    product: []
}
const j3: CustomerJourney = {
    journey_id: 'j3',
    journey_statement: 'Open account',
    journey_grp_tx: 'Banking',
    customer_tx: [],
    market: [],
    product: []
}

const groups: [string, CustomerJourney[]][] = [
    ['Shopping', [j1, j2]],
    ['Banking', [j3]]
]

describe('JourneyGroupList', () => {
    it('renders all group name headers', () => {
        render(
            <JourneyGroupList
                groupedJourneys={groups}
                aiRecommendedIds={new Set()}
                selectedIds={new Set()}
                onToggle={jest.fn()}
            />
        )
        // textTransform='uppercase' is CSS-only; DOM text is the original case
        expect(
            screen.getByTestId('journey-group-name-Shopping')
        ).toBeInTheDocument()
        expect(
            screen.getByTestId('journey-group-name-Banking')
        ).toBeInTheDocument()
    })

    it('renders journey statements for each journey', () => {
        render(
            <JourneyGroupList
                groupedJourneys={groups}
                aiRecommendedIds={new Set()}
                selectedIds={new Set()}
                onToggle={jest.fn()}
            />
        )
        expect(
            screen.getByTestId('journey-checkbox-label-j1')
        ).toHaveTextContent('Buy online')
        expect(
            screen.getByTestId('journey-checkbox-label-j2')
        ).toHaveTextContent('Return item')
        expect(
            screen.getByTestId('journey-checkbox-label-j3')
        ).toHaveTextContent('Open account')
    })

    it('selected journeys have checked checkboxes', () => {
        render(
            <JourneyGroupList
                groupedJourneys={groups}
                aiRecommendedIds={new Set()}
                selectedIds={new Set(['j1'])}
                onToggle={jest.fn()}
            />
        )
        const inputs = document.querySelectorAll('input[type="checkbox"]')
        // verify at least one checkbox is checked
        const checkedInputs = Array.from(inputs).filter(
            (el: Element) => (el as HTMLInputElement).checked
        )
        expect(checkedInputs).toHaveLength(1)
    })

    it('unselected journeys have unchecked checkboxes', () => {
        render(
            <JourneyGroupList
                groupedJourneys={groups}
                aiRecommendedIds={new Set()}
                selectedIds={new Set()}
                onToggle={jest.fn()}
            />
        )
        const inputs = document.querySelectorAll('input[type="checkbox"]')
        const checkedInputs = Array.from(inputs).filter(
            (el: Element) => (el as HTMLInputElement).checked
        )
        expect(checkedInputs).toHaveLength(0)
    })

    it('renders AI icon for journeys in aiRecommendedIds', () => {
        render(
            <JourneyGroupList
                groupedJourneys={groups}
                aiRecommendedIds={new Set(['j1'])}
                selectedIds={new Set(['j1'])}
                onToggle={jest.fn()}
            />
        )
        expect(screen.getByTestId('ai-icon')).toBeInTheDocument()
    })

    it('calls onToggle with the correct journey_id on click', async () => {
        const onToggle = jest.fn()
        const user = userEvent.setup()
        render(
            <JourneyGroupList
                groupedJourneys={groups}
                aiRecommendedIds={new Set()}
                selectedIds={new Set()}
                onToggle={onToggle}
            />
        )
        // Chakra v3 fires onCheckedChange via userEvent (pointer events) on the control
        const controls = document.querySelectorAll('[data-part="control"]')
        await user.click(controls[0] as HTMLElement)
        expect(onToggle).toHaveBeenCalled()
    })
})
