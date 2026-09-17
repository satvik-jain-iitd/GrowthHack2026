import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { CapabilitySelectCard } from './CapabilitySelectCard'
import {
    CapabilitySelectionStore,
    CapabilitySelectionProvider
} from './CapabilitySelectionContext'
import type { CapabilityNode } from '@/app/business-architecture/types'

jest.mock('@americanexpress/dls-icons', () => ({
    IconChevronDown: () => <span data-testid='icon-chevron-down' />,
    IconChevronUp: () => <span data-testid='icon-chevron-up' />
}))

jest.mock('@/app/business-architecture/constants', () => ({ colors: {} }))

// Mock NestedCheckboxAccordion to simplify rendering and expose its props
jest.mock('./NestedCheckboxAccordion', () => ({
    NestedCheckboxAccordion: ({
        data,
        expanded,
        matchedCapabilityIds
    }: {
        data: CapabilityNode[]
        expanded: string[]
        matchedCapabilityIds?: Set<string>
    }) => (
        <ul
            data-testid='nested-accordion'
            data-expanded={JSON.stringify(expanded)}
            data-matched={JSON.stringify(
                matchedCapabilityIds ? Array.from(matchedCapabilityIds) : []
            )}
        >
            {data.map(n => (
                <li key={n.capability_id}>{n.capability_nm}</li>
            ))}
        </ul>
    )
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeNode = (
    id: string,
    nm: string,
    children: CapabilityNode[] = []
): CapabilityNode => ({
    capability_id: id,
    parent_capability_id: null,
    capability_key_tx: id,
    capability_nm: nm,
    capability_desc_tx: '',
    capability_level: 1,
    begins_with_tx: '',
    ends_with_tx: '',
    includes_tx: '',
    customer_journey_id: '[]',
    product_tx: '[]',
    region_tx: '[]',
    customer_type: '[]',
    l1_capability_id: id,
    children
})

const childNode = makeNode('child1', 'Child Cap')
const parentNode = makeNode('l1', 'Technology', [childNode])
const leafNode = makeNode('leaf', 'Leaf Cap')

// Stable empty array used as default for defaultExpanded.
// Passing [] as an inline JSX expression creates a new reference on every
// re-render triggered by setExpanded, which makes the useEffect dependency
// array think the prop changed and fires the effect again → infinite loop.
const STABLE_EMPTY_EXPANDED: string[] = []

function renderCard(
    props: Partial<React.ComponentProps<typeof CapabilitySelectCard>> & {
        capability: CapabilityNode
    },
    store = new CapabilitySelectionStore()
) {
    return render(
        <CapabilitySelectionProvider store={store}>
            <CapabilitySelectCard
                isExpanded={false}
                onToggleExpand={jest.fn()}
                defaultExpanded={STABLE_EMPTY_EXPANDED}
                {...props}
            />
        </CapabilitySelectionProvider>
    )
}

describe('CapabilitySelectCard', () => {
    it('renders the capability name in uppercase', () => {
        renderCard({ capability: parentNode })
        expect(screen.getByTestId('capability-card-name-l1')).toHaveTextContent(
            'TECHNOLOGY'
        )
    })

    it('does not render a chevron when the node has no children', () => {
        renderCard({ capability: leafNode })
        expect(
            screen.queryByTestId('icon-chevron-down')
        ).not.toBeInTheDocument()
        expect(screen.queryByTestId('icon-chevron-up')).not.toBeInTheDocument()
    })

    it('renders chevron-down when node has children and isExpanded=false', () => {
        renderCard({ capability: parentNode, isExpanded: false })
        expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument()
    })

    it('renders chevron-up when node has children and isExpanded=true', () => {
        renderCard({ capability: parentNode, isExpanded: true })
        expect(screen.getByTestId('icon-chevron-up')).toBeInTheDocument()
    })

    it('clicking the chevron calls onToggleExpand with the capability_id', () => {
        const onToggleExpand = jest.fn()
        renderCard({
            capability: parentNode,
            isExpanded: false,
            onToggleExpand
        })
        fireEvent.click(screen.getByLabelText('Expand'))
        expect(onToggleExpand).toHaveBeenCalledWith('l1')
    })

    it('clicking Collapse (chevron-up) calls onToggleExpand', () => {
        const onToggleExpand = jest.fn()
        renderCard({ capability: parentNode, isExpanded: true, onToggleExpand })
        fireEvent.click(screen.getByLabelText('Collapse'))
        expect(onToggleExpand).toHaveBeenCalledWith('l1')
    })

    it('renders NestedCheckboxAccordion with children when expanded', () => {
        renderCard({ capability: parentNode, isExpanded: true })
        expect(screen.getByTestId('nested-accordion')).toBeInTheDocument()
        expect(screen.getByText('Child Cap')).toBeInTheDocument()
    })

    it('resets internal expanded state when activeJourneyId changes', () => {
        const { rerender } = renderCard({
            capability: parentNode,
            isExpanded: true,
            defaultExpanded: ['child1'],
            activeJourneyId: 'j1'
        })
        rerender(
            <CapabilitySelectionProvider store={new CapabilitySelectionStore()}>
                <CapabilitySelectCard
                    capability={parentNode}
                    isExpanded={true}
                    onToggleExpand={jest.fn()}
                    defaultExpanded={STABLE_EMPTY_EXPANDED}
                    activeJourneyId='j2'
                />
            </CapabilitySelectionProvider>
        )
        // After journey change, defaultExpanded is reset to []
        expect(screen.getByTestId('nested-accordion')).toBeInTheDocument()
    })

    it('autoExpandedIds syncs the inner expanded state via useEffect', () => {
        const autoExpandedIds = new Set(['child1'])
        renderCard({
            capability: parentNode,
            isExpanded: true,
            autoExpandedIds
        })
        const accordion = screen.getByTestId('nested-accordion')
        const expanded: string[] = JSON.parse(
            accordion.getAttribute('data-expanded') ?? '[]'
        )
        expect(expanded).toContain('child1')
    })

    it('with hasContentFilter=true, expanded is set to only autoExpandedIds (no merge with defaultExpanded)', () => {
        const autoExpandedIds = new Set(['child1'])
        renderCard({
            capability: parentNode,
            isExpanded: true,
            defaultExpanded: ['someOtherId'],
            hasContentFilter: true,
            autoExpandedIds
        })
        const accordion = screen.getByTestId('nested-accordion')
        const expanded: string[] = JSON.parse(
            accordion.getAttribute('data-expanded') ?? '[]'
        )
        expect(expanded).toContain('child1')
        expect(expanded).not.toContain('someOtherId')
    })

    it('matchedCapabilityIds is forwarded to NestedCheckboxAccordion', () => {
        const matchedCapabilityIds = new Set(['child1'])
        renderCard({
            capability: parentNode,
            isExpanded: true,
            matchedCapabilityIds
        })
        const accordion = screen.getByTestId('nested-accordion')
        const matched: string[] = JSON.parse(
            accordion.getAttribute('data-matched') ?? '[]'
        )
        expect(matched).toContain('child1')
    })
})
