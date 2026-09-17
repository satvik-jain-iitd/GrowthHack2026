/* istanbul ignore file */

import { Box, HStack, Link } from '@chakra-ui/react'
import { ContentSection } from './ContentSection'
import React from 'react'
import { useGetDomainInfo } from '../hooks/useGetDomainInfo'
import { MidSectionContent } from './MidSectionContent'
import {
    domainsLeftNav,
    apisLeftNav,
    DomainInfo
} from '@/app/api-docs/types/apiDocs'
import Styles from '@/app/api-docs/api-docs.module.scss'
import { getUrlByDomainId } from '@/app/company-domains/constants'
import { Domain } from '@/app/company-domains/types'

function RightSectionContent({ domain }: { domain: DomainInfo }) {
    const { id, playbookId } = domain
    const apiDocsLink = getUrlByDomainId(id)
    const helpfulLinks: {
        icon?: React.ReactNode
        href: string
        label: string
    }[] = [
        {
            href: `/docs/${playbookId}` || '',
            label: 'Company Domain Architecture'
        },
        {
            href: apiDocsLink || '',
            label: '2.3 Company Domain APIs'
        }
    ]
    return (
        <Box
            bg='gray.50'
            _dark={{ bg: '#1b1e25' }}
            borderRadius='lg'
            w='100%'
            borderColor='#D4DEE9'
            borderWidth='1px'
        >
            <Box
                className={Styles.endpointsHeader}
                borderTopRadius='inherit'
                fontWeight='600'
                _dark={{
                    color: '#c8c9c7',
                    bg: '#21252c'
                }}
            >
                Company Domain Related Links
            </Box>
            <Box
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(180px, 1fr))'
                gap={4}
                p='1rem'
                className={Styles.apiDocsFontSize}
            >
                {helpfulLinks.map(({ icon: Icon, href, label }) => (
                    <HStack gap={3} key={label}>
                        {Icon && Icon}
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            href={href}
                            color='#006fcf'
                            fontWeight='400'
                            _dark={{ color: '#c8c9c7' }}
                            target='_blank'
                        >
                            {label}
                        </Link>
                    </HStack>
                ))}
            </Box>
        </Box>
    )
}

export function DomainSection({
    domainId,
    data,
    domainGroup
}: {
    domainId: string
    data: {
        domains: Domain[] | undefined
        loading: boolean
        error: Error | null
    }
    domainGroup: domainsLeftNav
}) {
    const domain = useGetDomainInfo(domainId, data)
    const { description } = domain
    const metrics = [
        {
            label: 'APIs',
            value: Object.keys(domainGroup.apis).length
        },
        {
            label: 'Operations',
            value: Object.values(domainGroup.apis).reduce(
                (acc: number, api: apisLeftNav) =>
                    acc + Object.keys(api.operations).length,
                0
            )
        }
    ]
    return (
        <ContentSection
            id={domainId}
            midSection={
                <MidSectionContent
                    domain={domain}
                    description={description}
                    metricsTitle={'Company Domain APIs Metrics:'}
                    metrics={metrics ?? []}
                />
            }
            rightSection={<RightSectionContent domain={domain} />}
        />
    )
}
