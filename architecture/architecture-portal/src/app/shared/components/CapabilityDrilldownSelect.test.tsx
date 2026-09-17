import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import CapabilityDrilldownSelect from './CapabilityDrilldownSelect'
import type { Capability } from '@/app/business-architecture/types'

const capabilities: Capability[] = [
    {
        capability_id: 'l1',
        parent_capability_id: null,
        capability_level: 1,
        capability_nm: 'L1 Cap',
        l1_capability_id: 'l1'
    },
    {
        capability_id: 'l2',
        parent_capability_id: 'l1',
        capability_level: 2,
        capability_nm: 'L2 Cap',
        l1_capability_id: 'l1'
    },
    {
        capability_id: 'l3',
        parent_capability_id: 'l2',
        capability_level: 3,
        capability_nm: 'L3 Cap',
        l1_capability_id: 'l1'
    },
    {
        capability_id: 'l4',
        parent_capability_id: 'l3',
        capability_level: 4,
        capability_nm: 'L4 Cap',
        l1_capability_id: 'l1'
    },
    {
        capability_id: 'l3b',
        parent_capability_id: 'l2',
        capability_level: 3,
        capability_nm: 'L3 Leaf',
        l1_capability_id: 'l1'
    }
] as unknown as Capability[]

const mockUseCapabilities = jest.fn(() => ({
    capability: capabilities,
    loading: false,
    error: null
}))

jest.mock('@/app/business-architecture/hooks/useGetCapabilities', () => ({
    useCapabilities: () => mockUseCapabilities()
}))

beforeEach(() => {
    mockUseCapabilities.mockReturnValue({
        capability: capabilities,
        loading: false,
        error: null
    })
})

const selectOption = async (label: string, optionText: string) => {
    // react-select input carries the aria-label; open its menu then pick option
    await userEvent.click(screen.getByLabelText(label))
    await userEvent.click(screen.getByRole('option', { name: optionText }))
}

describe('CapabilityDrilldownSelect', () => {
    it('shows an empty state when nothing is linked', () => {
        render(<CapabilityDrilldownSelect value={[]} onChange={jest.fn()} />)
        expect(
            screen.getByText('No capabilities linked yet.')
        ).toBeInTheDocument()
    })

    it('disables the Add button until an L3 is selected', async () => {
        render(<CapabilityDrilldownSelect value={[]} onChange={jest.fn()} />)

        const addButton = screen.getByRole('button', {
            name: /add capability/i
        })
        expect(addButton).toBeDisabled()

        await selectOption('Select L1 capability', 'L1 Cap')
        await selectOption('Select L2 capability', 'L2 Cap')
        expect(addButton).toBeDisabled()

        await selectOption('Select L3 capability', 'L3 Cap')
        expect(addButton).toBeEnabled()
    })

    it('adds the selected L3 capability id via onChange', async () => {
        const onChange = jest.fn()
        render(<CapabilityDrilldownSelect value={[]} onChange={onChange} />)

        await selectOption('Select L1 capability', 'L1 Cap')
        await selectOption('Select L2 capability', 'L2 Cap')
        await selectOption('Select L3 capability', 'L3 Cap')
        await userEvent.click(
            screen.getByRole('button', { name: /add capability/i })
        )

        expect(onChange).toHaveBeenCalledWith(['l3'])
    })

    it('adds the deeper L4 capability id when an L4 is selected', async () => {
        const onChange = jest.fn()
        render(<CapabilityDrilldownSelect value={[]} onChange={onChange} />)

        await selectOption('Select L1 capability', 'L1 Cap')
        await selectOption('Select L2 capability', 'L2 Cap')
        await selectOption('Select L3 capability', 'L3 Cap')
        await selectOption('Select L4 capability', 'L4 Cap')
        await userEvent.click(
            screen.getByRole('button', { name: /add capability/i })
        )

        expect(onChange).toHaveBeenCalledWith(['l4'])
    })

    it('resets deeper levels when the L1 selection changes', async () => {
        render(<CapabilityDrilldownSelect value={[]} onChange={jest.fn()} />)

        await selectOption('Select L1 capability', 'L1 Cap')
        await selectOption('Select L2 capability', 'L2 Cap')
        await selectOption('Select L3 capability', 'L3 Cap')
        expect(
            screen.getByRole('button', { name: /add capability/i })
        ).toBeEnabled()

        // re-selecting the L1 clears L2/L3, disabling Add again
        await userEvent.click(screen.getByLabelText('Select L1 capability'))
        await userEvent.click(screen.getByRole('option', { name: 'L1 Cap' }))
        expect(
            screen.getByRole('button', { name: /add capability/i })
        ).toBeDisabled()
    })

    it('keeps L4 disabled for an L3 capability that has no children', async () => {
        render(<CapabilityDrilldownSelect value={[]} onChange={jest.fn()} />)

        await selectOption('Select L1 capability', 'L1 Cap')
        await selectOption('Select L2 capability', 'L2 Cap')
        await selectOption('Select L3 capability', 'L3 Leaf')

        expect(screen.getByLabelText('Select L4 capability')).toBeDisabled()
        expect(
            screen.getByRole('button', { name: /add capability/i })
        ).toBeEnabled()
    })

    it('clears the selection and resets deeper levels', async () => {
        render(<CapabilityDrilldownSelect value={[]} onChange={jest.fn()} />)

        await selectOption('Select L1 capability', 'L1 Cap')
        await selectOption('Select L2 capability', 'L2 Cap')

        const l1Input = screen.getByLabelText('Select L1 capability')
        await userEvent.click(l1Input)
        await userEvent.keyboard('{Backspace}')

        expect(screen.getByLabelText('Select L2 capability')).toBeDisabled()
    })

    it('renders selected capabilities as breadcrumb chips and removes them', async () => {
        const onChange = jest.fn()
        render(<CapabilityDrilldownSelect value={['l3']} onChange={onChange} />)

        expect(screen.getByText('L1 Cap › L2 Cap › L3 Cap')).toBeInTheDocument()

        await userEvent.click(screen.getByRole('button', { name: /remove/i }))
        expect(onChange).toHaveBeenCalledWith([])
    })

    it('falls back to the raw id for a capability missing from the hierarchy', () => {
        render(
            <CapabilityDrilldownSelect
                value={['unknown']}
                onChange={jest.fn()}
            />
        )
        expect(screen.getByText('unknown')).toBeInTheDocument()
    })

    it('shows the loading state while capabilities are fetching', () => {
        mockUseCapabilities.mockReturnValue({
            capability: [],
            loading: true,
            error: null
        })
        render(<CapabilityDrilldownSelect value={[]} onChange={jest.fn()} />)
        expect(
            screen.getByText('No capabilities linked yet.')
        ).toBeInTheDocument()
    })

    it('supports a custom label', () => {
        render(
            <CapabilityDrilldownSelect
                value={[]}
                onChange={jest.fn()}
                label='Realized Capabilities'
            />
        )
        expect(screen.getByText('Realized Capabilities')).toBeInTheDocument()
    })
})
