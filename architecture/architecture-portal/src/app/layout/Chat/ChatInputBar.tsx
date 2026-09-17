'use client'

import { Box, IconButton, Textarea, VisuallyHidden } from '@chakra-ui/react'

type ChatInputBarProps = {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    disabled: boolean
    disclaimerAccepted: boolean
}

export default function ChatInputBar({
    value,
    onChange,
    onSend,
    disabled,
    disclaimerAccepted
}: ChatInputBarProps) {
    return (
        <Box
            display='flex'
            gap='8px'
            padding='10px'
            borderTopWidth='1px'
            borderTopStyle='solid'
            borderTopColor='border.subtle'
            alignItems='center'
            aria-hidden={!disclaimerAccepted}
        >
            <VisuallyHidden>
                <label htmlFor='chat-input'>Chat input</label>
            </VisuallyHidden>

            <Textarea
                id='chat-input'
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter' && !disabled) {
                        onSend()
                    }
                }}
                placeholder='Type your question...'
                disabled={disabled}
                flex='1 1 auto'
                padding='8px 10px'
                borderRadius='8px'
                border='1px solid #ddd'
                fontSize='14px'
                bg='transparent'
                whiteSpace='pre-wrap'
                overflowY='auto'
                maxH='150px'
                resize='none'
                _focus={{
                    outline: '2px solid rgba(11, 116, 222, 0.18)',
                    borderColor: '#0b74de'
                }}
                _dark={{
                    bg: 'surface.foregroundSubtle',
                    borderColor: 'border.subtle',
                    color: 'text.regular'
                }}
            />

            <IconButton
                onClick={onSend}
                aria-label='Send message'
                disabled={disabled}
                width='44px'
                height='44px'
                borderRadius='8px'
                border='none'
                bg='interactive.primary.default'
                color='white'
                fontSize='18px'
                cursor='pointer'
                _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
                _hover={{ bg: 'interactive.primary.hover' }}
            >
                →
            </IconButton>
        </Box>
    )
}
