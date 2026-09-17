'use client'
import React from 'react'
import {
    Box,
    Heading,
    Button,
    Stack,
    Text,
    chakra,
    Collapsible,
    IconButton,
    Link
} from '@chakra-ui/react'
import { Group } from '@/app/faqs/types'
import { IconEdit } from '@americanexpress/dls-icons'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'

interface GroupCardProps {
    group: Group
    isOpenMap: number[]
    onToggleOpen: (groupId: string, idx: number) => void
    onToggleAll: (groupId: string, itemsLength: number) => void
    groupRef: (el: HTMLDivElement | null) => void
}

function Header({
    id,
    sourceLink,
    children
}: {
    id: string
    sourceLink: string
    children: React.ReactNode
}) {
    const [hovered, setHovered] = React.useState(false)

    return (
        <Heading
            id={id}
            size='md'
            color='fg.info'
            style={{ position: 'relative' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span style={{ display: 'flex', alignItems: 'center' }}>
                {children}
                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                <Link
                    href={sourceLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    ml={2}
                    data-testid={FAQ_TEST_IDS.groupSourceLink(id)}
                >
                    <IconButton
                        size='sm'
                        variant='subtle'
                        borderRadius='50%'
                        opacity={hovered ? 1 : 0}
                        transition='opacity 0.2s'
                        p={1}
                    >
                        <IconEdit color='information' />
                    </IconButton>
                </Link>
            </span>
        </Heading>
    )
}

export const GroupCard: React.FC<GroupCardProps> = ({
    group,
    isOpenMap,
    onToggleOpen,
    onToggleAll,
    groupRef
}) => {
    return (
        <Box
            ref={groupRef}
            data-testid={FAQ_TEST_IDS.groupCard(group.id)}
            tabIndex={-1}
            borderRadius='16px'
            _dark={{
                border: '1px solid',
                borderColor: 'border.emphasized'
            }}
            p={0}
            overflow='hidden'
            boxShadow='lg'
            _focus={{
                outline: 'none',
                boxShadow: 'lg'
            }}
        >
            <Box
                px={6}
                py={4}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
            >
                <Header id={group.id} sourceLink={group.sourceLink}>
                    <span data-testid={FAQ_TEST_IDS.groupHeader(group.id)}>
                        {group.title}
                    </span>
                </Header>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onToggleAll(group.id, group.items.length)}
                    data-testid={FAQ_TEST_IDS.toggleAllButton(group.id)}
                >
                    {isOpenMap.length === group.items.length
                        ? 'Close all'
                        : 'Open all'}
                </Button>
            </Box>
            <Box borderTop='1px solid' borderColor='border.emphasized' />
            <Stack direction='column' gap={0} alignItems='stretch'>
                {group.items.length === 0 ? (
                    <Box px={6} py={6}>
                        <Text
                            color='gray.500'
                            data-testid={FAQ_TEST_IDS.emptyState(group.id)}
                        >
                            No results in this topic.
                        </Text>
                    </Box>
                ) : (
                    group.items.map((it, idx) => {
                        const isOpen = isOpenMap.includes(idx)
                        return (
                            <Collapsible.Root
                                key={it.id}
                                open={isOpen}
                                onOpenChange={() => onToggleOpen(group.id, idx)}
                            >
                                <Box
                                    id={it.id}
                                    borderTop='1px solid'
                                    borderColor='border.emphasized'
                                >
                                    <Collapsible.Trigger asChild>
                                        <chakra.button
                                            data-testid={FAQ_TEST_IDS.questionTrigger(
                                                it.id
                                            )}
                                            w='full'
                                            textAlign='left'
                                            py={5}
                                            px={6}
                                            display='flex'
                                            alignItems='center'
                                            justifyContent='space-between'
                                            bg='transparent'
                                            cursor='pointer'
                                            _hover={{
                                                bg: 'bg.muted',
                                                _dark: { bg: 'bg.emphasized' }
                                            }}
                                            role='button'
                                            aria-expanded={isOpen}
                                        >
                                            <Box>
                                                <Text
                                                    style={{
                                                        fontWeight: isOpen
                                                            ? 'bold'
                                                            : 'normal'
                                                    }}
                                                >
                                                    {it.q}
                                                </Text>
                                            </Box>
                                            <Collapsible.Indicator>
                                                <Box
                                                    position='relative'
                                                    width='20px'
                                                    height='20px'
                                                    aria-hidden
                                                >
                                                    <Box
                                                        position='absolute'
                                                        inset='0'
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        fontSize='xl'
                                                        color='gray.500'
                                                        transition='opacity 180ms ease, transform 180ms ease'
                                                        opacity={isOpen ? 0 : 1}
                                                        transform={
                                                            isOpen
                                                                ? 'translateY(-4px)'
                                                                : 'translateY(0)'
                                                        }
                                                    >
                                                        +
                                                    </Box>
                                                    <Box
                                                        position='absolute'
                                                        inset='0'
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        fontSize='xl'
                                                        color='gray.500'
                                                        transition='opacity 180ms ease, transform 180ms ease'
                                                        opacity={isOpen ? 1 : 0}
                                                        transform={
                                                            isOpen
                                                                ? 'translateY(0)'
                                                                : 'translateY(4px)'
                                                        }
                                                    >
                                                        −
                                                    </Box>
                                                </Box>
                                            </Collapsible.Indicator>
                                        </chakra.button>
                                    </Collapsible.Trigger>
                                    <Collapsible.Content>
                                        <Box
                                            pr={6}
                                            pb={6}
                                            pt={4}
                                            pl={10}
                                            data-testid={FAQ_TEST_IDS.answerContent(
                                                it.id
                                            )}
                                        >
                                            <Box
                                                className='markdown-body'
                                                dangerouslySetInnerHTML={{
                                                    __html: it.a
                                                }}
                                            />
                                        </Box>
                                    </Collapsible.Content>
                                </Box>
                            </Collapsible.Root>
                        )
                    })
                )}
            </Stack>
        </Box>
    )
}
