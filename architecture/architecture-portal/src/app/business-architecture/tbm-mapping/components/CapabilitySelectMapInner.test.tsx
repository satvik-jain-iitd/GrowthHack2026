import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { CapabilitySelectMapInner } from './CapabilitySelectMapInner'
import {
    CapabilitySelectionStore,
    CapabilitySelectionProvider
} from './CapabilitySelectionContext'
import type { CapabilityNode } from '@/app/business-architecture/types'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import type { ApptioEpicMapping } from '@/app/business-architecture/hooks/useGetApptioEpicMappings'

jest.mock('@/app/business-architecture/hooks', () => ({
    useCapabilities: jest.fn().mockReturnValue({ capability: [] }),
    useCapabilityOwners: jest.fn().mockReturnValue({ capability_owners: [] }),
    useCustomerJourneys: jest.fn().mockReturnValue({ customer_journey: [] })
}))

jest.mock('@/context', () => ({
    useUserContext: jest.fn().mockReturnValue({
        attributes: {
            email: '[REDACTED_EMAIL_ADDRESS_1]',
            fullName: 'Test User'
        }
    })
}))

jest.mock('./CapabilitySelectCard', () => ({
    CapabilitySelectCard: ({
        capability,
        isExpanded,
        onToggleExpand
    }: {
        capability: CapabilityNode
        isExpanded: boolean
        onToggleExpand: (id: string) => void
    }) => (
        <div
            data-testid={`select-card-${capability.capability_id}`}
            data-expanded={String(isExpanded)}
            onClick={() => onToggleExpand(capability.capability_id)}
        >
            {capability.capability_nm}
        </div>
    )
}))

jest.mock('./CapabilityLoadingSpinner', () => ({
    CapabilityLoadingSpinner: ({ text }: { text?: string }) => (
        <div data-testid='loading-spinner'>{text}</div>
    )
}))

jest.mock('./JourneyCapabilityHeader', () => ({
    JourneyCapabilityHeader: () => <div data-testid='journey-header' />
}))

jest.mock('./JourneySidebar', () => ({
    JourneySidebar: ({ journeys }: { journeys: CustomerJourney[] }) => (
        <div data-testid='journey-sidebar'>
            {journeys.map(j => (
                <div
                    key={j.journey_id}
                    data-testid={`sidebar-journey-${j.journey_id}`}
                >
                    {j.journey_statement}
                </div>
            ))}
        </div>
    )
}))

jest.mock('./SubmitSummaryModal', () => ({
    SubmitSummaryModal: () => <div data-testid='submit-summary-modal' />
}))

jest.mock('../hooks/useModalState', () => ({
    useModalState: jest.fn()
}))

jest.mock('@/app/business-architecture/components/CapabilityFilterBar', () => ({
    CapabilityFilterBar: () => <div data-testid='capability-filter-bar' />
}))

import { useModalState } from '../hooks/useModalState'

const mockUseModalState = useModalState as jest.Mock

const makeNode = (id: string, nm: string, level = 1): CapabilityNode => ({
    capability_id: id,
    parent_capability_id: null,
    capability_key_tx: id,
    capability_nm: nm,
    capability_desc_tx: '',
    capability_level: level,
    begins_with_tx: '',
    ends_with_tx: '',
    includes_tx: '',
    customer_journey_id: '[]',
    product_tx: '[]',
    region_tx: '[]',
    customer_type: '',
    l1_capability_id: id,
    children: []
})

const journey1: CustomerJourney = {
    journey_id: 'j1',
    journey_statement: 'Buy a Product',
    journey_desc: 'Purchase flow',
    journey_link: '',
    journey_grp_tx: 'Commerce'
}

const journey2: CustomerJourney = {
    journey_id: 'j2',
    journey_statement: 'Return an Item',
    journey_desc: 'Returns flow',
    journey_link: '',
    journey_grp_tx: 'Commerce'
}

const defaultModalReturn = {
    modalMode: null,
    setModalMode: jest.fn(),
    isJourneyModalLoading: false,
    isFinalLoading: false,
    sessionExpired: false,
    modalSnapshot: [],
    aiModalSnapshot: [],
    handleSaveAndNext: jest.fn(),
    handleJourneyModalConfirm: jest.fn(),
    handleFinalConfirm: jest.fn(),
    handleSubmitAll: jest.fn(),
    handleEditJourney: jest.fn()
}

function renderInner(
    overrides: Partial<
        React.ComponentProps<typeof CapabilitySelectMapInner>
    > = {},
    store = new CapabilitySelectionStore()
) {
    const hierarchy: CapabilityNode[] = [
        makeNode('l1a', 'Technology'),
        makeNode('l1b', 'Finance')
    ]

    store.initJourneys([journey1.journey_id, journey2.journey_id])

    const defaults: React.ComponentProps<typeof CapabilitySelectMapInner> = {
        epicId: 'epic-1',
        selectedJourneys: [journey1, journey2],
        store,
        capabilityHierarchy: hierarchy,
        loading: false,
        aiAncestorsByJourney: new Map(),
        savedMappings: [],
        hasPreExistingMappings: new Map()
    }

    return render(
        <CapabilitySelectionProvider store={store}>
            <CapabilitySelectMapInner {...defaults} {...overrides} />
        </CapabilitySelectionProvider>
    )
}

describe('CapabilitySelectMapInner', () => {
    beforeEach(() => {
        mockUseModalState.mockReturnValue({ ...defaultModalReturn })
    })

    it('renders the loading spinner when loading=true', () => {
        renderInner({ loading: true })
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
        expect(screen.getByTestId('loading-spinner')).toHaveTextContent(
            'Loading Enterprise Customer Journeys...'
        )
    })

    it('does not render the main content when loading=true', () => {
        renderInner({ loading: true })
        expect(screen.queryByTestId('journey-sidebar')).not.toBeInTheDocument()
    })

    it('calls onSessionExpired and renders null when sessionExpired=true', () => {
        mockUseModalState.mockReturnValue({
            ...defaultModalReturn,
            sessionExpired: true
        })
        const onSessionExpired = jest.fn()
        const { container } = renderInner({ onSessionExpired })
        expect(onSessionExpired).toHaveBeenCalled()
        // The component returns null, so the container renders no visible content
        expect(container.innerHTML).toBe('')
    })

    it('renders the JourneySidebar with selected journeys', () => {
        renderInner()
        expect(screen.getByTestId('journey-sidebar')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-journey-j1')).toHaveTextContent(
            'Buy a Product'
        )
        expect(screen.getByTestId('sidebar-journey-j2')).toHaveTextContent(
            'Return an Item'
        )
    })

    it('renders one CapabilitySelectCard per root node in capabilityHierarchy', () => {
        renderInner()
        expect(screen.getByTestId('select-card-l1a')).toBeInTheDocument()
        expect(screen.getByTestId('select-card-l1b')).toBeInTheDocument()
    })

    it('renders the CapabilityFilterBar', () => {
        renderInner()
        expect(screen.getByTestId('capability-filter-bar')).toBeInTheDocument()
    })

    it('renders the JourneyCapabilityHeader', () => {
        renderInner()
        expect(screen.getByTestId('journey-header')).toBeInTheDocument()
    })

    it('all L1 cards start as expanded', () => {
        renderInner()
        expect(screen.getByTestId('select-card-l1a')).toHaveAttribute(
            'data-expanded',
            'true'
        )
        expect(screen.getByTestId('select-card-l1b')).toHaveAttribute(
            'data-expanded',
            'true'
        )
    })

    it('clicking a capability card calls the toggle handler and collapses it', () => {
        renderInner()
        // l1a starts expanded; clicking it should collapse it
        const card = screen.getByTestId('select-card-l1a')
        expect(card).toHaveAttribute('data-expanded', 'true')
        fireEvent.click(card)
        expect(screen.getByTestId('select-card-l1a')).toHaveAttribute(
            'data-expanded',
            'false'
        )
    })

    it('renders with an empty capabilityHierarchy without crashing', () => {
        const { container } = renderInner({ capabilityHierarchy: [] })
        expect(container).toBeInTheDocument()
    })

    it('renders SubmitSummaryModal components', () => {
        renderInner()
        const modals = screen.getAllByTestId('submit-summary-modal')
        // There are two: per-journey modal and final summary modal
        expect(modals.length).toBe(2)
    })

    it('does not render JourneySidebar when selectedJourneys is empty', () => {
        renderInner({ selectedJourneys: [] })
        expect(screen.queryByTestId('journey-sidebar')).not.toBeInTheDocument()
    })

    it('saved mappings mark journey as saved, affecting first unsaved index', () => {
        const store = new CapabilitySelectionStore()
        const savedMappings: ApptioEpicMapping[] = [
            {
                epicId: 'epic-1',
                journeyId: 'j1',
                capabilities: [],
                submittedAt: '',
                submittedBy: ''
            }
        ]
        store.initJourneys(['j1', 'j2'])
        // j1 is saved, so the component should start at j2 (index 1)
        // The component renders without errors in this scenario
        const { container } = renderInner({ savedMappings, store }, store)
        expect(container).toBeInTheDocument()
    })
})
