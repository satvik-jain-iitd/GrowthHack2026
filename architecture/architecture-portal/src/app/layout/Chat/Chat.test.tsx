import React from 'react'
import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { useUserContext } from '@/context'
import { usePilotGroup } from '@/hooks'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import { logChatEvent } from './chatLogger'
import { STATUS_PHRASES } from './chatStream'
import Chat from './Chat'

jest.mock('@/context', () => ({ useUserContext: jest.fn() }))
jest.mock('@/hooks', () => ({ usePilotGroup: jest.fn() }))
jest.mock('@/hooks/useUserAvatar', () => ({ useUserAvatar: jest.fn() }))
jest.mock('./chatLogger', () => ({ logChatEvent: jest.fn() }))

// react-markdown/remark-gfm ship as ESM and aren't transformed by the jest
// babel pipeline; a plain passthrough is enough here since markdown-specific
// rendering branches are exercised in ChatMessageBubble.test.tsx.
jest.mock('react-markdown', () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children }: any) => <>{children}</>
}))
jest.mock('remark-gfm', () => () => {})

const mockUseUserContext = useUserContext as jest.Mock
const mockUsePilotGroup = usePilotGroup as jest.Mock
const mockUseUserAvatar = useUserAvatar as jest.Mock
const mockLogChatEvent = logChatEvent as jest.Mock

const INITIAL_BOT_TEXT =
    'Hi! This is your Virtual Assistant. How can I help you today?'

function sse(type: string, extra: Record<string, unknown> = {}): string {
    return `event: ${type}\ndata: ${JSON.stringify({ type, ...extra })}\n\n`
}

function streamResponse(
    chunks: string[],
    opts: { ok?: boolean; nullBody?: boolean; hangAfter?: boolean } = {}
) {
    const { ok = true, nullBody = false, hangAfter = false } = opts
    if (nullBody) {
        return { ok, body: null }
    }
    const encoder = new TextEncoder()
    let i = 0
    return {
        ok,
        body: {
            getReader: () => ({
                read: jest.fn(() => {
                    if (i < chunks.length) {
                        const value = encoder.encode(chunks[i])
                        i += 1
                        return Promise.resolve({ done: false, value })
                    }
                    if (hangAfter) {
                        return new Promise(() => {})
                    }
                    return Promise.resolve({ done: true, value: undefined })
                })
            })
        }
    }
}

function openChat(): void {
    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }))
}

function acceptDisclaimer(): void {
    fireEvent.click(
        screen.getByRole('button', {
            name: 'Accept disclaimer and start chatting'
        })
    )
}

function openAndAccept(): void {
    openChat()
    acceptDisclaimer()
}

function typeMessage(text: string): void {
    fireEvent.change(screen.getByPlaceholderText('Type your question...'), {
        target: { value: text }
    })
}

function clickSend(): void {
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }))
}

describe('Chat', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseUserContext.mockReturnValue({
            attributes: { email: 'user@aexp.com', fullName: 'Jane Doe' }
        })
        mockUsePilotGroup.mockReturnValue({
            pilotGroup: { members: ['user@aexp.com'] }
        })
        mockUseUserAvatar.mockReturnValue({ avatarUrl: undefined })
        Object.assign(navigator, {
            clipboard: { writeText: jest.fn().mockResolvedValue(undefined) }
        })
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    describe('pilot group gate', () => {
        it('renders nothing when the current user is not a pilot member', () => {
            mockUsePilotGroup.mockReturnValue({
                pilotGroup: { members: ['someoneelse@aexp.com'] }
            })
            render(<Chat />)

            expect(
                screen.queryByRole('button', { name: 'Open chat' })
            ).not.toBeInTheDocument()
        })
    })

    describe('open and close', () => {
        it('opens the widget, logs session_start, and focuses the disclaimer button', () => {
            render(<Chat />)
            openChat()

            expect(screen.getByRole('dialog')).toBeInTheDocument()
            expect(mockLogChatEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    event: 'session_start',
                    userEmail: 'user@aexp.com',
                    userName: 'Jane Doe'
                })
            )
            expect(document.activeElement).toBe(
                screen.getByRole('button', {
                    name: 'Accept disclaimer and start chatting'
                })
            )
        })

        it('closes the widget and logs session_end with a computed duration and question count', () => {
            render(<Chat />)
            openChat()
            fireEvent.click(screen.getByRole('button', { name: 'Open chat' }))

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
            expect(mockLogChatEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    event: 'session_end',
                    durationMs: expect.any(Number),
                    questionCount: 0
                })
            )
        })

        it('closes the widget when the overlay is clicked', () => {
            const { container } = render(<Chat />)
            openChat()

            const overlay = (container.firstChild as HTMLElement)
                .children[1] as HTMLElement
            fireEvent.click(overlay)

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })
    })

    describe('session id generation', () => {
        it('uses crypto.randomUUID when available', () => {
            render(<Chat />)
            openChat()

            const call = mockLogChatEvent.mock.calls[0][0]
            expect(call.sessionId).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            )
        })

        it('falls back to a timestamp-based id when crypto.randomUUID is unavailable', () => {
            const originalCrypto = global.crypto
            Object.defineProperty(global, 'crypto', {
                value: {},
                configurable: true
            })

            render(<Chat />)
            openChat()

            const call = mockLogChatEvent.mock.calls[0][0]
            expect(call.sessionId).toMatch(/^chat-\d+-[a-z0-9]+$/)

            Object.defineProperty(global, 'crypto', {
                value: originalCrypto,
                configurable: true
            })
        })
    })

    describe('escape key handling', () => {
        it('does nothing when the chat is closed', () => {
            render(<Chat />)
            fireEvent.keyDown(window, { key: 'Escape' })
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })

        it('collapses an expanded widget instead of closing it', () => {
            render(<Chat />)
            openChat()
            fireEvent.click(screen.getByRole('button', { name: 'Expand chat' }))
            expect(
                screen.getByRole('button', { name: 'Exit full screen chat' })
            ).toBeInTheDocument()

            fireEvent.keyDown(window, { key: 'Escape' })

            expect(screen.getByRole('dialog')).toBeInTheDocument()
            expect(
                screen.getByRole('button', { name: 'Expand chat' })
            ).toBeInTheDocument()
        })

        it('closes the widget when it is open but not expanded', () => {
            render(<Chat />)
            openChat()

            fireEvent.keyDown(window, { key: 'Escape' })

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
            expect(mockLogChatEvent).toHaveBeenCalledWith(
                expect.objectContaining({ event: 'session_end' })
            )
        })
    })

    describe('disclaimer focus behavior', () => {
        it('reveals the input/list once accepted', () => {
            render(<Chat />)
            openChat()
            acceptDisclaimer()

            expect(
                screen
                    .getByPlaceholderText('Type your question...')
                    .closest('[aria-hidden]')
            ).toHaveAttribute('aria-hidden', 'false')
        })

        it('does not refocus the disclaimer once it has already been accepted', () => {
            const { container } = render(<Chat />)
            openChat()
            acceptDisclaimer()

            fireEvent.click(screen.getByRole('button', { name: 'Open chat' }))
            fireEvent.click(screen.getByRole('button', { name: 'Open chat' }))

            const disclaimerButton = container.querySelector(
                '[aria-label="Accept disclaimer and start chatting"]'
            )
            expect(disclaimerButton).not.toBeNull()
            expect(document.activeElement).not.toBe(disclaimerButton)
        })
    })

    describe('copy flow', () => {
        it('copies the message, swaps the icon, and auto-clears after 1500ms', async () => {
            jest.useFakeTimers()
            render(<Chat />)
            openAndAccept()

            fireEvent.click(
                screen.getByRole('button', { name: 'Copy bot response' })
            )
            await act(async () => {
                await Promise.resolve()
            })

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                INITIAL_BOT_TEXT
            )
            expect(screen.getByTestId('icon-check')).toBeInTheDocument()

            await act(async () => {
                jest.advanceTimersByTime(1500)
            })

            expect(screen.getByTestId('icon-copy')).toBeInTheDocument()
        })

        it('logs an error and does not crash when the clipboard rejects', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
                new Error('denied')
            )

            render(<Chat />)
            openAndAccept()

            fireEvent.click(
                screen.getByRole('button', { name: 'Copy bot response' })
            )
            await act(async () => {
                await Promise.resolve()
            })

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Failed to copy chat message.',
                expect.any(Error)
            )
            consoleErrorSpy.mockRestore()
        })
    })

    describe('handleSend guards', () => {
        it('does nothing when the input is empty or whitespace', () => {
            render(<Chat />)
            openAndAccept()
            typeMessage('   ')
            clickSend()

            expect(global.fetch).not.toHaveBeenCalled()
        })

        it('ignores a redundant same-tick send while one is already in flight', async () => {
            ;(global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}))
            render(<Chat />)
            openAndAccept()
            typeMessage('Hello?')

            await act(() => {
                fireEvent.keyDown(
                    screen.getByPlaceholderText('Type your question...'),
                    { key: 'Enter' }
                )
                fireEvent.click(
                    screen.getByRole('button', { name: 'Send message' })
                )
            })

            expect(global.fetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('fetch failure handling', () => {
        it('shows an error bubble and logs an error when the response is not ok', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([], { ok: false })
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hello?')
            clickSend()

            await waitFor(() => {
                expect(
                    screen.getByText('Failed to fetch from the chat service.')
                ).toBeInTheDocument()
            })
            expect(mockLogChatEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    event: 'error',
                    errorMessage: 'Failed to fetch from the chat service.'
                })
            )
        })

        it('shows an error bubble when the response has no body', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([], { nullBody: true })
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hello?')
            clickSend()

            await waitFor(() => {
                expect(
                    screen.getByText(
                        'Streaming is not supported by this browser.'
                    )
                ).toBeInTheDocument()
            })
        })

        it('shows a generic error message when fetch rejects with a non-Error value', async () => {
            ;(global.fetch as jest.Mock).mockRejectedValue('boom')
            render(<Chat />)
            openAndAccept()
            typeMessage('Hello?')
            clickSend()

            await waitFor(() => {
                expect(
                    screen.getByText('Failed to reach the chat service.')
                ).toBeInTheDocument()
            })
        })
    })

    describe('SSE stream handling', () => {
        it('skips [DONE] markers and malformed chunks', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([
                    'data: [DONE]\n\n',
                    'this-is-not-sse\n\n',
                    sse('response_chunk', { content: 'All good' })
                ])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(screen.getByText('All good')).toBeInTheDocument()
            })
        })

        it('throws and surfaces an error bubble for a type: error event', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([sse('error', { content: 'Boom' })])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(screen.getByText('Boom')).toBeInTheDocument()
            })
        })

        it('updates the bubble via a response_chunk event after a tool_start status event', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([
                    sse('tool_start', { tool: 'search' }),
                    sse('response_chunk', { content: 'Partial answer' })
                ])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(screen.getByText('Partial answer')).toBeInTheDocument()
            })
        })

        it('updates the bubble via a final event', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([sse('final', { content: 'The final answer' })])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(screen.getByText('The final answer')).toBeInTheDocument()
            })
        })

        it('treats response_end as a no-op', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([
                    sse('response_end'),
                    sse('response_chunk', { content: 'After response_end' })
                ])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(
                    screen.getByText('After response_end')
                ).toBeInTheDocument()
            })
        })

        it('drops progress+connected events without changing status or appending a line', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([
                    sse('progress', { phase: 'connected' }),
                    sse('response_chunk', { content: 'Reply after connected' })
                ])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(
                    screen.getByText('Reply after connected')
                ).toBeInTheDocument()
            })
        })

        it('shows the unexpected-response error when the stream ends without a reply', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([sse('tool_start', { tool: 'search' })])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(
                    screen.getByText(
                        'Unexpected response from the chat service.'
                    )
                ).toBeInTheDocument()
            })
        })

        it('does not reset the status interval when consecutive events map to the same phase', async () => {
            const setIntervalSpy = jest.spyOn(window, 'setInterval')
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([
                    sse('tool_start', { tool: 'a' }),
                    sse('tool_start', { tool: 'b' }),
                    sse('response_chunk', { content: 'done' })
                ])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(screen.getByText('done')).toBeInTheDocument()
            })

            // one setInterval(...,2500) for the initial 'starting' phase, one
            // for the transition to 'tool_call' on the first tool_start; the
            // second tool_start maps to the same phase and must not add
            // another. (Unrelated library code may also schedule its own
            // intervals, so filter to the 2500ms status-rotation interval.)
            const statusIntervalCalls = setIntervalSpy.mock.calls.filter(
                call => call[1] === 2500
            )
            expect(statusIntervalCalls).toHaveLength(2)
            setIntervalSpy.mockRestore()
        })

        it('clears a still-running status interval in the finally block when an error interrupts the stream', async () => {
            const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([sse('error', { content: 'Boom' })])
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')
            clickSend()

            await waitFor(() => {
                expect(screen.getByText('Boom')).toBeInTheDocument()
            })

            expect(clearIntervalSpy).toHaveBeenCalled()
            clearIntervalSpy.mockRestore()
        })
    })

    describe('status phrase rotation', () => {
        it('cycles through status phrases on a 2500ms interval while thinking', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                streamResponse([sse('thinking', {})], { hangAfter: true })
            )
            render(<Chat />)
            openAndAccept()
            typeMessage('Hi')

            jest.useFakeTimers()
            clickSend()

            await act(async () => {
                await Promise.resolve()
                await Promise.resolve()
            })
            expect(
                screen.getByText(STATUS_PHRASES.thinking[0])
            ).toBeInTheDocument()

            await act(async () => {
                jest.advanceTimersByTime(2500)
            })
            expect(
                screen.getByText(STATUS_PHRASES.thinking[1])
            ).toBeInTheDocument()
        })
    })

    describe('widget expand/collapse', () => {
        it('expands and collapses the widget via the header toggle button', () => {
            render(<Chat />)
            openChat()

            fireEvent.click(screen.getByRole('button', { name: 'Expand chat' }))
            expect(
                screen.getByRole('button', { name: 'Exit full screen chat' })
            ).toBeInTheDocument()

            fireEvent.click(
                screen.getByRole('button', { name: 'Exit full screen chat' })
            )
            expect(
                screen.getByRole('button', { name: 'Expand chat' })
            ).toBeInTheDocument()
        })
    })

    describe('input disabled state', () => {
        it('disables the input while the disclaimer is unaccepted, and again once busy', async () => {
            ;(global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}))
            render(<Chat />)
            openChat()

            expect(
                screen.getByPlaceholderText('Type your question...')
            ).toBeDisabled()

            acceptDisclaimer()
            expect(
                screen.getByPlaceholderText('Type your question...')
            ).toBeEnabled()

            typeMessage('Hi')
            clickSend()

            await act(async () => {
                await Promise.resolve()
            })
            expect(
                screen.getByPlaceholderText('Type your question...')
            ).toBeDisabled()
        })
    })
})
