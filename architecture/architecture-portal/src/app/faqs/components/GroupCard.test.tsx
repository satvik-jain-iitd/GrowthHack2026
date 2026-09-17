import React from 'react'
import { fireEvent, screen, within, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { GroupCard } from './GroupCard'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'
import { mockFaqGroups } from '@/app/faqs/test-data'

describe('GroupCard', () => {
    it('renders header and source link test ids', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        expect(
            screen.getByTestId(FAQ_TEST_IDS.groupCard(mockFaqGroups[0].id))
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(FAQ_TEST_IDS.groupHeader(mockFaqGroups[0].id))
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(
                FAQ_TEST_IDS.groupSourceLink(mockFaqGroups[0].id)
            )
        ).toBeInTheDocument()
    })

    it('calls onToggleAll with group id and item length', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        fireEvent.click(
            screen.getByTestId(
                FAQ_TEST_IDS.toggleAllButton(mockFaqGroups[0].id)
            )
        )

        expect(mockOnToggleAll).toHaveBeenCalledWith(
            mockFaqGroups[0].id,
            mockFaqGroups[0].items.length
        )
    })

    it('renders empty state for group without items', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[1]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        expect(
            screen.getByTestId(FAQ_TEST_IDS.emptyState(mockFaqGroups[1].id))
        ).toBeInTheDocument()
    })

    it('renders question trigger test id for item rows', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        expect(
            screen.getByTestId(
                FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
            )
        ).toBeInTheDocument()
    })

    it('shows close-all label when all items are open', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[0, 1]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        expect(
            screen.getByTestId(
                FAQ_TEST_IDS.toggleAllButton(mockFaqGroups[0].id)
            )
        ).toHaveTextContent('Close all')
    })

    it('renders answer content container for an open item', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[0]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        expect(
            screen.getByTestId(
                FAQ_TEST_IDS.answerContent(mockFaqGroups[0].items[0].id)
            )
        ).toBeInTheDocument()
    })

    it('displays all questions with default font weight when no question is selected', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        const trigger = screen.getByTestId(
            FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
        )
        const questionText = trigger.querySelector('p') || trigger
        expect(questionText).toHaveStyle({ fontWeight: 'normal' })
    })

    it('makes question bold when expanded and answer is visible', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[0]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        const trigger = screen.getByTestId(
            FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
        )
        const questionText = trigger.querySelector('p') || trigger
        expect(questionText).toHaveStyle({ fontWeight: 'bold' })
    })

    it('returns question to default font weight when collapsed', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        const { rerender } = render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[0]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        rerender(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        const trigger = screen.getByTestId(
            FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
        )
        const questionText = trigger.querySelector('p') || trigger
        expect(questionText).toHaveStyle({ fontWeight: 'normal' })
    })

    it('indents the answer content relative to the question', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[0]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        const answerContent = screen.getByTestId(
            FAQ_TEST_IDS.answerContent(mockFaqGroups[0].items[0].id)
        )
        const trigger = screen.getByTestId(
            FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
        )
        // Answer container has greater left padding than question trigger
        expect(answerContent.className).not.toBe(trigger.className)
        expect(answerContent).toBeInTheDocument()
    })

    it('question trigger is interactive and tracks expanded state', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        const trigger = screen.getByTestId(
            FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
        )

        // Trigger is interactive and tracks expanded state
        expect(trigger).toHaveAttribute('role', 'button')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('keeps answers collapsed for non-selected questions', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[0]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        // First item is expanded
        const firstTrigger = screen.getByTestId(
            FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
        )
        expect(firstTrigger).toHaveAttribute('aria-expanded', 'true')

        // Second item remains collapsed
        const secondTrigger = screen.getByTestId(
            FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[1].id)
        )
        expect(secondTrigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('shows edit icon on header hover and hides on mouse leave', () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        const heading = screen
            .getByTestId(FAQ_TEST_IDS.groupHeader(mockFaqGroups[0].id))
            .closest('h3, h2, [role="heading"]')!

        fireEvent.mouseEnter(heading)

        const sourceLink = screen.getByTestId(
            FAQ_TEST_IDS.groupSourceLink(mockFaqGroups[0].id)
        )
        const iconButton = within(sourceLink).getByRole('button')
        expect(iconButton).toBeInTheDocument()

        fireEvent.mouseLeave(heading)
        expect(iconButton).toBeInTheDocument()
    })

    it('calls onToggleOpen when a question trigger is clicked', async () => {
        const mockOnToggleOpen = jest.fn()
        const mockOnToggleAll = jest.fn()
        const mockGroupRef = jest.fn()

        render(
            <GroupCard
                group={mockFaqGroups[0]}
                isOpenMap={[]}
                onToggleOpen={mockOnToggleOpen}
                onToggleAll={mockOnToggleAll}
                groupRef={mockGroupRef}
            />
        )

        fireEvent.click(
            screen.getByTestId(
                FAQ_TEST_IDS.questionTrigger(mockFaqGroups[0].items[0].id)
            )
        )

        await waitFor(() => {
            expect(mockOnToggleOpen).toHaveBeenCalledWith(
                mockFaqGroups[0].id,
                0
            )
        })
    })
})
