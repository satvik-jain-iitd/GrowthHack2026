'use client'

import { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { getPilotGroupId } from '@/constants/pilotGroups'
import { useUserContext } from '@/context'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import { usePilotGroup } from '@/hooks'
import ChatToggleButton from './ChatToggleButton'
import ChatHeader from './ChatHeader'
import ChatDisclaimer from './ChatDisclaimer'
import ChatMessageList from './ChatMessageList'
import ChatInputBar from './ChatInputBar'
import {
    parseSseBlock,
    normalizeEventContent,
    getEventLabel,
    getEventDetail,
    getStatusPhase,
    STATUS_PHRASES
} from './chatStream'
import { ChatMessage, StreamEventLine, StatusPhase } from './types'
import { logChatEvent } from './chatLogger'
import styles from './Chat.module.scss'
import { fetchWithToken } from '@/utils/client'
import { API_ENDPOINTS } from '@/constants'

export default function Chat(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [input, setInput] = useState('')
    const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(
        null
    )
    const [scrollTrigger, setScrollTrigger] = useState(0)

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            sender: 'bot',
            text: 'Hi! This is your Virtual Assistant. How can I help you today?'
        }
    ])

    const chatIcons = '/femalbot2.svg'
    const iconSrc = chatIcons

    const [loading, setLoading] = useState(false)

    const user = useUserContext()

    const email = user?.attributes?.email ?? ''
    const pilotChatGroupId = getPilotGroupId('PILOT_CHAT_GROUP')

    const { pilotGroup: pilotChatGroup } = usePilotGroup(pilotChatGroupId)

    const normalizedPilotChatMembers =
        pilotChatGroup?.members?.map(member => member.toLowerCase()) ?? []

    const { avatarUrl: userAvatarUrl } = useUserAvatar(email)

    const botAvatarSrc = iconSrc

    // Ref to the scrollable messages container for auto-scrolling
    const chatRef = useRef<HTMLDivElement | null>(null)
    const chatSessionIdRef = useRef<string>(
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    )
    const isProcessingRef = useRef(false)
    const disclaimerButtonRef = useRef<HTMLButtonElement | null>(null)
    const openedAtRef = useRef<number | null>(null)
    const questionCountRef = useRef(0)

    const [isProcessing, setIsProcessing] = useState(false)
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
    const isChatBusy = isProcessing || loading
    const statusPhaseRef = useRef<StatusPhase | null>(null)
    const statusPhraseIndexRef = useRef(0)

    useLayoutEffect(() => {
        const el = chatRef.current
        if (el) {
            // Ensure the scroll happens after the DOM is updated
            setTimeout(() => {
                el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
            }, 0)
        }
    }, [scrollTrigger])

    useEffect(() => {
        if (!isOpen) return

        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key !== 'Escape') return

            if (isExpanded) {
                setIsExpanded(false)
                return
            }

            handleClose()
        }

        window.addEventListener('keydown', handleEscape)
        return () => {
            window.removeEventListener('keydown', handleEscape)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded, isOpen])

    useEffect(() => {
        if (!isOpen || disclaimerAccepted) return

        disclaimerButtonRef.current?.focus()
    }, [isOpen, disclaimerAccepted])

    useEffect(() => {
        if (copiedMessageIndex === null) return

        const timer = window.setTimeout(() => {
            setCopiedMessageIndex(null)
        }, 1500)

        return () => {
            window.clearTimeout(timer)
        }
    }, [copiedMessageIndex])

    const handleOpen = (): void => {
        openedAtRef.current = performance.now()
        questionCountRef.current = 0
        setIsOpen(true)
        logChatEvent({
            event: 'session_start',
            sessionId: chatSessionIdRef.current,
            userEmail: email,
            userName: user?.attributes?.fullName
        })
    }

    const handleClose = (): void => {
        setIsExpanded(false)
        setIsOpen(false)

        const durationMs = openedAtRef.current
            ? performance.now() - openedAtRef.current
            : undefined
        logChatEvent({
            event: 'session_end',
            sessionId: chatSessionIdRef.current,
            userEmail: email,
            userName: user?.attributes?.fullName,
            durationMs,
            questionCount: questionCountRef.current
        })
        openedAtRef.current = null
    }

    const handleCopyMessage = async (
        message: string,
        index: number
    ): Promise<void> => {
        if (!message.trim()) return

        try {
            await navigator.clipboard.writeText(message)
            setCopiedMessageIndex(index)
        } catch (error) {
            console.error('Failed to copy chat message.', error)
        }
    }

    const updateBotMessage = (
        index: number,
        updater: (message: ChatMessage) => ChatMessage
    ): void => {
        setMessages(prev => {
            if (index < 0 || index >= prev.length) return prev

            const next = [...prev]
            next[index] = updater(next[index])
            return next
        })
    }

    const appendStreamEvent = (index: number, line: StreamEventLine): void => {
        updateBotMessage(index, message => ({
            ...message,
            streamEvents: [...(message.streamEvents ?? []), line]
        }))
    }

    const setStatusText = (index: number, text: string | undefined): void => {
        updateBotMessage(index, message => ({
            ...message,
            statusText: text
        }))
    }

    const handleSend = async (): Promise<void> => {
        if (isProcessingRef.current || loading) return

        const val = input.trim()
        if (!val) return

        const questionSeq = ++questionCountRef.current
        logChatEvent({
            event: 'question_asked',
            sessionId: chatSessionIdRef.current,
            userEmail: email,
            userName: user?.attributes?.fullName,
            messageIndex: questionSeq,
            question: val
        })

        isProcessingRef.current = true
        setIsProcessing(true)

        // Append user message
        setMessages(prev => [...prev, { sender: 'user', text: val }])
        setInput('')

        // bot typing bubble (use typing flag)
        const typingIndex = messages.length + 1
        setMessages(prev => [
            ...prev,
            // typing bubble uses empty text and typing: true
            { sender: 'bot', text: '', typing: true }
        ])
        setScrollTrigger(n => n + 1)

        let statusInterval: number | null = null

        const rotateStatus = (phase: StatusPhase): void => {
            if (statusPhaseRef.current === phase && statusInterval !== null) {
                return
            }

            statusPhaseRef.current = phase
            statusPhraseIndexRef.current = 0

            if (statusInterval !== null) {
                window.clearInterval(statusInterval)
                statusInterval = null
            }

            const phrases = STATUS_PHRASES[phase]
            setStatusText(typingIndex, phrases[0])

            statusInterval = window.setInterval(() => {
                statusPhraseIndexRef.current =
                    (statusPhraseIndexRef.current + 1) % phrases.length
                setStatusText(
                    typingIndex,
                    phrases[statusPhraseIndexRef.current]
                )
            }, 2500)
        }

        try {
            setLoading(true)
            const response = await fetchWithToken(API_ENDPOINTS.GET_AGENT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: val,
                    session_id: chatSessionIdRef.current,
                    email: email
                })
            })

            if (!response.ok) {
                throw new Error('Failed to fetch from the chat service.')
            }

            if (!response.body) {
                throw new Error('Streaming is not supported by this browser.')
            }

            rotateStatus('starting')

            let finalReply = ''

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            const streamStart = performance.now()
            let streamDurationMs = 0

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    streamDurationMs = performance.now() - streamStart
                    console.log(
                        `Stream duration: ${streamDurationMs.toFixed(0)}ms (${(streamDurationMs / 1000).toFixed(2)}s)`
                    )
                    updateBotMessage(typingIndex, message => ({
                        ...message,
                        durationMs: streamDurationMs
                    }))
                    break
                }

                buffer += decoder.decode(value, { stream: true })
                const chunks = buffer.split('\n\n')
                buffer = chunks.pop() ?? ''

                for (const chunk of chunks) {
                    const event = parseSseBlock(chunk)
                    if (!event || event === '[DONE]') continue

                    if (event.type === 'error') {
                        const errorContent = normalizeEventContent(
                            event.content
                        )
                        throw new Error(
                            errorContent || 'Failed to reach the chat service.'
                        )
                    }

                    if (event.type === 'response_chunk') {
                        if (statusInterval !== null) {
                            window.clearInterval(statusInterval)
                            statusInterval = null
                        }
                        setStatusText(typingIndex, undefined)

                        finalReply =
                            normalizeEventContent(event.content) || finalReply
                        updateBotMessage(typingIndex, message => ({
                            ...message,
                            sender: 'bot',
                            text: finalReply,
                            typing: false,
                            sources: []
                        }))
                        continue
                    }

                    if (event.type === 'final') {
                        if (statusInterval !== null) {
                            window.clearInterval(statusInterval)
                            statusInterval = null
                        }
                        setStatusText(typingIndex, undefined)

                        finalReply =
                            normalizeEventContent(event.content) || finalReply
                        updateBotMessage(typingIndex, message => ({
                            ...message,
                            sender: 'bot',
                            text: finalReply,
                            typing: false,
                            sources: []
                        }))
                        continue
                    }

                    if (event.type === 'response_end') {
                        continue
                    }

                    const statusPhase = getStatusPhase(event)
                    if (statusPhase) rotateStatus(statusPhase)

                    const label = getEventLabel(event)
                    if (!label) continue

                    appendStreamEvent(typingIndex, {
                        type: event.type,
                        label,
                        detail: getEventDetail(event)
                    })
                }
            }

            if (!finalReply) {
                throw new Error('Unexpected response from the chat service.')
            }

            logChatEvent({
                event: 'answer_received',
                sessionId: chatSessionIdRef.current,
                userEmail: email,
                userName: user?.attributes?.fullName,
                messageIndex: questionSeq,
                question: val,
                answer: finalReply,
                durationMs: streamDurationMs
            })
            setScrollTrigger(n => n + 1)

            if (statusInterval !== null) {
                window.clearInterval(statusInterval)
                statusInterval = null
            }
        } catch (error) {
            const errorText =
                error instanceof Error
                    ? error.message
                    : 'Failed to reach the chat service.'

            logChatEvent({
                event: 'error',
                sessionId: chatSessionIdRef.current,
                userEmail: email,
                userName: user?.attributes?.fullName,
                messageIndex: questionSeq,
                question: val,
                errorMessage: errorText
            })

            // Replace typing bubble with an error message
            setMessages(prev => {
                const next = [...prev]
                next[typingIndex] = {
                    sender: 'bot',
                    text: errorText
                }
                return next
            })
            setScrollTrigger(n => n + 1)
        } finally {
            if (statusInterval !== null) {
                window.clearInterval(statusInterval)
            }
            setLoading(false)
            isProcessingRef.current = false
            setIsProcessing(false)
        }
    }

    if (!normalizedPilotChatMembers.includes(email.toLowerCase())) return <></>

    return (
        <Box
            className={styles.container}
            aria-live='polite'
            position='fixed'
            bottom='30px'
            right='30px'
            zIndex={10002}
            display='flex'
            flexDirection='column'
            alignItems='center'
            fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        >
            <ChatToggleButton
                iconSrc={iconSrc}
                isOpen={isOpen}
                onToggle={() => (isOpen ? handleClose() : handleOpen())}
            />

            {/* Overlay */}
            <Box
                as='div'
                position='fixed'
                inset={0}
                bg='rgba(0, 0, 0, 0.5)'
                zIndex={10000}
                opacity={isOpen ? 1 : 0}
                pointerEvents={isOpen ? 'auto' : 'none'}
                transition='opacity 0.28s ease'
                onClick={handleClose}
            />

            {/* Widget */}
            {isOpen && (
                <Box
                    id='chat-widget'
                    role='dialog'
                    aria-modal='true'
                    className={`${styles.widget}${isExpanded ? ` ${styles.widgetExpanded}` : ''}`}
                    position='fixed'
                    top={isExpanded ? '50%' : undefined}
                    left={isExpanded ? '50%' : undefined}
                    bottom={isExpanded ? undefined : '30px'}
                    right={isExpanded ? undefined : '30px'}
                    width={
                        isExpanded ? '75vw' : 'min(460px, calc(100vw - 24px))'
                    }
                    maxW={isExpanded ? '3xl' : undefined}
                    height={
                        isExpanded ? '90vh' : 'min(820px, calc(100vh - 120px))'
                    }
                    maxWidth={isExpanded ? 'none' : undefined}
                    maxHeight={isExpanded ? 'none' : undefined}
                    backdropFilter='blur(24px)'
                    borderRadius={isExpanded ? '14px' : '12px'}
                    boxShadow='0 12px 30px rgba(0, 0, 0, 0.4)'
                    overflow='auto'
                    marginTop={isExpanded ? undefined : '1rem'}
                    zIndex={10001}
                    opacity={isOpen ? 1 : 0}
                    transform={
                        isExpanded
                            ? 'translate(-50%, -50%)'
                            : isOpen
                              ? 'translateY(0)'
                              : 'translateY(12px) scale(0.995)'
                    }
                    pointerEvents={isOpen ? 'auto' : 'none'}
                    transition='opacity 0.28s ease, transform 0.28s ease'
                    display='flex'
                    flexDirection='column'
                    bg='bg.subtle'
                    _dark={{ boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)' }}
                >
                    <ChatHeader
                        iconSrc={iconSrc}
                        isExpanded={isExpanded}
                        onToggleExpand={() => setIsExpanded(v => !v)}
                        onClose={handleClose}
                    />

                    {/* Body: messages + input, with disclaimer overlay */}
                    <Box
                        position='relative'
                        flex='1'
                        display='flex'
                        flexDirection='column'
                        minHeight={0}
                        overflow='hidden'
                    >
                        <ChatDisclaimer
                            visible={!disclaimerAccepted}
                            onAccept={() => setDisclaimerAccepted(true)}
                            buttonRef={disclaimerButtonRef}
                        />

                        <ChatMessageList
                            ref={chatRef}
                            messages={messages}
                            isChatBusy={isChatBusy}
                            disclaimerAccepted={disclaimerAccepted}
                            botAvatarSrc={botAvatarSrc}
                            userAvatarUrl={userAvatarUrl}
                            userFullName={user?.attributes?.fullName}
                            copiedMessageIndex={copiedMessageIndex}
                            onCopyMessage={(text, index) => {
                                void handleCopyMessage(text, index)
                            }}
                        />

                        <ChatInputBar
                            value={input}
                            onChange={setInput}
                            onSend={() => {
                                void handleSend()
                            }}
                            disabled={isChatBusy || !disclaimerAccepted}
                            disclaimerAccepted={disclaimerAccepted}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    )
}
