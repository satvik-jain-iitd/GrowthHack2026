/* istanbul ignore file */

import { Box, Link, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import { ContentSection } from './ContentSection'
import {
    IconLink,
    IconOpenBanking,
    IconSource
} from '@americanexpress/dls-icons'
import { MidSectionContent } from './MidSectionContent'
import {
    introSectionDescription,
    introSectionMetricsTitle,
    introSectionTitle
} from '@/app/api-docs/constants/apiDocs'
import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { getDomainMetrics } from '@/app/api-docs/utils'

const helpfulLinks = [
    {
        icon: IconLink,
        href: 'https://enterprise-confluence.aexp.com/confluence/pages/viewpage.action?pageId=180529502&spaceKey=OIST&title=A2A%2BIntegrations',
        label: 'A2A Authorization'
    },
    {
        icon: IconOpenBanking,
        href: 'https://architecture1.aexp.com/adrs/5a717bf0-3cf6-41e6-b5b5-4a8d79c09f72',
        label: 'API Gateways'
    },
    {
        icon: IconSource,
        href: 'https://architecture1.aexp.com/adrs/ae6f6aae-e7c9-4372-8129-85dea782b472',
        label: 'API Hosting Platforms'
    }
]

function RightSectionContent() {
    return (
        <Box
            bg='gray.50'
            _dark={{ bg: '#1b1e25' }}
            borderRadius='lg'
            boxShadow='lg'
            w='100%'
            mt={4}
            backgroundColor='transparent'
        >
            <Box
                borderTopRadius='inherit'
                bg={'#006FCF'}
                p='8px 12px'
                position='sticky'
                fontWeight='600'
                color={'#ffffff'}
                _dark={{
                    color: '#c8c9c7',
                    bg: '#21252c'
                }}
            >
                Helpful Links
            </Box>
            <VStack
                gap={4}
                p='1rem'
                alignItems='flex-start'
                backgroundColor='transparent'
            >
                {helpfulLinks.map(({ icon: Icon, href, label }) => (
                    <HStack gap={3} key={label}>
                        <Icon color='neutral' />
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            href={href}
                            color='#85E9FF'
                            fontWeight='400'
                            _dark={{ color: '#c8c9c7' }}
                        >
                            {label}
                        </Link>
                    </HStack>
                ))}
            </VStack>
        </Box>
    )
}

export function IntroSection({ data }: { data: domainsLeftNav[] }) {
    const domainsList = data ? data : []
    const docsMetrics = getDomainMetrics(domainsList)

    const metrics: { label: string; value: number }[] = [
        {
            label: 'Company Domains',
            value: docsMetrics?.totalCompanyDomains || 0
        },
        { label: 'Total APIs', value: docsMetrics?.totalAPIs || 0 },
        { label: 'Total Operations', value: docsMetrics?.totalOperations || 0 }
    ]
    return (
        <ContentSection
            id='intro-section'
            midSection={
                <MidSectionContent
                    title={introSectionTitle}
                    description={introSectionDescription}
                    metricsTitle={introSectionMetricsTitle}
                    metrics={metrics}
                    id='intro-section-content'
                />
            }
            rightSection={<RightSectionContent />}
            firstSection
        />
    )
}
