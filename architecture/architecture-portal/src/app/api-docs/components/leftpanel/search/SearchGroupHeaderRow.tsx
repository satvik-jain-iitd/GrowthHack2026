/* istanbul ignore file */

import React from 'react'
import { Box, HStack, Image, Text } from '@chakra-ui/react'
import { Domains } from '@/app/api-docs/types/apiDocs'
import { useGetDomainInfo } from '@/app/api-docs/components/hooks/useGetDomainInfo'
import styles from './search.module.scss'
import {
    HighlightedText,
    clampDescription,
    optionDomId
} from './searchRowUtils'

export function SearchGroupHeaderRow({
    rowKey,
    level,
    domainId,
    domains,
    name,
    description,
    countLabel,
    tokens,
    active,
    onSelect,
    onHover
}: {
    rowKey: string
    level: 'domain' | 'api'
    domainId: string
    domains: Domains
    name: string
    description?: string
    countLabel: string
    tokens: string[]
    active: boolean
    onSelect: () => void
    onHover: () => void
}) {
    const isDomain = level === 'domain'
    const domainInfo = useGetDomainInfo(isDomain ? domainId : '', domains)
    const hasIcon = isDomain && Boolean(domainInfo.lightIcon)

    return (
        <Box
            role='option'
            id={optionDomId(rowKey)}
            aria-selected={active}
            onClick={onSelect}
            onMouseMove={onHover}
            cursor='pointer'
            px={3}
            py={isDomain ? 2 : 1.5}
            pl={isDomain ? 3 : 7}
            borderRadius='md'
            bg={active ? 'blue.50' : 'transparent'}
            _dark={{ bg: active ? '#243044' : 'transparent' }}
        >
            <HStack gap={2} alignItems='center'>
                {hasIcon && (
                    <>
                        <Image
                            alt=''
                            className='image-light'
                            width={4}
                            height={4}
                            src={`data:image/png;base64,${domainInfo.lightIcon}`}
                        />
                        <Image
                            alt=''
                            className='image-dark'
                            width={4}
                            height={4}
                            src={`data:image/png;base64,${domainInfo.darkIcon}`}
                        />
                    </>
                )}
                <Text
                    fontWeight={isDomain ? '700' : '600'}
                    fontSize={isDomain ? 'sm' : 'xs'}
                    color={isDomain ? 'gray.800' : 'gray.600'}
                    _dark={{ color: isDomain ? '#f0f0f0' : '#c8c9c7' }}
                >
                    <HighlightedText text={name} tokens={tokens} />
                </Text>
                <Text
                    as='span'
                    ml='auto'
                    fontSize='xs'
                    color='gray.500'
                    _dark={{ color: '#a8aaa8' }}
                    whiteSpace='nowrap'
                >
                    {countLabel}
                </Text>
            </HStack>
            {description && (
                <Text
                    className={styles.clamp}
                    fontSize='xs'
                    color='gray.500'
                    _dark={{ color: '#a8aaa8' }}
                    pl={hasIcon ? 6 : 0}
                >
                    <HighlightedText
                        text={clampDescription(description)}
                        tokens={tokens}
                    />
                </Text>
            )}
        </Box>
    )
}
