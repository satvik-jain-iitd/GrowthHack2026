import React, { createRef } from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import ChatMessageList from './ChatMessageList'
import { ChatMessage } from './types'

jest.mock('./ChatMessageBubble', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockChatMessageBubble(props: any) {
        return (
            <div data-testid={`bubble-${props.index}`}>
                <span data-testid={`is-last-${props.index}`}>
                    {String(props.isLast)}
                </span>
                <span data-testid={`is-copied-${props.index}`}>
                    {String(props.isCopied)}
                </span>
            </div>
        )
    }
})

const messages: ChatMessage[] = [
    { sender: 'user', text: 'first' },
    { sender: 'bot', text: 'second' },
    { sender: 'bot', text: 'third' }
]

describe('ChatMessageList', () => {
    it('forwards the ref to the scrollable container', () => {
        const ref = createRef<HTMLDivElement>()
        render(
            <ChatMessageList
                ref={ref}
                messages={messages}
                isChatBusy={false}
                disclaimerAccepted
                botAvatarSrc='/bot.svg'
                copiedMessageIndex={null}
                onCopyMessage={jest.fn()}
            />
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('marks only the final message as isLast', () => {
        render(
            <ChatMessageList
                messages={messages}
                isChatBusy={false}
                disclaimerAccepted
                botAvatarSrc='/bot.svg'
                copiedMessageIndex={null}
                onCopyMessage={jest.fn()}
            />
        )

        expect(screen.getByTestId('is-last-0')).toHaveTextContent('false')
        expect(screen.getByTestId('is-last-1')).toHaveTextContent('false')
        expect(screen.getByTestId('is-last-2')).toHaveTextContent('true')
    })

    it('marks isCopied true only for the message matching copiedMessageIndex', () => {
        render(
            <ChatMessageList
                messages={messages}
                isChatBusy={false}
                disclaimerAccepted
                botAvatarSrc='/bot.svg'
                copiedMessageIndex={1}
                onCopyMessage={jest.fn()}
            />
        )

        expect(screen.getByTestId('is-copied-0')).toHaveTextContent('false')
        expect(screen.getByTestId('is-copied-1')).toHaveTextContent('true')
        expect(screen.getByTestId('is-copied-2')).toHaveTextContent('false')
    })

    it('sets aria-hidden to the inverse of disclaimerAccepted', () => {
        const { container, rerender } = render(
            <ChatMessageList
                messages={messages}
                isChatBusy={false}
                disclaimerAccepted={false}
                botAvatarSrc='/bot.svg'
                copiedMessageIndex={null}
                onCopyMessage={jest.fn()}
            />
        )

        expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')

        rerender(
            <ChatMessageList
                messages={messages}
                isChatBusy={false}
                disclaimerAccepted
                botAvatarSrc='/bot.svg'
                copiedMessageIndex={null}
                onCopyMessage={jest.fn()}
            />
        )

        expect(container.firstChild).toHaveAttribute('aria-hidden', 'false')
    })
})
