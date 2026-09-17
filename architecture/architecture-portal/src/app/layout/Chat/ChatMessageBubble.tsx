'use client'

import { JSX, useMemo } from 'react'
import { Avatar, Box, IconButton, Image, Link, Text } from '@chakra-ui/react'
import { IconCheck, IconCopy } from '@americanexpress/dls-icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SourcesSection from './SourcesSection'
import StreamEventLog from './StreamEventLog'
import ChatMermaidDiagram from './ChatMermaidDiagram'
import ChatTableDialog from './ChatTableDialog'
import { ChatMessage } from './types'
import styles from './Chat.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const linkComponent = ({ href, children, ...props }: any) => (
    // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
    <Link
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={styles.inlineLink}
        {...props}
    >
        {children}
    </Link>
)

function buildMarkdownComponents(ready: boolean) {
    return {
        a: linkComponent,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pre: ({ children }: any) => {
            const codeChild = children?.props
            const className = codeChild?.className
            const language = className?.replace('language-', '')?.toLowerCase()
            if (language === 'mermaid') {
                const codeText =
                    typeof codeChild?.children === 'string'
                        ? codeChild.children.trim()
                        : ''
                return ready ? (
                    <ChatMermaidDiagram code={codeText} />
                ) : (
                    <div className='mermaid'>{codeText}</div>
                )
            }
            return <pre>{children}</pre>
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table: ({ children }: any) => (
            <ChatTableDialog>{children}</ChatTableDialog>
        )
    }
}

function TypingDots(): JSX.Element {
    return (
        <Box
            as='span'
            display='inline-flex'
            gap='6px'
            alignItems='center'
            height='1em'
            verticalAlign='middle'
            aria-hidden='true'
        >
            {[0, 1, 2].map(i => (
                <Box
                    key={i}
                    as='span'
                    className={styles.typingDot}
                    width='6px'
                    height='6px'
                    borderRadius='full'
                    bg='currentColor'
                />
            ))}
        </Box>
    )
}

type ChatMessageBubbleProps = {
    message: ChatMessage
    index: number
    isLast: boolean
    isChatBusy: boolean
    botAvatarSrc: string
    userAvatarUrl?: string | null
    userFullName?: string
    isCopied: boolean
    onCopy: (text: string, index: number) => void
}

export default function ChatMessageBubble({
    message,
    index,
    isLast,
    isChatBusy,
    botAvatarSrc,
    userAvatarUrl,
    userFullName,
    isCopied,
    onCopy
}: ChatMessageBubbleProps): JSX.Element {
    const isBot = message.sender === 'bot'
    const ready = typeof message.durationMs === 'number'
    const markdownComponents = useMemo(
        () => buildMarkdownComponents(ready),
        [ready]
    )

    return (
        <Box
            className='group'
            display='flex'
            alignItems='flex-end'
            gap='8px'
            margin='0.4rem 0'
            justifyContent={isBot ? 'flex-start' : 'flex-end'}
        >
            {isBot && (
                <Image
                    src={botAvatarSrc}
                    alt='assistant'
                    width='30px'
                    height='30px'
                    minW='30px'
                    borderRadius='full'
                    objectFit='cover'
                    flexShrink={0}
                    boxShadow='0 2px 6px rgba(0, 0, 0, 0.15)'
                />
            )}
            <Box
                className={isBot ? styles.botBubble : undefined}
                position='relative'
                maxWidth='75%'
                padding='0.6rem 1rem'
                borderRadius={
                    isBot ? '25px 25px 25px 1px' : '25px 25px 1px 25px'
                }
                fontSize='0.95rem'
                lineHeight='1.4'
                boxShadow='0 2px 6px rgba(0, 0, 0, 0.1)'
                bg={isBot ? 'gainsboro' : 'interactive.primary.default'}
                color={isBot ? undefined : 'white'}
                marginLeft={isBot ? '12px' : 'auto'}
                marginRight={isBot ? 'auto' : '12px'}
                _dark={
                    isBot
                        ? { bg: 'surface.foreground', color: 'text.regular' }
                        : undefined
                }
            >
                {isBot && (
                    <StreamEventLog
                        events={message.streamEvents ?? []}
                        isAnswerReady={!message.typing && !!message.text.trim()}
                    />
                )}
                {message.typing ? (
                    <Box display='flex' flexDirection='column' gap='4px'>
                        <Text whiteSpace='pre-wrap'>
                            <TypingDots />
                        </Text>
                        {message.statusText && (
                            <Text
                                key={message.statusText}
                                fontSize='11px'
                                color='fg.muted'
                                className={styles.statusText}
                            >
                                {message.statusText}
                            </Text>
                        )}
                    </Box>
                ) : isBot ? (
                    <Box
                        className={styles.markdownContent}
                        whiteSpace='normal'
                        overflowWrap='anywhere'
                        wordBreak='break-word'
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {message.text}
                        </ReactMarkdown>
                        {typeof message.durationMs === 'number' && (
                            <Text fontSize='xs' color='fg.muted' mt={1}>
                                Responded in{' '}
                                {(message.durationMs / 1000).toFixed(2)}s
                            </Text>
                        )}
                        {isChatBusy && isLast && (
                            <Text ml={2} whiteSpace='pre-wrap'>
                                <TypingDots />
                            </Text>
                        )}
                    </Box>
                ) : (
                    <Text whiteSpace='pre-wrap'>{message.text}</Text>
                )}
                {(message.sources?.length ?? 0) > 0 && (
                    <SourcesSection sources={message.sources!} />
                )}
                {isBot && !message.typing && !!message.text.trim() && (
                    <IconButton
                        onClick={() => {
                            void onCopy(message.text, index)
                        }}
                        aria-label='Copy bot response'
                        position='absolute'
                        top='50%'
                        right='-34px'
                        transform='translateY(-50%) scale(0.9)'
                        minW='28px'
                        width='28px'
                        height='28px'
                        padding={0}
                        borderRadius='full'
                        border='1px solid'
                        borderColor='border.subtle'
                        bg='surface.foreground'
                        color='text.subtle'
                        cursor='pointer'
                        flexShrink={0}
                        opacity={0}
                        pointerEvents='none'
                        transition='opacity 0.18s ease, transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease'
                        _groupHover={{
                            opacity: 1,
                            pointerEvents: 'auto',
                            transform: 'translateY(-50%) scale(1)'
                        }}
                        _focusVisible={{
                            opacity: 1,
                            pointerEvents: 'auto',
                            transform: 'translateY(-50%) scale(1)',
                            bg: 'interactive.tertiaryGray.hover',
                            borderColor: 'border.brand',
                            color: 'text.link'
                        }}
                        _hover={{
                            bg: 'interactive.tertiaryGray.hover',
                            borderColor: 'border.brand',
                            color: 'text.link'
                        }}
                    >
                        {isCopied ? (
                            <IconCheck size='xs' />
                        ) : (
                            <IconCopy size='xs' />
                        )}
                    </IconButton>
                )}
            </Box>
            {!isBot && (
                <Avatar.Root
                    width='30px'
                    height='30px'
                    minW='30px'
                    borderRadius='full'
                    boxShadow='0 2px 6px rgba(0, 0, 0, 0.15)'
                >
                    <Avatar.Image
                        src={userAvatarUrl ?? undefined}
                        alt={userFullName ?? 'You'}
                    />
                    <Avatar.Fallback>
                        {userFullName
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase() ?? 'U'}
                    </Avatar.Fallback>
                </Avatar.Root>
            )}
        </Box>
    )
}
