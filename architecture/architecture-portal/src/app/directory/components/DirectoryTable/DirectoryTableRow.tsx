/* istanbul ignore file */
import { DetailTable } from '@/app/company-domains/components/LandingPage/DetailTable'
import {
    Box,
    Button,
    Collapsible,
    Flex,
    HStack,
    Image,
    Menu,
    Portal,
    Spinner,
    Table,
    Text,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Application, Domain } from '@/app/company-domains/types'
import { AvatarTableRow } from '@/components/ui'
import {
    IconChevronUp,
    IconLaptop,
    IconMoreVertical
} from '@americanexpress/dls-icons'
import { API_ENDPOINTS } from '@/constants'
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import { UserContext } from '@/context/UserContext'
import { AddEditOwner } from './AddEditOwner'
import { fetchWithToken } from '@/utils/client'
import LogsModal from '../ApplicationTable/LogsModal'
import { useDomainHistory } from '../../hooks/useDomainHistory'
import { AuditAppResponse } from '../../types'

const DisplayUsers = ({
    Heading,
    Name,
    email
}: {
    Heading: string
    Name: string
    email: string
}) => {
    return (
        <HStack>
            <UserAvatar email={email} name={Name} />
            <Box>
                <Text fontWeight='bold'>{Heading}</Text>
                <Text>{Name}</Text>
            </Box>
        </HStack>
    )
}

const applicationsCache = new Map<string, Application[]>()
const applicationsInFlight = new Map<string, Promise<Application[]>>()

export const DirectoryTableRow = ({
    domain,
    rowId,
    openRowId,
    setOpenRowId
}: {
    domain?: Domain
    rowId: string
    openRowId: string | null
    setOpenRowId: (id: string | null) => void
}) => {
    const companyLogTableLabel = [
        { key: 'appId', label: 'Application ID' },
        { key: 'appName', label: 'Application name' },
        { key: 'action', label: 'Action Type' },
        { key: 'userName', label: 'User Name' },
        { key: 'timeStamp', label: 'Date' }
    ]
    const [apps, setApps] = useState<Application[] | null>(null)
    const [openAddEditOwner, setOpenAddEditOwner] = useState(false)
    const [isFilled, setFilled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openCompanyLogModal, setOpenCompanyLogModal] = useState(false)
    const offSet = '10'
    const collapseRef = React.useRef<HTMLButtonElement>(null)

    const { open: isAddEditOwnerOpen, onOpen, onClose } = useDisclosure()
    const user = useContext(UserContext)
    const isAdmin = user?.userDirectoryAccess?.admin
    const isDomainOwner = user?.userDirectoryAccess?.domains
    const canShowHistory =
        Boolean(isAdmin) ||
        Boolean(isDomainOwner?.includes(domain?.company_domain_id ?? ''))

    const {
        historyData,
        serverError: domainServerError,
        fetchData,
        recordCount,
        isLoading
    } = useDomainHistory()

    const normalizedHistoryData: AuditAppResponse[] = Array.isArray(historyData)
        ? (historyData as AuditAppResponse[])
        : []

    const fetchDomainHistory: UseMutateAsyncFunction<
        { data: AuditAppResponse[]; recordCount: number },
        Error,
        {
            applicationId?: string | undefined
            link?: boolean | undefined
            unlink?: boolean | undefined
            search_string?: string | undefined
            startDate?: string | undefined
            endDate?: string | undefined
            page?: string | undefined
            offset?: string | undefined
            sortBy?: string | undefined
            orderBy?: string | undefined
            domainId?: string | undefined
        },
        unknown
    > = async payload => {
        const response = await fetchData(payload)
        return response ?? { data: [], recordCount: 0 }
    }

    const title = domain?.domain_nm ?? '',
        imgSrcFilledLM = domain?.im_fill_light_tx,
        imgSrcLM = domain?.im_light_tx,
        imgSrcFilledDM = domain?.im_fill_dark_tx,
        imgSrcDM = domain?.im_dark_tx

    const fetchApplications = async (): Promise<Application[]> => {
        if (!domain) {
            return []
        }

        const cacheKey = domain.company_domain_id
        const cachedApplications = applicationsCache.get(cacheKey)

        if (cachedApplications) {
            setApps(cachedApplications)
            return cachedApplications
        }

        const existingRequest = applicationsInFlight.get(cacheKey)

        if (existingRequest) {
            return existingRequest
                .then(response => {
                    setApps(response)
                    return response
                })
                .finally(() => setLoading(false))
        }

        setLoading(true)

        const request = fetchWithToken(
            API_ENDPOINTS.GET_DOMAIN_DETAILS_APPLICATIONS(cacheKey)
        )
            .then(res => res.json())
            .then(res => {
                const response = res?.data ?? []
                applicationsCache.set(cacheKey, response)
                setApps(response)
                return response
            })
            .finally(() => {
                applicationsInFlight.delete(cacheKey)
            })

        applicationsInFlight.set(cacheKey, request)

        try {
            return await request
        } finally {
            setLoading(false)
        }
    }
    const isOpen = openRowId === rowId

    useEffect(() => {
        if (domain && isOpen && apps === null) {
            void fetchApplications()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apps, domain, isOpen])

    if (!domain) return <React.Fragment />

    const toggleAddEditModal = () => {
        if (!isAdmin) {
            return
        }
        onOpen()
        setOpenAddEditOwner(!openAddEditOwner)
    }

    const toggleCompanyDomainLogModal = () => {
        if (!canShowHistory) {
            return
        }
        setOpenCompanyLogModal(!openCompanyLogModal)
    }

    return (
        <Table.Row
            key={domain.company_domain_id}
            onMouseEnter={() => setFilled(true)}
            onMouseLeave={() => setFilled(false)}
            background={isOpen ? '#006FCF' : 'inherit'}
            height='64px'
        >
            <Table.Cell
                paddingTop='6px'
                paddingBottom='0'
                paddingX='0'
                marginX='100px'
                width='95%'
                colSpan={6}
            >
                {isAddEditOwnerOpen && (
                    <AddEditOwner
                        data={domain}
                        isOpen={isAddEditOwnerOpen}
                        onClose={onClose}
                    />
                )}
                {openCompanyLogModal && (
                    <LogsModal
                        isOpen={openCompanyLogModal}
                        onClose={() => {
                            setOpenCompanyLogModal(false)
                        }}
                        columns={companyLogTableLabel}
                        data={normalizedHistoryData}
                        searchApic='domain'
                        id={rowId}
                        offset={offSet}
                        fetchData={fetchDomainHistory}
                        name={domain?.domain_nm}
                        recordCount={recordCount}
                        serverError={domainServerError}
                        isLoading={isLoading}
                    />
                )}
                {/* TODO: Add logs modal from vidhi's PR */}
                <Collapsible.Root
                    open={isOpen}
                    onOpenChange={open => {
                        const isOpenValue =
                            typeof open === 'boolean' ? open : open?.open
                        if (isOpenValue) {
                            setOpenRowId(rowId)
                        } else {
                            setOpenRowId(null)
                        }
                    }}
                    unmountOnExit
                >
                    <VStack alignSelf='center'>
                        <HStack
                            justifyContent='space-between'
                            width='100%'
                            height='64px'
                        >
                            <Box width='35%' paddingRight='12px'>
                                <HStack>
                                    <Collapsible.Trigger
                                        paddingY='3'
                                        display='flex'
                                        gap='2'
                                        alignItems='center'
                                        ref={collapseRef}
                                    >
                                        <Collapsible.Indicator
                                            transition='transform 0.2s'
                                            _open={{
                                                transform: 'rotate(90deg)'
                                            }}
                                            marginLeft='5px'
                                        >
                                            <IconChevronUp
                                                isFilled
                                                color={
                                                    isOpen ? 'white' : 'brand'
                                                }
                                                style={{
                                                    transform: 'rotate(90deg)'
                                                }}
                                            />
                                        </Collapsible.Indicator>
                                    </Collapsible.Trigger>
                                    <Box marginLeft='4px'>
                                        <Image
                                            alt={`${title} Logo`}
                                            className='margin-1-b image-light'
                                            height='35px'
                                            width='35px'
                                            filter={
                                                isOpen
                                                    ? 'brightness(0) invert(1)'
                                                    : ''
                                            }
                                            src={`data:image/png;base64, ${!isOpen && isFilled ? imgSrcFilledLM : imgSrcLM}`}
                                        />
                                        <Image
                                            alt={`${title} Logo`}
                                            className='margin-1-b image-dark'
                                            height='35px'
                                            width='35px'
                                            src={`data:image/png;base64, ${!isOpen && isFilled ? imgSrcFilledDM : imgSrcDM}`}
                                        />
                                    </Box>
                                    <Text color={isOpen ? 'white' : 'gray.fg'}>
                                        {domain.domain_nm}
                                    </Text>
                                </HStack>
                            </Box>
                            <Box width='20%' paddingX='12px'>
                                <AvatarTableRow
                                    email={domain.unit_cio_email_ad_da[0]}
                                    showOpen
                                    bgColor='gray.emphasized'
                                    color={isOpen ? 'white' : 'gray.fg'}
                                />
                            </Box>
                            <Box width='20%' paddingX='12px'>
                                <AvatarTableRow
                                    email={domain.tech_own_email_ad_da[0]}
                                    showOpen
                                    bgColor='gray.emphasized'
                                    color={isOpen ? 'white' : 'gray.fg'}
                                />
                            </Box>
                            <Box width='20%' paddingX='12px'>
                                <AvatarTableRow
                                    email={domain.princ_ea_archt_email_ad_da[0]}
                                    showOpen
                                    bgColor='gray.emphasized'
                                    color={isOpen ? 'white' : 'gray.fg'}
                                />
                            </Box>
                            <Box
                                width='5%'
                                textAlign='center'
                                paddingX='12px'
                                cursor='pointer'
                            >
                                <Menu.Root
                                    positioning={{ hideWhenDetached: true }}
                                >
                                    <Menu.Trigger asChild>
                                        <Button
                                            variant='plain'
                                            size='md'
                                            color=''
                                        >
                                            <IconMoreVertical
                                                color={
                                                    isOpen ? 'white' : 'brand'
                                                }
                                                size='md'
                                                isFilled={false}
                                            />
                                        </Button>
                                    </Menu.Trigger>
                                    <Portal>
                                        <Menu.Positioner>
                                            <Menu.Content>
                                                <Menu.Item
                                                    value='view-domain'
                                                    onClick={() =>
                                                        collapseRef.current?.click()
                                                    }
                                                    disabled={isOpen}
                                                >
                                                    View Domain
                                                </Menu.Item>
                                                <Menu.Item
                                                    value='map-application'
                                                    disabled={
                                                        !isDomainOwner?.includes(
                                                            domain?.company_domain_id
                                                        )
                                                    }
                                                >
                                                    Map Application
                                                </Menu.Item>
                                                <Menu.Item
                                                    value='add-edit-owner'
                                                    onClick={toggleAddEditModal}
                                                    disabled={!isAdmin}
                                                >
                                                    Add / Edit Owner / SME
                                                </Menu.Item>
                                                <Menu.Item
                                                    value='show-history'
                                                    onClick={
                                                        toggleCompanyDomainLogModal
                                                    }
                                                    disabled={!canShowHistory}
                                                >
                                                    Show History
                                                </Menu.Item>
                                            </Menu.Content>
                                        </Menu.Positioner>
                                    </Portal>
                                </Menu.Root>
                            </Box>
                        </HStack>
                        <Collapsible.Content as='div' z-index={0} width='100%'>
                            {loading && isOpen ? (
                                <Flex
                                    justify='center'
                                    align='center'
                                    minH='100px'
                                    width='78.5vw'
                                    background='white'
                                    overflow='hidden'
                                >
                                    <Spinner />
                                </Flex>
                            ) : (
                                <Box
                                    background={{
                                        base: '#f7f8f9',
                                        _dark: '#1f1f1f'
                                    }}
                                    width='100%'
                                    paddingTop='50px'
                                    paddingBottom='40px'
                                >
                                    <Suspense
                                        fallback={
                                            <Spinner alignSelf='center' />
                                        }
                                    >
                                        <Text
                                            fontSize='16px'
                                            fontWeight='400'
                                            marginLeft='25px'
                                            whiteSpace='wrap'
                                        >
                                            {domain.domain_ds || '--'}
                                        </Text>
                                        <HStack
                                            justifyContent='space-between'
                                            width='100%'
                                            marginY='50px'
                                            marginX='25px'
                                        >
                                            <VStack alignItems='start'>
                                                {DisplayUsers({
                                                    Heading: 'Unit CIO',
                                                    Name: domain.unit_cio_nm,
                                                    email: domain
                                                        .unit_cio_email_ad_da?.[0]
                                                })}
                                                {DisplayUsers({
                                                    Heading: 'Tech Owner',
                                                    Name: domain.tech_owner_nm,
                                                    email: domain
                                                        .tech_own_email_ad_da?.[0]
                                                })}
                                            </VStack>
                                            <VStack alignItems='start'>
                                                {DisplayUsers({
                                                    Heading: 'Head Engineer',
                                                    Name: domain.head_engineer_nm,
                                                    email: domain
                                                        .head_engnr_email_ad_da?.[0]
                                                })}
                                                {DisplayUsers({
                                                    Heading:
                                                        'Unit CIO Architect (delegate)',
                                                    Name: domain.ea_architect_delegate_nm,
                                                    email: domain
                                                        .ea_archt_dlgte_email_ad_da?.[0]
                                                })}
                                            </VStack>
                                            <VStack alignItems='start'>
                                                {DisplayUsers({
                                                    Heading:
                                                        'Principal Architect',
                                                    Name: domain.principal_ea_architect_nm,
                                                    email: domain
                                                        .princ_ea_archt_email_ad_da?.[0]
                                                })}
                                                {DisplayUsers({
                                                    Heading:
                                                        'Enterprise Architect',
                                                    Name: domain.ea_architect_nm,
                                                    email: domain
                                                        .ea_archt_email_ad_da?.[0]
                                                })}
                                            </VStack>
                                            <Box width='20%'>
                                                <Flex alignItems={'center'}>
                                                    <Box>
                                                        <IconLaptop
                                                            className='icon-blue-color'
                                                            size='xl'
                                                            style={{
                                                                fontSize: '3rem'
                                                            }}
                                                            title='IconLaptop icon'
                                                            titleId='IconLaptop-icon-1'
                                                        />
                                                    </Box>

                                                    <Box ml='10px'>
                                                        <Box
                                                            color=' #006fcf'
                                                            fontSize='40px'
                                                            fontWeight='700'
                                                            lineHeight='44px'
                                                        >
                                                            {apps?.length}
                                                        </Box>
                                                        <Box
                                                            color='#006fcf'
                                                            fontSize='16px'
                                                            fontWeight='600'
                                                        >
                                                            APPLICATIONS
                                                        </Box>
                                                    </Box>
                                                </Flex>
                                            </Box>
                                        </HStack>

                                        <DetailTable
                                            domain={domain}
                                            applications={apps || []}
                                            allowUnlink={true}
                                            width='78.5vw'
                                            clearData={() => {
                                                void fetchApplications()
                                            }}
                                        />
                                    </Suspense>
                                </Box>
                            )}
                        </Collapsible.Content>
                    </VStack>
                </Collapsible.Root>
            </Table.Cell>
        </Table.Row>
    )
}
