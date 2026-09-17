/* istanbul ignore file */
import React, { useState, useContext, useEffect } from 'react'
import { Button, Menu, Portal, useDisclosure } from '@chakra-ui/react'
import { UserContext } from '@/context'
import { useApplicationHistory } from '../../hooks'
import {
    Application,
    ApplicationCentralInfo,
    Domain
} from '@/app/company-domains/types'
import ApplicationMapping from '@/app/company-domains/components/LandingPage/ApplicationMapping'
import LinkApplication from './LinkApplication'
import { IconMoreVertical } from '@americanexpress/dls-icons'
import CompanyDomainDetails from './CompanyDomainDetails'
import LogsModal from './LogsModal'
import { DomainProvider, useDomainContext } from '@/context/DomainContext'

const applicationLogTableLabel = [
    { key: 'domainName', label: 'Domain Name' },
    { key: 'action', label: 'Action Type' },
    { key: 'userName', label: 'User Name' },
    { key: 'timeStamp', label: 'Date' }
]

const ApplicationListActions = ({
    data,
    expanded,
    modalView
}: {
    data: Application & ApplicationCentralInfo
    expanded: boolean
    modalView: boolean
}) => {
    const { open: isOpen, onOpen, onClose } = useDisclosure()
    const [modalDetails, setModalDetails] = useState<{
        isLinked?: boolean
        name?: string
        data?: string
    }>({})
    const [showDetailsModal, setShowDetailsModal] = useState<string | null>(
        null
    )
    const [selectedDomainId, setSelectedDomainId] = useState<string | null>(
        null
    )

    const [domainDetails, setDomainDetails] = useState<Domain | null>(null)

    const [historyData, setHistoryData] = useState([])

    const [recordCount, setRecordCount] = useState(0)
    const [applicationServerError, setApplicationServerError] = useState<
        unknown | null
    >(null)

    const applicationId = modalView ? data?.id : data?.application_id
    const selectedApplicationName = modalView
        ? data?.name
        : data?.application_nm
    const page = '1'
    const offSet = '10'

    const [openApplicationLogModal, setOpenApplicationLogModal] =
        useState(false)

    const user = useContext(UserContext)
    const userDomains = user?.userDirectoryAccess?.domains

    const isAdmin = user?.userDirectoryAccess?.admin

    const domainName = modalView ? data?.domainName : data?.domain_nm
    const domainId =
        (modalView ? data?.domainId : data?.company_domain_id) || ''

    const { domains: domainData } = useDomainContext() || {}

    const mutation = useApplicationHistory()

    const onClickModal = (
        e: React.MouseEvent,
        label: string,
        isLinked: boolean
    ) => {
        e.stopPropagation()
        onOpen()
        setShowDetailsModal(null)

        setModalDetails({
            name: label,
            data: domainName,
            isLinked
        })
    }

    const handleChange = async (e: React.MouseEvent, localDomainId: string) => {
        e.stopPropagation()
        setSelectedDomainId(localDomainId)
        //await fetchDomainData()
    }

    const onClickShowHistory = async () => {
        try {
            const Payload = {
                applicationId,
                page: page,
                offset: offSet
            }
            const response = await mutation.mutateAsync(Payload)
            setHistoryData(response.data)
            setRecordCount(response.recordCount)
            setOpenApplicationLogModal(!openApplicationLogModal)
        } catch (err) {
            setApplicationServerError(err)
        }
    }

    const getMenuItemCompanyDomain = () => {
        if (
            domainId &&
            domainName &&
            (userDomains?.includes(domainId) || isAdmin)
        ) {
            return { label: 'Unlink Company Domain', action: true }
        } else if (
            (isAdmin || (userDomains?.length || 0) > 0) &&
            (!domainId || domainName === '')
        ) {
            return { label: 'Link Company Domain', action: false }
        }
        return ''
    }

    useEffect(() => {
        if (domainData && selectedDomainId) {
            const selectedDomain = domainData.filter(
                ({ company_domain_id }) => company_domain_id == selectedDomainId
            )
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDomainDetails(selectedDomain?.[0])
            setShowDetailsModal('Company Domain')
            onOpen()
        }
    }, [domainData, selectedDomainId, onOpen])

    const { label: domainLabel = '', action: domainAction = false } =
        getMenuItemCompanyDomain() || {}
    const showActionItems =
        (domainName && domainId) ||
        data?.ebc_level_4_nm ||
        data?.ebc_level_3_nm ||
        getMenuItemCompanyDomain()

    return (
        <>
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button variant='plain' size='md' color=''>
                        <IconMoreVertical
                            color={expanded ? 'white' : 'brand'}
                            size='md'
                            isFilled={false}
                        />
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            {domainName && domainId && (
                                <Menu.Item
                                    value='Company Domain'
                                    onClick={e => handleChange(e, domainId)}
                                >
                                    Company Domain Details
                                </Menu.Item>
                            )}
                            {getMenuItemCompanyDomain() && (
                                <Menu.Item
                                    value={domainLabel}
                                    onClick={e =>
                                        onClickModal(
                                            e,
                                            'Company Domain',
                                            domainAction
                                        )
                                    }
                                >
                                    {domainLabel}
                                </Menu.Item>
                            )}
                            {(isAdmin || userDomains?.includes(domainId)) && (
                                <Menu.Item
                                    value='show history'
                                    onClick={async () => {
                                        await onClickShowHistory()
                                    }}
                                >
                                    Show History
                                </Menu.Item>
                            )}
                            {!showActionItems && (
                                <Menu.Item
                                    value='No Actions Available'
                                    disabled={true}
                                >
                                    No Actions Available
                                </Menu.Item>
                            )}
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
            {showDetailsModal ? (
                <>
                    {selectedDomainId == domainId && (
                        <CompanyDomainDetails
                            data={domainDetails}
                            isOpen={isOpen}
                            onClose={() => {
                                setSelectedDomainId(null)
                                onClose()
                            }}
                        />
                    )}
                </>
            ) : modalDetails?.isLinked ? (
                <ApplicationMapping
                    modalDetails={modalDetails}
                    applicationData={data}
                    isLinked={modalDetails?.isLinked}
                    isOpen={isOpen}
                    onClose={onClose}
                    domainName={{ id: domainId }}
                />
            ) : (
                <DomainProvider>
                    <LinkApplication
                        data={data}
                        modalDetails={modalDetails}
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                </DomainProvider>
            )}

            {openApplicationLogModal && (
                <LogsModal
                    isOpen={openApplicationLogModal}
                    onClose={() => {
                        setOpenApplicationLogModal(false)
                    }}
                    columns={applicationLogTableLabel}
                    data={historyData}
                    searchApic='application'
                    id={applicationId || ''}
                    offset={offSet}
                    fetchData={mutation.mutateAsync}
                    name={selectedApplicationName || ''}
                    recordCount={recordCount}
                    serverError={applicationServerError}
                />
            )}
        </>
    )
}

export default ApplicationListActions
