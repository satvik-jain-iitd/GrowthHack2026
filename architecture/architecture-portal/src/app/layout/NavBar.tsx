/* istanbul ignore file */
'use client'
import * as React from 'react'
import { NoPrefetchLink } from '@/components/ui'
import Image from 'next/image'
import { Box, Flex, IconButton, Text, Link } from '@chakra-ui/react'
import HamburgerMenu from '@/app/layout/HamburgerMenu'
import NavBarTabs from '@/app/layout/NavBarTabs'
import AutocompleteSearch from '@/app/layout/AutocompleteSearch'
import ThemeModeButton from '@/app/layout/ThemeModeButton'
import UserIcon from '@/app/layout/UserIcon'
import MaintenanceBanner from '@/app/layout/MaintenanceBanner'
import { ARCH_PORTAL_HELP_SLACK_URL } from '@/constants'
import { NAVBAR_HEIGHT, MAINTENANCE_BANNER_HEIGHT } from '@/constants/layout'
import { useScrollContext, useNavbarContext } from '@/context'
import { useMaintenanceModeVisible } from '@/hooks'

export default function NavBar({ children }: { children: React.ReactNode }) {
    const { scrollRef } = useScrollContext()
    const { hidden } = useNavbarContext()
    const bannerVisible = useMaintenanceModeVisible()
    const showBanner = !hidden && bannerVisible
    return (
        <Box flexGrow={1} height='100vh'>
            {!hidden && (
                <Box
                    as='header'
                    position='fixed'
                    height={NAVBAR_HEIGHT}
                    width='100%'
                    zIndex={1201}
                    boxShadow={{ base: 'md', _dark: 'none' }}
                >
                    <Flex
                        px={4}
                        py={2}
                        bg='surface.white'
                        justifyContent='space-between'
                        height='100%'
                    >
                        <Flex align='center'>
                            <HamburgerMenu />
                            <NoPrefetchLink href='/'>
                                <IconButton
                                    variant='ghost'
                                    color='#006fcf'
                                    borderRadius='50%'
                                >
                                    <Image
                                        src='/ArchitecturePortalLogo.svg'
                                        alt='Architecture Portal Logo'
                                        width={25}
                                        height={25}
                                    />
                                </IconButton>
                            </NoPrefetchLink>
                            <Text
                                display={{ base: 'none', md: 'block' }}
                                color={{ base: '#00175a', _dark: '#1a88e9ff' }}
                                fontWeight='bold'
                                textDecoration='none'
                                cursor='pointer'
                                ml={2}
                                fontSize='16px'
                                truncate
                            >
                                <NoPrefetchLink href='/'>
                                    Architecture Portal
                                </NoPrefetchLink>
                            </Text>
                            <NavBarTabs
                                css={{
                                    display: { base: 'none', lg: 'flex' },
                                    pl: '10px',
                                    alignItems: 'center',
                                    alignContent: 'center'
                                }}
                            />
                        </Flex>
                        <Flex align='center'>
                            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                            <Link
                                as={NoPrefetchLink}
                                href={ARCH_PORTAL_HELP_SLACK_URL}
                                target='_blank'
                                display={{ base: 'none', md: 'flex' }}
                                mr={2}
                            >
                                <IconButton borderRadius='50%' variant='ghost'>
                                    <Image
                                        src='/slack-icon-size_256.png'
                                        alt='Slack'
                                        width={24}
                                        height={24}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </IconButton>
                            </Link>
                            <AutocompleteSearch />
                            <UserIcon />
                            <ThemeModeButton />
                        </Flex>
                    </Flex>
                </Box>
            )}
            {!hidden && <MaintenanceBanner />}
            <Box
                data-testid='navbar-content'
                mt={
                    hidden
                        ? 0
                        : showBanner
                          ? `calc(${NAVBAR_HEIGHT} + ${MAINTENANCE_BANNER_HEIGHT})`
                          : NAVBAR_HEIGHT
                }
                height={
                    hidden
                        ? '100vh'
                        : showBanner
                          ? `calc(100vh - ${NAVBAR_HEIGHT} - ${MAINTENANCE_BANNER_HEIGHT})`
                          : `calc(100vh - ${NAVBAR_HEIGHT})`
                }
                scrollBehavior='smooth'
                overflowY='auto'
                ref={scrollRef}
            >
                {children}
            </Box>
        </Box>
    )
}
