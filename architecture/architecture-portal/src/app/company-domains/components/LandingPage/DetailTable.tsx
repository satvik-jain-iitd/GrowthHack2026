/* istanbul ignore file */
'use client'
import { useState, useRef, useEffect, useContext } from 'react'
import { Box, CloseButton, Flex, ScrollArea } from '@chakra-ui/react'
import { Dialog, Table } from '@chakra-ui/react'
import {
    IconChevronDown,
    IconArrowDown,
    IconArrowUp
} from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/company-domain-landing.module.css'
import { ApplicationDetail } from './ApplicationDetail'
import EBCMDetails, { EBCMDetailsProps } from './EBCMDetails'
import ApplicationMapping from './ApplicationMapping'
import { API_ENDPOINTS } from '@/constants'
import { Domain } from '@/app/company-domains/types'
import { Application } from '@/app/company-domains/types'
import { DetailTableRow } from './DetailTableRow'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fetchWithToken } from '@/utils/client'
import { UserContext } from '@/context/UserContext'

export const DetailTable = (props: {
    domain: Domain
    applications: Application[]
    allowUnlink: boolean
    width?: string
    isOpen?: boolean
    clearData?: () => Promise<void> | void
}) => {
    const { domain, applications, allowUnlink = true, width, clearData } = props
    const [openApplicationDetail, setOpenApplicationDetail] = useState(false)
    const [openEBCMDetails, setOpenEBCMDetails] = useState(false)
    const [openUnlinkApplication, setOpenUnlinkApplication] = useState(false)
    const [applicationData, setApplicationData] = useState<Application | null>(
        null
    )
    const [currentRowForUnlink, setCurrentRowForUnlink] =
        useState<Application | null>(null)
    const [sortedData, setSortedData] =
        useState<Array<Application>>(applications)
    const [sortConfig, setSortConfig] = useState<{
        key: string | null
        direction: 'ascending' | 'descending' | null
    }>({
        key: null,
        direction: null
    })
    const [eBCMDetails, setEBCMDetails] =
        useState<EBCMDetailsProps['data']>(undefined)
    const tableRef = useRef<HTMLTableElement>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
        count: sortedData.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 75,
        overscan: 5
    })

    useEffect(() => {
        setSortedData(applications)
    }, [applications])

    const userDomains: string[] = [] // Replace with the actual array of domains if available
    const user = useContext(UserContext)
    const isAdmin = user?.userDirectoryAccess?.admin

    const fetchEBCMDetails = async (row: {
        ebc_level_4_nm?: string
        ebc_level_3_nm: string
    }) => {
        fetchWithToken(API_ENDPOINTS.GET_EBCM_DETAILS(row))
            .then(res => res.json())
            .then(res => setEBCMDetails(res?.data?.data))
    }

    const HandleClick = async (type: string, row: Application) => {
        if (type === 'Application Detail') {
            setApplicationData(row)
            setOpenEBCMDetails(false)
            setOpenUnlinkApplication(false)
            setOpenApplicationDetail(true)
        }

        if (type === 'EBCM Details') {
            setOpenUnlinkApplication(false)
            setOpenApplicationDetail(false)
            await fetchEBCMDetails(row)
            setOpenEBCMDetails(true)
        }

        if (type === 'Unlink Application') {
            setOpenEBCMDetails(false)
            setOpenApplicationDetail(false)
            setCurrentRowForUnlink(row)
            setOpenUnlinkApplication(true)
        }
    }

    const thClass = sortedData?.length === 0 ? 'empty' : ''
    const handleSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }

        const data = [...sortedData].sort((a, b) => {
            let aValueToCompare: string =
                typeof a[key as keyof typeof a] === 'string'
                    ? (a[key as keyof typeof a] as string)
                    : ''
            let bValueToCompare: string =
                (b[key as keyof typeof b] as string) || ''

            if (key === 'application_id') {
                if (
                    !isNaN(Number(aValueToCompare)) &&
                    !isNaN(Number(bValueToCompare))
                ) {
                    const aValue = Number(aValueToCompare)
                    const bValue = Number(bValueToCompare)
                    return direction === 'ascending'
                        ? aValue - bValue
                        : bValue - aValue
                }
            }

            if (key === 'applicationOwner') {
                aValueToCompare =
                    a?.central_application_da?.ownershipInfo?.applicationOwner
                        ?.fullName || ''

                bValueToCompare =
                    b?.central_application_da?.ownershipInfo?.applicationOwner
                        ?.fullName || ''
            }

            if (key === 'vp1') {
                aValueToCompare =
                    a?.central_application_da?.ownershipInfo
                        ?.applicationOwnerLeader1?.fullName || ''

                bValueToCompare =
                    b?.central_application_da?.ownershipInfo
                        ?.applicationOwnerLeader1?.fullName || ''
            }

            if (key === 'vp2') {
                aValueToCompare =
                    a?.central_application_da?.ownershipInfo
                        ?.applicationOwnerLeader2?.fullName || ''

                bValueToCompare =
                    b?.central_application_da?.ownershipInfo
                        ?.applicationOwnerLeader2?.fullName || ''
            }

            if (key === 'businessOwner') {
                aValueToCompare =
                    a?.central_application_da?.ownershipInfo?.businessOwner
                        ?.fullName || ''
                bValueToCompare =
                    b?.central_application_da?.ownershipInfo?.businessOwner
                        ?.fullName || ''
            }

            return direction === 'ascending'
                ? aValueToCompare.localeCompare(bValueToCompare)
                : bValueToCompare.localeCompare(aValueToCompare)
        })

        setSortedData(data)
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key: string) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? (
                <div
                    style={{
                        marginLeft: '6px'
                    }}
                >
                    <IconArrowUp size='xs' />
                </div>
            ) : (
                <div
                    style={{
                        marginLeft: '6px'
                    }}
                >
                    <IconArrowDown size='xs' />
                </div>
            )
        }
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '6px'
                }}
            >
                <IconArrowUp size='xs' />
                <IconArrowDown size='xs' />
            </div>
        )
    }

    const scrollAmount = 300
    const handleScrollBtn = () => {
        if (scrollRef.current) {
            const maxScroll =
                scrollRef.current.scrollHeight - scrollRef.current.clientHeight

            if (scrollRef.current.scrollTop < maxScroll) {
                scrollRef.current.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth'
                })
            }

            setTimeout(() => {
                if ((scrollRef?.current?.scrollTop ?? 0) > maxScroll) {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = maxScroll
                    }
                }
            }, 300)
        }
    }

    return (
        <>
            <Table.Root
                className={styles.companyDetailTable}
                variant='outline'
                ref={tableRef}
                display={'block'}
                stickyHeader
                minW={width}
                scrollbar='hidden'
            >
                <Table.Header top={0}>
                    <Table.Row
                        backgroundColor={{
                            base: '#DDE9F4',
                            _dark: '#53565a'
                        }}
                    >
                        <Table.ColumnHeader
                            className={thClass}
                            onClick={() => {
                                handleSort('application_id')
                            }}
                            _dark={{
                                color: 'white',
                                backgroundColor: '#333'
                            }}
                            width='8%'
                        >
                            <Flex className={styles.applicationTableHeaderFlex}>
                                CAR ID {getSortIcon('application_id')}
                            </Flex>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            className={thClass}
                            onClick={() => {
                                handleSort('application_nm')
                            }}
                            _dark={{
                                color: 'white',
                                backgroundColor: '#333'
                            }}
                            width='17.4%'
                        >
                            <Flex className={styles.applicationTableHeaderFlex}>
                                APPLICATION NAME
                                {getSortIcon('application_nm')}
                            </Flex>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            className={thClass}
                            onClick={() => {
                                handleSort('applicationOwner')
                            }}
                            _dark={{
                                color: 'white',
                                backgroundColor: '#333'
                            }}
                            width='17.4%'
                        >
                            <Flex className={styles.applicationTableHeaderFlex}>
                                APPLICATION OWNER
                                {getSortIcon('applicationOwner')}
                            </Flex>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            className={thClass}
                            onClick={() => {
                                handleSort('vp1')
                            }}
                            _dark={{
                                color: 'white',
                                backgroundColor: '#333'
                            }}
                            width='17.4%'
                        >
                            <Flex className={styles.applicationTableHeaderFlex}>
                                VP1 {getSortIcon('vp1')}
                            </Flex>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            className={thClass}
                            onClick={() => {
                                handleSort('vp2')
                            }}
                            _dark={{
                                color: 'white',
                                backgroundColor: '#333'
                            }}
                            width='17.4%'
                        >
                            <Flex className={styles.applicationTableHeaderFlex}>
                                VP2 {getSortIcon('vp2')}
                            </Flex>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            className={thClass}
                            onClick={() => {
                                handleSort('businessOwner')
                            }}
                            _dark={{
                                color: 'white',
                                backgroundColor: '#333'
                            }}
                            width='17.4%'
                        >
                            <Flex className={styles.applicationTableHeaderFlex}>
                                BUSINESS OWNER {getSortIcon('businessOwner')}
                            </Flex>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            className={thClass}
                            _dark={{
                                color: 'white',
                                backgroundColor: '#333'
                            }}
                            width='5%'
                        >
                            <Flex className={styles.applicationTableHeaderFlex}>
                                ACTION
                            </Flex>
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell colSpan={7} padding={0} maxHeight='50vh'>
                            {sortedData.length > 4 ? (
                                <ScrollArea.Root height='50vh'>
                                    <ScrollArea.Viewport ref={scrollRef}>
                                        <div
                                            style={{
                                                height: `${virtualizer.getTotalSize()}px`,
                                                width: '100%',
                                                position: 'relative'
                                            }}
                                        >
                                            {virtualizer
                                                .getVirtualItems()
                                                .map(virtualItem => (
                                                    <div
                                                        key={virtualItem.key}
                                                        ref={
                                                            virtualizer.measureElement
                                                        }
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: `${virtualItem.size}px`,
                                                            transform: `translateY(${virtualItem.start}px)`
                                                        }}
                                                    >
                                                        <DetailTableRow
                                                            application={
                                                                sortedData[
                                                                    virtualItem
                                                                        .index
                                                                ]
                                                            }
                                                            HandleClick={
                                                                HandleClick
                                                            }
                                                            allowUnlink={
                                                                allowUnlink
                                                            }
                                                            isAdmin={isAdmin}
                                                            userDomains={
                                                                userDomains
                                                            }
                                                            domain={domain}
                                                            width='100%'
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </ScrollArea.Viewport>
                                </ScrollArea.Root>
                            ) : (
                                sortedData.map(application => (
                                    <DetailTableRow
                                        key={application.application_id}
                                        application={application}
                                        HandleClick={HandleClick}
                                        allowUnlink={allowUnlink}
                                        isAdmin={isAdmin}
                                        userDomains={userDomains}
                                        domain={domain}
                                        width='76vw'
                                    />
                                ))
                            )}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
            <Box className={styles.downIconBox}>
                <IconChevronDown
                    className={styles.downIcon}
                    onClick={handleScrollBtn}
                />
            </Box>
            {openEBCMDetails && (
                <EBCMDetails
                    data={eBCMDetails}
                    isOpen={openEBCMDetails}
                    onClose={() => setOpenEBCMDetails(false)}
                />
            )}
            {openUnlinkApplication && currentRowForUnlink && (
                <ApplicationMapping
                    modalDetails={{ data: domain.domain_nm }}
                    applicationData={{
                        ...currentRowForUnlink,
                        id: currentRowForUnlink?.application_id || '',
                        name: currentRowForUnlink?.application_nm || '',
                        application_name:
                            currentRowForUnlink?.application_nm || ''
                    }}
                    isLinked={true}
                    isOpen={openUnlinkApplication}
                    onClose={() => setOpenUnlinkApplication(false)}
                    domainName={{ id: domain.company_domain_id }}
                    clearData={clearData}
                />
            )}
            {openApplicationDetail && (
                <Dialog.Root
                    open={openApplicationDetail}
                    onOpenChange={() => {
                        setOpenApplicationDetail(false)
                    }}
                    placement='center'
                >
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content
                            style={{ width: '80%', maxWidth: '1700px' }}
                        >
                            <Dialog.Header>
                                <Dialog.Title>
                                    <Box fontSize='20px' fontWeight='600'>
                                        {
                                            applicationData
                                                ?.central_application_da?.name
                                        }
                                    </Box>
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton />
                            </Dialog.CloseTrigger>
                            <Dialog.Body>
                                <ApplicationDetail
                                    applicationData={applicationData}
                                    setOpenModal={setOpenApplicationDetail}
                                />
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>
            )}
        </>
    )
}
