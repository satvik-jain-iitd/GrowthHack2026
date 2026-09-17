'use client'
/* istanbul ignore file */
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react'
import { DirectoryHeader } from '../components'
import { DirectoryTable } from './DirectoryTable'
import { SearchBox } from './SearchBox'
import React, { useState, useEffect, useRef } from 'react'
import { Domain } from '@/app/company-domains/types'
import { featureFlags } from '@/constants'
import { useDomainContext } from '@/context/DomainContext'
import styles from '@/app/directory/directory.module.css'
import ApplicationListTable from './ApplicationTable/ApplicationListTable'
import { useDirectoryContext } from '@/context'
import { TAB_NAMES } from '@/app/directory/constants'

export const DirectoryContainer = () => {
    const { selectedOption, setSelectedOption } = useDirectoryContext() || {}

    const { loading, domains } = useDomainContext() || {}

    const pages = featureFlags?.enableEBCM
        ? [
              TAB_NAMES.COMPANY_DOMAIN_DIRECTORY,
              TAB_NAMES.EBCM_DIRECTORY,
              TAB_NAMES.APPLICATION_DIRECTORY
          ]
        : [TAB_NAMES.APPLICATION_DIRECTORY, TAB_NAMES.COMPANY_DOMAIN_DIRECTORY]

    const pageSelection = pages[selectedOption ?? 0]

    const filteredDomains = useRef<Domain[]>([])

    const [currentDomains, setCurrentDomains] = useState<Domain[]>([])

    const setDomains = (result: Domain[] | undefined) => {
        setCurrentDomains(result ?? [])
    }

    useEffect(() => {
        if (domains) {
            filteredDomains.current = domains
                .filter(x => x.domain_category_nm !== 'Others')
                .sort((a, b) => a.domain_category_sort - b.domain_category_sort)
            setCurrentDomains(filteredDomains.current)
        }
    }, [domains])

    const handleTabClick = (page: string) => {
        if (selectedOption !== pages.indexOf(page)) {
            setSelectedOption?.(pages.indexOf(page))
        }
    }

    return (
        <>
            <DirectoryHeader />
            <Box>
                <Flex
                    width='100%'
                    background='surface.default.offwhite'
                    justifyContent='center !important'
                    minHeight='100vh'
                >
                    <Flex
                        className={`${styles.cardContainer} ${styles.directoryContainer}`}
                        direction='column'
                        mt='3'
                        zIndex='1'
                        background='transparent'
                    >
                        <Box>
                            <Box mb='30px' mt='10px'>
                                {pages.map((page, i) => {
                                    return (
                                        <Button
                                            backgroundColor={
                                                pageSelection !== page
                                                    ? 'var(--bgColor-default)'
                                                    : '#006fcf'
                                            }
                                            borderColor={
                                                pageSelection !== page
                                                    ? {
                                                          base: '#006fcf',
                                                          _dark: 'white'
                                                      }
                                                    : '#006fcf'
                                            }
                                            color={
                                                pageSelection !== page
                                                    ? {
                                                          base: '#006fcf',
                                                          _dark: 'white'
                                                      }
                                                    : '#ffffff'
                                            }
                                            key={page + 'light' + i}
                                            onClick={() => handleTabClick(page)}
                                            className={styles.directoryTabs}
                                            variant={'outline'}
                                            padding={'0.8125rem 1.875rem'}
                                        >
                                            {page}
                                        </Button>
                                    )
                                })}
                            </Box>
                            {loading ? (
                                <Flex
                                    justify='center'
                                    align='center'
                                    minH='200px'
                                >
                                    <Spinner />
                                </Flex>
                            ) : (
                                <Box
                                    className='directory-content'
                                    background='var(--directory-content-BG)'
                                >
                                    {pageSelection ===
                                    TAB_NAMES.COMPANY_DOMAIN_DIRECTORY ? (
                                        <Box padding={'2'}>
                                            <Flex
                                                justify='space-between'
                                                align='center'
                                                className={
                                                    styles.directoryResultsBar
                                                }
                                            >
                                                <SearchBox
                                                    domains={
                                                        // eslint-disable-next-line react-hooks/refs
                                                        filteredDomains.current
                                                    }
                                                    setDomains={setDomains}
                                                />
                                                <Text
                                                    id='results-list-length'
                                                    className={
                                                        styles.directoryResultsCount
                                                    }
                                                    color='gray'
                                                    ml='16px'
                                                >
                                                    Showing{' '}
                                                    {currentDomains?.length ||
                                                        0}{' '}
                                                    Domains
                                                </Text>
                                            </Flex>
                                            <DirectoryTable
                                                domains={currentDomains}
                                                setDomains={setDomains}
                                            />
                                        </Box>
                                    ) : pageSelection ===
                                          TAB_NAMES.EBCM_DIRECTORY &&
                                      featureFlags.enableEBCM ? (
                                        <>Ebcm List Page</>
                                    ) : (
                                        <ApplicationListTable />
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
