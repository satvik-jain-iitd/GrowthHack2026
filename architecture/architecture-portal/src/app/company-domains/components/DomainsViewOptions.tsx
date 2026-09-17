import React from 'react'
import { Button, Stack, HStack, Flex } from '@chakra-ui/react'
import { getNumDomains, getCategoryName } from '../utils'
import { Tooltip, NoPrefetchLink as Link } from '@/components/ui'
import { domainViews, VERSION_1_DOMAINS_LABEL } from '../constants'
import { Domain, DomainCategory, Filters } from '../types/domains'
import { DOMAIN_TEST_IDS } from '../test-ids'
import styles from '../domains-page.module.scss'
import { OwnersIcon, GridIcon, MetricsIcon, ListIcon } from '@/components/icons'
import {
    DEFAULT_METRIC_VIEW,
    metricsPathFor
} from '@/app/resources/metrics/constants/metricRoutes'

interface Props {
    categories: DomainCategory[]
    filters: Partial<Record<Filters, boolean>>
    handleFilterChange: (category: Filters) => void
    view: domainViews
    onViewChange: (view: domainViews) => void
    domains?: Domain[]
}

export const DomainsViewOptions = ({
    categories,
    filters,
    handleFilterChange,
    view,
    onViewChange,
    domains
}: Props) => {
    const domainCount = getNumDomains(domains, filters[VERSION_1_DOMAINS_LABEL])

    return (
        <Stack
            position='relative'
            justifyContent='space-between'
            className={styles.domainsViewOptions}
            bottom='25px'
            width='100%'
            float='left'
        >
            <Stack className={styles.domainsViewOptions__filters}>
                <Button
                    id='View All'
                    data-testid={DOMAIN_TEST_IDS.viewAllBtn}
                    size={{ base: 'sm', md: 'md' }}
                    variant='outline'
                    onClick={() => handleFilterChange('viewAll')}
                    fontWeight='600'
                    _hover={{
                        border: '1px solid var(--chakra-colors-fg-info) !important',
                        background: 'white',
                        color: 'fg.info'
                    }}
                    _dark={{
                        _hover: {
                            background: 'transparent'
                        }
                    }}
                    css={{
                        base: filters['viewAll']
                            ? {
                                  borderColor: 'fg.info',
                                  background: '#ffffff',
                                  color: 'fg.info'
                              }
                            : {
                                  background: 'transparent',
                                  borderColor: 'fg.muted !important',
                                  color: 'fg.muted',
                                  fontSize: '14px'
                              },
                        _dark: filters['viewAll']
                            ? {
                                  background: 'transparent'
                              }
                            : {}
                    }}
                >
                    View All ({domainCount['viewAll']})
                </Button>
                {categories.map(group => {
                    return domainCount?.[group] && domainCount?.[group] > 0 ? (
                        <Button
                            id={group}
                            key={group}
                            data-testid={DOMAIN_TEST_IDS.categoryBtn}
                            size={{ base: 'sm', md: 'md' }}
                            variant='outline'
                            onClick={() => handleFilterChange(group)}
                            fontWeight='600'
                            whiteSpace='normal'
                            wordWrap='break-word'
                            _hover={{
                                border: '1px solid var(--chakra-colors-fg-info) !important',
                                color: 'fg.info',
                                background: 'white'
                            }}
                            _dark={{
                                _hover: {
                                    background: 'transparent'
                                }
                            }}
                            css={{
                                base: filters[group]
                                    ? {
                                          borderColor: '#006fcf',
                                          background: '#ffffff',
                                          color: '#006fcf'
                                      }
                                    : {
                                          background: 'transparent',
                                          borderColor: 'fg.muted !important',
                                          color: 'fg.muted',
                                          fontSize: '14px'
                                      },
                                _dark: filters[group]
                                    ? {
                                          background: 'transparent',
                                          borderColor: '#61c5ff',
                                          color: '#61c5ff'
                                      }
                                    : {}
                            }}
                        >
                            {getCategoryName(group)} ({domainCount[group]})
                        </Button>
                    ) : null
                })}
            </Stack>
            <Flex
                className={styles.domainsViewOptions__viewControl}
                paddingBottom='4px'
                paddingRight='20px'
                marginLeft='2px'
                float='right'
            >
                <HStack
                    className={styles.domainsViewOptions__viewControlButtons}
                    gap='1rem'
                    marginTop='4px'
                >
                    <Tooltip showArrow content='Domain Map'>
                        <button
                            style={{ cursor: 'pointer' }}
                            onClick={() => onViewChange(domainViews.cardView)}
                            data-testid={DOMAIN_TEST_IDS.cardViewBtn}
                        >
                            <GridIcon
                                className={
                                    view != domainViews.cardView
                                        ? styles.domainViewToggle
                                        : styles.domainViewToggle__active
                                }
                            />
                        </button>
                    </Tooltip>
                    <Tooltip showArrow content='Domain List View'>
                        <button
                            style={{ cursor: 'pointer' }}
                            onClick={() => onViewChange(domainViews.listView)}
                        >
                            <ListIcon
                                width='32px'
                                height='32px'
                                data-testid={DOMAIN_TEST_IDS.listViewBtn}
                                className={
                                    view != domainViews.listView
                                        ? styles.domainViewToggle
                                        : styles.domainViewToggle__active
                                }
                            />
                        </button>
                    </Tooltip>
                    <Tooltip showArrow content='Domain Owners'>
                        <button
                            style={{ cursor: 'pointer' }}
                            onClick={() => onViewChange(domainViews.ownerView)}
                            data-testid={DOMAIN_TEST_IDS.ownerViewBtn}
                        >
                            <OwnersIcon
                                className={
                                    view != domainViews.ownerView
                                        ? styles.domainViewToggle
                                        : styles.domainViewToggle__active
                                }
                            />
                        </button>
                    </Tooltip>
                    <Tooltip showArrow content='Company Domain and API Metrics'>
                        <Link href={metricsPathFor(DEFAULT_METRIC_VIEW)}>
                            <button style={{ cursor: 'pointer' }}>
                                <MetricsIcon
                                    width='36px'
                                    height='36px'
                                    style={{ marginRight: '8px' }}
                                    color='#8E9092'
                                    className={styles.domainViewToggle}
                                />
                            </button>
                        </Link>
                    </Tooltip>
                </HStack>
            </Flex>
        </Stack>
    )
}
