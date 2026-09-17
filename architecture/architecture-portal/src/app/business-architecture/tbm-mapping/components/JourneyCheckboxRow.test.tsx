import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { JourneyCheckboxRow } from './JourneyCheckboxRow'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

jest.mock('@/components/icons/AIIcon', () => ({
    AIIcon: () => <span data-testid='ai-icon' />
}))

const makeJourney = (
    id = 'j1',
    label = 'Buy something online'
): CustomerJourney => ({
    journey_id: id,
    journey_statement: label,
    journey_grp_tx: 'Shopping',
    customer_tx: [],
    market: [],
    product: []
})

describe('JourneyCheckboxRow', () => {
    it('renders the journey statement text', () => {
        render(
            <JourneyCheckboxRow
                journey={makeJourney()}
                isChecked={false}
                isAI={false}
                onToggle={jest.fn()}
            />
        )
        expect(
            screen.getByTestId('journey-checkbox-label-j1')
        ).toHaveTextContent('Buy something online')
    })

    it('renders a checked checkbox when isChecked=true', () => {
        render(
            <JourneyCheckboxRow
                journey={makeJourney()}
                isChecked={true}
                isAI={false}
                onToggle={jest.fn()}
            />
        )
        const input = document.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement
        expect(input.checked).toBe(true)
    })

    it('renders an unchecked checkbox when isChecked=false', () => {
        render(
            <JourneyCheckboxRow
                journey={makeJourney()}
                isChecked={false}
                isAI={false}
                onToggle={jest.fn()}
            />
        )
        const input = document.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement
        expect(input.checked).toBe(false)
    })

    it('calls onToggle with the journey_id when checkbox is clicked', async () => {
        const onToggle = jest.fn()
        const user = userEvent.setup()
        render(
            <JourneyCheckboxRow
                journey={makeJourney('j42')}
                isChecked={false}
                isAI={false}
                onToggle={onToggle}
            />
        )
        const control = document.querySelector(
            '[data-part="control"]'
        ) as HTMLElement
        await user.click(control)
        expect(onToggle).toHaveBeenCalledWith('j42')
    })

    it('renders the AI icon when isAI=true', () => {
        render(
            <JourneyCheckboxRow
                journey={makeJourney()}
                isChecked={true}
                isAI={true}
                onToggle={jest.fn()}
            />
        )
        expect(screen.getByTestId('ai-icon')).toBeInTheDocument()
    })

    it('does not render the AI icon when isAI=false', () => {
        render(
            <JourneyCheckboxRow
                journey={makeJourney()}
                isChecked={false}
                isAI={false}
                onToggle={jest.fn()}
            />
        )
        expect(screen.queryByTestId('ai-icon')).not.toBeInTheDocument()
    })
})
