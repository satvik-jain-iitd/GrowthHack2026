import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { CapabilityFilterBar } from './CapabilityFilterBar'
import type { CapabilityFilter } from '@/app/business-architecture/types'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

jest.mock('@americanexpress/dls-icons', () => ({
    IconSearch: () => <span data-testid='icon-search' />,
    IconMinus: () => <span data-testid='icon-minus' />,
    IconPlus: () => <span data-testid='icon-plus' />
}))

const emptyFilter: CapabilityFilter = {
    name: '',
    region: '',
    product: '',
    customerJourney: '',
    persona: '',
    customer: '',
    application: ''
}

const journeys: CustomerJourney[] = [
    {
        journey_id: 'j1',
        journey_statement: 'Buy a Product',
        journey_desc: 'Purchase flow',
        journey_link: '',
        journey_grp_tx: 'Commerce'
    },
    {
        journey_id: 'j2',
        journey_statement: 'Return an Item',
        journey_desc: 'Returns flow',
        journey_link: '',
        journey_grp_tx: 'Commerce'
    }
]

function renderBar(
    overrides: Partial<React.ComponentProps<typeof CapabilityFilterBar>> = {}
) {
    const defaults: React.ComponentProps<typeof CapabilityFilterBar> = {
        capabilityFilter: emptyFilter,
        updateFilter: jest.fn(),
        clearFilters: jest.fn(),
        hasContentFilter: false,
        allCustomers: ['Consumer', 'Business'],
        customerJourneys: journeys,
        minLevel: 1,
        maxLevel: 5,
        capabilityLevel: '2',
        onLevelDecrement: jest.fn(),
        onLevelIncrement: jest.fn()
    }
    return render(<CapabilityFilterBar {...defaults} {...overrides} />)
}

describe('CapabilityFilterBar', () => {
    it('renders the capability name search input with correct placeholder', () => {
        renderBar()
        expect(
            screen.getByPlaceholderText(
                'Filter By Capability Name or Description'
            )
        ).toBeInTheDocument()
    })

    it('typing in the capability name input calls updateFilter with the new name', () => {
        const updateFilter = jest.fn()
        renderBar({ updateFilter })
        fireEvent.change(
            screen.getByPlaceholderText(
                'Filter By Capability Name or Description'
            ),
            { target: { value: 'Cloud' } }
        )
        expect(updateFilter).toHaveBeenCalledWith({ name: 'Cloud' })
    })

    it('renders the application search input with correct placeholder', () => {
        renderBar()
        expect(
            screen.getByPlaceholderText('Filter By Application name or ID')
        ).toBeInTheDocument()
    })

    it('typing in the application search input calls updateFilter with the application value', () => {
        const updateFilter = jest.fn()
        renderBar({ updateFilter })
        fireEvent.change(
            screen.getByPlaceholderText('Filter By Application name or ID'),
            { target: { value: 'MyApp' } }
        )
        expect(updateFilter).toHaveBeenCalledWith({ application: 'MyApp' })
    })

    it('renders an option for each entry in allCustomers', () => {
        renderBar({ allCustomers: ['Consumer', 'Business', 'SME'] })
        expect(
            screen.getByRole('option', { name: 'Consumer' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('option', { name: 'Business' })
        ).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'SME' })).toBeInTheDocument()
    })

    it('changing the customer segment select calls updateFilter({ customer })', () => {
        const updateFilter = jest.fn()
        renderBar({ updateFilter })
        // The NativeSelect renders as a native <select> element
        const selects = screen.getAllByRole('combobox')
        const nativeSelect = selects.find(el => el.tagName === 'SELECT')!
        fireEvent.change(nativeSelect, { target: { value: 'Business' } })
        expect(updateFilter).toHaveBeenCalledWith({ customer: 'Business' })
    })

    it('renders level controls with "Capability Level" label by default (showLevelControl=true)', () => {
        renderBar()
        expect(screen.getByText('Capability Level')).toBeInTheDocument()
    })

    it('hides level controls when showLevelControl=false', () => {
        renderBar({ showLevelControl: false })
        expect(screen.queryByText('Capability Level')).not.toBeInTheDocument()
    })

    it('clicking the minus icon calls onLevelDecrement', () => {
        const onLevelDecrement = jest.fn()
        renderBar({ onLevelDecrement })
        fireEvent.click(screen.getByTestId('icon-minus'))
        expect(onLevelDecrement).toHaveBeenCalled()
    })

    it('clicking the plus icon calls onLevelIncrement', () => {
        const onLevelIncrement = jest.fn()
        renderBar({ onLevelIncrement })
        fireEvent.click(screen.getByTestId('icon-plus'))
        expect(onLevelIncrement).toHaveBeenCalled()
    })

    it('does NOT render "Clear filters" link when hasContentFilter is false', () => {
        renderBar({ hasContentFilter: false })
        expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
    })

    it('renders "Clear filters" link when hasContentFilter is true', () => {
        renderBar({ hasContentFilter: true })
        expect(screen.getByText('Clear filters')).toBeInTheDocument()
    })

    it('clicking "Clear filters" calls clearFilters', () => {
        const clearFilters = jest.fn()
        renderBar({ hasContentFilter: true, clearFilters })
        fireEvent.click(screen.getByText('Clear filters'))
        expect(clearFilters).toHaveBeenCalled()
    })

    it('renders the journey combobox input with placeholder text', () => {
        renderBar()
        expect(
            screen.getByPlaceholderText(
                'Please select enterprise customer journey'
            )
        ).toBeInTheDocument()
    })

    it('shows the Customer section by default (showCustomerFilter=true)', () => {
        renderBar()
        expect(screen.getByText('Customer')).toBeInTheDocument()
        expect(
            screen.getByRole('option', { name: 'Consumer' })
        ).toBeInTheDocument()
    })

    it('hides the Customer section when showCustomerFilter=false', () => {
        renderBar({ showCustomerFilter: false })
        expect(screen.queryByText('Customer')).not.toBeInTheDocument()
        expect(
            screen.queryByRole('option', { name: 'Consumer' })
        ).not.toBeInTheDocument()
    })

    it('shows the Journey section by default (showJourneyFilter=true)', () => {
        renderBar()
        expect(
            screen.getByText('Enterprise Customer Journey')
        ).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText(
                'Please select enterprise customer journey'
            )
        ).toBeInTheDocument()
    })

    it('hides the Journey section when showJourneyFilter=false', () => {
        renderBar({ showJourneyFilter: false })
        expect(
            screen.queryByText('Enterprise Customer Journey')
        ).not.toBeInTheDocument()
        expect(
            screen.queryByPlaceholderText(
                'Please select enterprise customer journey'
            )
        ).not.toBeInTheDocument()
    })
})
