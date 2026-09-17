import React from 'react'
import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { SessionExpiredState } from './SessionExpiredState'

describe('SessionExpiredState', () => {
    it('renders the session expired heading', () => {
        render(<SessionExpiredState />)
        expect(
            screen.getByTestId('session-expired-heading')
        ).toBeInTheDocument()
    })

    it('renders the session expired message', () => {
        render(<SessionExpiredState />)
        expect(
            screen.getByTestId('session-expired-message')
        ).toBeInTheDocument()
    })

    it('renders a Refresh Page button', () => {
        render(<SessionExpiredState />)
        expect(screen.getByTestId('refresh-page-btn')).toBeInTheDocument()
    })

    it('renders a Close Tab button that closes the window', () => {
        const closeMock = jest.fn()
        window.close = closeMock
        render(<SessionExpiredState />)
        fireEvent.click(screen.getByTestId('close-tab-btn'))
        expect(closeMock).toHaveBeenCalledTimes(1)
    })
})
