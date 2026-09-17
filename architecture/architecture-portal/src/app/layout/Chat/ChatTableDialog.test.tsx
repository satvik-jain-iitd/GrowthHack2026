import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import ChatTableDialog from './ChatTableDialog'

describe('ChatTableDialog', () => {
    it('renders the compact table with an expand button and no dialog initially', () => {
        render(
            <ChatTableDialog>
                <tbody>
                    <tr>
                        <td>cell content</td>
                    </tr>
                </tbody>
            </ChatTableDialog>
        )

        expect(screen.getByText('cell content')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Expand table' })
        ).toBeInTheDocument()
        expect(
            screen.queryByRole('button', { name: 'Minimize table' })
        ).not.toBeInTheDocument()
    })

    it('opens the dialog with a minimize button when the expand button is clicked', async () => {
        render(
            <ChatTableDialog>
                <tbody>
                    <tr>
                        <td>cell content</td>
                    </tr>
                </tbody>
            </ChatTableDialog>
        )

        fireEvent.click(screen.getByRole('button', { name: 'Expand table' }))

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Minimize table' })
            ).toBeInTheDocument()
        })
    })

    it('closes the dialog when the minimize button is clicked', async () => {
        render(
            <ChatTableDialog>
                <tbody>
                    <tr>
                        <td>cell content</td>
                    </tr>
                </tbody>
            </ChatTableDialog>
        )

        fireEvent.click(screen.getByRole('button', { name: 'Expand table' }))

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Minimize table' })
            ).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole('button', { name: 'Minimize table' }))

        await waitFor(() => {
            expect(
                screen.queryByRole('button', { name: 'Minimize table' })
            ).not.toBeInTheDocument()
        })
    })
})
