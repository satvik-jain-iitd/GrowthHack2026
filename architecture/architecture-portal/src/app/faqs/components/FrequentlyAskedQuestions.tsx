'use client'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Box, Container, Heading, Stack } from '@chakra-ui/react'
import { LeftNav } from './LeftNav'
import { GroupCard } from './GroupCard'
import { Group, LeftNavGroup } from '@/app/faqs/types'
import { FAQ_TEST_IDS } from '@/app/faqs/test-ids'
import { useScrollContext } from '@/context'

interface FrequentlyAskedQuestionsProps {
    faqs: Group[]
}

export const FrequentlyAskedQuestions: React.FC<
    FrequentlyAskedQuestionsProps
> = ({ faqs }) => {
    const [selectedGroup, setSelectedGroup] = useState(faqs[0]?.id || '')
    const [openMap, setOpenMap] = useState<Record<string, number[]>>(() =>
        faqs.reduce(
            (acc, g) => {
                acc[g.id] = []
                return acc
            },
            {} as Record<string, number[]>
        )
    )
    const [isReady, setIsReady] = useState(false)
    const groupRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const { scrollRef } = useScrollContext()

    // Build nav data
    const navGroups: LeftNavGroup[] = faqs.map(g => ({
        id: g.id,
        title: g.title,
        count: g.items.length
    }))

    // Toggle a single item open/close
    function toggleOpen(groupId: string, index: number) {
        setOpenMap(prev => {
            const arr = prev[groupId] ? [...prev[groupId]] : []
            const pos = arr.indexOf(index)
            if (pos === -1) arr.push(index)
            else arr.splice(pos, 1)
            return { ...prev, [groupId]: arr }
        })
    }

    // Open or close all items in a group
    function toggleAll(groupId: string, itemsLength: number) {
        setOpenMap(prev => {
            const current = prev[groupId] || []
            if (current.length === itemsLength) {
                return { ...prev, [groupId]: [] }
            } else {
                return {
                    ...prev,
                    [groupId]: Array.from({ length: itemsLength }, (_, i) => i)
                }
            }
        })
    }

    // Scroll to group on nav click
    function handleSelectGroup(gId: string) {
        setSelectedGroup(gId)
        window.history.replaceState(null, '', `#${gId}`)
        const el = groupRefs.current[gId]
        if (el && el.firstElementChild) {
            const fl = el.firstElementChild
            if (
                fl &&
                typeof fl.firstElementChild?.scrollIntoView === 'function'
            ) {
                fl.firstElementChild.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        }
    }

    // On page load, instantly scroll to the hash group and mark ready before browser paints
    // Uses scrollRef (custom scroll container) and overrides scroll-behavior to prevent smooth animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        const hash = window.location.hash.slice(1)
        if (hash && faqs.some(g => g.id === hash)) {
            setSelectedGroup(hash)
        }
        setIsReady(true)
    }, [faqs, scrollRef])

    // Scroll to hash target after isReady render, using a separate effect to avoid scroll reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        if (!isReady) return
        const hash = window.location.hash.slice(1)
        if (hash && faqs.some(g => g.id === hash)) {
            const el = groupRefs.current[hash]
            const container = scrollRef.current
            if (el && container) {
                // Override smooth scroll-behavior to prevent animated jump
                const prev = container.style.scrollBehavior
                container.style.scrollBehavior = 'auto'
                container.scrollTop = el.offsetTop - container.offsetTop
                container.style.scrollBehavior = prev
            }
        }
    }, [isReady, faqs, scrollRef])

    // Ensure selectedGroup always exists if data changes
    useEffect(() => {
        if (
            selectedGroup &&
            !faqs.find(g => g.id === selectedGroup) &&
            faqs.length > 0
        ) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedGroup(faqs[0].id)
        }
    }, [selectedGroup, faqs])

    return (
        <Container
            maxW='8xl'
            py={{ base: 6, md: 10 }}
            data-testid={FAQ_TEST_IDS.faqContainer}
            style={{ opacity: isReady ? 1 : 0 }}
        >
            <Heading
                as='h1'
                size='3xl'
                mb={8}
                data-testid={FAQ_TEST_IDS.faqHeading}
            >
                Frequently Asked Questions
            </Heading>
            <Stack
                direction={{ base: 'column', md: 'row' }}
                gap={8}
                alignItems='start'
            >
                <Box
                    flexBasis={{ md: '25%' }}
                    minW={0}
                    position='sticky'
                    top='30px'
                >
                    <LeftNav
                        groups={navGroups}
                        selectedGroup={selectedGroup}
                        onSelectGroup={handleSelectGroup}
                    />
                </Box>
                <Box flex='1'>
                    <Stack gap={6}>
                        {faqs.map(g => (
                            <GroupCard
                                key={g.id}
                                group={g}
                                isOpenMap={openMap[g.id] || []}
                                onToggleOpen={toggleOpen}
                                onToggleAll={toggleAll}
                                groupRef={el => (groupRefs.current[g.id] = el)}
                            />
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Container>
    )
}
