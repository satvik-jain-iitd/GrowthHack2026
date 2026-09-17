export type Sender = 'bot' | 'user'

export type StreamEventLine = {
    type: string
    label: string
    detail: string
}

export type ChatMessage = {
    sender: Sender
    text: string
    sources?: string[]
    typing?: boolean
    durationMs?: number
    streamEvents?: StreamEventLine[]
    statusText?: string
}

export type StatusPhase =
    | 'starting'
    | 'thinking'
    | 'tool_call'
    | 'tool_response'
    | 'finalizing'

export type AgentStreamEvent = {
    type:
        | 'thinking'
        | 'response_end'
        | 'tool_start'
        | 'tool_output'
        | 'done'
        | 'response_chunk'
        | 'reshaping'
        | 'found'
        | 'filtering'
        | 'progress'
        | 'status'
        | string
    stage?: string
    phase?: string
    message?: string
    tool?: string
    data?: unknown
    output?: unknown
    content?: unknown
    metadata?: {
        tool?: string
        final?: boolean
        [key: string]: unknown
    }
}
