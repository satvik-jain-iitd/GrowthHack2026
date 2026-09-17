import { useEffect, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import {
    HistoryData,
    useDomainApiHistoryList,
    useGetDomains,
    useUserDetails
} from '@/app/company-domains/hooks'
import { OperationalTable } from './OperationTable'
import {
    getAbsoluteApiUrl,
    domainHistoryTableLabel,
    REVIEW_LABELS,
    B2B_GATEWAY_DOMAIN
} from '@/app/company-domains/constants'
import {
    ApiAddDa,
    ApiEndpoint,
    ApiMetadata,
    Reviewer
} from '@/app/company-domains/types'
import {
    AddCoEditorsModal,
    ApiEndpointHistoryModal,
    ApiEndpointConfirmationModal,
    ErrorModal,
    ConfirmationModal
} from '../Modals'
import ApiActionBar from './ApiActionBar'
import ApiSummarySection from './ApiSummarySection'

const DetailsPageAPI = ({
    reviewers,
    setIsEditRow,
    data,
    reloadData,
    domainId,
    api_metadata_id,
    additionalData,
    endpointMetadata,
    isLoading,
    api_nm,
    rowExpanded,
    viewOnly,
    setOperationDragInProgress,
    allowedUsers
}: {
    reviewers: Reviewer | undefined
    setIsEditRow: (
        id: string,
        data: ApiMetadata & ApiEndpoint,
        name: string,
        isApiEdit?: boolean
    ) => void
    data: ApiMetadata & ApiEndpoint
    reloadData: () => void
    domainId: string
    api_metadata_id: string
    additionalData: ApiAddDa
    endpointMetadata: ApiEndpoint[]
    isLoading?: boolean
    api_nm: string
    rowExpanded: boolean
    viewOnly: boolean
    setOperationDragInProgress?: (isDragging: boolean) => void
    allowedUsers?: boolean
}) => {
    const [openDialog, setOpenDialog] = useState({
        approve: false,
        reject: false
    })
    const [isDraggingDisabled, setIsDraggingDisabled] = useState(true)
    const [tableData, setTableData] = useState<ApiMetadata>(data)
    const [errorMessage, setErrorMessage] = useState('')
    const { isAdmin, domainOwner, loggedInUserEmail } = useUserDetails()

    const { domains } = useGetDomains()
    const consumerDomainNames = useMemo(() => {
        return data?.consm_co_dmn_da
            ? data?.consm_co_dmn_da
                  ?.map(
                      id =>
                          domains?.find(
                              domain => domain.company_domain_id == id
                          )?.domain_nm ||
                          (id === B2B_GATEWAY_DOMAIN.ID
                              ? B2B_GATEWAY_DOMAIN.NAME
                              : undefined)
                  )
                  .filter(name => !!name)
                  .join(', ')
            : undefined
    }, [data?.consm_co_dmn_da, domains])
    const [coEditorsData, setCoEditorsData] = useState(data?.co_editors || [])
    const allRequestors =
        data?.api_endpoint?.map(item =>
            item?.draft_user_email?.toLowerCase()
        ) || []
    const uniqueRequestors = [
        ...new Set([
            ...allRequestors,
            ...coEditorsData.map(email => email.toLowerCase())
        ])
    ]

    const [openApiLogsHistoryModal, setOpenApiLogsHistoryModal] =
        useState(false)
    const [openCoEditorsModal, setOpenCoEditorsModal] = useState(false)

    const [apiHistoryData, setApiHistoryData] = useState<HistoryData[]>([])

    const isShowHistoryVisible =
        isAdmin || domainOwner?.includes(domainId) || reviewers?.isEArbReviewer

    const isAdminOrDomainOwner = isAdmin || domainOwner?.includes(domainId)
    const showEditActionForRequestor =
        uniqueRequestors.length === 0 ||
        (uniqueRequestors.includes(loggedInUserEmail) &&
            data?.status?.toLowerCase() === 'draft')
    // Show the edit action for Admins, Domain Owners at any point of time, and for Requestors only if the API is in Draft status
    const showEditAction = isAdminOrDomainOwner || showEditActionForRequestor
    const isAddCoEditorsVisible =
        isAdmin ||
        domainOwner?.includes(domainId) ||
        data?.created_user_email?.toLowerCase() === loggedInUserEmail

    const {
        isLoading: historyDataLoad,
        data: historyData,
        fetchData
    } = useDomainApiHistoryList(
        `/arch-api/v1/domainApi/${api_metadata_id}/audLogMetadataHistory`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    )

    const handleShowHistory = () => {
        fetchData()
        setOpenApiLogsHistoryModal(true)
    }

    useEffect(() => {
        const flatEndHistory = historyData?.map((history: HistoryData) => {
            return {
                ...history,
                api_metadata_id: history.api_endpoint_metadata_id,
                expanded: false
            }
        })

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApiHistoryData(flatEndHistory || [])
    }, [historyData])

    const getReviewLabel = () => {
        if (reviewers?.isEnggReviewer && !data?.darb_eng) {
            return REVIEW_LABELS.ENGINEER_REVIEW
        }
        if (reviewers?.isArchReviewer && !data?.darb_arch) {
            return REVIEW_LABELS.ARCHITECT_REVIEW
        }
        if (
            reviewers?.isEArbReviewer &&
            data?.darb_eng &&
            data?.darb_arch &&
            !data?.earb
        ) {
            return REVIEW_LABELS.EARB_REVIEW
        }
    }

    const createMarkup = (text: string) => {
        return { __html: text }
    }

    const handleReorderSave = async () => {
        setIsDraggingDisabled(true)
    }

    const apiUrl = getAbsoluteApiUrl(domainId, api_metadata_id)

    const tooltipStyles = {
        '--tooltip-bg': 'white',
        color: 'black',
        fontSize: '16px',
        padding: '10px',
        lineHeight: '20px'
    }
    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
        useState(false)
    const [status, setStatus] = useState('')

    const handleClick = (value: string) => {
        setStatus(value)
        setOpenDeleteConfirmationModal(true)
    }

    const hasOperations = data?.api_endpoint?.length > 0
    const isDeletedApi = data?.add_da?.status?.toLowerCase() === 'deleted'
    const isRestoreVisible = allowedUsers && isDeletedApi
    const endpointStatus = data?.api_endpoint?.map(item => {
        if (item?.delete) {
            return true
        } else {
            return false
        }
    })
    const isDeleteVisible =
        (!hasOperations || !endpointStatus?.includes(false)) &&
        allowedUsers &&
        !isDeletedApi

    return (
        <>
            <Box
                background={{ base: 'rgb(245, 243, 243)', _dark: 'black' }}
                paddingBottom={'20px'}
            >
                <Box
                    whiteSpace={'pre-wrap'}
                    className={styles.fields}
                    _dark={{ backgroundColor: 'black', color: 'white' }}
                >
                    <ApiSummarySection
                        apiUrl={apiUrl}
                        consumerDomainNames={consumerDomainNames}
                        createMarkup={createMarkup}
                        data={data}
                        endpointMetadata={endpointMetadata}
                        tooltipStyles={tooltipStyles}
                    />
                    {!viewOnly && (
                        <ApiActionBar
                            additionalData={additionalData}
                            api_metadata_id={api_metadata_id}
                            api_nm={api_nm}
                            data={data}
                            handleClick={handleClick}
                            handleReorderSave={handleReorderSave}
                            handleShowHistory={handleShowHistory}
                            isAddCoEditorsVisible={isAddCoEditorsVisible}
                            isAdmin={!!isAdmin}
                            isDeleteVisible={!!isDeleteVisible}
                            isDeletedApi={!!isDeletedApi}
                            isDraggingDisabled={isDraggingDisabled}
                            isRestoreVisible={!!isRestoreVisible}
                            isShowHistoryVisible={!!isShowHistoryVisible}
                            onOpenCoEditors={() => setOpenCoEditorsModal(true)}
                            onStartReorder={() => setIsDraggingDisabled(false)}
                            reviewers={reviewers}
                            setIsEditRow={setIsEditRow}
                            showEditAction={showEditAction}
                        />
                    )}
                </Box>
            </Box>
            <ApiEndpointConfirmationModal
                isApprove={openDialog.approve}
                reviewLabel={getReviewLabel() || ''}
                domainId={domainId}
                reloadData={reloadData}
                api_metadata_id={api_metadata_id}
                isOpen={openDialog.approve || openDialog.reject}
                closeDialog={() =>
                    setOpenDialog({ approve: false, reject: false })
                }
            />
            {openApiLogsHistoryModal && (
                <ApiEndpointHistoryModal
                    isOpen={openApiLogsHistoryModal}
                    onClose={() => {
                        setOpenApiLogsHistoryModal(false)
                    }}
                    columns={domainHistoryTableLabel}
                    data={apiHistoryData}
                    isLoading={historyDataLoad}
                    api_nm={api_nm}
                />
            )}
            {rowExpanded && (
                <OperationalTable
                    searchVal={''}
                    api_nm={api_nm}
                    isAdd={false}
                    reviewers={reviewers}
                    domainId={domainId}
                    setIsEditRow={setIsEditRow}
                    isReviewersLoading={false}
                    refreshTableData={reloadData}
                    data={data}
                    isLoading={isLoading || false}
                    viewOnly={viewOnly}
                    isDraggingDisabled={isDraggingDisabled}
                    tableData={tableData}
                    setTableData={setTableData}
                    setOperationDragInProgress={setOperationDragInProgress}
                    api_metadata_id={api_metadata_id}
                    isDeletedApi={isDeletedApi}
                />
            )}
            <AddCoEditorsModal
                isOpen={openCoEditorsModal}
                closeDialog={() => {
                    setOpenCoEditorsModal(false)
                }}
                coEditorsList={coEditorsData}
                reviewers={reviewers}
                data={data}
                setCoEditorsData={setCoEditorsData}
                reloadData={reloadData}
            />
            <ErrorModal
                isOpen={errorMessage?.length != 0}
                errorMessage={errorMessage}
                onClose={() => setErrorMessage('')}
            />
            {openDeleteConfirmationModal && (
                <ConfirmationModal
                    isOpen={openDeleteConfirmationModal}
                    closeDialog={() => setOpenDeleteConfirmationModal(false)}
                    data={data}
                    status={status}
                    isApiData={true}
                    isRevert={false}
                    reloadData={reloadData}
                    domainId={domainId}
                />
            )}
        </>
    )
}

export default DetailsPageAPI
