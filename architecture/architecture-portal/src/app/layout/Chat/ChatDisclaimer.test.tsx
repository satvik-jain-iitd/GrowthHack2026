import React, { createRef } from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import ChatDisclaimer from './ChatDisclaimer'

describe('ChatDisclaimer', () => {
    it('applies the visible styles when visible is true', () => {
        const buttonRef = createRef<HTMLButtonElement>()
        render(
            <ChatDisclaimer
                visible
                onAccept={jest.fn()}
                buttonRef={buttonRef}
            />
        )

        const dialog = screen.getByRole('alertdialog')
        expect(dialog).toHaveStyle({ opacity: '1', visibility: 'visible' })
    })

    it('applies the hidden styles when visible is false', () => {
        const buttonRef = createRef<HTMLButtonElement>()
        render(
            <ChatDisclaimer
                visible={false}
                onAccept={jest.fn()}
                buttonRef={buttonRef}
            />
        )

        const dialog = screen.getByRole('alertdialog', { hidden: true })
        expect(dialog).toHaveStyle({ opacity: '0', visibility: 'hidden' })
    })

    it('calls onAccept when the accept button is clicked', () => {
        const onAccept = jest.fn()
        const buttonRef = createRef<HTMLButtonElement>()
        render(
            <ChatDisclaimer visible onAccept={onAccept} buttonRef={buttonRef} />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Accept disclaimer and start chatting/i
            })
        )

        expect(onAccept).toHaveBeenCalledTimes(1)
    })

    it('attaches the buttonRef to the accept button element', () => {
        const buttonRef = createRef<HTMLButtonElement>()
        render(
            <ChatDisclaimer
                visible
                onAccept={jest.fn()}
                buttonRef={buttonRef}
            />
        )

        expect(buttonRef.current).toBeInstanceOf(HTMLButtonElement)
        expect(buttonRef.current).toBe(
            screen.getByRole('button', {
                name: /Accept disclaimer and start chatting/i
            })
        )
    })
})
