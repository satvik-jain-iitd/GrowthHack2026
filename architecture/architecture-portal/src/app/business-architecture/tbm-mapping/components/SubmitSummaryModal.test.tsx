import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { SubmitSummaryModal } from './SubmitSummaryModal'
import { buildCapabilityHierarchy } from '../utils/capabilityTree'
import type { Capability } from '@/app/business-architecture/types'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

jest.mock('@americanexpress/dls-icons', () => ({
    IconAccount: () => <span data-testid='icon-account' />,
    IconLocation: () => <span data-testid='icon-location' />
}))

jest.mock('@/components/icons/AIIcon', () => ({
    AIIcon: () => <span data-testid='ai-icon' />
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeJourney = (id: string, label: string): CustomerJourney => ({
    journey_id: id,
    journey_statement: label,
    journey_grp_tx: 'Shopping',
    customer_tx: [],
    market: [],
    product: []
})

const makeCap = (
    id: string,
    level: number,
    parentId: string | null,
    nm: string
): Capability => ({
    capability_id: id,
    parent_capability_id: parentId,
    capability_key_tx: id,
    capability_nm: nm,
    capability_desc_tx: '',
    capability_level: level,
    begins_with_tx: '',
    ends_with_tx: '',
    includes_tx: '',
    customer_journey_id: [],
    product_tx: [],
    region_tx: [],
    customer_type: [],
    l1_capability_id: 'l1'
})

const flatCaps: Capability[] = [
    makeCap('l1', 1, null, 'Technology'),
    makeCap('l2', 2, 'l1', 'Payments'),
    makeCap('l3', 3, 'l2', 'Digital Payments')
]

const hierarchy = buildCapabilityHierarchy(flatCaps)
const journey1 = makeJourney('j1', 'Buy online')
const journey2 = makeJourney('j2', 'Return item')

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    journeys: [journey1],
    journeyCapabilities: [{ journey_id: 'j1', capability_ids: ['l3'] }],
    capabilityHierarchy: hierarchy
}

describe('SubmitSummaryModal', () => {
    beforeEach(() => jest.clearAllMocks())

    it('does not render modal content when isOpen=false', () => {
        render(<SubmitSummaryModal {...defaultProps} isOpen={false} />)
        expect(
            screen.queryByTestId('modal-journey-statement-j1')
        ).not.toBeInTheDocument()
    })

    it('renders the journey statement when isOpen=true', () => {
        render(<SubmitSummaryModal {...defaultProps} />)
        expect(
            screen.getByTestId('modal-journey-statement-j1')
        ).toHaveTextContent('Buy online')
    })

    it('clicking Submit Selections calls onConfirm', () => {
        const onConfirm = jest.fn()
        render(<SubmitSummaryModal {...defaultProps} onConfirm={onConfirm} />)
        fireEvent.click(
            screen.getByRole('button', {
                name: /Submit Selections/i
            })
        )
        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('clicking Cancel calls onClose', () => {
        const onClose = jest.fn()
        render(<SubmitSummaryModal {...defaultProps} onClose={onClose} />)
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('shows "No capabilities selected" when capability_ids is empty', () => {
        render(
            <SubmitSummaryModal
                {...defaultProps}
                journeyCapabilities={[{ journey_id: 'j1', capability_ids: [] }]}
            />
        )
        expect(
            screen.getByTestId('no-capabilities-selected')
        ).toBeInTheDocument()
    })

    it('renders capability path segments when hierarchy and ids provided', () => {
        render(<SubmitSummaryModal {...defaultProps} />)
        // The path should show "Technology" as L1 header and "Digital Payments" as leaf
        expect(
            screen.getByTestId('l1-group-name-Technology')
        ).toBeInTheDocument()
        expect(screen.getByTestId('capability-leaf-l3')).toHaveTextContent(
            'Digital Payments'
        )
    })

    it('renders AI icon for capabilities in journeyAICapabilities', () => {
        render(
            <SubmitSummaryModal
                {...defaultProps}
                journeyAICapabilities={[
                    { journey_id: 'j1', capability_ids: ['l3'] }
                ]}
            />
        )
        expect(screen.getByTestId('ai-icon')).toBeInTheDocument()
    })

    it('renders a separator between multiple journey sections', () => {
        render(
            <SubmitSummaryModal
                {...defaultProps}
                journeys={[journey1, journey2]}
                journeyCapabilities={[
                    { journey_id: 'j1', capability_ids: [] },
                    { journey_id: 'j2', capability_ids: [] }
                ]}
            />
        )
        expect(
            screen.getByTestId('modal-journey-statement-j1')
        ).toHaveTextContent('Buy online')
        expect(
            screen.getByTestId('modal-journey-statement-j2')
        ).toHaveTextContent('Return item')
    })

    it('uses custom confirmLabel when provided', () => {
        render(
            <SubmitSummaryModal
                {...defaultProps}
                confirmLabel='Save and Continue'
            />
        )
        expect(
            screen.getByRole('button', { name: /Save and Continue/i })
        ).toBeInTheDocument()
    })
})
