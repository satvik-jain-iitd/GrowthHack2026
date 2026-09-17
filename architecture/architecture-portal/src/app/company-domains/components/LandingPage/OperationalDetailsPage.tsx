/* istanbul ignore file */
import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import {
    apiColumns,
    REVIEW_LABELS,
    B2B_GATEWAY_DOMAIN
} from '@/app/company-domains/constants'
import {
    useDomainApiHistoryList,
    useGetDomains
} from '@/app/company-domains/hooks'
import {
    ApiStatusHistoryModal,
    ApiEndpointConfirmationModal,
    ConfirmationModal
} from '../Modals'
import {
    ApiEndpoint,
    ApiMetadata,
    Reviewer,
    ConsumerCompanyDomainOption
} from '@/app/company-domains/types'
import OperationalData from './OperationalData'
import { MultiValue } from 'react-select'
import { toast } from 'react-toastify'
import { useSaveSlasOperation } from '@/app/company-domains/hooks'

interface OperationalDetailsPageProps {
    reviewers: Reviewer | undefined
    setIsEditRow: (
        id: string,
        data: ApiMetadata & ApiEndpoint,
        name: string
    ) => void
    showEditAction: boolean
    reloadData: () => void
    domainId: string
    api_nm: string
    api_metadata_id: string
    api_endpoint_metadata_id: string
    viewOnly: boolean
    canEditPartially?: boolean
    tableData: ApiMetadata
    allowedUsers?: boolean
    isRestoreVisible?: boolean
    isDeleteVisible?: boolean
    handleClick?: (value: string) => void
    isDeletedApi?: boolean
    isDeletedApiOperation?: boolean
}

const OperationalDetailsPage: React.FC<OperationalDetailsPageProps> = ({
    reviewers,
    setIsEditRow,
    showEditAction,
    reloadData,
    domainId,
    api_nm,
    api_metadata_id,
    api_endpoint_metadata_id,
    viewOnly,
    canEditPartially = false,
    tableData,
    allowedUsers,
    isRestoreVisible,
    isDeleteVisible,
    handleClick = () => {},
    isDeletedApi,
    isDeletedApiOperation
}) => {
    const data =
        tableData?.api_endpoint.find(
            (endpoint: ApiEndpoint) =>
                endpoint.api_endpoint_metadata_id === api_endpoint_metadata_id
        ) ?? ({} as ApiMetadata & ApiEndpoint)
    const { domains } = useGetDomains()
    const [openDialog, setOpenDialog] = useState({
        approve: false,
        reject: false
    })
    const [openHistoryTable, setOpenHistoryTable] = useState(false)
    const [showRevert, setShowRevert] = useState(false)
    const [isSlaEdit, setIsSlaEdit] = useState(false)
    const [isEditConsumerCompanyDomain, setIsEditConsumerCompanyDomain] =
        useState(false)
    const getConsumerCompanyDomainSelections = (
        ids: string[] = []
    ): ConsumerCompanyDomainOption[] =>
        ids.map(id => ({
            value: id,
            label:
                domains?.find(domain => domain.company_domain_id == id)
                    ?.domain_nm ||
                (id === B2B_GATEWAY_DOMAIN.ID ? B2B_GATEWAY_DOMAIN.NAME : id)
        }))

    const [consumerCompanyDomainValue, setConsumerCompanyDomainValue] =
        useState<ConsumerCompanyDomainOption[]>([])

    const handleConsumerCompanyDomainChange = (
        newValue: MultiValue<ConsumerCompanyDomainOption>
    ) => {
        setConsumerCompanyDomainValue([...newValue])
    }

    const handleConsumerCompanyDomainCancel = () => {
        setConsumerCompanyDomainValue(
            getConsumerCompanyDomainSelections(data?.consm_co_dmn_da || [])
        )
        setIsEditConsumerCompanyDomain(false)
    }

    useEffect(() => {
        setConsumerCompanyDomainValue(
            getConsumerCompanyDomainSelections(data?.consm_co_dmn_da ?? [])
        )
    }, [data?.consm_co_dmn_da, domains])

    const {
        isLoading: historyDataLoad,
        data: historyData,
        fetchData
    } = useDomainApiHistoryList(
        `/arch-api/v1/domainApi/${api_endpoint_metadata_id}/audLogEndPointHistory`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    )

    const handleShowHistory = () => {
        fetchData()
        setOpenHistoryTable(true)
    }
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
    const handleDialog = (type: string) => {
        setOpenDialog({
            approve: type === 'approve',
            reject: type === 'reject'
        })
    }

    const [slaFormValues, setSlaFormValues] = useState({
        slaResponseTime: data?.slas?.response_time || '',
        slaAverageRps: data?.slas?.average_rps || '',
        slaPeakRps: data?.slas?.peak_rps || '',
        slaErrorRate: data?.slas?.error_rate || '',
        slaAvailability: data?.slas?.availability || ''
    })

    useEffect(() => {
        setSlaFormValues({
            slaResponseTime: data?.slas?.response_time || '',
            slaAverageRps: data?.slas?.average_rps || '',
            slaPeakRps: data?.slas?.peak_rps || '',
            slaErrorRate: data?.slas?.error_rate || '',
            slaAvailability: data?.slas?.availability || ''
        })
    }, [
        data?.slas?.response_time,
        data?.slas?.average_rps,
        data?.slas?.peak_rps,
        data?.slas?.error_rate,
        data?.slas?.availability
    ])

    const [slaFormErrors, setSlaFormErrors] = useState({
        slaResponseTime: { error: false, message: '' },
        slaAverageRps: { error: false, message: '' },
        slaPeakRps: { error: false, message: '' },
        slaErrorRate: { error: false, message: '' },
        slaAvailability: { error: false, message: '' }
    })

    const resetSlaErrors = () => {
        setSlaFormErrors({
            slaResponseTime: { error: false, message: '' },
            slaAverageRps: { error: false, message: '' },
            slaPeakRps: { error: false, message: '' },
            slaErrorRate: { error: false, message: '' },
            slaAvailability: { error: false, message: '' }
        })
    }

    const resetSlaFormValues = () => {
        setSlaFormValues({
            slaResponseTime: data?.slas?.response_time || '',
            slaAverageRps: data?.slas?.average_rps || '',
            slaPeakRps: data?.slas?.peak_rps || '',
            slaErrorRate: data?.slas?.error_rate || '',
            slaAvailability: data?.slas?.availability || ''
        })
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: rawValue } = e.target
        const value = rawValue.trim()
        resetSlaErrors()
        if (isNaN(Number(value))) {
            setSlaFormErrors(prev => ({
                ...prev,
                [name]: { error: true, message: 'Value must be a number' }
            }))
        } else {
            setSlaFormErrors(prev => ({
                ...prev,
                [name]: { error: false, message: '' }
            }))
        }
        if (
            name === 'slaResponseTime' &&
            value !== '' &&
            (Number(value) < 1 || Number(value) > 5000)
        ) {
            setSlaFormErrors(prev => ({
                ...prev,
                slaResponseTime: {
                    error: true,
                    message: 'Response Time must be between 1 and 5000ms'
                }
            }))
        }
        if (
            name === 'slaAverageRps' &&
            value !== '' &&
            (Number(value) < 0 || Number(value) > 5000)
        ) {
            setSlaFormErrors(prev => ({
                ...prev,
                slaAverageRps: {
                    error: true,
                    message: 'Average RPS must be between 0 and 5000'
                }
            }))
        }
        if (
            name === 'slaPeakRps' &&
            value !== '' &&
            (Number(value) < 0 || Number(value) > 5000)
        ) {
            setSlaFormErrors(prev => ({
                ...prev,
                slaPeakRps: {
                    error: true,
                    message: 'Peak RPS must be between 0 and 5000'
                }
            }))
        }
        if (
            name === 'slaAvailability' &&
            value !== '' &&
            (Number(value) > 99.999 || Number(value) <= 0)
        ) {
            setSlaFormErrors(prev => ({
                ...prev,
                slaAvailability: {
                    error: true,
                    message:
                        'Availability must be a percentage value between 0 and 99.999'
                }
            }))
        }
        if (
            name === 'slaErrorRate' &&
            value !== '' &&
            (Number(value) >= 100 || Number(value) <= 0)
        ) {
            setSlaFormErrors(prev => ({
                ...prev,
                slaErrorRate: {
                    error: true,
                    message:
                        'Error Rate must be a percentage value between 0 and 100'
                }
            }))
        }
        setSlaFormValues(prev => ({ ...prev, [name]: value }))
    }

    const saveSlasMutation = useSaveSlasOperation()

    const handleSlaSave = () => {
        const slasKeysMapping = {
            slaResponseTime: 'response_time',
            slaAverageRps: 'average_rps',
            slaPeakRps: 'peak_rps',
            slaErrorRate: 'error_rate',
            slaAvailability: 'availability'
        }
        const isDirty = Object.keys(slasKeysMapping).some(key => {
            const formValue = slaFormValues[key as keyof typeof slaFormValues]
            const dataValue =
                data?.slas?.[
                    slasKeysMapping[
                        key as keyof typeof slasKeysMapping
                    ] as keyof typeof data.slas
                ] ?? null
            if (formValue === '' && (dataValue === null || dataValue === ''))
                return false
            return Number(formValue) !== Number(dataValue)
        })
        if (!isDirty) {
            setIsSlaEdit(false)
            toast.info('No changes detected in NFRs')
            resetSlaErrors()
            resetSlaFormValues()
            return
        }

        const hasErrors = Object.values(slaFormErrors).some(
            error => error.error
        )
        if (hasErrors) {
            return
        }
        if (
            slaFormValues.slaAverageRps !== '' &&
            slaFormValues.slaPeakRps !== '' &&
            Number(slaFormValues.slaPeakRps) <=
                Number(slaFormValues.slaAverageRps)
        ) {
            setSlaFormErrors(prev => ({
                ...prev,
                slaPeakRps: {
                    error: true,
                    message: 'Peak RPS must be greater than Average RPS'
                }
            }))
            return
        }
        const slas = {
            response_time:
                Number(slaFormValues.slaResponseTime) === 0
                    ? null
                    : Number(slaFormValues.slaResponseTime),
            average_rps:
                Number(slaFormValues.slaAverageRps) === 0
                    ? null
                    : Number(slaFormValues.slaAverageRps),
            peak_rps:
                Number(slaFormValues.slaPeakRps) === 0
                    ? null
                    : Number(slaFormValues.slaPeakRps),
            error_rate:
                Number(slaFormValues.slaErrorRate) === 0
                    ? null
                    : Number(slaFormValues.slaErrorRate),
            availability:
                Number(slaFormValues.slaAvailability) === 0
                    ? null
                    : Number(slaFormValues.slaAvailability)
        }
        saveSlasMutation.mutate(
            {
                domainId,
                api_metadata_id,
                api_endpoint_metadata_id,
                slas: slas
            },
            {
                onSuccess: () => {
                    toast.success('NFRs saved successfully')
                    reloadData()
                    setIsSlaEdit(false)
                    resetSlaErrors()
                    resetSlaFormValues()
                }
            }
        )
    }

    const handleCancelSlaEdit = () => {
        setIsSlaEdit(false)
        resetSlaErrors()
        resetSlaFormValues()
    }

    return (
        <>
            <Box
                backgroundColor={{ base: 'rgb(248, 249, 253)', _dark: '#333' }}
                pb={'20px'}
            >
                <OperationalData
                    reviewers={reviewers}
                    setIsEditRow={setIsEditRow}
                    showEditAction={showEditAction}
                    reloadData={reloadData}
                    api_nm={api_nm}
                    api_metadata_id={api_metadata_id}
                    api_endpoint_metadata_id={api_endpoint_metadata_id}
                    viewOnly={viewOnly}
                    canEditPartially={canEditPartially}
                    tableData={tableData}
                    allowedUsers={allowedUsers}
                    isRestoreVisible={isRestoreVisible}
                    isDeleteVisible={isDeleteVisible}
                    handleClick={handleClick}
                    isDeletedApi={isDeletedApi}
                    isDeletedApiOperation={isDeletedApiOperation}
                    handleDialog={handleDialog}
                    setShowRevert={setShowRevert}
                    handleShowHistory={handleShowHistory}
                    consumerCompanyDomainValue={consumerCompanyDomainValue}
                    handleConsumerCompanyDomainChange={
                        handleConsumerCompanyDomainChange
                    }
                    handleConsumerCompanyDomainCancel={
                        handleConsumerCompanyDomainCancel
                    }
                    isEditConsumerCompanyDomain={isEditConsumerCompanyDomain}
                    setIsEditConsumerCompanyDomain={
                        setIsEditConsumerCompanyDomain
                    }
                    onChange={onChange}
                    handleSlaSave={handleSlaSave}
                    handleCancelSlaEdit={handleCancelSlaEdit}
                    isSlaEdit={isSlaEdit}
                    setIsSlaEdit={setIsSlaEdit}
                    slaFormErrors={slaFormErrors}
                    slaFormValues={slaFormValues}
                />
            </Box>
            <ApiEndpointConfirmationModal
                isApprove={openDialog.approve}
                reviewLabel={getReviewLabel() || ''}
                domainId={domainId}
                reloadData={reloadData}
                api_endpoint_metadata_id={api_endpoint_metadata_id}
                api_metadata_id={api_metadata_id}
                isOpen={openDialog.approve || openDialog.reject}
                closeDialog={() =>
                    setOpenDialog({ approve: false, reject: false })
                }
                reviewers={reviewers}
            />
            {openHistoryTable && (
                <ApiStatusHistoryModal
                    isOpen={openHistoryTable}
                    onClose={() => setOpenHistoryTable(false)}
                    columns={apiColumns}
                    data={
                        historyData && Array.isArray(historyData[0].history)
                            ? historyData[0].history
                            : []
                    }
                    operationName={data?.endpoint_operation}
                    isLoading={historyDataLoad}
                />
            )}
            {showRevert && (
                <ConfirmationModal
                    isOpen={showRevert}
                    closeDialog={() => setShowRevert(false)}
                    data={data}
                    isRevert={true}
                    reloadData={reloadData}
                    isApiData={false}
                    domainId={domainId}
                    api_metadata_id={api_metadata_id}
                />
            )}
        </>
    )
}

export default OperationalDetailsPage
