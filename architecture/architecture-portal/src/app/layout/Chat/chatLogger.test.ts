import { logChatEvent, ChatLogPayload } from './chatLogger'

describe('chatLogger', () => {
    const payload: ChatLogPayload = {
        event: 'session_start',
        sessionId: 'session-123',
        userEmail: 'user@aexp.com'
    }

    beforeEach(() => {
        jest.restoreAllMocks()
    })

    it('POSTs the payload to /api/chat/log with the correct request shape', () => {
        const fetchMock = jest.fn().mockResolvedValue({ ok: true })
        global.fetch = fetchMock as unknown as typeof fetch

        logChatEvent(payload)

        expect(fetchMock).toHaveBeenCalledWith('/api/chat/log', {
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    })

    it('swallows synchronous errors thrown by fetch', () => {
        global.fetch = jest.fn(() => {
            throw new Error('network unavailable')
        }) as unknown as typeof fetch

        expect(() => logChatEvent(payload)).not.toThrow()
    })
})
