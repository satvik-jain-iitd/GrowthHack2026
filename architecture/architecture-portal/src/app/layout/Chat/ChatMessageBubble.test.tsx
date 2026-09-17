import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import ChatMessageBubble from './ChatMessageBubble'
import { ChatMessage } from './types'

// react-markdown/remark-gfm ship as ESM and aren't transformed by the jest
// babel pipeline, so we stub react-markdown with a minimal fake that
// understands just enough syntax (fenced code blocks + a `||`-prefixed table
// marker) to drive the real `pre`/`table` renderers defined in
// ChatMessageBubble itself.
jest.mock('react-markdown', () => {
    return function MockReactMarkdown({
        children,
        components
    }: {
        children: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components: any
    }) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ReactLocal = require('react')
        const text = children ?? ''
        const codeMatch = text.match(/^```(\w+)?\n([\s\S]*?)\n```$/)
        if (codeMatch) {
            const [, lang, code] = codeMatch
            const codeElement = ReactLocal.createElement(
                'code',
                { className: lang ? `language-${lang}` : undefined },
                code
            )
            return components.pre({ children: codeElement })
        }
        if (text.startsWith('||')) {
            return components.table({ children: text.slice(2) })
        }
        return <>{text}</>
    }
})

jest.mock('remark-gfm', () => () => {})

jest.mock('./ChatMermaidDiagram', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockChatMermaidDiagram({ code }: any) {
        return <div data-testid='mermaid-mock'>{code}</div>
    }
})

jest.mock('./ChatTableDialog', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockChatTableDialog({ children }: any) {
        return (
            <div data-testid='table-dialog-mock'>
                <table>{children}</table>
            </div>
        )
    }
})

jest.mock('./SourcesSection', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockSourcesSection({ sources }: any) {
        return <div data-testid='sources-mock'>{sources.join(',')}</div>
    }
})

jest.mock('./StreamEventLog', () => {
    return function MockStreamEventLog() {
        return <div data-testid='stream-event-log-mock' />
    }
})

const baseProps = {
    index: 0,
    isLast: false,
    isChatBusy: false,
    botAvatarSrc: '/bot.svg',
    userAvatarUrl: undefined as string | null | undefined,
    userFullName: undefined as string | undefined,
    isCopied: false,
    onCopy: jest.fn()
}

function botMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
    return { sender: 'bot', text: 'Hello there', ...overrides }
}

function userMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
    return { sender: 'user', text: 'Hi bot', ...overrides }
}

describe('ChatMessageBubble', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('sender-driven layout', () => {
        it('renders the bot avatar and stream event log for bot messages', () => {
            render(<ChatMessageBubble {...baseProps} message={botMessage()} />)

            expect(screen.getByAltText('assistant')).toBeInTheDocument()
            expect(
                screen.getByTestId('stream-event-log-mock')
            ).toBeInTheDocument()
        })

        it('renders the user avatar and no stream event log for user messages', () => {
            render(<ChatMessageBubble {...baseProps} message={userMessage()} />)

            expect(screen.queryByAltText('assistant')).not.toBeInTheDocument()
            expect(
                screen.queryByTestId('stream-event-log-mock')
            ).not.toBeInTheDocument()
        })
    })

    describe('typing state', () => {
        it('renders typing dots and no statusText when statusText is absent', () => {
            const { container } = render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ text: '', typing: true })}
                />
            )

            expect(container.querySelectorAll('.typingDot')).toHaveLength(3)
        })

        it('renders the statusText alongside the typing dots when present', () => {
            render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({
                        text: '',
                        typing: true,
                        statusText: 'Thinking hard...'
                    })}
                />
            )

            expect(screen.getByText('Thinking hard...')).toBeInTheDocument()
        })
    })

    describe('bot markdown rendering', () => {
        const mermaidText = '```mermaid\ngraph TD;\nA-->B;\n```'

        it('renders the mermaid diagram component when ready', () => {
            render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ text: mermaidText, durationMs: 500 })}
                />
            )

            expect(screen.getByTestId('mermaid-mock')).toHaveTextContent(
                'graph TD; A-->B;'
            )
        })

        it('renders a plain mermaid placeholder div when not ready', () => {
            const { container } = render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ text: mermaidText })}
                />
            )

            expect(screen.queryByTestId('mermaid-mock')).not.toBeInTheDocument()
            expect(container.querySelector('div.mermaid')).toHaveTextContent(
                'graph TD; A-->B;'
            )
        })

        it('renders a plain <pre> for non-mermaid fenced code blocks', () => {
            const { container } = render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({
                        text: '```js\nconst a = 1;\n```',
                        durationMs: 100
                    })}
                />
            )

            expect(container.querySelector('pre')).toHaveTextContent(
                'const a = 1;'
            )
        })

        it('renders the table dialog mock for GFM tables', () => {
            render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ text: '||A,B,1,2' })}
                />
            )

            expect(screen.getByTestId('table-dialog-mock')).toHaveTextContent(
                'A,B,1,2'
            )
        })

        it('shows the "Responded in Xs" text only when durationMs is a number', () => {
            const { rerender } = render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ durationMs: 2345 })}
                />
            )
            expect(screen.getByText(/Responded in 2\.35s/)).toBeInTheDocument()

            rerender(
                <ChatMessageBubble {...baseProps} message={botMessage()} />
            )
            expect(screen.queryByText(/Responded in/)).not.toBeInTheDocument()
        })
    })

    describe('trailing typing indicator', () => {
        it('renders trailing typing dots only when isChatBusy and isLast are both true', () => {
            const { container, rerender } = render(
                <ChatMessageBubble
                    {...baseProps}
                    isChatBusy
                    isLast
                    message={botMessage()}
                />
            )
            expect(container.querySelectorAll('.typingDot')).toHaveLength(3)

            rerender(
                <ChatMessageBubble
                    {...baseProps}
                    isChatBusy={false}
                    isLast
                    message={botMessage()}
                />
            )
            expect(container.querySelectorAll('.typingDot')).toHaveLength(0)

            rerender(
                <ChatMessageBubble
                    {...baseProps}
                    isChatBusy
                    isLast={false}
                    message={botMessage()}
                />
            )
            expect(container.querySelectorAll('.typingDot')).toHaveLength(0)
        })
    })

    describe('sources', () => {
        it('renders SourcesSection only when sources are present', () => {
            const { rerender } = render(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ sources: ['https://a.com'] })}
                />
            )
            expect(screen.getByTestId('sources-mock')).toBeInTheDocument()

            rerender(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ sources: [] })}
                />
            )
            expect(screen.queryByTestId('sources-mock')).not.toBeInTheDocument()
        })
    })

    describe('copy button', () => {
        it('renders the copy button only for non-typing bot messages with text', () => {
            const { rerender } = render(
                <ChatMessageBubble {...baseProps} message={botMessage()} />
            )
            expect(
                screen.getByRole('button', { name: 'Copy bot response' })
            ).toBeInTheDocument()

            rerender(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ typing: true, text: '' })}
                />
            )
            expect(
                screen.queryByRole('button', { name: 'Copy bot response' })
            ).not.toBeInTheDocument()

            rerender(
                <ChatMessageBubble
                    {...baseProps}
                    message={botMessage({ text: '   ' })}
                />
            )
            expect(
                screen.queryByRole('button', { name: 'Copy bot response' })
            ).not.toBeInTheDocument()

            rerender(
                <ChatMessageBubble {...baseProps} message={userMessage()} />
            )
            expect(
                screen.queryByRole('button', { name: 'Copy bot response' })
            ).not.toBeInTheDocument()
        })

        it('calls onCopy with the message text and index when clicked', () => {
            const onCopy = jest.fn()
            render(
                <ChatMessageBubble
                    {...baseProps}
                    index={2}
                    onCopy={onCopy}
                    message={botMessage({ text: 'copy me' })}
                />
            )

            fireEvent.click(
                screen.getByRole('button', { name: 'Copy bot response' })
            )
            expect(onCopy).toHaveBeenCalledWith('copy me', 2)
        })
    })

    describe('avatar fallback initials', () => {
        it('uses the first letters of a multi-word full name', () => {
            render(
                <ChatMessageBubble
                    {...baseProps}
                    userFullName='John Doe'
                    message={userMessage()}
                />
            )
            expect(screen.getByText('JD')).toBeInTheDocument()
        })

        it('uses the first letter of a single-word name', () => {
            render(
                <ChatMessageBubble
                    {...baseProps}
                    userFullName='John'
                    message={userMessage()}
                />
            )
            expect(screen.getByText('J')).toBeInTheDocument()
        })

        it('falls back to "U" when there is no name', () => {
            render(
                <ChatMessageBubble
                    {...baseProps}
                    userFullName={undefined}
                    message={userMessage()}
                />
            )
            expect(screen.getByText('U')).toBeInTheDocument()
        })
    })
})
