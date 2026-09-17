/* istanbul ignore file */

import React from 'react'
import { Code, HStack, Kbd, Text, VStack } from '@chakra-ui/react'
import { LinkButton } from './searchRowUtils'

const CAPABILITIES: { title: string; body: React.ReactNode }[] = [
    {
        title: 'WHAT YOU CAN SEARCH',
        body: (
            <>
                Company domains by name, APIs by name and description, and
                operations by name, URI path and description. Every word has to
                match, so adding words narrows the results. Accents are ignored
                — <Code fontSize='xs'>cartao</Code> finds Cartão.
            </>
        )
    },
    {
        title: 'FILTER BY HTTP METHOD',
        body: (
            <>
                Start with <Code fontSize='xs'>get</Code>,{' '}
                <Code fontSize='xs'>post</Code>, <Code fontSize='xs'>put</Code>,{' '}
                <Code fontSize='xs'>patch</Code> or{' '}
                <Code fontSize='xs'>delete</Code> followed by at least one more
                word, e.g. <Code fontSize='xs'>post payment</Code>. On its own,{' '}
                <Code fontSize='xs'>delete</Code> is treated as ordinary text so
                operations named “Delete …” still match.
            </>
        )
    },
    {
        title: 'SEARCH BY PATH',
        body: (
            <>
                URI fragments work too, e.g.{' '}
                <Code fontSize='xs'>/v1/cards/{'{cardId}'}</Code>.
            </>
        )
    },
    {
        title: 'NARROW TO A COMPANY DOMAIN',
        body: (
            <>
                Use the chips below the input. Several can be selected at once,
                and Clear resets them.
            </>
        )
    },
    {
        title: 'READING THE RESULTS',
        body: (
            <>
                Results are grouped company domain → API → operation, with the
                best textual match first. Equally-matched operations are ordered
                by certification status: Production Certified, then Design
                Certified, then Onboarded to Catalog. Long groups are capped,
                and “Show all N more” reveals the rest.
            </>
        )
    }
]

const SHORTCUTS: [string, string][] = [
    ['⌘K / Ctrl K', 'Open this search'],
    ['⌘F / Ctrl F', 'Open this search — it replaces browser find-in-page'],
    ['/', 'Open this search'],
    ['↑ ↓', 'Move between results'],
    ['↵', 'Open the highlighted result'],
    ['?', 'Show this help'],
    ['esc', 'Back to results, then close']
]

export function SearchHelpPanel({ onBack }: { onBack: () => void }) {
    return (
        <VStack
            align='stretch'
            gap={4}
            px={4}
            py={4}
            maxH='60vh'
            overflowY='auto'
        >
            <HStack justifyContent='space-between'>
                <Text fontSize='xs' fontWeight='700' color='gray.500'>
                    SEARCH HELP
                </Text>
                <LinkButton onClick={onBack}>← Back to results</LinkButton>
            </HStack>

            {CAPABILITIES.map(section => (
                <VStack key={section.title} align='stretch' gap={1}>
                    <Text fontSize='xs' fontWeight='700' color='gray.500'>
                        {section.title}
                    </Text>
                    <Text
                        fontSize='sm'
                        color='gray.800'
                        _dark={{ color: '#f0f0f0' }}
                    >
                        {section.body}
                    </Text>
                </VStack>
            ))}

            <VStack
                align='stretch'
                gap={2}
                pt={3}
                borderTopWidth='1px'
                borderColor='#D4DEE9'
                _dark={{ borderColor: '#3c4250' }}
            >
                <Text fontSize='xs' fontWeight='700' color='gray.500'>
                    KEYBOARD
                </Text>
                {SHORTCUTS.map(([keys, label]) => (
                    <HStack key={keys} gap={3} alignItems='baseline'>
                        <Kbd size='sm' minW='80px' textAlign='center'>
                            {keys}
                        </Kbd>
                        <Text
                            fontSize='sm'
                            color='gray.800'
                            _dark={{ color: '#f0f0f0' }}
                        >
                            {label}
                        </Text>
                    </HStack>
                ))}
            </VStack>
        </VStack>
    )
}
