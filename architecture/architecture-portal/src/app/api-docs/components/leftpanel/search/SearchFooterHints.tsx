/* istanbul ignore file */

import React from 'react'
import { HStack, Kbd, Text, chakra } from '@chakra-ui/react'

const HINTS: [string, string][] = [
    ['↑↓', 'navigate'],
    ['↵', 'select'],
    ['esc', 'close']
]

export function SearchFooterHints({
    helpOpen,
    onToggleHelp
}: {
    helpOpen: boolean
    onToggleHelp: () => void
}) {
    return (
        <HStack
            gap={4}
            px={4}
            py={2}
            borderTopWidth='1px'
            borderColor='#D4DEE9'
            _dark={{ borderColor: '#3c4250' }}
            fontSize='xs'
            color='gray.500'
            flexWrap='wrap'
        >
            {HINTS.map(([key, label]) => (
                <HStack gap={1} key={label}>
                    <Kbd size='sm'>{key}</Kbd>
                    <Text as='span'>{label}</Text>
                </HStack>
            ))}
            <chakra.button
                type='button'
                ml='auto'
                aria-pressed={helpOpen}
                onClick={onToggleHelp}
            >
                <HStack gap={1}>
                    <Kbd size='sm'>?</Kbd>
                    <Text as='span'>{helpOpen ? 'back' : 'help'}</Text>
                </HStack>
            </chakra.button>
        </HStack>
    )
}
