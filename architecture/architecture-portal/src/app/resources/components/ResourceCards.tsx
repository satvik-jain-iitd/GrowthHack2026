/* istanbul ignore file */
'use client'

import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { useNavigation, usePilotGroup } from '@/hooks'
import {
    IconStatementReady,
    IconPieChart,
    IconLink,
    IconCart,
    IconSetting,
    IconBarChart,
    IconSparkle
} from '@americanexpress/dls-icons'
import Image from 'next/image'
import { useUserDetails } from '@/app/company-domains/hooks'
import { useEffect, useState } from 'react'
import { getPilotGroupId } from '@/constants'
import {
    DEFAULT_METRIC_VIEW,
    metricsPathFor
} from '@/app/resources/metrics/constants/metricRoutes'

const resources = [
    {
        title: 'Build vs. Buy Tracker',
        link: '/resources/bvb-tracker',
        description:
            'Build vs. Buy status tracker to monitor progress, status and completion of all current Build vs. Buy Analysis.',
        icon: <IconCart size='lg' color='information' />
    },
    {
        title: 'Company Domain Metrics',
        link: metricsPathFor(DEFAULT_METRIC_VIEW),
        description:
            'Page to monitor progress, status and completion of all current Metrics APIs.',
        icon: <IconPieChart size='lg' color='information' />
    },
    {
        title: 'AMEX Internal API Docs',
        link: '/api-docs',
        description: 'Explore all authoritative company domain APIs.',
        icon: <IconSetting size='lg' color='information' />
    },
    {
        title: 'How to Onboard Document',
        link: '/contribute/getting-started',
        description:
            'Want to contribute to the Architecture Portal? Here is the Step by Step guide to get started.',
        icon: <IconStatementReady size='lg' color='information' />
    },
    {
        title: 'Skills',
        link: '/resources/skills',
        description:
            'Discover all the skills available in the Architecture Portal with our comprehensive Skills Guide.',
        icon: <IconSparkle size='lg' color='information' />
    },
    {
        title: 'Architecture Portal APIs',
        link: '/resources/apis',
        description:
            'Explore all the APIs the architecture portal exposes to fetch data.',
        icon: <IconLink size='lg' color='information' />
    },
    {
        title: 'Enterprise Data Architecture Artifact',
        link: '/resources/edaaat',
        description:
            'A unified tool for generating information architecture playbook artifacts.',
        icon: (
            <Image
                src='/enterpriseDataArtifactIcon.svg'
                alt='Architecture Portal Logo'
                width={40}
                height={40}
            />
        )
    }
]

export default function ResourceCards() {
    const router = useNavigation()
    const [displayCards, setDisplayCards] = useState(resources)
    const { loggedInUserEmail, isAdmin } = useUserDetails()
    const planningProcessDashboardPilotGroupId = getPilotGroupId(
        'PLANNING_PROCESS_DASHBOARD_PILOT_GROUP'
    )
    const {
        pilotGroup: planningProcessDashboardPilotGroup,
        isLoading: isLoadingPlanningProcessDashboardPilotGroup,
        error: planningProcessDashboardPilotGroupError
    } = usePilotGroup(planningProcessDashboardPilotGroupId)
    const apptioPilotGroupMembers =
        planningProcessDashboardPilotGroup?.members || []

    const initiativesTablePilotGroupId = getPilotGroupId(
        'INITIATIVES_TABLE_PILOT_GROUP'
    )
    const {
        pilotGroup: initiativesTablePilotGroup,
        isLoading: isLoadingInitiativesTablePilotGroup
    } = usePilotGroup(initiativesTablePilotGroupId)
    const InitiativesTablePilotGroupMembers =
        initiativesTablePilotGroup?.members || []

    useEffect(() => {
        if (
            apptioPilotGroupMembers.length > 0 &&
            apptioPilotGroupMembers.some(
                member => member === loggedInUserEmail.toLowerCase()
            )
        ) {
            setDisplayCards(prevResources => {
                if (
                    prevResources.some(
                        r => r.title === 'Tech Investment Planning'
                    )
                ) {
                    return prevResources
                }
                return [
                    ...prevResources,
                    {
                        title: 'Tech Investment Planning',
                        link: '/resources/tech-investment-planning-dashboard',
                        description:
                            'Dashboard for Strategic Epics to proposed Enterprise Customer Journey and Enterprise Business Capability mapping to understand the Business Capabilities and their relationships with strategic epics and journeys.',
                        icon: <IconBarChart size='lg' color='information' />
                    }
                ]
            })
        }
        if (
            (InitiativesTablePilotGroupMembers.length > 0 &&
                loggedInUserEmail &&
                InitiativesTablePilotGroupMembers.some(
                    member => member === loggedInUserEmail.toLowerCase()
                )) ||
            isAdmin
        ) {
            setDisplayCards(prevResources => {
                if (prevResources.some(r => r.title === 'Initiatives Table')) {
                    return prevResources
                }
                return [
                    ...prevResources,
                    {
                        title: 'Initiatives Table',
                        link: '/resources/metamodel/initiatives',
                        description:
                            'Browse and filter all initiatives, ETPs and ECMIs.',
                        icon: (
                            <Image
                                src='/products/initiatives_icon.png'
                                alt='Initiatives'
                                width={40}
                                height={40}
                            />
                        )
                    }
                ]
            })
        }
        if (isAdmin) {
            setDisplayCards(prevResources => {
                if (prevResources.some(r => r.title === 'Metamodel')) {
                    return prevResources
                }
                return [
                    ...prevResources,
                    {
                        title: 'Metamodel',
                        link: '/resources/metamodel',
                        description:
                            'Browse read-only metamodel datasets — initiatives, applications, ADRs, BvBs, company domains, and technical capabilities.',
                        icon: <IconBarChart size='lg' color='information' />
                    }
                ]
            })
        }
    }, [
        isLoadingPlanningProcessDashboardPilotGroup,
        planningProcessDashboardPilotGroupError,
        isLoadingInitiativesTablePilotGroup,
        isAdmin,
        loggedInUserEmail
    ])

    return (
        <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={6}
            alignItems='stretch'
            width={{ xl: '50%', base: '80%' }}
        >
            {displayCards.map(resource => (
                <Box
                    key={resource.title}
                    padding={6}
                    borderRadius='lg'
                    border='1px solid'
                    borderColor='border'
                    boxShadow='md'
                    cursor='pointer'
                    display='flex'
                    flexDirection='column'
                    height='100%'
                    transition='transform 0.3s, box-shadow 0.3s'
                    onClick={() => router.push(resource.link)}
                    bgColor={{
                        _dark: 'bg.emphasized'
                    }}
                    _hover={{
                        boxShadow: 'xl',
                        transform: 'translateY(-4px)'
                    }}
                >
                    <Box
                        mb={2}
                        display='flex'
                        justifyContent='left'
                        fontSize='2xl'
                    >
                        {resource.icon}
                    </Box>
                    <Text fontSize='xl' color='fg' mb={1} textAlign='left'>
                        {resource.title}
                    </Text>
                    <Text
                        fontSize='sm'
                        color='fg.muted'
                        mb={2}
                        textAlign='left'
                    >
                        {resource.description}
                    </Text>
                </Box>
            ))}
        </SimpleGrid>
    )
}
