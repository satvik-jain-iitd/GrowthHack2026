'use client'

import { forwardRef } from 'react'
import { Box } from '@chakra-ui/react'
import ChatMessageBubble from './ChatMessageBubble'
import { ChatMessage } from './types'

type ChatMessageListProps = {
    messages: ChatMessage[]
    isChatBusy: boolean
    disclaimerAccepted: boolean
    botAvatarSrc: string
    userAvatarUrl?: string | null
    userFullName?: string
    copiedMessageIndex: number | null
    onCopyMessage: (text: string, index: number) => void
}

const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
    function ChatMessageList(
        {
            messages,
            isChatBusy,
            disclaimerAccepted,
            botAvatarSrc,
            userAvatarUrl,
            userFullName,
            copiedMessageIndex,
            onCopyMessage
        },
        ref
    ) {
        return (
            <Box
                ref={ref}
                aria-hidden={!disclaimerAccepted}
                flex='1'
                padding='1rem 1.25rem'
                overflowY='auto'
                bg={{ base: '#f9f9f9', _dark: 'bg.muted' }}
                gap='0.75rem'
                display='flex'
                flexDirection='column'
                boxShadow='inset 0 0 10px rgba(0, 0, 0, 0.1)'
                fontSize='1em'
                fontFamily='sans-serif'
                css={{
                    scrollbarWidth: 'thin',
                    scrollbarColor:
                        'var(--chakra-colors-border-regular) transparent'
                }}
            >
                {messages.map((message, idx) => (
                    <ChatMessageBubble
                        key={idx}
                        message={message}
                        index={idx}
                        isLast={idx === messages.length - 1}
                        isChatBusy={isChatBusy}
                        botAvatarSrc={botAvatarSrc}
                        userAvatarUrl={userAvatarUrl}
                        userFullName={userFullName}
                        isCopied={copiedMessageIndex === idx}
                        onCopy={onCopyMessage}
                    />
                ))}
            </Box>
        )
    }
)

export default ChatMessageList
