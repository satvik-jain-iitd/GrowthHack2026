import { POST } from './route'

jest.mock('@/utils/server', () => ({
    Logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn()
    }
}))

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, init) => ({ _body: body, _init: init }))
    }
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { NextResponse } = require('next/server')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Logger } = require('@/utils/server')

const makeRequest = (body: unknown): Request =>
    ({
        json: async () => body
    }) as unknown as Request

const makeMalformedRequest = (): Request =>
    ({
        json: async () => {
            throw new SyntaxError('Unexpected token')
        }
    }) as unknown as Request

describe('POST /api/chat/log', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        NextResponse.json.mockImplementation(
            (body: unknown, init?: ResponseInit) => ({
                _body: body,
                _init: init
            })
        )
    })

    it('logs a valid session_start event at info level with logCategory', async () => {
        await POST(
            makeRequest({
                event: 'session_start',
                sessionId: 'sess-1',
                userEmail: 'user@example.com'
            })
        )

        expect(Logger.info).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                logCategory: 'chat-assistant',
                event: 'session_start',
                sessionId: 'sess-1',
                userEmail: 'user@example.com'
            })
        )
        expect(NextResponse.json).toHaveBeenCalledWith({ ok: true })
    })

    it('logs an error event at error level', async () => {
        await POST(
            makeRequest({
                event: 'error',
                sessionId: 'sess-1',
                userEmail: 'user@example.com',
                errorMessage: 'Something broke'
            })
        )

        expect(Logger.error).toHaveBeenCalledWith(
            expect.stringContaining('Something broke'),
            expect.objectContaining({
                logCategory: 'chat-assistant',
                event: 'error',
                errorMessage: 'Something broke'
            })
        )
    })

    it('returns 400 and does not throw on malformed JSON body', async () => {
        await POST(makeMalformedRequest())

        expect(Logger.warn).toHaveBeenCalled()
        expect(NextResponse.json).toHaveBeenCalledWith(
            { ok: false },
            { status: 400 }
        )
    })

    it('returns 400 for an unknown event type', async () => {
        await POST(
            makeRequest({
                event: 'not_a_real_event',
                sessionId: 'sess-1'
            })
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            { ok: false },
            { status: 400 }
        )
    })

    it('returns 400 when sessionId is missing', async () => {
        await POST(
            makeRequest({
                event: 'session_start'
            })
        )

        expect(NextResponse.json).toHaveBeenCalledWith(
            { ok: false },
            { status: 400 }
        )
    })

    it('truncates long question/answer text and reports original lengths', async () => {
        const longQuestion = 'q'.repeat(1500)
        const longAnswer = 'a'.repeat(2000)

        await POST(
            makeRequest({
                event: 'answer_received',
                sessionId: 'sess-1',
                userEmail: 'user@example.com',
                question: longQuestion,
                answer: longAnswer,
                durationMs: 100
            })
        )

        const [, attributes] = Logger.info.mock.calls[0]
        expect(attributes.question).toHaveLength(1000 + '… [truncated]'.length)
        expect(attributes.question.endsWith('… [truncated]')).toBe(true)
        expect(attributes.questionLength).toBe(1500)
        expect(attributes.answer.endsWith('… [truncated]')).toBe(true)
        expect(attributes.answerLength).toBe(2000)
    })
})
