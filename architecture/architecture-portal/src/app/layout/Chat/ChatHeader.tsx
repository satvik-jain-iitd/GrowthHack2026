'use client'

import { IconClose, IconCollapse, IconExpand } from '@americanexpress/dls-icons'
import { Box, IconButton, Image, Text } from '@chakra-ui/react'

type ChatHeaderProps = {
    iconSrc: string
    isExpanded: boolean
    onToggleExpand: () => void
    onClose: () => void
}

export default function ChatHeader({
    iconSrc,
    isExpanded,
    onToggleExpand,
    onClose
}: ChatHeaderProps) {
    return (
        <Box
            display='flex'
            alignItems='center'
            gap='10px'
            padding='8px 12px'
            borderBottomWidth='1px'
            borderBottomStyle='solid'
            borderBottomColor='border.subtle'
            bg='bg.subtle'
        >
            <Image
                src={iconSrc}
                alt='assistant'
                boxSize='28px'
                objectFit='cover'
                display='block'
            />
            <Text fontWeight='600' color='fg.info'>
                Ask Portal
            </Text>
            <Box flex='1' />
            <IconButton
                onClick={onToggleExpand}
                variant='ghost'
                size='sm'
                bg='transparent'
                fontSize='16px'
                lineHeight='1'
                aria-label={
                    isExpanded ? 'Exit full screen chat' : 'Expand chat'
                }
                _dark={{ color: '#e5e7eb' }}
            >
                {isExpanded ? (
                    <IconCollapse color='neutral' isFilled />
                ) : (
                    <IconExpand color='neutral' isFilled />
                )}
            </IconButton>
            <IconButton
                onClick={onClose}
                variant='ghost'
                size='sm'
                bg='transparent'
                fontSize='18px'
                aria-label='Close chat'
            >
                <IconClose color='neutral' isFilled />
            </IconButton>
        </Box>
    )
}
