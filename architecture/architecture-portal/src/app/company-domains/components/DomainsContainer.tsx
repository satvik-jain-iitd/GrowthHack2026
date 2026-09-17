/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import { DomainsViewOptions } from './DomainsViewOptions'
import {
    domainViews,
    VERSION_1_DOMAINS_LABEL,
    VERSION_1_DOMAINS_UUIDS
} from '../constants'
import { VersionToggle } from '.'
import styles from '../domains-page.module.scss'
import { Flex, Box, Text, Spinner } from '@chakra-ui/react'
import { DOMAIN_TEST_IDS } from '../test-ids'
import { Filters } from '@/app/company-domains/types'
import { DomainsCardView } from './CardView'
import { DomainsOwnerListView } from './OwnerView'
import { DomainsListView } from './ListView'
import { useDomainContext } from '@/context/DomainContext'

interface Props {
    viewState: domainViews
}

export const DomainsContainer = ({ viewState }: Props) => {
    const [view, setView] = useState(
        viewState === domainViews.ownerView
            ? domainViews.ownerView
            : domainViews.cardView
    )
    const [filters, setFilters] = useState<Partial<Record<Filters, boolean>>>({
        [VERSION_1_DOMAINS_LABEL]: false,
        viewAll: true
    })
    const [isV1, setIsV1] = useState(false)

    const { loading, error, domains } = useDomainContext() || {}

    const domainCategories = [
        ...new Set(
            domains
                ?.filter(x => x.domain_category_nm !== 'Others')
                .sort((a, b) => a.domain_category_sort - b.domain_category_sort)
                .map(x => x.domain_category_nm)
        )
    ]

    const categories = [...domainCategories]
    const viewFilters: Filters[] = filters['viewAll']
        ? domainCategories
        : domainCategories.filter(x => !!filters[x])
    const filteredDomains = domains
        ?.filter(
            x =>
                x.company_domain_id &&
                viewFilters.includes(x.domain_category_nm) &&
                (!filters[VERSION_1_DOMAINS_LABEL] ||
                    VERSION_1_DOMAINS_UUIDS.has(x.company_domain_id))
        )
        .sort((a, b) => a.company_domain_sort - b.company_domain_sort)

    const handleFilterChange = (buttonName: Filters) => {
        if (buttonName === 'viewAll') {
            return setFilters({
                ...Object.keys(filters).map(key => [key, false]),
                [VERSION_1_DOMAINS_LABEL]: isV1,
                viewAll: true
            })
        } else if (buttonName === VERSION_1_DOMAINS_LABEL) {
            setIsV1(!isV1)
            return setFilters({
                ...Object.keys(filters).map(key => [key, false]),
                viewAll: true,
                [VERSION_1_DOMAINS_LABEL]: !filters[VERSION_1_DOMAINS_LABEL]
            })
        } else if (viewFilters.length === 1 && !!filters[buttonName]) {
            return setFilters({
                ...filters,
                [buttonName]: !filters[buttonName],
                viewAll: true
            })
        } else {
            return setFilters({
                ...filters,
                viewAll: false,
                [buttonName]: !filters[buttonName]
            })
        }
    }

    const onViewChange = (view: domainViews) => setView(view)

    return (
        <Box className={styles.domainContainer} width='100%'>
            <Flex
                width='100%'
                justifyContent='center !important'
                direction={'column'}
            >
                <Flex
                    direction={{
                        base: 'column',
                        md: 'row'
                    }}
                    marginBottom={'50px'}
                    justifyContent={{ base: 'flex-start', md: 'space-between' }}
                    height='180px'
                    backgroundColor={{
                        base: '#00175a',
                        _dark: '#1c1c1c'
                    }}
                    backgroundImage={{
                        base: 'none',
                        md: "url('/company-domains/BKG.png')"
                    }}
                    backgroundRepeat='no-repeat'
                    backgroundPosition='right'
                    backgroundSize='contain'
                >
                    <Box
                        pt={{ base: '10px', md: '60px' }}
                        position='relative'
                        className={styles.domainTitleContainer}
                        px='10vw'
                    >
                        <Text
                            data-testid={DOMAIN_TEST_IDS.headerText}
                            style={{
                                whiteSpace: 'nowrap',
                                paddingTop: '10px',
                                width: '50%',
                                font: 'BentonSans',
                                fontSize: '37px',
                                fontWeight: 300,
                                lineHeight: '44px',
                                textAlign: 'left',
                                color: '#ffffff'
                            }}
                        >
                            Company Domains
                        </Text>
                        <Box
                            fontSize='15px'
                            fontWeight='400'
                            lineHeight='24px'
                            textAlign='left'
                            color='#ffffff'
                        >
                            <Text>
                                Explore Company Domains in American Express.
                            </Text>
                        </Box>
                    </Box>
                    <VersionToggle
                        isV1={isV1}
                        handleVersionChange={() =>
                            handleFilterChange(VERSION_1_DOMAINS_LABEL)
                        }
                    />
                </Flex>
                <Flex
                    className='flex-item-growmargin-3-t'
                    width='100%'
                    background='transparent'
                    paddingTop='25px'
                    paddingLeft='10vw'
                    paddingRight='10vw'
                    overflow='hidden'
                    flexDirection='column'
                    zIndex='1'
                    backgroundColor='transparent'
                    alignItems='center'
                >
                    <Box maxWidth='1520px' width='100%'>
                        <DomainsViewOptions
                            categories={categories}
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                            view={view}
                            onViewChange={onViewChange}
                            domains={domains}
                        />
                    </Box>
                    {loading ? (
                        <Flex justify='center' align='center' minH='200px'>
                            <Spinner />
                        </Flex>
                    ) : error ? (
                        <Text color='red.500'>Failed to load playbooks.</Text>
                    ) : (
                        <>
                            <Box position='relative'>
                                <Box>
                                    {view === 'listView' ? (
                                        <DomainsListView
                                            domains={filteredDomains}
                                            isV1={isV1}
                                        />
                                    ) : view === 'cardView' ? (
                                        <DomainsCardView
                                            viewFilters={viewFilters}
                                            domains={filteredDomains}
                                            isV1={isV1}
                                        />
                                    ) : (
                                        <DomainsOwnerListView
                                            domains={filteredDomains}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </>
                    )}
                </Flex>
            </Flex>
        </Box>
    )
}
