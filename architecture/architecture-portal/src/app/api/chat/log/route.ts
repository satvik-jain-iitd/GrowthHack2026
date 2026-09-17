import { Logger } from '@/utils/server'
import { NextResponse } from 'next/server'

const CHAT_LOG_EVENTS = [
    'session_start', // This event is logged when a new chat session is initiated or when a user returns to an existing session.
    'session_end', // This event is logged when a chat session is concluded, i.e. when the user leaves the chat(by minimizing the chat window) or closes the browser.
    'question_asked',
    'answer_received',
    'error',
    'stream_event'
] as const

type ChatLogEvent = (typeof CHAT_LOG_EVENTS)[number]

type ChatLogRequestBody = {
    event: ChatLogEvent
    sessionId: string
    userEmail?: string
    userName?: string
    messageIndex?: number
    question?: string
    answer?: string
    durationMs?: number
    questionCount?: number
    errorMessage?: string
}

const MAX_TEXT_LENGTH = 1000
const TRUNCATED_SUFFIX = '… [truncated]'

const truncate = (
    text: string | undefined
): { text: string | undefined; length: number | undefined } => {
    if (text === undefined) return { text: undefined, length: undefined }

    const length = text.length
    if (length <= MAX_TEXT_LENGTH) return { text, length }

    return {
        text: text.slice(0, MAX_TEXT_LENGTH) + TRUNCATED_SUFFIX,
        length
    }
}

const isValidBody = (body: unknown): body is ChatLogRequestBody => {
    if (!body || typeof body !== 'object') return false

    const candidate = body as Record<string, unknown>

    return (
        typeof candidate.event === 'string' &&
        (CHAT_LOG_EVENTS as readonly string[]).includes(candidate.event) &&
        typeof candidate.sessionId === 'string' &&
        candidate.sessionId.length > 0
    )
}

export async function POST(request: Request) {
    try {
        let body: unknown
        try {
            body = await request.json()
        } catch {
            body = null
        }

        if (!isValidBody(body)) {
            Logger.warn('Rejected malformed chat log request.', {
                logCategory: 'chat-assistant'
            })
            return NextResponse.json({ ok: false }, { status: 400 })
        }

        const {
            event,
            sessionId,
            userEmail,
            userName,
            messageIndex,
            question,
            answer,
            durationMs,
            questionCount,
            errorMessage
        } = body

        const truncatedQuestion = truncate(question)
        const truncatedAnswer = truncate(answer)

        const attributes = {
            logCategory: 'chat-assistant',
            event,
            sessionId,
            userEmail,
            userName,
            messageIndex,
            question: truncatedQuestion.text,
            questionLength: truncatedQuestion.length,
            answer: truncatedAnswer.text,
            answerLength: truncatedAnswer.length,
            durationMs,
            questionCount,
            errorMessage
        }

        if (event === 'error') {
            Logger.error(
                `Chat assistant error: ${errorMessage ?? 'unknown'}`,
                attributes
            )
        } else if (event === 'stream_event') {
            Logger.debug(() => `Chat assistant stream event`, attributes)
        } else {
            Logger.info(`Chat assistant event: ${event}`, attributes)
        }

        return NextResponse.json({ ok: true })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        Logger.error(error)
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
