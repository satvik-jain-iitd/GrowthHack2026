'use client'

import { RefObject } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { IconAlert } from '@americanexpress/dls-icons'

type ChatDisclaimerProps = {
    visible: boolean
    onAccept: () => void
    buttonRef: RefObject<HTMLButtonElement | null>
}

export default function ChatDisclaimer({
    visible,
    onAccept,
    buttonRef
}: ChatDisclaimerProps) {
    return (
        <Box
            position='absolute'
            inset={0}
            zIndex={5}
            display='flex'
            alignItems='center'
            justifyContent='center'
            padding='20px'
            bg='rgba(15, 23, 42, 0.55)'
            backdropFilter='blur(3px)'
            opacity={visible ? 1 : 0}
            visibility={visible ? 'visible' : 'hidden'}
            pointerEvents={visible ? 'auto' : 'none'}
            transition='opacity 0.25s ease, visibility 0.25s ease'
            _dark={{ bg: 'rgba(2, 6, 23, 0.72)' }}
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='chat-disclaimer-title'
        >
            <Box
                maxWidth='320px'
                width='100%'
                bg='status.cautionSubtle'
                border='1px solid'
                borderColor='status.caution'
                borderRadius='14px'
                padding='20px 22px'
                boxShadow='0 20px 45px rgba(0, 0, 0, 0.3)'
                display='flex'
                flexDirection='column'
                gap='10px'
                transform={visible ? 'scale(1)' : 'scale(0.94)'}
                transition='transform 0.25s ease'
                _dark={{ boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)' }}
            >
                <Box
                    gap='6px'
                    display='flex'
                    alignItems='center'
                    id='chat-disclaimer-title'
                    fontSize='0.82rem'
                    fontWeight='700'
                    color='status.caution'
                    letterSpacing='0.01em'
                >
                    <IconAlert size='md' color='caution' />
                    Before you start
                </Box>
                <Text fontSize='0.78rem' color='text.regular' lineHeight='1.55'>
                    This assistant uses AI and may occasionally produce
                    inaccurate results. Always verify critical information from
                    authoritative sources.
                </Text>
                <Button
                    ref={buttonRef}
                    onClick={onAccept}
                    alignSelf='stretch'
                    bg='interactive.primary.default'
                    border='none'
                    color='#fff'
                    fontSize='0.78rem'
                    fontWeight='600'
                    padding='8px 18px'
                    height='auto'
                    borderRadius='8px'
                    cursor='pointer'
                    textAlign='center'
                    transition='background 0.18s ease, box-shadow 0.18s ease'
                    boxShadow='0 1px 6px rgba(26, 86, 219, 0.2)'
                    _hover={{
                        bg: 'interactive.primary.hover',
                        boxShadow: '0 3px 12px rgba(26, 86, 219, 0.35)'
                    }}
                    aria-label='Accept disclaimer and start chatting'
                >
                    ✓ I UNDERSTAND, LET&apos;S START
                </Button>
            </Box>
        </Box>
    )
}
