import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

import { FilterPopover } from './FilterPopover'

function renderPopover(props: Partial<Parameters<typeof FilterPopover>[0]>) {
    const onChange = jest.fn()
    const columnId = props.columnId ?? 'isEtp'
    render(
        <ChakraProvider value={defaultSystem}>
            <FilterPopover
                columnId={columnId}
                value=''
                onChange={onChange}
                {...props}
            />
        </ChakraProvider>
    )
    fireEvent.click(screen.getByLabelText(`Filter ${columnId}`))
    return onChange
}

describe('FilterPopover', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())

    it('debounces text input before reporting the filter', () => {
        const onChange = renderPopover({ columnId: 'name' })

        fireEvent.change(screen.getByPlaceholderText('Filter…'), {
            target: { value: 'Pay' }
        })

        expect(onChange).not.toHaveBeenCalled()
        act(() => jest.advanceTimersByTime(250))
        expect(onChange).toHaveBeenCalledWith('Pay')
    })

    it('renders a dropdown of the supplied options and reports immediately', () => {
        const onChange = renderPopover({
            options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' }
            ],
            placeholder: 'Yes or No…'
        })

        const select = screen.getByLabelText(
            'Filter isEtp value'
        ) as HTMLSelectElement
        expect(
            Array.from(select.options).map(option => option.textContent)
        ).toEqual(['Yes or No…', 'Yes', 'No'])

        fireEvent.change(select, { target: { value: 'no' } })

        expect(onChange).toHaveBeenCalledWith('no')
    })

    it('reports every checked option of a multiselect', async () => {
        const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime
        })
        const onChange = renderPopover({
            columnId: 'initiativeType',
            value: ['etp'],
            multiple: true,
            options: [
                { label: 'None', value: 'none' },
                { label: 'ETP', value: 'etp' },
                { label: 'ECMI', value: 'ecmi' }
            ]
        })

        await user.click(screen.getByLabelText('ECMI'))

        expect(onChange).toHaveBeenCalledWith(['etp', 'ecmi'])
    })

    it('unchecks an already selected multiselect option', async () => {
        const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime
        })
        const onChange = renderPopover({
            columnId: 'initiativeType',
            value: ['etp', 'ecmi'],
            multiple: true,
            options: [
                { label: 'ETP', value: 'etp' },
                { label: 'ECMI', value: 'ecmi' }
            ]
        })

        await user.click(screen.getByLabelText('ETP'))

        expect(onChange).toHaveBeenCalledWith(['ecmi'])
    })

    it('clears a multiselect to an empty selection', () => {
        const onChange = renderPopover({
            columnId: 'initiativeType',
            value: ['etp'],
            multiple: true,
            options: [{ label: 'ETP', value: 'etp' }]
        })

        fireEvent.click(screen.getByText('Clear filter'))

        expect(onChange).toHaveBeenCalledWith([])
    })

    it('clears an active filter', () => {
        const onChange = renderPopover({ value: 'yes', options: [] })

        fireEvent.click(screen.getByText('Clear filter'))

        expect(onChange).toHaveBeenCalledWith('')
    })
})
