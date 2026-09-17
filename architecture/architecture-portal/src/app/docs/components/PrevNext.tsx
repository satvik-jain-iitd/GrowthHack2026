/* istanbul ignore file */
import React from 'react'
import { PrevNext as Props } from '@/types/PrevNext'
import { Box, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import { IconChevronLeft, IconChevronRight } from '@americanexpress/dls-icons'
import { NoPrefetchLink as Link } from '@/components/ui'

export default function PrevNext({ prevNext }: { prevNext: Props }) {
    const { previous, next } = prevNext
    return (
        <Box display='flex' justifyContent='space-between' mt={2}>
            {previous ? (
                <LinkBox
                    as='article'
                    width='50%'
                    m={1.5}
                    borderWidth='1px'
                    borderRadius='md'
                    _dark={{ bg: 'bg.muted' }}
                    _hover={{ borderColor: 'fg.info' }}
                    transition='border-color 0.2s'
                >
                    <LinkOverlay
                        as={Link}
                        href={previous.href!}
                        p={3}
                        display='block'
                    >
                        <Text color='fg' textAlign='left' ml={1} fontSize={14}>
                            Previous
                        </Text>
                        <Box
                            display='flex'
                            alignItems='center'
                            color='fg.info'
                            fontSize={14}
                            mt={1}
                        >
                            <IconChevronLeft />
                            <Box as='span' ml={2}>
                                {previous.label}
                            </Box>
                        </Box>
                    </LinkOverlay>
                </LinkBox>
            ) : (
                <span style={{ width: '50%', margin: '6px' }} />
            )}
            {next ? (
                <LinkBox
                    as='article'
                    width='50%'
                    m={1.5}
                    borderWidth='1px'
                    borderRadius='md'
                    _dark={{ bg: 'bg.muted' }}
                    _hover={{ borderColor: 'fg.info' }}
                    transition='border-color 0.2s'
                >
                    <LinkOverlay
                        as={Link}
                        href={next.href!}
                        p={3}
                        display='block'
                    >
                        <Text color='fg' textAlign='right' mr={1} fontSize={14}>
                            Next
                        </Text>
                        <Box
                            display='flex'
                            alignItems='center'
                            color='fg.info'
                            fontSize={14}
                            mt={1}
                            justifyContent='flex-end'
                        >
                            <Box as='span' mr={2}>
                                {next.label}
                            </Box>
                            <IconChevronRight />
                        </Box>
                    </LinkOverlay>
                </LinkBox>
            ) : (
                <span style={{ width: '50%', margin: '6px' }} />
            )}
        </Box>
    )
}
