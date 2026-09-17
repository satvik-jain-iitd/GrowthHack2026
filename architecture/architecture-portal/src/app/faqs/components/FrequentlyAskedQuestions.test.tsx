import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { FrequentlyAskedQuestions } from './FrequentlyAskedQuestions'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'
import { mockFaqGroups } from '@/app/faqs/test-data'

const mockScrollRef = {
    current: { scrollTop: 0, offsetTop: 0, style: { scrollBehavior: '' } }
}
jest.mock('@/context', () => ({
    ...jest.requireActual('@/context'),
    useScrollContext: () => ({
        scrollRef: mockScrollRef,
        scrollTo: jest.fn(),
        getScrollY: jest.fn()
    })
}))

const mockNestedScrollIntoView = jest.fn()
const mockGroupScrollIntoView = jest.fn()
const mockGroupFocus = jest.fn()

jest.mock('./LeftNav', () => ({
    LeftNav: ({
        selectedGroup,
        onSelectGroup
    }: {
        selectedGroup: string
        onSelectGroup: (groupId: string) => void
    }) => {
        return (
            <div>
                <div
                    data-testid='mock-left-nav-selected-group'
                    data-selected-group={selectedGroup}
                />
                <button
                    data-testid='mock-left-nav-select-general'
                    onClick={() => onSelectGroup('general')}
                >
                    select-general
                </button>
                <button
                    data-testid='mock-left-nav-select-governance'
                    onClick={() => onSelectGroup('governance')}
                >
                    select-governance
                </button>
            </div>
        )
    }
}))

jest.mock('./GroupCard', () => ({
    GroupCard: ({
        group,
        isOpenMap,
        onToggleOpen,
        onToggleAll,
        groupRef
    }: {
        group: { id: string; items: Array<{ id: string }> }
        isOpenMap: number[]
        onToggleOpen: (groupId: string, index: number) => void
        onToggleAll: (groupId: string, itemsLength: number) => void
        groupRef: (el: HTMLDivElement | null) => void
    }) => (
        <div
            data-testid={`mock-group-card-${group.id}`}
            data-open-count={String(isOpenMap.length)}
            ref={el => {
                if (!el) {
                    groupRef(null)
                    return
                }

                const firstLevel = globalThis.document.createElement('div')
                const firstChild = globalThis.document.createElement('button')
                ;(firstChild as HTMLButtonElement).scrollIntoView =
                    mockNestedScrollIntoView
                firstLevel.appendChild(firstChild)
                el.prepend(firstLevel)
                ;(el as HTMLDivElement).scrollIntoView = mockGroupScrollIntoView
                ;(el as HTMLDivElement).focus = mockGroupFocus
                groupRef(el)
            }}
        >
            <button
                data-testid={`mock-toggle-open-${group.id}`}
                onClick={() => onToggleOpen(group.id, 0)}
            >
                toggle-open
            </button>
            <button
                data-testid={`mock-toggle-all-${group.id}`}
                onClick={() => onToggleAll(group.id, group.items.length)}
            >
                toggle-all
            </button>
        </div>
    )
}))

describe('FrequentlyAskedQuestions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        window.location.hash = ''
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('renders container and heading test ids', () => {
        render(<FrequentlyAskedQuestions faqs={mockFaqGroups} />)

        expect(
            screen.getByTestId(FAQ_TEST_IDS.faqContainer)
        ).toBeInTheDocument()
        expect(screen.getByTestId(FAQ_TEST_IDS.faqHeading)).toBeInTheDocument()
    })

    it('renders one group card per faq group', () => {
        render(<FrequentlyAskedQuestions faqs={mockFaqGroups} />)

        expect(
            screen.getByTestId('mock-group-card-general')
        ).toBeInTheDocument()
        expect(
            screen.getByTestId('mock-group-card-governance')
        ).toBeInTheDocument()
    })

    it('updates hash and triggers nested scroll when group is selected from nav', () => {
        render(<FrequentlyAskedQuestions faqs={mockFaqGroups} />)

        fireEvent.click(screen.getByTestId('mock-left-nav-select-governance'))

        expect(window.location.hash).toBe('#governance')
        expect(mockNestedScrollIntoView).toHaveBeenCalled()
    })

    it('toggles one item open and then closed for a group', () => {
        render(<FrequentlyAskedQuestions faqs={mockFaqGroups} />)

        expect(screen.getByTestId('mock-group-card-general')).toHaveAttribute(
            'data-open-count',
            '0'
        )

        fireEvent.click(screen.getByTestId('mock-toggle-open-general'))
        expect(screen.getByTestId('mock-group-card-general')).toHaveAttribute(
            'data-open-count',
            '1'
        )

        fireEvent.click(screen.getByTestId('mock-toggle-open-general'))
        expect(screen.getByTestId('mock-group-card-general')).toHaveAttribute(
            'data-open-count',
            '0'
        )
    })

    it('toggles all items open and then closed for a group', () => {
        render(<FrequentlyAskedQuestions faqs={mockFaqGroups} />)

        fireEvent.click(screen.getByTestId('mock-toggle-all-general'))
        expect(screen.getByTestId('mock-group-card-general')).toHaveAttribute(
            'data-open-count',
            String(mockFaqGroups[0].items.length)
        )

        fireEvent.click(screen.getByTestId('mock-toggle-all-general'))
        expect(screen.getByTestId('mock-group-card-general')).toHaveAttribute(
            'data-open-count',
            '0'
        )
    })

    it('initializes selected group from hash and scrolls container', () => {
        window.location.hash = '#general'
        mockScrollRef.current.scrollTop = 0
        render(<FrequentlyAskedQuestions faqs={mockFaqGroups} />)

        expect(
            screen.getByTestId('mock-left-nav-selected-group')
        ).toHaveAttribute('data-selected-group', 'general')
    })

    it('defaults selected group to the first item when hash is missing', () => {
        render(<FrequentlyAskedQuestions faqs={mockFaqGroups} />)

        expect(
            screen.getByTestId('mock-left-nav-selected-group')
        ).toHaveAttribute('data-selected-group', 'general')
    })

    it('resets selected group if current selection is removed after faqs update', () => {
        const { rerender } = render(
            <FrequentlyAskedQuestions faqs={mockFaqGroups} />
        )

        fireEvent.click(screen.getByTestId('mock-left-nav-select-governance'))
        expect(
            screen.getByTestId('mock-left-nav-selected-group')
        ).toHaveAttribute('data-selected-group', 'governance')

        rerender(
            <FrequentlyAskedQuestions
                faqs={[
                    {
                        ...mockFaqGroups[0],
                        id: 'new-general'
                    }
                ]}
            />
        )

        expect(
            screen.getByTestId('mock-left-nav-selected-group')
        ).toHaveAttribute('data-selected-group', 'new-general')
    })
})
