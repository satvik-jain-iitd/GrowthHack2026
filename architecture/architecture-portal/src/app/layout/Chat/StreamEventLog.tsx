'use client'

import { JSX } from 'react'
import { Accordion, Box, Text } from '@chakra-ui/react'
import { IconInfo } from '@americanexpress/dls-icons'
import { Tooltip } from '@/components/ui'
import { StreamEventLine } from './types'

// Flip this to 'hide' to make the event trace disappear entirely once the
// final answer is ready, instead of collapsing into an accordion.
const EVENT_LOG_MODE: 'collapse' | 'hide' = 'collapse'

const EVENT_TYPE_DISPLAY_NAMES: Record<string, string> = {
    thinking: 'Thinking',
    tool_start: 'Tool',
    tool_output: 'Tool',
    progress: 'Progress',
    status: 'Status',
    reshaping: 'Refining',
    found: 'Found',
    filtering: 'Filtering'
}

function getEventTypeDisplayName(type: string): string {
    if (EVENT_TYPE_DISPLAY_NAMES[type]) return EVENT_TYPE_DISPLAY_NAMES[type]

    return type
        .split('_')
        .filter(Boolean)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ')
}

type StreamEventLogProps = {
    events: StreamEventLine[]
    isAnswerReady: boolean
}

function EventLines({ events }: { events: StreamEventLine[] }): JSX.Element {
    return (
        <Box display='flex' flexDirection='column' gap='4px'>
            {events.map((line, i) => (
                <Box
                    key={i}
                    display='flex'
                    alignItems='center'
                    gap='6px'
                    fontSize='12px'
                    color='fg.muted'
                >
                    <Text
                        as='span'
                        fontWeight='600'
                        textTransform='uppercase'
                        fontSize='10px'
                        letterSpacing='0.02em'
                        flexShrink={0}
                    >
                        {getEventTypeDisplayName(line.type)}
                    </Text>
                    <Text as='span' overflowWrap='anywhere'>
                        {line.label}
                    </Text>
                    <Tooltip
                        showArrow
                        content={line.detail}
                        positionerProps={{ zIndex: 50010 }}
                    >
                        <IconInfo
                            style={{
                                cursor: 'pointer',
                                width: '12px',
                                height: '12px',
                                flexShrink: 0,
                                color: 'var(--chakra-colors-text-subtle)'
                            }}
                        />
                    </Tooltip>
                </Box>
            ))}
        </Box>
    )
}

export default function StreamEventLog({
    events,
    isAnswerReady
}: StreamEventLogProps): JSX.Element | null {
    if (events.length === 0) return null

    if (!isAnswerReady) {
        return <EventLines events={events} />
    }

    if (EVENT_LOG_MODE === 'hide') return null

    return (
        <Accordion.Root
            collapsible
            mb='10px'
            fontSize='12px'
            borderBottomWidth='1px'
            borderBottomStyle='solid'
            borderBottomColor='border.subtle'
            pb='8px'
        >
            <Accordion.Item value='steps' border='none'>
                <Accordion.ItemTrigger
                    display='inline-flex'
                    alignItems='center'
                    gap='4px'
                    padding='2px 0'
                    cursor='pointer'
                    fontSize='12px'
                    fontWeight='600'
                    color='fg.muted'
                    letterSpacing='0.02em'
                    textTransform='uppercase'
                    _hover={{ color: 'text.link' }}
                >
                    {events.length} step{events.length !== 1 ? 's' : ''}
                    <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Box mt='6px'>
                        <EventLines events={events} />
                    </Box>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}
