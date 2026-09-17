/* istanbul ignore file */
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
    Box,
    Center,
    Flex,
    Icon,
    SimpleGrid,
    Spinner,
    Text
} from '@chakra-ui/react'
import {
    IconBarChart,
    IconGrid,
    IconDocument,
    IconList,
    IconPieChart,
    IconSetting
} from '@americanexpress/dls-icons'
import { MetamodelTableHeader } from './MetamodelTableHeader'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import { notFound } from 'next/navigation'
import { isMetamodelDatasetEnabled, type MetamodelDataset } from '../constants'

interface HubEntry {
    dataset: MetamodelDataset
    title: string
    description: string
    link: string
    icon: typeof IconBarChart
}

const ENTRIES: HubEntry[] = [
    {
        dataset: 'initiatives',
        title: 'Initiatives',
        description: 'Browse, filter and edit initiatives.',
        link: '/resources/metamodel/initiatives',
        icon: IconBarChart
    },
    {
        dataset: 'applications',
        title: 'Applications',
        description: 'Browse, filter and edit applications.',
        link: '/resources/metamodel/applications',
        icon: IconGrid
    },
    {
        dataset: 'adrs',
        title: 'ADRs',
        description: 'Browse architecture decision records.',
        link: '/resources/metamodel/adrs',
        icon: IconDocument
    },
    {
        dataset: 'bvbs',
        title: 'Build vs Buy Assessments',
        description: 'Browse build-vs-buy assessments.',
        link: '/resources/metamodel/bvbs',
        icon: IconList
    },
    {
        dataset: 'company-domains',
        title: 'Company Domains',
        description: 'Browse company domains.',
        link: '/resources/metamodel/company-domains',
        icon: IconPieChart
    },
    {
        dataset: 'technical-capabilities',
        title: 'Technical Capabilities',
        description: 'Browse technical capabilities.',
        link: '/resources/metamodel/technical-capabilities',
        icon: IconSetting
    }
]

const VISIBLE_ENTRIES = ENTRIES.filter(entry =>
    isMetamodelDatasetEnabled(entry.dataset)
)

export default function MetamodelHub() {
    const router = useRouter()
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const [isPending, startTransition] = useTransition()
    const [pendingLink, setPendingLink] = useState<string | null>(null)

    if (!isAdmin) {
        return notFound()
    }

    const navigate = (link: string) => {
        if (pendingLink) return
        setPendingLink(link)
        startTransition(() => {
            router.push(link)
        })
    }

    return (
        <Box w='100%'>
            <MetamodelTableHeader
                title='Metamodel'
                subtitle='Browse and edit metamodel datasets.'
            />
            <Box px={6} pb={10}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                    {VISIBLE_ENTRIES.map(entry => {
                        const isNavigating =
                            isPending && pendingLink === entry.link
                        return (
                            <Flex
                                key={entry.title}
                                role='group'
                                position='relative'
                                direction='column'
                                gap={3}
                                p={5}
                                borderWidth='1px'
                                borderColor='border'
                                borderRadius='md'
                                cursor={pendingLink ? 'wait' : 'pointer'}
                                aria-busy={isNavigating}
                                opacity={pendingLink && !isNavigating ? 0.6 : 1}
                                transition='box-shadow 0.15s, border-color 0.15s'
                                _hover={{
                                    borderColor: 'blue.500',
                                    boxShadow: 'md'
                                }}
                                onClick={() => navigate(entry.link)}
                            >
                                <Icon
                                    as={entry.icon}
                                    boxSize={7}
                                    color='blue.600'
                                />
                                <Text fontSize='lg' fontWeight={600}>
                                    {entry.title}
                                </Text>
                                <Text fontSize='sm' color='fg.subtle'>
                                    {entry.description}
                                </Text>
                                {isNavigating && (
                                    <Center
                                        position='absolute'
                                        inset={0}
                                        bg='bg/70'
                                        borderRadius='md'
                                    >
                                        <Spinner
                                            size='lg'
                                            color='blue.600'
                                            data-testid={`metamodel-card-spinner-${entry.title}`}
                                        />
                                    </Center>
                                )}
                            </Flex>
                        )
                    })}
                </SimpleGrid>
            </Box>
        </Box>
    )
}
