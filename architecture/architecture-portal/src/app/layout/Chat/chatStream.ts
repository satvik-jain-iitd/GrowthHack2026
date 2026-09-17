import { AgentStreamEvent, StatusPhase } from './types'

export const STATUS_PHRASES: Record<StatusPhase, string[]> = {
    starting: ['Getting started...', 'Connecting to the assistant...'],
    thinking: ['Still thinking...', 'Working through your request...'],
    tool_call: [
        'Calling a tool to gather information...',
        'Fetching what you need...'
    ],
    tool_response: ['Parsing the response...', 'Reviewing the results...'],
    finalizing: [
        'Preparing your final answer...',
        'Putting the response together...'
    ]
}

export function getStatusPhase(event: AgentStreamEvent): StatusPhase | null {
    const stage =
        typeof event.stage === 'string'
            ? event.stage
            : typeof event.metadata?.stage === 'string'
              ? event.metadata.stage
              : undefined

    if (event.type === 'tool_start') return 'tool_call'
    if (event.type === 'tool_output') return 'tool_response'

    if (event.type === 'progress') {
        if (event.phase === 'connected') return null
        if (event.phase === 'tool_end') return 'tool_response'
        return 'thinking'
    }

    if (event.type === 'thinking' || event.type === 'status') {
        if (stage === 'post_process_start' || stage === 'parse_json_response') {
            return 'finalizing'
        }
        return 'thinking'
    }

    return null
}

export function parseSseBlock(
    block: string
): AgentStreamEvent | '[DONE]' | null {
    const lines = block.split('\n')
    const eventLine = lines.find(line => line.startsWith('event:'))
    const eventName = eventLine?.slice(6).trim()
    const dataLines = lines
        .filter(line => line.startsWith('data:'))
        .map(line => line.slice(5).trimStart())

    if (!dataLines.length) return null

    const payload = dataLines.join('\n').trim()
    if (!payload) return null
    if (payload === '[DONE]') return '[DONE]'

    try {
        const parsed = JSON.parse(payload) as Record<string, unknown>
        const parsedMetadata =
            typeof parsed.metadata === 'object' && parsed.metadata !== null
                ? (parsed.metadata as Record<string, unknown>)
                : {}
        const parsedData = parsed.data
        const parsedDataRecord =
            typeof parsedData === 'object' && parsedData !== null
                ? (parsedData as Record<string, unknown>)
                : null

        const normalizedType =
            eventName ||
            (typeof parsed.type === 'string' ? parsed.type : 'status')
        const normalizedPhase =
            typeof parsed.phase === 'string' ? parsed.phase : undefined
        const normalizedContent =
            normalizedPhase === 'complete'
                ? ((parsedDataRecord?.reply as unknown) ?? parsed.content)
                : (parsed.content ??
                  parsed.message ??
                  (parsedDataRecord?.reply as unknown))

        return {
            type: normalizedType,
            stage: typeof parsed.stage === 'string' ? parsed.stage : undefined,
            phase: normalizedPhase,
            message:
                typeof parsed.message === 'string' ? parsed.message : undefined,
            tool:
                typeof parsed.tool === 'string'
                    ? parsed.tool
                    : typeof parsedDataRecord?.tool === 'string'
                      ? parsedDataRecord.tool
                      : typeof parsedMetadata.tool === 'string'
                        ? parsedMetadata.tool
                        : undefined,
            data: parsedData,
            output: parsed.output ?? parsedData,
            content: normalizedContent,
            metadata: {
                ...parsedMetadata,
                ...(typeof parsed.phase === 'string'
                    ? { phase: parsed.phase }
                    : {})
            }
        }
    } catch {
        return null
    }
}

export function normalizeEventContent(content: unknown): string {
    if (content == null) return ''

    if (typeof content === 'string') {
        const trimmed = content.trim()
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
                const parsed = JSON.parse(trimmed) as {
                    content?: unknown
                    text?: unknown
                    output?: unknown
                }
                const nested = parsed.content ?? parsed.text ?? parsed.output
                if (nested != null) {
                    return normalizeEventContent(nested)
                }
            } catch {
                return trimmed
            }
        }
        return trimmed
    }

    if (Array.isArray(content)) {
        return content
            .map(item => normalizeEventContent(item))
            .filter(Boolean)
            .join('')
    }

    if (typeof content === 'object') {
        const record = content as Record<string, unknown>
        const nested =
            record.content ??
            record.text ??
            record.output ??
            record.value ??
            record.message ??
            record.reply
        if (nested != null) {
            return normalizeEventContent(nested)
        }
        return ''
    }

    return String(content).trim()
}

export function getToolEndPreviewText(data: unknown): string {
    if (typeof data !== 'object' || data === null) return ''

    const record = data as Record<string, unknown>
    const outputPreview = record.output_preview
    if (outputPreview == null) return ''

    const normalizedPreview = normalizeEventContent(outputPreview)
    if (!normalizedPreview) return ''

    const contentMatch = normalizedPreview.match(/content='([^']+)'/)
    const candidate = contentMatch ? contentMatch[1] : normalizedPreview
    const normalizedCandidate = normalizeEventContent(candidate)

    if (!normalizedCandidate) return ''
    const compact = normalizedCandidate.replace(/\s+/g, ' ').trim()
    return compact.length > 160 ? `${compact.slice(0, 160)}...` : compact
}

export function getEventLabel(event: AgentStreamEvent): string | null {
    const normalizedContent = normalizeEventContent(event.content)
    const normalizedOutput = normalizeEventContent(event.output)

    const stage =
        typeof event.stage === 'string'
            ? event.stage
            : typeof event.metadata?.stage === 'string'
              ? event.metadata.stage
              : undefined

    if (event.type === 'done' || event.type === 'response_end') {
        return null
    }

    if (event.type === 'thinking') {
        if (stage === 'start') return 'Working on your request...'
        if (stage === 'post_process_start')
            return 'Preparing the final response...'
        if (stage === 'parse_json_response') return 'Formatting the response...'
        return normalizedContent || normalizedOutput || 'Thinking...'
    }

    if (event.type === 'tool_start') {
        return 'Starting a tool call...'
    }

    if (event.type === 'tool_output') {
        return 'Tool call finished.'
    }

    if (event.type === 'progress') {
        if (event.phase === 'connected') return null

        if (event.phase === 'tool_end') {
            return 'Response received.'
        }

        if (normalizedContent) return normalizedContent
        if (normalizedOutput) return normalizedOutput
        return event.phase ? `Progress: ${event.phase}` : 'Making progress...'
    }

    if (event.type === 'status') {
        if (stage === 'start' || stage === 'connected') {
            return 'Working on your request...'
        }

        if (stage === 'post_process_start') {
            return 'Preparing the final response...'
        }

        if (stage === 'parse_json_response') {
            return 'Formatting the response...'
        }

        if (normalizedContent) return normalizedContent
        if (normalizedOutput) return normalizedOutput
        return 'Status update received...'
    }

    return `Processing ${event.type}...`
}

export function getEventDetail(event: AgentStreamEvent): string {
    const normalizedContent = normalizeEventContent(event.content)
    const normalizedOutput = normalizeEventContent(event.output)

    if (event.type === 'tool_start') {
        const toolLine = `Tool: ${event.tool ?? 'Unknown tool'}`
        return normalizedContent
            ? `${toolLine}\n${normalizedContent}`
            : toolLine
    }

    if (event.type === 'tool_output') {
        const toolLine = `Tool: ${event.tool ?? 'Unknown tool'}`
        const response = normalizedContent || normalizedOutput
        return response ? `${toolLine}\nResponse: ${response}` : toolLine
    }

    if (event.type === 'progress' && event.phase === 'tool_end') {
        const previewText = getToolEndPreviewText(event.data)
        if (previewText) {
            return event.tool
                ? `Tool: ${event.tool}\n${previewText}`
                : previewText
        }
    }

    if (normalizedContent) return normalizedContent
    if (normalizedOutput) return normalizedOutput

    if (event.message) return event.message

    if (event.data !== undefined) {
        try {
            return JSON.stringify(event.data)
        } catch {
            console.warn('Failed to stringify event data:', event.data)
        }
    }

    return 'No additional details available.'
}
