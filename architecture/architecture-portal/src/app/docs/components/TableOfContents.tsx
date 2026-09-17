/* istanbul ignore file */
'use client'
import React from 'react'
import { Box, Text, Link } from '@chakra-ui/react'
import { useTocContext } from '@/context'

export default function TableOfContents({
    toc
}: {
    toc: { level: number; text: string; anchor: string }[]
}) {
    const { activeId, onTocClick } = useTocContext()
    if (!(toc.length > 0)) {
        return <></>
    }

    return (
        <Box position='sticky' top='20px' display='flex'>
            <Box width='1px' bg='bg.emphasized' borderRadius='full' />
            <Box
                as='ul'
                width='100%'
                bg='bg.surface'
                p={0}
                m={0}
                listStyleType='none'
            >
                <Text fontSize='sm' mb={2} pl={4} pt={4} color='fg.muted'>
                    On this page
                </Text>
                {toc.map(item => {
                    const selected = item.anchor === activeId
                    return (
                        <Box
                            as='li'
                            key={item.anchor}
                            p={0}
                            m={0}
                            border='none'
                        >
                            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                            <Link
                                href={`#${item.anchor}`}
                                display='block'
                                pl={`${item.level * 1}rem`}
                                py={1.5}
                                color='fg.info'
                                bg={selected ? 'bg.info' : 'transparent'}
                                borderRadius='none'
                                borderLeft={
                                    selected
                                        ? '3px solid'
                                        : '3px solid transparent'
                                }
                                borderColor={
                                    selected ? 'fg.info' : 'transparent'
                                }
                                transition='all 0.2s ease-in-out'
                                fontSize='14px'
                                onClick={e => onTocClick(e, item.anchor)}
                                _hover={{
                                    bg: {
                                        base: 'bg.muted',
                                        _dark: 'bg.emphasized'
                                    },
                                    textDecoration: 'none'
                                }}
                                _focus={{
                                    outline: 'none',
                                    boxShadow: 'none'
                                }}
                            >
                                {item.text}
                            </Link>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}
