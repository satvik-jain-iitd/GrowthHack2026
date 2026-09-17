/* istanbul ignore file */

import React from 'react'
import { Box, Flex, IconButton, VStack } from '@chakra-ui/react'
import {
    IconChevronLeft,
    IconChevronRight,
    IconSearch
} from '@americanexpress/dls-icons'
import SearchTrigger from './leftpanel/SearchTrigger'
import LeftNav from './leftpanel/LeftNav'
import { Tooltip } from '@/components/ui'
import styles from '@/app/api-docs/api-docs.module.scss'
import { Domains, domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { useEffect } from 'react'

const LEFT_NAV_ID = 'api-docs-left-nav'

export default function LeftPanel({
    domains,
    sidebarData,
    navRequest,
    onSearchOpen,
    searchTriggerRef,
    collapsed,
    onToggleCollapsed
}: {
    domains: Domains
    sidebarData: { [key: string]: domainsLeftNav }
    navRequest: { id: string; nonce: number } | null
    onSearchOpen: () => void
    searchTriggerRef: React.RefObject<HTMLButtonElement | null>
    collapsed: boolean
    onToggleCollapsed: () => void
}) {
    const [selectedId, setSelectedId] = React.useState<string | undefined>(
        () =>
            typeof window !== 'undefined' && window.location.hash
                ? window.location.hash.substring(1)
                : undefined
    )
    const [handledNonce, setHandledNonce] = React.useState(0)

    // Search jumps carry a nonce so re-selecting the same id still re-runs
    // LeftNav's scroll effect, which React would bail out of on Object.is.
    if (navRequest && navRequest.nonce !== handledNonce) {
        setHandledNonce(navRequest.nonce)
        setSelectedId(navRequest.id)
    }

    // Observe the hash or hash change in the URL to set the selectedId
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash
            const nextSelectedId = hash ? hash.substring(1) : undefined
            setSelectedId(prev =>
                prev === nextSelectedId ? prev : nextSelectedId
            )
        }
        window.addEventListener('hashchange', handleHashChange)
        handleHashChange()
        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [])

    return (
        <Box as='nav' position='sticky' top='20px'>
            {collapsed ? (
                <VStack gap={2}>
                    <Tooltip content='Expand navigation'>
                        <IconButton
                            size='sm'
                            variant='ghost'
                            borderRadius='50%'
                            aria-label='Expand navigation'
                            aria-expanded={false}
                            aria-controls={LEFT_NAV_ID}
                            onClick={onToggleCollapsed}
                        >
                            <IconChevronRight size='sm' color='information' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Search (⌘K)'>
                        <IconButton
                            ref={searchTriggerRef}
                            size='sm'
                            variant='ghost'
                            borderRadius='50%'
                            aria-label='Search API documentation'
                            aria-keyshortcuts='Meta+K Control+K'
                            onClick={onSearchOpen}
                        >
                            <IconSearch
                                size='sm'
                                className={styles.searchIcon}
                            />
                        </IconButton>
                    </Tooltip>
                </VStack>
            ) : (
                <Flex px={2} gap={2} align='center'>
                    <Box flex='1' minW={0}>
                        <SearchTrigger
                            ref={searchTriggerRef}
                            onClick={onSearchOpen}
                        />
                    </Box>
                    <IconButton
                        size='sm'
                        variant='ghost'
                        borderRadius='50%'
                        aria-label='Collapse navigation'
                        aria-expanded={true}
                        aria-controls={LEFT_NAV_ID}
                        onClick={onToggleCollapsed}
                    >
                        <IconChevronLeft size='sm' color='information' />
                    </IconButton>
                </Flex>
            )}
            {/* Hidden rather than unmounted so each LeftNavItem keeps its own
                open state and LeftNav's scroll effect does not re-fire. */}
            <Box id={LEFT_NAV_ID} display={collapsed ? 'none' : 'block'}>
                <LeftNav
                    data={sidebarData}
                    selectedId={selectedId}
                    domains={domains}
                    setSelectedId={setSelectedId}
                    navNonce={handledNonce}
                />
            </Box>
        </Box>
    )
}
