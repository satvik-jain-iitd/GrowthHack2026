/* istanbul ignore file */
import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Grid, GridItem, Text, HStack } from '@chakra-ui/react'
import { IconWarning, IconCheck, IconClose } from '@americanexpress/dls-icons'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { B2B_GATEWAY_DOMAIN } from '@/app/company-domains/constants'
import { useGetDomains } from '@/app/company-domains/hooks'
import { useEditMarket, useSaveApiData } from '@/app/company-domains/hooks'
import {
    ApiEndpoint,
    ApiMetadata,
    Markets,
    OperationalDataProps
} from '@/app/company-domains/types'
import OperationStepper from './OperationStepper'
import OperationalDataActions from './OperationalDataActions'
import OperationalFields from './OperationalFields'
import { SlaFormElement } from '../DomainAPIs/OperationSlas'
import { NfrList } from '@/components/ui'

const OperationalData: React.FC<OperationalDataProps> = ({
    reviewers,
    setIsEditRow,
    showEditAction,
    reloadData,
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
    isDeletedApiOperation,
    handleDialog,
    setShowRevert,
    handleShowHistory,
    consumerCompanyDomainValue,
    handleConsumerCompanyDomainChange,
    handleConsumerCompanyDomainCancel,
    isEditConsumerCompanyDomain,
    setIsEditConsumerCompanyDomain,
    onChange,
    handleSlaSave,
    handleCancelSlaEdit,
    isSlaEdit,
    slaFormErrors,
    setIsSlaEdit,
    slaFormValues
}) => {
    const data =
        tableData?.api_endpoint.find(
            (endpoint: ApiEndpoint) =>
                endpoint.api_endpoint_metadata_id === api_endpoint_metadata_id
        ) ?? ({} as ApiMetadata & ApiEndpoint)
    const { domains } = useGetDomains()
    const [isEditActualMarkets, setIsEditActualMarkets] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [formValues, setFormValues] = useState({
        actualMarkets: data?.actual_markets
    })
    const [actualMarkets, setActualMarkets] = useState(data?.actual_markets)

    const saveApiDataMutation = useSaveApiData()

    const handleConsumerCompanyDomainSave = () => {
        const requestBody = {
            action_type: 'SAVE',
            api_endpoint_metadata_id: data?.api_endpoint_metadata_id,
            api_metadata_id,
            endpoint_operation: data?.endpoint_operation || '',
            consm_co_dmn_da: consumerCompanyDomainValue.map(item => item.value)
        }

        saveApiDataMutation.mutate(
            {
                isApiFormEnabled: false,
                requestBody
            },
            {
                onSuccess: response => {
                    if (!response.ok) {
                        return
                    }
                    setIsEditConsumerCompanyDomain(false)
                    reloadData()
                }
            }
        )
    }

    const consumerCompanyDomainName = useMemo(() => {
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

    const mutation = useEditMarket()
    const canEditInline =
        canEditPartially && (data?.status || '').toLowerCase() !== 'draft'

    // Show warning icon if slas object is empty or if any of the sla fields have values (to indicate incomplete sla details)
    // check if all the sla fields are empty or not present, if they are all empty then show warning, if any of them have value then also show warning as it indicates incomplete sla details
    const showSlaWarning =
        !data?.slas ||
        !(data.slas && Object.keys(data.slas).length > 0) ||
        Object.keys(data.slas).some(
            key =>
                ([
                    'response_time',
                    'average_rps',
                    'peak_rps',
                    'error_rate',
                    'availability'
                ].includes(key) &&
                    data?.slas?.[key as keyof typeof data.slas] === '') ||
                !data?.slas?.[key as keyof typeof data.slas]
        )

    const determineCurrentStep = (data: ApiEndpoint) => {
        if (data?.status === 'DELETED') return 1
        if (data?.status === 'PRODUCTION CERTIFIED') return 7
        if (
            data?.precert === 'CERTIFIED' ||
            data?.precert === 'DESIGN CERTIFIED'
        )
            return 6
        // TODO: change to correct value that catalog supports
        if (data?.catalog_status === 'ACTIVE') return 5
        if (data?.earb === 'APPROVED') return 4
        if (data?.darb_eng === 'APPROVED' && data?.darb_arch === 'APPROVED')
            return 3
        if (data?.proposed === 'PROPOSED') return 2
        if (data?.draft === 'DRAFT') return 1
        return 1
    }

    const currentStep = determineCurrentStep(data)

    const handleChange = (name: string, newValue: Markets[]) => {
        const isGlobal = newValue?.some(
            (item: Markets) => item.code === 'GLOBAL' || item.value === 'GLOBAL'
        )
        const actualMarketsArray = Array.isArray(formValues?.actualMarkets)
            ? formValues?.actualMarkets
            : []
        // Check if the current selection is global
        const hasGlobal = actualMarketsArray.some(
            item => item.code === 'GLOBAL' || item.value === 'GLOBAL'
        )
        if (hasGlobal && newValue.length > 1) {
            setErrorMessage(
                'Global selection cannot be combined with other markets'
            )
            return
        } else if (isGlobal) {
            newValue = [{ label: 'Global', value: 'GLOBAL', code: 'GLOBAL' }]
            setFormValues({ ...formValues, [name]: newValue })
            setErrorMessage('')
        } else {
            setFormValues({ ...formValues, [name]: newValue })
            setErrorMessage('')
        }
    }

    useEffect(() => {
        setFormValues(prev => ({
            ...prev,
            actualMarkets: data?.actual_markets
        }))
    }, [data?.actual_markets])

    const handleSubmit = async () => {
        const requestBody = {
            api_endpoint_metadata_id: data?.api_endpoint_metadata_id,
            actual_markets: formValues?.actualMarkets
        }

        mutation.mutate(requestBody, {
            onSuccess: (responseData: {
                data: { actual_markets: Markets[] }
            }) => {
                const updatedData = {
                    ...formValues,
                    actualMarkets: responseData?.data?.actual_markets
                }
                setFormValues(updatedData)
                setActualMarkets(responseData?.data?.actual_markets)
                setIsEditActualMarkets(false)
                reloadData()
            }
        })
    }
    const marketLabels = (data: ApiEndpoint, marketField: string) => {
        let markets = []
        try {
            markets =
                typeof data?.[marketField as keyof ApiEndpoint] === 'string'
                    ? JSON.parse(
                          data[marketField as keyof ApiEndpoint] as string
                      )
                    : Array.isArray(data?.[marketField as keyof ApiEndpoint])
                      ? data[marketField as keyof ApiEndpoint]
                      : []
        } catch (error) {
            console.error('Error parsing markets JSON:', error)
            markets = []
        }

        return markets.length > 0
            ? markets
                  .map((market: Markets) => market?.label || '')
                  .filter(Boolean)
                  .join(', ')
            : '--'
    }

    let consumerCompanyDomainOptions = useMemo(
        () =>
            (domains || []).map(domain => ({
                value: domain.company_domain_id,
                label: domain.domain_nm
            })),
        [domains]
    )
    consumerCompanyDomainOptions = consumerCompanyDomainOptions.concat({
        label: B2B_GATEWAY_DOMAIN.NAME,
        value: B2B_GATEWAY_DOMAIN.ID
    })

    const intendedMarketsLabels = marketLabels(data, 'intended_markets')
    const actualMarketsLabels = marketLabels(
        { ...data, actual_markets: formValues.actualMarkets },
        'actual_markets'
    )

    return (
        <Box whiteSpace={'pre-wrap'} className={styles.fields}>
            <Box
                className={styles.stepperContainer}
                backgroundColor={{
                    base: 'rgb(248, 249, 253)',
                    _dark: '#333'
                }}
                pt={10}
            >
                <OperationStepper
                    currentStep={currentStep}
                    status={data?.status}
                />
            </Box>
            <Box
                whiteSpace={'pre-wrap'}
                className={styles.fields}
                width={'100%'}
            >
                <Box p={4}>
                    <Grid templateColumns='repeat(4, 1fr)' gap={4}>
                        <OperationalFields
                            api_endpoint_metadata_id={api_endpoint_metadata_id}
                            viewOnly={viewOnly}
                            canEditPartially={canEditPartially}
                            tableData={tableData}
                            isDeletedApi={isDeletedApi}
                            isDeletedApiOperation={isDeletedApiOperation}
                            consumerCompanyDomainValue={
                                consumerCompanyDomainValue
                            }
                            handleConsumerCompanyDomainChange={
                                handleConsumerCompanyDomainChange
                            }
                            handleConsumerCompanyDomainCancel={
                                handleConsumerCompanyDomainCancel
                            }
                            isEditConsumerCompanyDomain={
                                isEditConsumerCompanyDomain
                            }
                            setIsEditConsumerCompanyDomain={
                                setIsEditConsumerCompanyDomain
                            }
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            actualMarkets={actualMarkets}
                            handleConsumerCompanyDomainSave={
                                handleConsumerCompanyDomainSave
                            }
                            consumerCompanyDomainName={
                                consumerCompanyDomainName
                            }
                            isEditActualMarkets={isEditActualMarkets}
                            setIsEditActualMarkets={setIsEditActualMarkets}
                            intendedMarketsLabels={intendedMarketsLabels}
                            actualMarketsLabels={actualMarketsLabels}
                            consumerCompanyDomainOptions={
                                consumerCompanyDomainOptions
                            }
                            errorMessage={errorMessage}
                            setErrorMessage={setErrorMessage}
                            formValues={formValues}
                            setFormValues={setFormValues}
                        />
                        <GridItem colSpan={2}>
                            {/* Show the 5 slas for the operation as a read only text */}
                            <HStack>
                                <Text
                                    fontWeight='bold'
                                    className={styles.content}
                                    mb={2}
                                >
                                    Non Functional Requirements (NFRs)
                                    {canEditInline && !isSlaEdit && (
                                        <Button
                                            color={'#006fcf'}
                                            onClick={() => setIsSlaEdit(true)}
                                            disabled={
                                                viewOnly ||
                                                isDeletedApi ||
                                                isDeletedApiOperation
                                            }
                                            variant={'plain'}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Text>
                                {canEditInline && isSlaEdit && (
                                    <Box
                                        className={styles.editIcons}
                                        mb={4}
                                        ml={4}
                                    >
                                        <IconCheck
                                            title='Save SLAs'
                                            titleId='save-slas-icon'
                                            className={styles.marketsCheckIcon}
                                            onClick={() => handleSlaSave()}
                                        />
                                        <IconClose
                                            title='Cancel SLAs Edit'
                                            titleId='cancel-slas-icon'
                                            className={styles.marketsCloseIcon}
                                            onClick={() =>
                                                handleCancelSlaEdit()
                                            }
                                        />
                                    </Box>
                                )}
                            </HStack>
                            {showSlaWarning && !isSlaEdit && (
                                <>
                                    <IconWarning
                                        isFilled={true}
                                        color='caution'
                                        size='xl'
                                        style={{ fontSize: '22px' }}
                                    />
                                    <Text as='span' ml={2} color='caution'>
                                        {canEditInline
                                            ? data?.status === 'DRAFT'
                                                ? 'NFRs are required for Production Certification. Please click edit to enter the NFR details.'
                                                : 'Please click edit to enter the NFRs, as they are required for Production Certification'
                                            : 'NFRs are required for Production Certification. Please contact domain personas for adding NFRs.'}
                                    </Text>
                                </>
                            )}
                            {!isSlaEdit && !showSlaWarning && (
                                <NfrList slas={data?.slas} />
                            )}
                            {isSlaEdit && (
                                <SlaFormElement
                                    formValues={slaFormValues}
                                    formErrors={slaFormErrors}
                                    onChange={onChange}
                                />
                            )}
                        </GridItem>
                    </Grid>
                </Box>
                {!viewOnly && (
                    <OperationalDataActions
                        reviewers={reviewers}
                        setIsEditRow={setIsEditRow}
                        showEditAction={showEditAction}
                        api_nm={api_nm}
                        api_metadata_id={api_metadata_id}
                        api_endpoint_metadata_id={api_endpoint_metadata_id}
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
                    />
                )}
            </Box>
        </Box>
    )
}

export default OperationalData
