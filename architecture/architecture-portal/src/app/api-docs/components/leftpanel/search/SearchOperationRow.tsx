/* istanbul ignore file */

import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'
import { OperationResult } from '@/app/api-docs/types/search'
import { getMethodColor } from '@/app/api-docs/utils/getMethodColor'
import Status from '@/app/company-domains/components/LandingPage/Status'
import styles from './search.module.scss'
import {
    HighlightedText,
    clampDescription,
    optionDomId
} from './searchRowUtils'

export function SearchOperationRow({
    rowKey,
    result,
    tokens,
    active,
    onSelect,
    onHover
}: {
    rowKey: string
    result: OperationResult
    tokens: string[]
    active: boolean
    onSelect: () => void
    onHover: () => void
}) {
    const { entry } = result
    return (
        <Box
            role='option'
            id={optionDomId(rowKey)}
            aria-selected={active}
            onClick={onSelect}
            onMouseMove={onHover}
            cursor='pointer'
            pl={11}
            pr={3}
            py={1.5}
            borderRadius='md'
            bg={active ? 'blue.50' : 'transparent'}
            _dark={{ bg: active ? '#243044' : 'transparent' }}
        >
            <HStack gap={2} alignItems='center'>
                {entry.method && (
                    <Text
                        as='span'
                        fontSize='xs'
                        fontWeight='700'
                        minW='46px'
                        textAlign='right'
                        color={getMethodColor(entry.method)}
                    >
                        {entry.method}
                    </Text>
                )}
                <Text
                    fontSize='sm'
                    color='gray.800'
                    _dark={{ color: '#f0f0f0' }}
                >
                    <HighlightedText text={entry.name} tokens={tokens} />
                </Text>
                {entry.status && (
                    <Status
                        data={{ status: entry.status }}
                        rowExpanded={false}
                    />
                )}
            </HStack>
            {entry.uri && (
                <Text
                    className={`${styles.uri} ${styles.clamp}`}
                    pl={entry.method ? '54px' : 0}
                    color='gray.500'
                    _dark={{ color: '#a8aaa8' }}
                >
                    <HighlightedText text={entry.uri} tokens={tokens} />
                </Text>
            )}
            {!entry.uri && entry.description && (
                <Text
                    className={styles.clamp}
                    fontSize='xs'
                    color='gray.500'
                    _dark={{ color: '#a8aaa8' }}
                >
                    <HighlightedText
                        text={clampDescription(entry.description)}
                        tokens={tokens}
                    />
                </Text>
            )}
        </Box>
    )
}
