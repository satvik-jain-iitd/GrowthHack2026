'use client'

import { JSX } from 'react'
import { Accordion, Box, Link } from '@chakra-ui/react'

function getSourceDisplayName(url: string): string {
    try {
        const u = new URL(url)
        const parts = u.pathname.replace(/\/$/, '').split('/').filter(Boolean)
        return parts.length
            ? decodeURIComponent(parts[parts.length - 1])
            : u.hostname
    } catch {
        return url
    }
}

type SourcesSectionProps = {
    sources: string[]
}

export default function SourcesSection({
    sources
}: SourcesSectionProps): JSX.Element | null {
    if (!sources.length) return null

    return (
        <Accordion.Root
            collapsible
            mt='10px'
            fontSize='12px'
            borderTopWidth='1px'
            borderTopStyle='solid'
            borderTopColor='border.subtle'
            pt='8px'
        >
            <Accordion.Item value='sources' border='none'>
                <Accordion.ItemTrigger
                    display='inline-flex'
                    alignItems='center'
                    gap='4px'
                    padding='2px 0'
                    cursor='pointer'
                    fontSize='12px'
                    fontWeight='600'
                    color='fg.muted'
                    letterSpacing='0.02em'
                    textTransform='uppercase'
                    _hover={{ color: 'text.link' }}
                >
                    {sources.length} source{sources.length !== 1 ? 's' : ''}
                    <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                    <Box
                        as='ol'
                        m='6px 0 0 4px'
                        p={0}
                        listStyle='decimal inside'
                    >
                        {sources.map((s, i) => (
                            <Box as='li' key={i} mb='4px' fontSize='12px'>
                                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                <Link
                                    href={s}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    title={s}
                                    color='text.link'
                                    textDecoration='none'
                                    wordBreak='break-all'
                                    _hover={{ textDecoration: 'underline' }}
                                >
                                    {getSourceDisplayName(s)}
                                </Link>
                            </Box>
                        ))}
                    </Box>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}
