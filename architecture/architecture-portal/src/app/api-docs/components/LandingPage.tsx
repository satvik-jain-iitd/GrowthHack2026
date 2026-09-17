/* istanbul ignore file */

'use client'

import React, { useCallback, useMemo, useRef } from 'react'
import { Box, Spinner, RadioGroup, HStack, VStack } from '@chakra-ui/react'
import LeftPanel from './LeftPanel'
import CenterContent from './CenterContent'
import styles from '@/app/api-docs/api-docs.module.scss'
import { useGetDomains } from '@/app/company-domains/hooks'
import { useGetApiDocsSidebar } from '@/app/api-docs/components/hooks/useGetApiDocsSidebar'
import { useSearchHotkeys } from '@/app/api-docs/components/hooks'
import {
    APIDOCS_LEFT_NAV_WIDTH,
    APIDOCS_LEFT_NAV_COLLAPSED_WIDTH
} from '@/constants'
import { STATUS_FILTERS } from '@/app/api-docs/constants'
import { getFilteredData } from '@/app/api-docs/utils'
import { IntroSection } from './centercontent/'
import { SearchDialog } from './leftpanel/search'
import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'

export default function LandingPage() {
    const [filter, setFilter] = React.useState('all')
    // The dialog lives here rather than in LeftPanel: `.apiDocs .leftNav` is
    // display:none below 1000px, which would unmount every hotkey listener.
    const [searchOpen, setSearchOpen] = React.useState(false)
    const [navCollapsed, setNavCollapsed] = React.useState(false)
    const [navRequest, setNavRequest] = React.useState<{
        id: string
        nonce: number
    } | null>(null)
    const nonceRef = useRef(0)
    const searchTriggerRef = useRef<HTMLButtonElement>(null)

    const domains = useGetDomains()
    const data = useGetApiDocsSidebar()

    const { loading } = domains
    const handleFilter = (value: string) => {
        setFilter(value)
    }
    // filter the sidebar data based on the selected filter
    const filteredData = useMemo(() => {
        return getFilteredData(data?.sidebarData, filter)
    }, [filter, data?.sidebarData])

    const openSearch = useCallback(() => setSearchOpen(true), [])
    const toggleNav = useCallback(() => setNavCollapsed(c => !c), [])
    useSearchHotkeys(searchOpen, openSearch)

    // The nonce makes selecting the same result twice re-run LeftNav's scroll
    // effect, which React would otherwise bail out of on Object.is.
    const handleNavigate = useCallback((id: string) => {
        nonceRef.current += 1
        setNavRequest({ id, nonce: nonceRef.current })
    }, [])

    if (loading || data.loading) {
        return (
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='100vh'
            >
                <Spinner size='xl' />
            </Box>
        )
    }
    const domainsList: domainsLeftNav[] = Object.values(filteredData)

    return (
        <Box
            display='flex'
            className={styles.apiDocs}
            width='100%'
            _dark={{
                backgroundColor: '#3c3c3c'
            }}
        >
            <Box
                flex='1'
                py={4}
                maxW={
                    navCollapsed
                        ? APIDOCS_LEFT_NAV_COLLAPSED_WIDTH
                        : APIDOCS_LEFT_NAV_WIDTH
                }
                minW={
                    navCollapsed
                        ? APIDOCS_LEFT_NAV_COLLAPSED_WIDTH
                        : APIDOCS_LEFT_NAV_WIDTH
                }
                transition='max-width 200ms ease, min-width 200ms ease'
                className={styles.leftNav}
                _dark={{
                    bg: '#14171d'
                }}
            >
                <LeftPanel
                    domains={domains}
                    sidebarData={filteredData}
                    navRequest={navRequest}
                    onSearchOpen={openSearch}
                    searchTriggerRef={searchTriggerRef}
                    collapsed={navCollapsed}
                    onToggleCollapsed={toggleNav}
                />
            </Box>
            <Box
                flex='1'
                minW={0}
                className={styles.centerContent}
                display='flex'
                justifyContent={'center'}
                width='100%'
                maxW='100%'
                boxSizing='border-box'
                _dark={{ bg: '#14171d' }}
            >
                <VStack boxSizing='border-box' width='100%' gap={8}>
                    <VStack
                        width='100%'
                        backgroundColor={{
                            base: '#00175a',
                            _dark: '#14171d'
                        }}
                        backgroundImage={{
                            base: 'none',
                            md: "url('/company-domains/BKG.png')"
                        }}
                        _dark={{
                            borderBottom: '0.5px solid #d8dee4'
                        }}
                        backgroundRepeat='no-repeat'
                        backgroundPositionY='bottom'
                        backgroundPositionX='right'
                    >
                        <Box width='100%' maxW={'110rem'}>
                            <IntroSection data={domainsList} />
                        </Box>
                    </VStack>
                    <HStack
                        px='2rem'
                        width='100%'
                        maxW={'110rem'}
                        flexWrap='wrap'
                        justifyContent='flex-end'
                    >
                        <Box fontSize='sm' fontWeight='bold'>
                            Filter by Status:
                        </Box>

                        <RadioGroup.Root
                            value={filter}
                            onValueChange={e => handleFilter(e.value || 'all')}
                            variant='solid'
                        >
                            <HStack gap='6'>
                                {STATUS_FILTERS.map(
                                    (item: {
                                        label: string
                                        value: string
                                    }) => (
                                        <RadioGroup.Item
                                            key={item.value}
                                            value={item.value}
                                        >
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>
                                                {item.label}
                                            </RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                    )
                                )}
                            </HStack>
                        </RadioGroup.Root>
                    </HStack>

                    <CenterContent
                        domains={domains}
                        sidebarData={filteredData}
                    />
                </VStack>
            </Box>
            <SearchDialog
                open={searchOpen}
                onOpenChange={setSearchOpen}
                sidebarData={filteredData}
                domains={domains}
                onNavigate={handleNavigate}
                triggerRef={searchTriggerRef}
            />
        </Box>
    )
}
