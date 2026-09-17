import {
    getStatusPhase,
    parseSseBlock,
    normalizeEventContent,
    getToolEndPreviewText,
    getEventLabel,
    getEventDetail
} from './chatStream'
import { AgentStreamEvent } from './types'

function ev(partial: Partial<AgentStreamEvent>): AgentStreamEvent {
    return { type: 'status', ...partial }
}

describe('getStatusPhase', () => {
    it('returns tool_call for tool_start', () => {
        expect(getStatusPhase(ev({ type: 'tool_start' }))).toBe('tool_call')
    })

    it('returns tool_response for tool_output', () => {
        expect(getStatusPhase(ev({ type: 'tool_output' }))).toBe(
            'tool_response'
        )
    })

    it('returns null for progress with phase connected', () => {
        expect(
            getStatusPhase(ev({ type: 'progress', phase: 'connected' }))
        ).toBeNull()
    })

    it('returns tool_response for progress with phase tool_end', () => {
        expect(
            getStatusPhase(ev({ type: 'progress', phase: 'tool_end' }))
        ).toBe('tool_response')
    })

    it('returns thinking for progress with any other phase', () => {
        expect(
            getStatusPhase(ev({ type: 'progress', phase: 'something' }))
        ).toBe('thinking')
    })

    it('returns finalizing for thinking with stage post_process_start', () => {
        expect(
            getStatusPhase(
                ev({ type: 'thinking', stage: 'post_process_start' })
            )
        ).toBe('finalizing')
    })

    it('returns finalizing for thinking with stage parse_json_response', () => {
        expect(
            getStatusPhase(
                ev({ type: 'thinking', stage: 'parse_json_response' })
            )
        ).toBe('finalizing')
    })

    it('returns thinking for thinking with an unrecognized stage', () => {
        expect(getStatusPhase(ev({ type: 'thinking', stage: 'other' }))).toBe(
            'thinking'
        )
    })

    it('returns finalizing for status with stage read from metadata.stage', () => {
        expect(
            getStatusPhase(
                ev({
                    type: 'status',
                    metadata: { stage: 'post_process_start' }
                })
            )
        ).toBe('finalizing')
    })

    it('returns thinking for status with no stage at all', () => {
        expect(getStatusPhase(ev({ type: 'status' }))).toBe('thinking')
    })

    it('returns null for unknown event types', () => {
        expect(getStatusPhase(ev({ type: 'reshaping' }))).toBeNull()
    })
})

describe('parseSseBlock', () => {
    it('falls back to parsed.type when there is no event: line', () => {
        const result = parseSseBlock('data: {"type":"custom_type"}')
        expect(result).not.toBe('[DONE]')
        expect(result).not.toBeNull()
        expect((result as AgentStreamEvent).type).toBe('custom_type')
    })

    it('falls back to "status" when there is no event: line and no type field', () => {
        const result = parseSseBlock('data: {"content":"hi"}')
        expect((result as AgentStreamEvent).type).toBe('status')
    })

    it('joins multiple data: lines to reconstruct multiline JSON', () => {
        const block =
            'event: message\ndata: {\ndata:   "content": "hello"\ndata: }'
        const result = parseSseBlock(block) as AgentStreamEvent
        expect(result.type).toBe('message')
        expect(result.content).toBe('hello')
    })

    it('returns null when there are no data: lines', () => {
        expect(parseSseBlock('event: message')).toBeNull()
    })

    it('returns null when the payload is empty', () => {
        expect(parseSseBlock('data: ')).toBeNull()
    })

    it('returns the literal [DONE] marker', () => {
        expect(parseSseBlock('data: [DONE]')).toBe('[DONE]')
    })

    it('returns null when the payload is invalid JSON', () => {
        expect(parseSseBlock('data: not-json{')).toBeNull()
    })

    it('reads tool from parsed.tool when present', () => {
        const result = parseSseBlock(
            'data: {"tool":"top-level-tool"}'
        ) as AgentStreamEvent
        expect(result.tool).toBe('top-level-tool')
    })

    it('falls back to data.tool when parsed.tool is absent', () => {
        const result = parseSseBlock(
            'data: {"data":{"tool":"data-tool"}}'
        ) as AgentStreamEvent
        expect(result.tool).toBe('data-tool')
    })

    it('falls back to metadata.tool when parsed.tool and data.tool are absent', () => {
        const result = parseSseBlock(
            'data: {"metadata":{"tool":"metadata-tool"}}'
        ) as AgentStreamEvent
        expect(result.tool).toBe('metadata-tool')
    })

    it('leaves tool undefined when nothing provides it', () => {
        const result = parseSseBlock('data: {}') as AgentStreamEvent
        expect(result.tool).toBeUndefined()
    })

    it('prefers data.reply over parsed.content when phase is complete', () => {
        const result = parseSseBlock(
            'data: {"phase":"complete","content":"ignored","data":{"reply":"final answer"}}'
        ) as AgentStreamEvent
        expect(result.content).toBe('final answer')
    })

    it('falls back to parsed.content when phase is complete and data.reply is absent', () => {
        const result = parseSseBlock(
            'data: {"phase":"complete","content":"only content"}'
        ) as AgentStreamEvent
        expect(result.content).toBe('only content')
    })

    it('uses parsed.content by default when phase is not complete', () => {
        const result = parseSseBlock(
            'data: {"content":"direct content","message":"msg","data":{"reply":"reply"}}'
        ) as AgentStreamEvent
        expect(result.content).toBe('direct content')
    })

    it('falls back to parsed.message when parsed.content is absent', () => {
        const result = parseSseBlock(
            'data: {"message":"a message","data":{"reply":"reply"}}'
        ) as AgentStreamEvent
        expect(result.content).toBe('a message')
    })

    it('falls back to data.reply when content and message are both absent', () => {
        const result = parseSseBlock(
            'data: {"data":{"reply":"fallback reply"}}'
        ) as AgentStreamEvent
        expect(result.content).toBe('fallback reply')
    })

    it('leaves content undefined when nothing provides it', () => {
        const result = parseSseBlock('data: {}') as AgentStreamEvent
        expect(result.content).toBeUndefined()
    })

    it('reads output from parsed.output when present', () => {
        const result = parseSseBlock(
            'data: {"output":"direct-output","data":{"foo":"bar"}}'
        ) as AgentStreamEvent
        expect(result.output).toBe('direct-output')
    })

    it('falls back to parsed.data for output when parsed.output is absent', () => {
        const result = parseSseBlock(
            'data: {"data":{"foo":"bar"}}'
        ) as AgentStreamEvent
        expect(result.output).toEqual({ foo: 'bar' })
    })

    it('reads stage when it is a string', () => {
        const result = parseSseBlock(
            'data: {"stage":"start"}'
        ) as AgentStreamEvent
        expect(result.stage).toBe('start')
    })

    it('leaves stage undefined when it is not a string', () => {
        const result = parseSseBlock('data: {"stage":123}') as AgentStreamEvent
        expect(result.stage).toBeUndefined()
    })

    it('merges parsed.phase into metadata', () => {
        const result = parseSseBlock(
            'data: {"phase":"connected","metadata":{"foo":"bar"}}'
        ) as AgentStreamEvent
        expect(result.metadata).toEqual({ foo: 'bar', phase: 'connected' })
    })
})

describe('normalizeEventContent', () => {
    it('returns empty string for null', () => {
        expect(normalizeEventContent(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
        expect(normalizeEventContent(undefined)).toBe('')
    })

    it('trims plain strings', () => {
        expect(normalizeEventContent('  hello  ')).toBe('hello')
    })

    it('recurses into a nested "content" key of a JSON-object-looking string', () => {
        expect(normalizeEventContent('{"content":"inner"}')).toBe('inner')
    })

    it('recurses into a nested "text" key of a JSON-object-looking string', () => {
        expect(normalizeEventContent('{"text":"inner-text"}')).toBe(
            'inner-text'
        )
    })

    it('recurses into a nested "output" key of a JSON-object-looking string', () => {
        expect(normalizeEventContent('{"output":"inner-output"}')).toBe(
            'inner-output'
        )
    })

    it('returns the raw trimmed JSON text when no nested key matches', () => {
        const input = '{"foo":"bar"}'
        expect(normalizeEventContent(input)).toBe(input)
    })

    it('returns the trimmed text when the JSON-object-looking string fails to parse', () => {
        const input = '{"foo": invalid}'
        expect(normalizeEventContent(input)).toBe(input)
    })

    it('joins array items, filtering out falsy normalized results', () => {
        expect(normalizeEventContent(['a', '', 'b'])).toBe('ab')
    })

    it('reads the "content" key from an object', () => {
        expect(normalizeEventContent({ content: 'c' })).toBe('c')
    })

    it('reads the "text" key from an object when content is absent', () => {
        expect(normalizeEventContent({ text: 't' })).toBe('t')
    })

    it('reads the "output" key from an object when content/text are absent', () => {
        expect(normalizeEventContent({ output: 'o' })).toBe('o')
    })

    it('reads the "value" key from an object when earlier keys are absent', () => {
        expect(normalizeEventContent({ value: 'v' })).toBe('v')
    })

    it('reads the "message" key from an object when earlier keys are absent', () => {
        expect(normalizeEventContent({ message: 'm' })).toBe('m')
    })

    it('reads the "reply" key from an object when earlier keys are absent', () => {
        expect(normalizeEventContent({ reply: 'r' })).toBe('r')
    })

    it('returns empty string for an object with none of the known keys', () => {
        expect(normalizeEventContent({ foo: 'bar' })).toBe('')
    })

    it('stringifies non-string/object primitives', () => {
        expect(normalizeEventContent(42)).toBe('42')
        expect(normalizeEventContent(true)).toBe('true')
    })
})

describe('getToolEndPreviewText', () => {
    it('returns empty string when data is not an object', () => {
        expect(getToolEndPreviewText('a string')).toBe('')
        expect(getToolEndPreviewText(null)).toBe('')
    })

    it('returns empty string when output_preview is missing', () => {
        expect(getToolEndPreviewText({})).toBe('')
    })

    it('returns empty string when output_preview is explicitly null', () => {
        expect(getToolEndPreviewText({ output_preview: null })).toBe('')
    })

    it('returns empty string when the normalized preview is empty', () => {
        expect(getToolEndPreviewText({ output_preview: '   ' })).toBe('')
    })

    it("extracts the quoted content when the content='...' pattern matches", () => {
        const text = getToolEndPreviewText({
            output_preview: "ToolResult(content='hello world')"
        })
        expect(text).toBe('hello world')
    })

    it('uses the full normalized preview when the pattern does not match', () => {
        const text = getToolEndPreviewText({
            output_preview: 'plain preview text'
        })
        expect(text).toBe('plain preview text')
    })

    it('returns empty string when the matched candidate normalizes to empty', () => {
        const text = getToolEndPreviewText({
            output_preview: "ToolResult(content='   ')"
        })
        expect(text).toBe('')
    })

    it('collapses whitespace and truncates candidates longer than 160 characters', () => {
        const long = 'a'.repeat(200)
        const text = getToolEndPreviewText({ output_preview: long })
        expect(text).toBe(`${'a'.repeat(160)}...`)
    })

    it('does not truncate candidates at or under 160 characters', () => {
        const exact = 'b'.repeat(160)
        const text = getToolEndPreviewText({ output_preview: exact })
        expect(text).toBe(exact)
    })
})

describe('getEventLabel', () => {
    it('returns null for done', () => {
        expect(getEventLabel(ev({ type: 'done' }))).toBeNull()
    })

    it('returns null for response_end', () => {
        expect(getEventLabel(ev({ type: 'response_end' }))).toBeNull()
    })

    it('returns the working message for thinking with stage start', () => {
        expect(getEventLabel(ev({ type: 'thinking', stage: 'start' }))).toBe(
            'Working on your request...'
        )
    })

    it('reads the stage from metadata for thinking events', () => {
        expect(
            getEventLabel(
                ev({ type: 'thinking', metadata: { stage: 'start' } })
            )
        ).toBe('Working on your request...')
    })

    it('returns the preparing message for thinking with stage post_process_start', () => {
        expect(
            getEventLabel(ev({ type: 'thinking', stage: 'post_process_start' }))
        ).toBe('Preparing the final response...')
    })

    it('returns the formatting message for thinking with stage parse_json_response', () => {
        expect(
            getEventLabel(
                ev({ type: 'thinking', stage: 'parse_json_response' })
            )
        ).toBe('Formatting the response...')
    })

    it('returns normalized content for thinking with an unrecognized stage', () => {
        expect(
            getEventLabel(
                ev({ type: 'thinking', stage: 'other', content: 'a thought' })
            )
        ).toBe('a thought')
    })

    it('falls back to normalized output for thinking when content is absent', () => {
        expect(
            getEventLabel(ev({ type: 'thinking', output: 'an output' }))
        ).toBe('an output')
    })

    it('falls back to the default thinking message when content and output are absent', () => {
        expect(getEventLabel(ev({ type: 'thinking' }))).toBe('Thinking...')
    })

    it('returns the starting tool message for tool_start', () => {
        expect(getEventLabel(ev({ type: 'tool_start' }))).toBe(
            'Starting a tool call...'
        )
    })

    it('returns the finished tool message for tool_output', () => {
        expect(getEventLabel(ev({ type: 'tool_output' }))).toBe(
            'Tool call finished.'
        )
    })

    it('returns null for progress with phase connected', () => {
        expect(
            getEventLabel(ev({ type: 'progress', phase: 'connected' }))
        ).toBeNull()
    })

    it('returns the response received message for progress with phase tool_end', () => {
        expect(getEventLabel(ev({ type: 'progress', phase: 'tool_end' }))).toBe(
            'Response received.'
        )
    })

    it('returns normalized content for progress when present', () => {
        expect(
            getEventLabel(ev({ type: 'progress', content: 'progress info' }))
        ).toBe('progress info')
    })

    it('falls back to normalized output for progress when content is absent', () => {
        expect(
            getEventLabel(ev({ type: 'progress', output: 'progress output' }))
        ).toBe('progress output')
    })

    it('returns a phase-labeled message for progress with a phase but no content/output', () => {
        expect(getEventLabel(ev({ type: 'progress', phase: 'custom' }))).toBe(
            'Progress: custom'
        )
    })

    it('returns the generic progress message when there is no phase, content, or output', () => {
        expect(getEventLabel(ev({ type: 'progress' }))).toBe(
            'Making progress...'
        )
    })

    it('returns the working message for status with stage start', () => {
        expect(getEventLabel(ev({ type: 'status', stage: 'start' }))).toBe(
            'Working on your request...'
        )
    })

    it('returns the working message for status with stage connected', () => {
        expect(getEventLabel(ev({ type: 'status', stage: 'connected' }))).toBe(
            'Working on your request...'
        )
    })

    it('returns the preparing message for status with stage post_process_start', () => {
        expect(
            getEventLabel(ev({ type: 'status', stage: 'post_process_start' }))
        ).toBe('Preparing the final response...')
    })

    it('returns the formatting message for status with stage parse_json_response', () => {
        expect(
            getEventLabel(ev({ type: 'status', stage: 'parse_json_response' }))
        ).toBe('Formatting the response...')
    })

    it('returns normalized content for status when present', () => {
        expect(
            getEventLabel(ev({ type: 'status', content: 'status content' }))
        ).toBe('status content')
    })

    it('falls back to normalized output for status when content is absent', () => {
        expect(
            getEventLabel(ev({ type: 'status', output: 'status output' }))
        ).toBe('status output')
    })

    it('returns the default status message when nothing else applies', () => {
        expect(getEventLabel(ev({ type: 'status' }))).toBe(
            'Status update received...'
        )
    })

    it('returns a generic processing message for unknown types', () => {
        expect(getEventLabel(ev({ type: 'reshaping' }))).toBe(
            'Processing reshaping...'
        )
    })
})

describe('getEventDetail', () => {
    it('formats tool_start without content using the tool name', () => {
        expect(getEventDetail(ev({ type: 'tool_start', tool: 'search' }))).toBe(
            'Tool: search'
        )
    })

    it('formats tool_start without a tool name using the Unknown tool fallback', () => {
        expect(getEventDetail(ev({ type: 'tool_start' }))).toBe(
            'Tool: Unknown tool'
        )
    })

    it('appends normalized content for tool_start when present', () => {
        expect(
            getEventDetail(
                ev({ type: 'tool_start', tool: 'search', content: 'query' })
            )
        ).toBe('Tool: search\nquery')
    })

    it('formats tool_output without content or output using just the tool line', () => {
        expect(
            getEventDetail(ev({ type: 'tool_output', tool: 'search' }))
        ).toBe('Tool: search')
    })

    it('appends normalized content as the response for tool_output', () => {
        expect(
            getEventDetail(
                ev({ type: 'tool_output', tool: 'search', content: 'result' })
            )
        ).toBe('Tool: search\nResponse: result')
    })

    it('falls back to normalized output as the response for tool_output', () => {
        expect(
            getEventDetail(
                ev({ type: 'tool_output', tool: 'search', output: 'out' })
            )
        ).toBe('Tool: search\nResponse: out')
    })

    it('includes the tool name with preview text for progress tool_end', () => {
        expect(
            getEventDetail(
                ev({
                    type: 'progress',
                    phase: 'tool_end',
                    tool: 'search',
                    data: { output_preview: 'preview text' }
                })
            )
        ).toBe('Tool: search\npreview text')
    })

    it('omits the tool line when there is no tool name for progress tool_end', () => {
        expect(
            getEventDetail(
                ev({
                    type: 'progress',
                    phase: 'tool_end',
                    data: { output_preview: 'preview text' }
                })
            )
        ).toBe('preview text')
    })

    it('falls through past tool_end when there is no preview text', () => {
        expect(
            getEventDetail(
                ev({
                    type: 'progress',
                    phase: 'tool_end',
                    content: 'fallback content',
                    data: {}
                })
            )
        ).toBe('fallback content')
    })

    it('returns normalized content when present for other event shapes', () => {
        expect(
            getEventDetail(ev({ type: 'status', content: 'the content' }))
        ).toBe('the content')
    })

    it('falls back to normalized output when content is absent', () => {
        expect(
            getEventDetail(ev({ type: 'status', output: 'the output' }))
        ).toBe('the output')
    })

    it('falls back to the raw message when content and output are absent', () => {
        expect(
            getEventDetail(ev({ type: 'status', message: 'the message' }))
        ).toBe('the message')
    })

    it('falls back to JSON.stringify(data) when nothing else is available', () => {
        expect(getEventDetail(ev({ type: 'status', data: { a: 1 } }))).toBe(
            '{"a":1}'
        )
    })

    it('falls back to the default message when JSON.stringify throws on circular data', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const circular: any = {}
        circular.self = circular

        expect(getEventDetail(ev({ type: 'status', data: circular }))).toBe(
            'No additional details available.'
        )
        expect(warnSpy).toHaveBeenCalled()
        warnSpy.mockRestore()
    })

    it('returns the default message when there is nothing to show at all', () => {
        expect(getEventDetail(ev({ type: 'status' }))).toBe(
            'No additional details available.'
        )
    })
})
