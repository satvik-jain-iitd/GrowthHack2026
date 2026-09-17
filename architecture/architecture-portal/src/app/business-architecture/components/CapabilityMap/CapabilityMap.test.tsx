import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { CapabilityMap } from './CapabilityMap'
import type { Capability } from '@/app/business-architecture/types'

jest.mock('@/app/business-architecture/hooks', () => ({
    useCapabilities: jest.fn(),
    useCapabilityOwners: jest.fn(),
    useCustomerJourneys: jest.fn(),
    useSubmitBAChangeModalRequest: jest.fn()
}))

jest.mock(
    '@/app/business-architecture/components/CapabilityMap/CapabilityCard',
    () => ({
        CapabilityCard: ({
            capability
        }: {
            capability: { capability_id: string; capability_nm: string }
        }) => (
            <div data-testid={`capability-card-${capability.capability_id}`}>
                {capability.capability_nm}
            </div>
        )
    })
)

jest.mock('@/app/business-architecture/components/BAChangeModal', () => ({
    BAChangeModal: () => <div data-testid='ba-change-modal' />
}))

jest.mock('@/app/business-architecture/components/CapabilityFilterBar', () => ({
    CapabilityFilterBar: () => <div data-testid='capability-filter-bar' />
}))

import {
    useCapabilities,
    useCapabilityOwners,
    useCustomerJourneys,
    useSubmitBAChangeModalRequest
} from '@/app/business-architecture/hooks'

const mockUseCapabilities = useCapabilities as jest.Mock
const mockUseCapabilityOwners = useCapabilityOwners as jest.Mock
const mockUseCustomerJourneys = useCustomerJourneys as jest.Mock
const mockUseSubmitBAChangeModalRequest =
    useSubmitBAChangeModalRequest as jest.Mock

const makeCapability = (
    id: string,
    nm: string,
    level: number,
    parentId: string | null = null
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
    customer_journey_id: '[]',
    product_tx: '[]',
    region_tx: '[]',
    customer_type: '',
    l1_capability_id: parentId ?? id
})

function setupMocks(capabilities: Capability[] = []) {
    mockUseCapabilities.mockReturnValue({ capability: capabilities })
    mockUseCapabilityOwners.mockReturnValue({ capability_owners: [] })
    mockUseCustomerJourneys.mockReturnValue({ customer_journey: [] })
    mockUseSubmitBAChangeModalRequest.mockReturnValue({
        handleSubmitBAChangeModal: jest.fn(),
        isSubmitting: false
    })
}

describe('CapabilityMap', () => {
    beforeEach(() => {
        setupMocks()
    })

    it('renders without crashing with no capabilities', () => {
        const { container } = render(<CapabilityMap selectedL1={null} />)
        expect(container).toBeInTheDocument()
    })

    it('renders the CapabilityFilterBar', () => {
        render(<CapabilityMap selectedL1={null} />)
        expect(screen.getByTestId('capability-filter-bar')).toBeInTheDocument()
    })

    it('renders one CapabilityCard per L1 root capability', () => {
        const caps: Capability[] = [
            makeCapability('l1a', 'Technology', 1),
            makeCapability('l1b', 'Finance', 1),
            makeCapability('l2a', 'Cloud', 2, 'l1a')
        ]
        setupMocks(caps)
        render(<CapabilityMap selectedL1={null} />)
        // Only l1a and l1b are roots (l2a has a parent that exists)
        expect(screen.getByTestId('capability-card-l1a')).toBeInTheDocument()
        expect(screen.getByTestId('capability-card-l1b')).toBeInTheDocument()
        expect(
            screen.queryByTestId('capability-card-l2a')
        ).not.toBeInTheDocument()
    })

    it('child capability is nested under parent, not rendered as a root card', () => {
        const caps: Capability[] = [
            makeCapability('root1', 'Root One', 1),
            makeCapability('child1', 'Child One', 2, 'root1')
        ]
        setupMocks(caps)
        render(<CapabilityMap selectedL1={null} />)
        expect(screen.getByTestId('capability-card-root1')).toBeInTheDocument()
        expect(
            screen.queryByTestId('capability-card-child1')
        ).not.toBeInTheDocument()
    })

    it('renders the BAChangeModal', () => {
        render(<CapabilityMap selectedL1={null} />)
        expect(screen.getByTestId('ba-change-modal')).toBeInTheDocument()
    })
})
