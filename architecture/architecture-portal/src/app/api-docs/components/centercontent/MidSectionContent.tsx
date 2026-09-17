/* istanbul ignore file */

import React from 'react'
import { Box, Text, HStack, Image, Skeleton, Link } from '@chakra-ui/react'
import Styles from '@/app/api-docs/api-docs.module.scss'
import { MetricsCard } from './MetricsCard'
import { apisLeftNav, DomainInfo } from '@/app/api-docs/types/apiDocs'
import { IconLinkOut } from '@americanexpress/dls-icons'
import { getUrlByDomainId } from '@/app/company-domains/constants/domainApiMap'

export function MidSectionContent({
    title,
    description,
    metricsTitle,
    metrics,
    domain,
    id: apiId,
    api,
    parentId
}: {
    title?: string
    description: string
    metricsTitle?: string
    metrics: { label: string; value: number }[]
    domain?: DomainInfo
    api?: apisLeftNav
    id?: string
    parentId?: string
}) {
    const { id, lightIcon, darkIcon, name, loading } = domain || {
        id: apiId
    }
    // Parent id is used for API mid-section only to generate links to the architecture portal and catalog. For domain mid-section, parentId will be undefined
    const domainId = parentId || ''
    const companyDomainLink = getUrlByDomainId(domainId)
    const apiLink = companyDomainLink ? companyDomainLink + '#' + apiId : ''
    const isIntro = id === 'intro-section-content'
    return (
        <Box id={id}>
            {!domain && (
                <Text
                    as='h3'
                    fontSize={isIntro ? '2em' : '1.5em'}
                    fontWeight='700'
                >
                    {title}
                </Text>
            )}
            {domain && (
                <Skeleton loading={loading}>
                    <HStack gap={4} mb={4}>
                        <Image
                            alt={` ${name} Logo`}
                            className='image-light'
                            width={35}
                            height={35}
                            src={`data:image/png;base64, ${lightIcon}`}
                        />
                        <Image
                            alt={` ${name} Logo`}
                            className='image-dark'
                            width={45}
                            height={45}
                            src={`data:image/png;base64, ${darkIcon}`}
                        />
                        <Text as='h3' fontSize='1.5em' fontWeight='700'>
                            {name}
                        </Text>
                    </HStack>
                </Skeleton>
            )}
            <Text
                className={isIntro ? undefined : Styles.apiDocsFontSize}
                mt='1em'
                textAlign={'justify'}
            >
                {description}
            </Text>
            {api && (
                <Box
                    className={Styles.apiDocsFontSize}
                    mt='1em'
                    gap={4}
                    display='flex'
                    flexDirection={{
                        base: 'column',
                        md: 'row'
                    }}
                >
                    {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                    <Link
                        className={Styles.apiDocsFontSize}
                        href={apiLink}
                        target='_blank'
                    >
                        <IconLinkOut /> View in Company Domain
                    </Link>
                    {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                </Box>
            )}
            <Box mt='2em'>
                {metricsTitle && (
                    <Text
                        className={Styles.apiDocsFontSize}
                        id={id + '-metrics-title'}
                    >
                        {metricsTitle}
                    </Text>
                )}
                <Box
                    display='flex'
                    justifyContent='space-between'
                    gap={6}
                    mt='1em'
                >
                    {metrics.map(({ label, value }) => (
                        <MetricsCard
                            key={label}
                            label={label}
                            value={value.toString()}
                            isIntro={isIntro}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
