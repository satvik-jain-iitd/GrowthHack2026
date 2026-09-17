'use client'

import { Box, Image, Text } from '@chakra-ui/react'
import styles from './Chat.module.scss'

type ChatToggleButtonProps = {
    iconSrc: string
    isOpen: boolean
    onToggle: () => void
}

export default function ChatToggleButton({
    iconSrc,
    isOpen,
    onToggle
}: ChatToggleButtonProps) {
    return (
        <Box
            as='button'
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls='chat-widget'
            className={`group ${styles.toggle}`}
            width='60px'
            height='60px'
            bg='transparent'
            borderRadius='full'
            border='none'
            cursor='pointer'
            boxShadow='0 6px 20px rgba(0, 0, 0, 0.25)'
            transition='transform 0.2s ease, box-shadow 0.2s ease'
            _hover={{
                bg: 'transparent',
                transform: 'scale(1.12)',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.3)'
            }}
            _dark={{ bg: 'transparent', border: 'none', boxShadow: 'none' }}
        >
            <Image
                src={iconSrc}
                alt='Open chat'
                width='100%'
                height='100%'
                objectFit='cover'
                display='block'
            />
            <Text
                as='span'
                position='absolute'
                top='50%'
                right='calc(100% + 14px)'
                transform='translateY(-50%) translateX(6px)'
                bg='whitesmoke'
                color='#111827'
                px='0.9rem'
                py='0.45rem'
                borderRadius='8px'
                fontSize='0.82rem'
                fontWeight='500'
                letterSpacing='0.01em'
                whiteSpace='nowrap'
                boxShadow='0 4px 14px rgba(0, 0, 0, 0.25)'
                pointerEvents='none'
                visibility='hidden'
                opacity={0}
                transition='opacity 0.22s ease, visibility 0.22s ease, transform 0.22s ease'
                _groupHover={{
                    visibility: 'visible',
                    opacity: 1,
                    transform: 'translateY(-50%) translateX(0)'
                }}
                _after={{
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    right: '-7px',
                    transform: 'translateY(-50%)',
                    borderWidth: '6px 0 6px 7px',
                    borderStyle: 'solid',
                    borderColor: 'transparent transparent transparent #1a1a2e'
                }}
                _dark={{
                    bg: 'surface.foreground',
                    color: 'text.regular',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
                    _after: {
                        borderColor:
                            'transparent transparent transparent var(--chakra-colors-surface-foreground)'
                    }
                }}
            >
                Hi! Can I help you with anything?
            </Text>
        </Box>
    )
}
