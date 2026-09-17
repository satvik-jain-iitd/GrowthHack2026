'use client'
import React from 'react'
import { Box, Stack, Text, chakra } from '@chakra-ui/react'
import { LeftNavGroup } from '@/app/faqs/types'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'

interface LeftNavProps {
    groups: LeftNavGroup[]
    selectedGroup: string
    onSelectGroup: (groupId: string) => void
}

export const LeftNav: React.FC<LeftNavProps> = ({
    groups,
    selectedGroup,
    onSelectGroup
}) => {
    return (
        <Stack
            direction='column'
            alignItems='start'
            gap={6}
            data-testid={FAQ_TEST_IDS.leftNavRoot}
        >
            <Stack direction='column' alignItems='stretch' gap={3} w='full'>
                {groups.map(g => {
                    const active = selectedGroup === g.id
                    return (
                        <chakra.button
                            key={g.id}
                            onClick={() => onSelectGroup(g.id)}
                            data-testid={FAQ_TEST_IDS.leftNavButton(g.id)}
                            display='flex'
                            alignItems='center'
                            justifyContent='space-between'
                            px={4}
                            py={3}
                            bg={active ? 'gray.700' : 'transparent'}
                            color={active ? 'white' : 'inherit'}
                            borderRadius={active ? '8px' : 'none'}
                            _focus={{
                                boxShadow: active
                                    ? '0 0 0 4px rgba(66,153,225,0.18)'
                                    : '0 0 0 4px rgba(66,153,225,0.08)',
                                outline: 'none',
                                borderRadius: '10px'
                            }}
                            textAlign='left'
                            aria-pressed={active}
                            cursor='pointer'
                        >
                            <Stack direction='row' alignItems='center' gap={4}>
                                <Text fontSize='md'>{g.title}</Text>
                            </Stack>
                            <Stack direction='row' gap={3}>
                                <Box
                                    data-testid={FAQ_TEST_IDS.leftNavCount(
                                        g.id
                                    )}
                                    minW='28px'
                                    px={2}
                                    py='2px'
                                    bg={{
                                        base: active
                                            ? 'bg.info'
                                            : 'bg.emphasized',
                                        _dark: active
                                            ? 'bg.emphasized'
                                            : 'bg.emphasized'
                                    }}
                                    color={{
                                        base: active ? 'gray.700' : 'gray.700',
                                        _dark: active ? 'fg.info' : 'fg.subtle'
                                    }}
                                    borderRadius='6px'
                                    textAlign='center'
                                    fontSize='sm'
                                    fontWeight='600'
                                >
                                    {g.count}
                                </Box>
                            </Stack>
                        </chakra.button>
                    )
                })}
            </Stack>
        </Stack>
    )
}
