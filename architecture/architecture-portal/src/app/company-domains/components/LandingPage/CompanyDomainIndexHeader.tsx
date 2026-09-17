'use client'
import React from 'react'
import Image from 'next/image'
import { DOMAIN_API_MAP } from '@/app/company-domains/constants'
import { ENVIRONMENT as ENVIRONMENT_KEY, PLAYBOOK_TYPE_IDS } from '@/constants'
import { Domain } from '@/app/company-domains/types'
import { Flex, Link } from '@chakra-ui/react'
import { NoPrefetchLink as NextLink } from '@/components/ui'
import styles from '@/app/company-domains/company-domain-landing.module.css'
import { PrevNext } from '@/types/PrevNext'
import AddAdrButton from '@/app/docs/components/AddAdrButton'

export const CompanyDomainIndexHeader = ({
    domain,
    prevNext,
    playbookId,
    repo
}: {
    domain: Domain
    prevNext: PrevNext
    playbookId?: string
    repo?: string
}) => {
    const {
        im_light_tx: imgSrcLM,
        im_dark_tx: imgSrcDM,
        cntrb_in: contributionStat,
        domain_nm: domainName
    } = domain || {}

    return (
        <Flex
            justifyContent={'space-between'}
            alignItems={{ base: 'center', mdDown: 'flex-start' }}
            flexDirection={{
                base: 'row',
                mdDown: 'column'
            }}
        >
            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                cursor={'default'}
            >
                <Image
                    alt='Domain'
                    src={`data:image/png;base64, ${imgSrcDM}`}
                    className='image-dark'
                    style={{ cursor: 'default' }}
                    width={35}
                    height={35}
                />
                <Image
                    alt='Domain'
                    src={`data:image/png;base64, ${imgSrcLM}`}
                    className='image-light'
                    style={{ cursor: 'default' }}
                    width={35}
                    height={35}
                />
                <h1 className={styles.domainLandingPageTitle}>{domainName}</h1>
            </Flex>

            <Flex direction='column'>
                {contributionStat && prevNext?.next?.href && (
                    // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                    <Link
                        as={NextLink}
                        style={{
                            color: '#006fcf',
                            cursor: 'pointer'
                        }}
                        _hover={{ textDecoration: 'underline' }}
                        variant={'plain'}
                        href={prevNext?.next.href}
                    >
                        Architecture Docs
                    </Link>
                )}
                {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                <Link
                    as={NextLink}
                    style={{
                        color: '#006fcf',
                        cursor: 'pointer'
                    }}
                    _hover={{ textDecoration: 'underline' }}
                    variant={'plain'}
                    href='/directory'
                >
                    Application Meta Model
                </Link>
                {DOMAIN_API_MAP[
                    domain.company_domain_id as keyof typeof DOMAIN_API_MAP
                ]?.[
                    ENVIRONMENT_KEY as keyof (typeof DOMAIN_API_MAP)[keyof typeof DOMAIN_API_MAP]
                ] && (
                    // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                    <Link
                        as={NextLink}
                        style={{
                            color: '#006fcf',
                            cursor: 'pointer'
                        }}
                        _hover={{ textDecoration: 'underline' }}
                        variant={'plain'}
                        href={
                            DOMAIN_API_MAP[
                                domain.company_domain_id as keyof typeof DOMAIN_API_MAP
                            ]?.[
                                ENVIRONMENT_KEY as keyof (typeof DOMAIN_API_MAP)[keyof typeof DOMAIN_API_MAP]
                            ] || '#'
                        }
                    >
                        Company Domain APIs
                    </Link>
                )}
                {playbookId && repo && (
                    <AddAdrButton
                        playbookId={playbookId}
                        repo={repo}
                        playbookTypeId={PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN}
                        text
                    />
                )}
            </Flex>
        </Flex>
    )
}

export default CompanyDomainIndexHeader
