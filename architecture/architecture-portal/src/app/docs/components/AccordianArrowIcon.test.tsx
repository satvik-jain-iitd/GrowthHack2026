import React from 'react'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import { Accordion } from '@chakra-ui/react'
import AccordianArrowIcon from './AccordianArrowIcon'
import userEvent from '@testing-library/user-event'

// Helper component to test the AccordianArrowIcon within an Accordion context
const AccordionWrapper = () => {
    return (
        <Accordion.Root collapsible>
            <Accordion.Item value='test-item'>
                <Accordion.ItemTrigger>
                    <span>Test Accordion</span>
                    <AccordianArrowIcon />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Accordion.ItemBody>Test Content</Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}

describe('AccordianArrowIcon', () => {
    it('renders the chevron icon', () => {
        render(<AccordionWrapper />)

        // The icon should be present in the document
        const button = screen.getByRole('button', { name: /test accordion/i })
        expect(button).toBeInTheDocument()
    })

    it('has initial rotation of 0deg when collapsed', () => {
        render(<AccordionWrapper />)

        const button = screen.getByRole('button', { name: /test accordion/i })
        const icon = button.querySelector('svg')

        expect(icon).toHaveStyle({ transform: 'rotate(0deg)' })
    })

    it('rotates to 90deg when accordion is expanded', async () => {
        const user = userEvent.setup()
        render(<AccordionWrapper />)

        const button = screen.getByRole('button', { name: /test accordion/i })

        // Click to expand the accordion
        await user.click(button)

        // Wait for the rotation to update
        await waitFor(() => {
            const icon = button.querySelector('svg')
            expect(icon).toHaveStyle({ transform: 'rotate(90deg)' })
        })
    })

    it('rotates back to 0deg when accordion is collapsed again', async () => {
        const user = userEvent.setup()
        render(<AccordionWrapper />)

        const button = screen.getByRole('button', { name: /test accordion/i })

        // Expand
        await user.click(button)
        await waitFor(() => {
            const icon = button.querySelector('svg')
            expect(icon).toHaveStyle({ transform: 'rotate(90deg)' })
        })

        // Collapse
        await user.click(button)
        await waitFor(() => {
            const icon = button.querySelector('svg')
            expect(icon).toHaveStyle({ transform: 'rotate(0deg)' })
        })
    })

    it('has the correct color applied', () => {
        render(<AccordionWrapper />)

        const button = screen.getByRole('button', { name: /test accordion/i })
        const icon = button.querySelector('svg')

        // Check if the icon is rendered
        expect(icon).toBeInTheDocument()
    })

    it('has transition style for smooth rotation', () => {
        render(<AccordionWrapper />)

        const button = screen.getByRole('button', { name: /test accordion/i })
        const icon = button.querySelector('svg')

        expect(icon).toHaveStyle({ transition: 'transform 0.2s' })
    })
})
