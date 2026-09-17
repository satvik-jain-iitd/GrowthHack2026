export type ChatLogEvent =
    | 'session_start'
    | 'session_end'
    | 'question_asked'
    | 'answer_received'
    | 'error'
    | 'stream_event'

export type ChatLogPayload = {
    event: ChatLogEvent
    sessionId: string
    userEmail: string
    userName?: string
    messageIndex?: number
    question?: string
    answer?: string
    durationMs?: number
    questionCount?: number
    errorMessage?: string
}

export const logChatEvent = (payload: ChatLogPayload): void => {
    try {
        void fetch('/api/chat/log', {
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    } catch {
        // Logging must never break the chat UX.
    }
}
