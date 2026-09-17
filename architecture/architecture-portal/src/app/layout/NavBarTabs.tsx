/* istanbul ignore file */
'use client'
import React, { useState, useEffect } from 'react'
import { Box, Button, SystemStyleObject } from '@chakra-ui/react'
import { NoPrefetchLink as Link } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { useNavbarContext } from '@/context'
import { NAVBAR_FONT_SIZE } from '@/constants/layout'

const validTabsArray = [
    'initiatives',
    'company-domains',
    'business-architecture',
    'enterprise-customer-journeys',
    'foundational-technologies',
    'adrs',
    'build-vs-buys',
    'directory',
    'resources',
    'faqs'
] as const
type Tab = (typeof validTabsArray)[number] | null

const validTabs = new Set(validTabsArray)
const tabsList: {
    label: string
    href: string
    tab: (typeof validTabsArray)[number]
}[] = [
    {
        label: 'Initiatives',
        href: '/initiatives',
        tab: 'initiatives'
    },
    {
        label: 'Company Domains',
        href: '/company-domains',
        tab: 'company-domains'
    },
    {
        label: 'EBCM',
        href: '/business-architecture',
        tab: 'business-architecture'
    },
    {
        label: 'Enterprise Customer Journeys',
        href: '/enterprise-customer-journeys',
        tab: 'enterprise-customer-journeys'
    },
    {
        label: 'Foundational Technologies',
        href: '/foundational-technologies',
        tab: 'foundational-technologies'
    },
    {
        label: 'ADRs',
        href: '/adrs',
        tab: 'adrs'
    },
    {
        label: 'Build vs Buys',
        href: '/build-vs-buys',
        tab: 'build-vs-buys'
    },
    {
        label: 'Applications',
        href: '/directory',
        tab: 'directory'
    },
    {
        label: 'Resources',
        href: '/resources',
        tab: 'resources'
    },
    {
        label: 'FAQs',
        href: '/faqs',
        tab: 'faqs'
    }
]

function NavBarButton({
    value,
    tab,
    label,
    handleClick
}: {
    value: Tab
    tab: Tab
    label: string
    handleClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        tab: Tab
    ) => void
}) {
    return (
        <Button
            variant='ghost'
            color='fg.info'
            onClick={event => handleClick(event, tab)}
            borderRadius='0'
            whiteSpace='nowrap'
            justifyContent='center'
            alignItems='center'
            textAlign='center'
            minH='40px'
            fontSize={NAVBAR_FONT_SIZE}
            paddingX={2}
            boxShadow={value === tab ? 'inset 0 -4px 0 0 #ff8f00' : 'none'}
            _hover={{ bg: 'gray.100', _dark: { bg: 'gray.700' } }}
        >
            {label}
        </Button>
    )
}

export default function NavBarTabs({
    css
}: {
    css?:
        | SystemStyleObject
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | Omit<(SystemStyleObject | undefined)[], keyof any[]>
}) {
    const path = usePathname()
    const { slug } = useNavbarContext()
    const [value, setValue] = useState<Tab>(null)

    useEffect(() => {
        let route = slug ?? path ?? ''
        if (route.startsWith('/')) route = route.slice(1)
        if (validTabs.has(route as (typeof validTabsArray)[number])) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setValue(route as Tab)
        } else {
            setValue(null)
        }
    }, [slug, path])

    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        tab: Tab
    ): void => {
        setValue(tab)
    }

    return (
        <Box css={css}>
            {tabsList.map((item, index) => {
                // Special handling for foundational-technologies
                if (item.tab === 'foundational-technologies') {
                    return (
                        <React.Fragment key={index}>
                            {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                            <a href={item.href}>
                                <NavBarButton
                                    value={value}
                                    tab={item.tab}
                                    label={item.label}
                                    handleClick={handleClick}
                                />
                            </a>
                        </React.Fragment>
                    )
                }

                // Default case
                return (
                    <Link key={index} href={item.href}>
                        <NavBarButton
                            value={value}
                            tab={item.tab}
                            label={item.label}
                            handleClick={handleClick}
                        />
                    </Link>
                )
            })}
        </Box>
    )
}
