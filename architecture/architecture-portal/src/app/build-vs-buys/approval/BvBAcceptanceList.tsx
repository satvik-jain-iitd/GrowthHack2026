'use client'
import React from 'react'
import { useGetBvBPlaybooks } from '@/app/resources/bvb-tracker/hooks/useGetBvBPlaybooks'
import {
    Badge,
    Box,
    Card,
    Flex,
    Text,
    Link as ChakraLink
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { NoPrefetchLink } from '@/components/ui'

export default function BvBAcceptancePage() {
    const { playbooks, loading } = useGetBvBPlaybooks({
        status: 'PENDING'
    })

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Box marginTop={12}>
            <Text color={'fg'} fontSize={'2rem'} fontWeight={600}>
                BvB Acceptance List
            </Text>
            <Flex gap={4} flexDir={'column'} marginTop={4}>
                {playbooks.map(playbook => (
                    <Card.Root
                        key={playbook.playbook_id}
                        bg={'bg.muted'}
                        display={'flex'}
                        flexDir={'row'}
                        alignItems={'space-between'}
                        w={'80vw'}
                        overflow='hidden'
                    >
                        <Card.Body>
                            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                            <ChakraLink asChild>
                                <NoPrefetchLink
                                    href={`approval/${playbook.playbook_id}`}
                                >
                                    {playbook.playbook_nm}
                                </NoPrefetchLink>
                            </ChakraLink>
                        </Card.Body>
                        <Card.Body
                            alignItems={'center'}
                            justifyContent={'flex-end'}
                            flexDir={'row'}
                            gap={4}
                        >
                            <Text>
                                {dayjs(playbook.creat_ts).format('MM/DD/YYYY')}
                            </Text>
                            <Badge size={'lg'} colorPalette={'blue'}>
                                Pending
                            </Badge>
                        </Card.Body>
                    </Card.Root>
                ))}
            </Flex>
        </Box>
    )
}
