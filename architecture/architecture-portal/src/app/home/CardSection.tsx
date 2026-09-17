'use client'
import React from 'react'
import { Playbook } from '@/types/Playbook'
import { usePlaybooks } from '@/hooks'
import { PLAYBOOK_TYPE_IDS } from '@/constants'
import { Box, Grid, Stack, Text, Card, Link } from '@chakra-ui/react'
import { LandingCards } from '@/app/home/LandingCards'
import { NoPrefetchLink as NextLink } from '@/components/ui'
import Image from 'next/image'

type SidebarItem = {
    title: string
    icon: string
    darkIcon: string
    links: SidebarLink[]
}

type SidebarLink = {
    label: string
    link: string
    target?: string
}

export default function CardSection() {
    const { playbooks } = usePlaybooks()
    const sidebar: SidebarItem[] = [
        {
            title: 'Trending Initiatives',
            icon: '/trend-icons/blueUpwardTrend.png',
            darkIcon: '/trend-icons/blueUpwardTrendDm.png',
            links:
                playbooks
                    ?.filter(
                        ({ add_da, playbook_type_id }: Playbook) =>
                            playbook_type_id === PLAYBOOK_TYPE_IDS.INITIATIVE &&
                            add_da &&
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (add_da as any).trendingNumber
                    )
                    .sort(
                        (a: Playbook, b: Playbook) =>
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (a.add_da as any).trendingNumber -
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (b.add_da as any).trendingNumber
                    )
                    .slice(0, 4)
                    .map(initiative => ({
                        label: initiative.playbook_nm,
                        link: `/docs/${initiative.playbook_id}`
                    })) ?? []
        },
        {
            title: 'Important Links',
            icon: '/InitiativeSide.png',
            darkIcon: '/InitiativeSideDark.png',
            links: [
                {
                    label: 'EA Vision & Strategy',
                    link: '/strategy/ea-vision-and-strategy'
                },
                {
                    label: 'TECH05.10 ETP/ECMI Playbook Adoption',
                    link: 'https://architecture.aexp.com/governance/compliance/tech0510-compliance?category=etp',
                    target: '_blank'
                },
                {
                    label: 'Authoritative Domain API',
                    link: '/strategy/authoritative-domain-api-lifecycle'
                }
            ]
        },
        {
            title: "What's New",
            icon: '/newSide.png',
            darkIcon: '/newSideDark.png',
            links: [
                {
                    label: 'EA Playbook Metrics',
                    link: 'https://enterprise-confluence.aexp.com/confluence/pages/viewpage.action?pageId=1394813924',
                    target: '_blank'
                },
                // {
                //     label: 'Latest Portal Release Notes',
                //     link: '#'
                // },
                {
                    label: 'EA Design Playbook Template v2.0 Launch – List of Changes',
                    link: '/contribute/EA-Design-Playbook-Template-v2.0-Launch-List-of-Changes#ea-design-playbook-template-v20-launch-list-of-changes'
                }
            ]
        }
    ]

    return (
        <Box mt={6} display='flex' justifyContent='center' width='100%'>
            <Grid
                templateColumns={{
                    xl: '3fr 1fr',
                    lg: '3fr 1fr',
                    md: '1fr',
                    sm: '1fr'
                }}
                gap={6}
                width='100%'
                maxW='1520px'
                px={{ base: 4, md: 6 }}
            >
                <Box>
                    <LandingCards />
                </Box>
                <Box>
                    <Card.Root
                        borderTop='8px solid #1976d2'
                        boxShadow='md'
                        css={{ _dark: { bgColor: 'bg.emphasized' } }}
                    >
                        <Card.Body>
                            {sidebar.map(({ title, icon, darkIcon, links }) => (
                                <Stack key={title} mb={6}>
                                    <Box display='flex' alignItems='center'>
                                        <Image
                                            alt='Icon'
                                            src={darkIcon}
                                            className='image-dark'
                                            width={40}
                                            height={40}
                                        />
                                        <Image
                                            alt='Icon'
                                            src={icon}
                                            className='image-light'
                                            width={40}
                                            height={40}
                                        />
                                        <Text fontSize='xl' ml={2}>
                                            {title}
                                        </Text>
                                    </Box>
                                    <Stack mt={2}>
                                        {links.map((x, i) => (
                                            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                                            <Link
                                                key={i}
                                                as={NextLink}
                                                href={x.link}
                                                target={x.target}
                                                color='fg.info'
                                                textDecoration='none'
                                                ml={6}
                                                width='fit-content'
                                                _hover={{
                                                    textDecoration: 'underline'
                                                }}
                                                _focus={{
                                                    outline: 'none',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                {x.label}
                                            </Link>
                                        ))}
                                    </Stack>
                                </Stack>
                            ))}
                        </Card.Body>
                    </Card.Root>
                </Box>
            </Grid>
        </Box>
    )
}
