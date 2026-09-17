import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { JourneySearchBar } from './JourneySearchBar'

jest.mock('@americanexpress/dls-icons', () => ({
    IconInfo: () => <span data-testid='icon-info' />,
    IconSearch: () => <span data-testid='icon-search' />,
    IconClose: () => <span data-testid='icon-close' />
}))

jest.mock('@/components/icons/AIIcon', () => ({
    AIIcon: () => <span data-testid='ai-icon' />
}))

jest.mock('@/components/ui', () => ({
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

const defaultProps = {
    searchTerm: '',
    onSearchChange: jest.fn(),
    onNext: jest.fn(),
    onClear: jest.fn(),
    canNext: false,
    selectedJourneys: [],
    onRemoveJourney: jest.fn()
}

describe('JourneySearchBar', () => {
    beforeEach(() => jest.clearAllMocks())

    it('renders the search input with the provided searchTerm value', () => {
        render(<JourneySearchBar {...defaultProps} searchTerm='billing' />)
        expect(
            screen.getByPlaceholderText('Type an Enterprise Customer Journey')
        ).toHaveValue('billing')
    })

    it('calls onSearchChange with the new value when typing', () => {
        const onSearchChange = jest.fn()
        render(
            <JourneySearchBar
                {...defaultProps}
                onSearchChange={onSearchChange}
            />
        )
        fireEvent.change(
            screen.getByPlaceholderText('Type an Enterprise Customer Journey'),
            {
                target: { value: 'pay' }
            }
        )
        expect(onSearchChange).toHaveBeenCalledWith('pay')
    })

    it('Review button is disabled when canNext=false', () => {
        render(<JourneySearchBar {...defaultProps} canNext={false} />)
        expect(screen.getByTestId('review-impacted-btn')).toBeDisabled()
    })

    it('Review button is enabled when canNext=true and calls onNext on click', () => {
        const onNext = jest.fn()
        render(
            <JourneySearchBar
                {...defaultProps}
                canNext={true}
                onNext={onNext}
            />
        )
        const btn = screen.getByTestId('review-impacted-btn')
        expect(btn).not.toBeDisabled()
        fireEvent.click(btn)
        expect(onNext).toHaveBeenCalledTimes(1)
    })

    it('Clear button calls onClear', () => {
        const onClear = jest.fn()
        render(<JourneySearchBar {...defaultProps} onClear={onClear} />)
        fireEvent.click(screen.getByTestId('clear-btn'))
        expect(onClear).toHaveBeenCalledTimes(1)
    })

    it('renders no tags when selectedJourneys is empty', () => {
        render(<JourneySearchBar {...defaultProps} selectedJourneys={[]} />)
        expect(screen.queryByTestId('journey-tag-j1')).not.toBeInTheDocument()
    })

    it('renders a tag for each selected journey', () => {
        render(
            <JourneySearchBar
                {...defaultProps}
                selectedJourneys={[
                    { id: 'j1', label: 'Buy online', isAI: false },
                    { id: 'j2', label: 'Return item', isAI: false }
                ]}
            />
        )
        expect(screen.getByTestId('journey-tag-j1')).toHaveTextContent(
            'Buy online'
        )
        expect(screen.getByTestId('journey-tag-j2')).toHaveTextContent(
            'Return item'
        )
    })

    it('renders AI icon on tags where isAI=true', () => {
        render(
            <JourneySearchBar
                {...defaultProps}
                selectedJourneys={[
                    { id: 'j1', label: 'Buy online', isAI: true }
                ]}
            />
        )
        expect(screen.getByTestId('ai-icon')).toBeInTheDocument()
    })

    it('clicking the remove button on a tag calls onRemoveJourney with the id', () => {
        const onRemoveJourney = jest.fn()
        render(
            <JourneySearchBar
                {...defaultProps}
                selectedJourneys={[
                    { id: 'j1', label: 'Buy online', isAI: false }
                ]}
                onRemoveJourney={onRemoveJourney}
            />
        )
        fireEvent.click(screen.getByLabelText('Remove Buy online'))
        expect(onRemoveJourney).toHaveBeenCalledWith('j1')
    })

    it('Review button shows loading state when isLoading=true', () => {
        render(
            <JourneySearchBar
                {...defaultProps}
                canNext={true}
                isLoading={true}
            />
        )
        // When loading, Chakra visually replaces the button text; query by type instead
        const buttons = document.querySelectorAll('button')
        // The Review button is the first button in the HStack
        expect(buttons[0]).toBeDisabled()
    })

    it('renders the reusable Slack help button', () => {
        render(<JourneySearchBar {...defaultProps} />)
        expect(
            screen.getByRole('link', {
                name: /need help\?/i
            })
        ).toBeInTheDocument()
    })
})
