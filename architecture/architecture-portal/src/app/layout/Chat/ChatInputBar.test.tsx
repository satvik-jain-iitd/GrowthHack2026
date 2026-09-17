import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import ChatInputBar from './ChatInputBar'

describe('ChatInputBar', () => {
    it('calls onChange when typing in the input', () => {
        const onChange = jest.fn()
        render(
            <ChatInputBar
                value=''
                onChange={onChange}
                onSend={jest.fn()}
                disabled={false}
                disclaimerAccepted
            />
        )

        fireEvent.change(screen.getByPlaceholderText('Type your question...'), {
            target: { value: 'hello' }
        })

        expect(onChange).toHaveBeenCalledWith('hello')
    })

    it('calls onSend when Enter is pressed and not disabled', () => {
        const onSend = jest.fn()
        render(
            <ChatInputBar
                value='hi'
                onChange={jest.fn()}
                onSend={onSend}
                disabled={false}
                disclaimerAccepted
            />
        )

        fireEvent.keyDown(
            screen.getByPlaceholderText('Type your question...'),
            {
                key: 'Enter'
            }
        )

        expect(onSend).toHaveBeenCalledTimes(1)
    })

    it('does not call onSend when Enter is pressed while disabled', () => {
        const onSend = jest.fn()
        render(
            <ChatInputBar
                value='hi'
                onChange={jest.fn()}
                onSend={onSend}
                disabled
                disclaimerAccepted
            />
        )

        fireEvent.keyDown(
            screen.getByPlaceholderText('Type your question...'),
            {
                key: 'Enter'
            }
        )

        expect(onSend).not.toHaveBeenCalled()
    })

    it('does not call onSend for non-Enter keys', () => {
        const onSend = jest.fn()
        render(
            <ChatInputBar
                value='hi'
                onChange={jest.fn()}
                onSend={onSend}
                disabled={false}
                disclaimerAccepted
            />
        )

        fireEvent.keyDown(
            screen.getByPlaceholderText('Type your question...'),
            {
                key: 'a'
            }
        )

        expect(onSend).not.toHaveBeenCalled()
    })

    it('hides the bar from assistive tech when the disclaimer has not been accepted', () => {
        const { container } = render(
            <ChatInputBar
                value=''
                onChange={jest.fn()}
                onSend={jest.fn()}
                disabled
                disclaimerAccepted={false}
            />
        )

        expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })

    it('shows the bar to assistive tech once the disclaimer has been accepted', () => {
        const { container } = render(
            <ChatInputBar
                value=''
                onChange={jest.fn()}
                onSend={jest.fn()}
                disabled={false}
                disclaimerAccepted
            />
        )

        expect(container.firstChild).toHaveAttribute('aria-hidden', 'false')
    })
})
