/* istanbul ignore file */

'use client'
import React, { useCallback, useMemo, useState } from 'react'
import {
    Box,
    Circle,
    Flex,
    HStack,
    Image,
    Separator,
    Stack,
    Table,
    Tabs,
    Text,
    useTabs
} from '@chakra-ui/react'
import {
    ApplicationTableRow,
    CapabilityAccordionItem,
    ECJTableRow
} from '@/app/business-architecture/capabilities/components/Details'
import { useRouter, useSearchParams } from 'next/navigation'
import { Domain, Journey } from '@/app/business-architecture/types'
import { useGetDomains } from '@/app/company-domains/hooks'
import {
    useCustomerJourneys,
    useGetCapabilityCompanyDomains
} from '@/app/business-architecture/hooks'
import { Application } from '@/app/company-domains/types'
import { useQueries } from '@tanstack/react-query'
import {
    APPLICATION_QUERY_KEY,
    fetchApplicationDetail
} from '@/app/applications/hooks/useGetApplicationDetail'
import styles from '@/app/business-architecture/business-architecture.module.scss'
import { ApplicationsIcon } from '@/components/icons/ApplicationsIcon'
import { Tooltip } from '@/components/ui'
import { IconInfo } from '@americanexpress/dls-icons'

export function DetailsTabs({
    capability_id,
    applications
}: {
    capability_id: string
    applications: { application_id: number; application_nm: string }[]
}) {
    const router = useRouter()
    const { customer_journey } = useCustomerJourneys()
    const { domains: domainData = [], loading } = useGetDomains()
    const { companyDomains, loading: companyDomainsLoading } =
        useGetCapabilityCompanyDomains(capability_id)
    const [apiColumnWidth, setApiColumnWidth] = useState<number>()

    // Fetch all application details to get company_domain_ids
    const applicationQueries = useQueries({
        queries: (applications || []).map(app => ({
            queryKey: APPLICATION_QUERY_KEY(app.application_id.toString()),
            queryFn: () =>
                fetchApplicationDetail(app.application_id.toString()),
            enabled: !!app.application_id
        }))
    })

    const handleApiColumnWidthChange = useCallback((width: number) => {
        if (width <= 0) return
        setApiColumnWidth(previous =>
            previous && previous > width ? previous : width
        )
    }, [])

    // Find all journey objects and their stages that include this capability_id
    const journeysWithCapability = useMemo(() => {
        const journeys: Record<string, Journey> = {}
        customer_journey?.forEach(journey => {
            if (
                journey.journey_stages &&
                Array.isArray(journey.journey_stages)
            ) {
                journey.journey_stages.forEach(stage => {
                    if (
                        stage.capabilities?.some(
                            c => c.capability_id === capability_id
                        )
                    ) {
                        journeys[journey.journey_id] = {
                            journey_statement: journey.journey_statement,
                            journey_desc: journey.journey_desc || '',
                            journey_id: journey.journey_id,
                            journey_link: journey.journey_link || ''
                        }
                    }
                })
            }
        })
        return journeys
    }, [capability_id, customer_journey])

    // Build company domains from both capability-domain mappings and
    // fetched application details, then enrich with domain metadata.
    // APIs are fetched independently by CapabilityAccordionItem via
    // useDomainApiWithEndpointDetails.
    const companyDomainsWithCapability = useMemo(() => {
        const domainDataById = new Map(
            domainData.map(domain => [domain.company_domain_id, domain])
        )
        const domains: Record<string, Domain> = {}
        companyDomains.forEach(cd => {
            const domainMeta = domainDataById.get(cd.company_domain_id)
            domains[cd.company_domain_id] = {
                company_domain_id: cd.company_domain_id,
                domain_nm: cd.domain_nm,
                playbook_id: cd.playbook_id,
                description:
                    domainMeta?.dmn_shrt_ds || domainMeta?.domain_ds || '--',
                apis: []
            }
        })

        applicationQueries.forEach((query, idx) => {
            const appDetail = query.data
            if (!appDetail || !applications?.[idx]) {
                return
            }

            const companyDomainId = appDetail.company_domain_id
            if (!companyDomainId || domains[companyDomainId]) {
                return
            }

            const domainMeta = domainDataById.get(companyDomainId)
            domains[companyDomainId] = {
                company_domain_id: companyDomainId,
                domain_nm: appDetail.domain_nm || domainMeta?.domain_nm || '--',
                playbook_id: domainMeta?.playbook_id || '',
                description:
                    domainMeta?.dmn_shrt_ds || domainMeta?.domain_ds || '--',
                apis: []
            }
        })

        return domains
    }, [companyDomains, domainData, applicationQueries, applications])

    // Build map of application details and track loading state
    const { applicationDetailsById, isApplicationsLoading } = useMemo(() => {
        const detailsMap: Record<string, Application> = {}
        let isLoading = false

        applicationQueries.forEach((query, idx) => {
            if (query.data && applications?.[idx]) {
                const centralId = applications[idx].application_id.toString()
                detailsMap[centralId] = query.data
            }
            if (query.isLoading) {
                isLoading = true
            }
        })

        return {
            applicationDetailsById: detailsMap,
            isApplicationsLoading: isLoading
        }
    }, [applicationQueries, applications])

    const tabValues = [
        {
            value: 'Enterprise Customer Journeys',
            label: 'Enterprise Customer Journeys',
            iconDark: '/products/darkcustomer_icon.png',
            iconLight: '/products/CustomerJourneysLogo.png',
            count: Object.keys(journeysWithCapability).length
        },
        {
            value: 'Company Domains',
            label: 'Company Domains',
            iconDark: '/products/darkdomain_icon.png',
            iconLight: '/products/PlatformsLogo.png',
            count: Object.keys(companyDomainsWithCapability).length
        },
        {
            value: 'Applications',
            label: 'Applications',
            iconDark: '/products/darkapplication_icon.png',
            iconLight: '/products/ApplicationsLogo.png',
            count: applications?.length || 0
        }
    ]

    const searchParams = useSearchParams()
    const selectedTab =
        searchParams?.get('tab') || 'Enterprise Customer Journeys'
    const tabs = useTabs({
        defaultValue: selectedTab
    })

    // Only update the query string if the tab change is a navigation to a new page
    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('tab') !== newTab) {
            params.set('tab', newTab)
            router.replace(`?${params.toString()}`, { scroll: false })
        }
    }

    return (
        <Box>
            {/* box for desc, begins with, ends with */}
            <Tabs.RootProvider
                variant={'enclosed'}
                value={tabs}
                flexDirection={{ mdDown: 'column' }}
            >
                {/* todo look into lazy mounted */}
                {/* top value statements (receive dispute journey stages) */}
                <Stack
                    as={Tabs.List}
                    direction={{ base: 'column', md: 'row' }}
                    display={'flex'}
                    boxShadow={'none'}
                    gap={0}
                    borderRadius={'16px'}
                    mb={5}
                    p={2}
                    backgroundColor={'#EDF2F7'}
                >
                    {tabValues.map(tab => (
                        <Tabs.Trigger
                            key={tab.value}
                            minHeight={{
                                base: '80px',
                                mdDown: 'unset'
                            }}
                            flex={1}
                            value={tab.value}
                            borderRadius={'16px'}
                            onClick={() => handleTabChange(tab.value)}
                            _selected={{
                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06))'
                            }}
                        >
                            <Flex
                                flexDirection={{
                                    base: 'row',
                                    mdDown: 'row'
                                }}
                                alignItems={'center'}
                                justifyContent={{
                                    base: 'flex-start',
                                    mdDown: 'flex-start'
                                }}
                                width={'100%'}
                            >
                                {tabs.value === tab.value ? (
                                    <Circle
                                        size='42px'
                                        border='2px solid'
                                        borderColor='status.caution'
                                        color='status.caution'
                                        bg='status.caution'
                                        marginRight='20px'
                                    >
                                        <Text
                                            fontSize='16px'
                                            fontWeight='700'
                                            style={{ fontFamily: 'BentonSans' }}
                                            lineHeight='120%'
                                            color='white'
                                            _selected={{ color: 'white' }}
                                            marginTop='2px'
                                        >
                                            {tab.count !== 0
                                                ? tab.count < 10
                                                    ? '0' + tab.count
                                                    : tab.count
                                                : '0'}
                                        </Text>
                                    </Circle>
                                ) : (
                                    <Circle
                                        size='42px'
                                        border=' 2px solid'
                                        borderColor='status.caution'
                                        color='status.caution'
                                        marginRight='20px'
                                    >
                                        <Text
                                            fontSize='16px'
                                            fontWeight='700'
                                            color='status.caution'
                                            marginTop='2px'
                                            style={{
                                                fontFamily: 'BentonSans'
                                            }}
                                            lineHeight='120%'
                                        >
                                            {tab.count !== 0
                                                ? tab.count < 10
                                                    ? '0' + tab.count
                                                    : tab.count
                                                : '0'}
                                        </Text>
                                    </Circle>
                                )}
                                <Box
                                    color={{
                                        _dark: 'white',
                                        base: '#61c5ff'
                                    }}
                                >
                                    {tab.value === 'Applications' ? (
                                        <ApplicationsIcon
                                            width='33px'
                                            height='33px'
                                            color='#006fcf'
                                            viewBox='0 10 65 55'
                                        />
                                    ) : (
                                        <>
                                            <Image
                                                src={tab.iconDark}
                                                className='image-dark'
                                                alt='Poster image'
                                                height='33px'
                                                width='33px'
                                            />
                                            <Image
                                                src={tab.iconLight}
                                                className='image-light'
                                                alt='Poster image'
                                                height='33px'
                                                width='33px'
                                            />
                                        </>
                                    )}
                                </Box>
                                <Box
                                    ml={2}
                                    fontWeight='bold'
                                    fontSize='16px'
                                    color={{
                                        base: 'blue.700'
                                        //     _dark: 'white'
                                    }}
                                >
                                    {tab.label}
                                </Box>
                            </Flex>
                        </Tabs.Trigger>
                    ))}
                </Stack>
                <Tabs.Content
                    value='Enterprise Customer Journeys'
                    backgroundColor={'white'}
                    border='2px solid'
                    borderColor='var(--chakra-colors-gray-300, #E2E8F0)'
                    borderRadius='16px'
                    pt={3}
                    mb={6}
                >
                    <Table.Root
                        variant='line'
                        stickyHeader
                        className={styles.capDetailsTable}
                        backgroundColor='transparent'
                        paddingX='1rem'
                    >
                        <Table.Header backgroundColor='#EDF2F7'>
                            <Table.Row
                                backgroundColor={{
                                    base: '#E4F1FA',
                                    _dark: '#53565a'
                                }}
                            >
                                <Table.ColumnHeader color={'#00175A'}>
                                    <HStack>
                                        <Text fontWeight={'semibold'}>
                                            Enterprise Customer Journeys
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'Click on the Enterprise Customer Journey name to view more details'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo
                                                size='md'
                                                color='brand-alt'
                                            />
                                        </Tooltip>
                                    </HStack>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color={'#00175A'}>
                                    <Text fontWeight={'semibold'}>
                                        Description
                                    </Text>
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body backgroundColor='transparent'>
                            {Object.values(journeysWithCapability).map(
                                journey => (
                                    <ECJTableRow
                                        key={journey.journey_id}
                                        title={journey.journey_statement}
                                        description={
                                            journey.journey_desc || '--'
                                        }
                                        link={
                                            journey.journey_link ||
                                            '/' +
                                                'enterprise-customer-journeys/' +
                                                journey.journey_id
                                        }
                                    />
                                )
                            )}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
                <Tabs.Content
                    value='Company Domains'
                    backgroundColor={'white'}
                    border='2px solid'
                    borderColor='var(--chakra-colors-gray-300, #E2E8F0)'
                    borderRadius='16px'
                    pt={3}
                    mb={6}
                >
                    <Box px='1rem' py={3}>
                        <Box
                            className={styles.capDetailsAccordionHeader}
                            style={{
                                gridTemplateColumns: `1fr 3fr  1fr ${apiColumnWidth ? `${apiColumnWidth}px` : 'auto'}`
                            }}
                        >
                            <HStack
                                className={styles.capDetailsAccordionHeaderCell}
                            >
                                <Text>Company Domains</Text>
                                <Tooltip
                                    showArrow
                                    content={
                                        'Click on the Company Domain name to view more details'
                                    }
                                    contentProps={{
                                        css: {
                                            '--tooltip-bg': 'grey'
                                        }
                                    }}
                                >
                                    <IconInfo size='md' color='brand-alt' />
                                </Tooltip>
                            </HStack>
                            <Text
                                className={styles.capDetailsAccordionHeaderCell}
                            >
                                Description
                            </Text>
                            <Text
                                className={styles.capDetailsAccordionHeaderCell}
                                justifySelf={'center'}
                            >
                                Total APIs
                            </Text>
                        </Box>
                        <Stack gap={3}>
                            {Object.values(companyDomainsWithCapability).map(
                                (domain, idx) => (
                                    <React.Fragment
                                        key={domain.company_domain_id}
                                    >
                                        <CapabilityAccordionItem
                                            company_domain_id={
                                                domain.company_domain_id
                                            }
                                            playbook_id={domain.playbook_id}
                                            title={domain.domain_nm}
                                            description={
                                                domain.description || '--'
                                            }
                                            apis={domain.apis}
                                            loading={
                                                loading || companyDomainsLoading
                                            }
                                            apiColumnWidth={apiColumnWidth}
                                            onApiColumnWidthChange={
                                                handleApiColumnWidthChange
                                            }
                                        />
                                        {idx <
                                            Object.values(
                                                companyDomainsWithCapability
                                            ).length -
                                                1 && (
                                            <Separator
                                                size='md'
                                                borderColor='var(--chakra-colors-gray-300, #E2E8F0)'
                                            />
                                        )}
                                    </React.Fragment>
                                )
                            )}
                        </Stack>
                    </Box>
                </Tabs.Content>
                <Tabs.Content
                    value='Applications'
                    backgroundColor={'white'}
                    border='2px solid'
                    borderColor='var(--chakra-colors-gray-300, #E2E8F0)'
                    borderRadius='16px'
                    boxShadow='0 1px 1px 0 rgba(0, 0, 0, 0.10)'
                    pt={3}
                    mb={6}
                >
                    <Table.Root
                        variant='line'
                        stickyHeader
                        className={styles.capDetailsTable}
                        backgroundColor='transparent'
                        paddingX='1rem'
                    >
                        <Table.Header>
                            <Table.Row
                                backgroundColor={{
                                    base: '#E4F1FA',
                                    _dark: '#53565a'
                                }}
                            >
                                <Table.ColumnHeader color={'#00175A'}>
                                    <HStack>
                                        <Text fontWeight={'semibold'}>
                                            Application Name
                                        </Text>
                                        <Tooltip
                                            showArrow
                                            content={
                                                'Click on the Application name to view more details'
                                            }
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'grey'
                                                }
                                            }}
                                        >
                                            <IconInfo
                                                size='md'
                                                color='brand-alt'
                                            />
                                        </Tooltip>
                                    </HStack>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color={'#00175A'}>
                                    <Text fontWeight={'semibold'}>
                                        Application ID
                                    </Text>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color={'#00175A'}>
                                    <Text fontWeight={'semibold'}>Owner</Text>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader color={'#00175A'}>
                                    <Text fontWeight={'semibold'}>
                                        Company Domain
                                    </Text>
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body backgroundColor='transparent'>
                            {applications?.map(application => {
                                const centralId =
                                    application.application_id.toString()
                                return (
                                    <ApplicationTableRow
                                        key={application.application_id}
                                        applicationName={application.application_nm.toString()}
                                        centralId={centralId}
                                        applicationData={
                                            applicationDetailsById[centralId]
                                        }
                                        isLoading={isApplicationsLoading}
                                        // TODO will need to be changed to `/applications/${application.application_id}` once shanthan's changes are in, 500px height if doing scrollable
                                        link={`/directory`}
                                    />
                                )
                            })}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
            </Tabs.RootProvider>
        </Box>
    )
}
