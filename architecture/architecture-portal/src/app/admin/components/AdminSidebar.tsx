'use client'
import React, { useEffect, useState } from 'react'
import { Box, Text, VStack, Button } from '@chakra-ui/react'
import { useAdminContext } from '@/context'
import { IconChevronDown, IconChevronRight } from '@americanexpress/dls-icons'
import { ADMIN_TEST_IDS } from '../test-ids'

export interface AdminSidebarType {
    playbook_id: string
    href: string
    label: string
    children: AdminSidebarType[]
}

export function AdminSidebar({
    sidebar,
    isMobile
}: {
    sidebar: AdminSidebarType[]
    isMobile?: boolean
}) {
    const [accordionExpand, setAccordionExpand] = useState(false)
    const adminContext = useAdminContext()
    const {
        setSelectedPlaybook,
        setExpandedPlaybook,
        expandedPlaybook,
        selectedPlaybook
    } = adminContext || {}

    useEffect(() => {
        if (!selectedPlaybook) {
            if (sidebar && sidebar.length > 0) {
                setSelectedPlaybook?.({
                    playbook_id: sidebar[0].playbook_id,
                    playbook_nm: sidebar[0].label
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSelectPlaybook = (
        playbook: AdminSidebarType,
        isExpandable: boolean
    ) => {
        setSelectedPlaybook?.({
            playbook_id: playbook.playbook_id,
            playbook_nm: playbook.label
        })

        const isTopLevel = sidebar?.findIndex(
            v => v.playbook_id == playbook.playbook_id
        )

        if (isExpandable) {
            const index = expandedPlaybook?.findIndex(
                (p: string) => p === playbook.playbook_id
            )
            if (index != -1) {
                if (index !== undefined && index !== -1) {
                    expandedPlaybook?.splice(index, 1)
                }
            } else {
                if (isTopLevel != -1) {
                    expandedPlaybook?.splice(0, expandedPlaybook.length)
                }
                expandedPlaybook?.push(playbook.playbook_id)
            }

            setExpandedPlaybook?.([...(expandedPlaybook || [])])
        } else {
            setAccordionExpand(false)
        }
    }

    const renderSidebarItems = (items: AdminSidebarType[], level = 0) => {
        return items?.map(item => {
            const isParent = item.children && item.children.length > 0
            const isActive = selectedPlaybook?.playbook_id == item.playbook_id
            const isExpanded = expandedPlaybook?.indexOf(item.playbook_id) != -1

            if (!isParent) {
                return (
                    <Box
                        key={item.playbook_id}
                        data-testid={ADMIN_TEST_IDS.sidebarLeafItem(
                            item.playbook_id
                        )}
                        px={0}
                        pl={level * 4 + 3}
                        bg={isActive ? 'bg.muted' : undefined}
                        onClick={() => onSelectPlaybook(item, false)}
                        cursor='pointer'
                        borderRadius='md'
                        width='100%'
                        _hover={{
                            bg: { base: 'bg.subtle', _dark: 'bg.emphasized' }
                        }}
                    >
                        <Text
                            fontSize='sm'
                            fontWeight={isActive ? 'bold' : 'normal'}
                            color={isActive ? 'blue.700' : 'fg'}
                            pl={3}
                        >
                            {item.label}
                        </Text>
                    </Box>
                )
            } else {
                return (
                    <React.Fragment key={item.playbook_id}>
                        <Box
                            data-testid={ADMIN_TEST_IDS.sidebarParentItem(
                                item.playbook_id
                            )}
                            px={0}
                            pl={level * 4}
                            bg={isActive ? 'bg.muted' : undefined}
                            display='flex'
                            alignItems='center'
                            cursor='pointer'
                            borderRadius='md'
                            _hover={{
                                bg: {
                                    base: 'bg.subtle',
                                    _dark: 'bg.emphasized'
                                }
                            }}
                            width='100%'
                            onClick={() => onSelectPlaybook(item, true)}
                        >
                            <Box mr={2}>
                                {isExpanded ? (
                                    <IconChevronDown
                                        size='xs'
                                        color='information'
                                    />
                                ) : (
                                    <IconChevronRight
                                        size='xs'
                                        color='information'
                                    />
                                )}
                            </Box>
                            <Text
                                fontSize='sm'
                                fontWeight={isActive ? 'bold' : 'normal'}
                                color={isActive ? 'blue.700' : 'fg'}
                            >
                                {item.label}
                            </Text>
                        </Box>
                        {isExpanded && (
                            <Box width='100%'>
                                <VStack align='start' gap={0}>
                                    {renderSidebarItems(
                                        item.children,
                                        level + 1
                                    )}
                                </VStack>
                            </Box>
                        )}
                    </React.Fragment>
                )
            }
        })
    }

    const drawer = (
        <Box>
            <VStack align='start' gap={0}>
                {renderSidebarItems(sidebar)}
            </VStack>
        </Box>
    )

    if (!isMobile) {
        return (
            <Box
                height='100%'
                p={2}
                boxShadow='md'
                minW='240px'
                overflow='hidden'
                overflowY='scroll'
                borderRadius='7px'
            >
                {drawer}
            </Box>
        )
    }

    return (
        <Box>
            <Button
                data-testid={ADMIN_TEST_IDS.sidebarMobileButton}
                w='100%'
                bg='bg.emphasized'
                minH='48px'
                h='48px'
                textAlign='left'
                onClick={() => setAccordionExpand(!accordionExpand)}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
            >
                <Text flex='1' textAlign='left' color='fg'>
                    {selectedPlaybook?.playbook_nm}
                </Text>
                <Box ml={2}>
                    {accordionExpand ? (
                        <IconChevronDown size='xs' color='information' />
                    ) : (
                        <IconChevronRight size='xs' color='information' />
                    )}
                </Box>
            </Button>
            {accordionExpand && <Box p={2}>{drawer}</Box>}
        </Box>
    )
}
