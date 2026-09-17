import { Box, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { useSaveApiData } from '@/app/company-domains/hooks'
import { validateCoEditorEmails } from '@/app/utils/utils'
import { DOMAIN_TEST_IDS } from '../../test-ids'
import { ApiDetailsForm } from './ApiDetailsForm'
import { DomainApiAddItemActions } from './DomainApiAddItemActions'
import { OperationDetailsForm } from './OperationDetailsForm'
import { useDomainApiAddItemForm } from './useDomainApiAddItemForm'
import { SelectOptions } from '@/app/company-domains/types'
import {
    getEBCMLevelOptions,
    getLevel2Options
} from '@/app/company-domains/utils'
import type {
    ErrorType,
    DomainApiAddItemPropsType
} from './DomainApiAddItem.types'

export const DomainApiAddItem = ({
    cancelAdd,
    domainId,
    reloadData,
    isEditRow = {} as DomainApiAddItemPropsType['isEditRow'],
    ebcmLevelsData = {} as DomainApiAddItemPropsType['ebcmLevelsData'],
    setIsValuesChanged,
    apiData,
    apiEndpointData = {} as DomainApiAddItemPropsType['apiEndpointData'],
    companyDomains,
    companySubDomains,
    domainAPIData
}: DomainApiAddItemPropsType) => {
    const { api_data: data, api_nm, isApiEdit = false } = isEditRow || {}
    const isDraftStatus = data?.status?.toLowerCase() === 'draft'
    const [isChangesAdded, setIsChangesAdded] = useState(false)
    const [isSubmitReviewAction, setIsSubmitReviewAction] = useState(false)
    const [loading, setLoading] = useState<string | boolean>(false)
    const [sessionError, setSessionError] = useState('')
    const [openReviewConfirmation, setOpenReviewConfirmation] = useState(false)
    const [openCoEditorsModal, setOpenCoEditorsModal] = useState({
        coEditorsList: false,
        addCoEditors: false
    })
    const mutation = useSaveApiData()
    const queryClient = useQueryClient()
    const {
        additionalData,
        apiEndpoints,
        consumerDomainOptions,
        domainOptions,
        formValue,
        formValues,
        formErrors,
        isApiFormEnabled,
        isVisible,
        levels,
        newApi,
        onChange,
        onChangeMultiSelect,
        onChangeSelectSingle,
        isFormValid,
        selectedEBCM,
        selectedEBCMOptions,
        selectStyles,
        setFormErrors,
        setFormValue,
        setNewApi,
        setSelectedEBCM,
        sortedList1,
        subDomainOptions,
        setFormValues,
        setLevels
    } = useDomainApiAddItemForm({
        apiData,
        apiEndpointData,
        companyDomains,
        companySubDomains,
        domainId,
        ebcmLevelsData,
        isEditRow,
        setIsValuesChanged,
        domainAPIData
    })

    const handleLevel1Change = (value: SelectOptions | null) => {
        setLevels({
            level1: value,
            level2: null,
            level3: null,
            level4: null,
            level2Options: getLevel2Options(value?.label || '', ebcmLevelsData),
            level3Options: [],
            level4Options: []
        })
        setFormValues({
            ...formValues,
            ebcm: value || ''
        })
        setIsValuesChanged(true)
    }
    const handleLevel2Change = (
        newValue: SelectOptions,
        actionMeta: { action: string }
    ) => {
        if (actionMeta.action === 'clear') {
            setLevels({
                ...levels,
                level2: null,
                level3: null,
                level4: null,
                level3Options: [],
                level4Options: []
            })
            setFormValues({
                ...formValues,
                ebcm: levels.level1 as SelectOptions
            })
            return
        }

        setLevels({
            ...levels,
            level2: newValue,
            level3: null,
            level4: null,
            level3Options: getEBCMLevelOptions(
                typeof newValue != 'string' ? newValue?.label : '',
                levels.level2Options
            ),
            level4Options: []
        })
        setFormValues({
            ...formValues,
            ebcm: newValue
        })
        setIsValuesChanged(true)
    }
    const handleLevel3Change = (
        newValue: string | { label: string; value: string },
        actionMeta: { action: string }
    ) => {
        if (actionMeta.action === 'clear') {
            setLevels({
                ...levels,
                level3: null,
                level4: null,
                level4Options: []
            })
            setFormValues({
                ...formValues,
                ebcm: levels.level2 as SelectOptions
            })
            return
        }

        setLevels({
            ...levels,
            level3: newValue as SelectOptions,
            level4: null,
            level4Options: getEBCMLevelOptions(
                typeof newValue != 'string' ? newValue?.label : '',
                levels.level3Options
            )
        })
        setFormValues({
            ...formValues,
            ebcm: newValue as SelectOptions
        })
        setIsValuesChanged(true)
    }
    const handleLevel4Change = (value: SelectOptions | null) => {
        setLevels({
            ...levels,
            level4: value
        })
        setFormValues({
            ...formValues,
            ebcm: (value || levels.level3) as SelectOptions
        })
        setIsValuesChanged(true)
    }

    const handleSave = async (actionLevel: string, submitContinue = false) => {
        if (
            actionLevel === 'SAVE' &&
            formValue.label === 'Operations' &&
            (!formValues.operation || !formValues.api)
        ) {
            const errors = {} as { [key: string]: ErrorType }
            if (!formValues.api) {
                errors.api = {
                    error: true,
                    message: 'API is required'
                }
            }
            if (!formValues.operation && formValues.operation !== '') {
                errors.operation = {
                    error: true,
                    message: 'Operation is required'
                }
            }
            setFormErrors(errors)
            return
        }
        if (actionLevel === 'SUBMIT' && !isFormValid()) {
            console.error('Form is invalid')
            return
        }
        const { isValid, invalidEmails, emails } = validateCoEditorEmails(
            formValues.apiCoeditors,
            isEditRow.api_id
        )
        if (!isValid) {
            setFormErrors(prev => ({
                ...prev,
                apiCoeditors: {
                    error: true,
                    message: `Please enter valid email(s): ${invalidEmails.join(', ')}`
                }
            }))
            return
        }
        if (formValues.ebcm) {
            setFormErrors(prev => ({
                ...prev,
                ebcm: {
                    error: true,
                    message: `Please add the EBCM before ${
                        actionLevel === 'SAVE' ? 'saving' : 'submitting'
                    }.`
                }
            }))
            return
        }
        if (actionLevel === 'SAVE' && !isVisible) {
            setIsChangesAdded(true)
            setOpenReviewConfirmation(true)
            return
        }

        const requestBody = isApiFormEnabled
            ? {
                  pageLink: window.location.href,
                  api_metadata_id: data.api_metadata_id
                      ? data.api_metadata_id
                      : null,
                  api_nm: formValues.apiName,
                  api_ds: formValues.apiDesc,
                  prvd_company_domain_id: formValues.prvdDomain.map(
                      (item: { value: string }) => item.value
                  ),
                  prim_company_domain_id: domainId,
                  prvd_company_sub_domain_id: formValues.subDomain?.value
                      ? [formValues.subDomain?.value]
                      : [],
                  prim_company_sub_domain_id:
                      formValues.subDomain?.value || null,
                  co_editors: emails,
                  api_resource: formValues.apiResource || '',
                  add_da: {
                      ...additionalData,
                      architecturePortalUrl: window.location.href
                  }
              }
            : {
                  pageLink: window.location.href,
                  action_type: actionLevel,
                  api_endpoint_metadata_id:
                      apiEndpointData?.api_endpoint_metadata_id || undefined,
                  api_metadata_id: formValues?.api?.api_metadata_id || null,
                  endpoint_operation: formValues.operation || '',
                  input: formValues.input,
                  output: formValues.output,
                  endpoint_type: formValues?.apiType?.label,
                  endpoint_style: formValues.apiStyle,
                  journey_link: formValues.journeyLink || '',
                  intended_markets: formValues.intendedMarkets,
                  actual_markets: formValues.actualMarkets,
                  endpoint_ds: formValues.endpoint_ds,
                  ebcm_da: selectedEBCM.map(item => item?.value),
                  add_da: {
                      slas: {
                          response_time: formValues.slaResponseTime,
                          average_rps: formValues.slaAverageRps,
                          peak_rps: formValues.slaPeakRps,
                          error_rate: formValues.slaErrorRate,
                          availability: formValues.slaAvailability
                      }
                  },
                  consm_co_dmn_da: formValues.cnsmDomain.map(
                      (item: { value: string }) => item.value
                  ),
                  consm_company_sub_domain_id: data.consm_company_sub_domain_id
                      ? data.consm_company_sub_domain_id
                      : null
              }

        try {
            setLoading(submitContinue ? 'SUBMIT' : 'SUBMIT_ADD')
            const response = await mutation.mutateAsync({
                isApiFormEnabled,
                requestBody
            })
            if (!response) {
                setLoading(false)
                return
            }
            if (response.ok) {
                if (isApiFormEnabled && submitContinue) {
                    const responseData = await response.json()
                    setNewApi({
                        label: responseData?.data?.api_nm,
                        value: responseData?.data?.api_metadata_id,
                        api_metadata_id: responseData?.data?.api_metadata_id
                    })
                    setFormValue({ label: 'Operations', value: 'operations' })
                    try {
                        await queryClient.invalidateQueries({
                            queryKey: ['fetchApiEndpointWithDetails', domainId]
                        })
                    } catch {
                        // ignore
                    }
                    reloadData()
                } else {
                    if (actionLevel === 'SAVE') {
                        cancelAdd()
                        try {
                            await queryClient.invalidateQueries({
                                queryKey: [
                                    'fetchApiEndpointWithDetails',
                                    domainId
                                ]
                            })
                        } catch {
                            // ignore
                        }
                        reloadData()
                        setIsValuesChanged(false)
                    } else {
                        try {
                            reloadData()
                        } catch {
                            // ignore
                        }
                        setOpenReviewConfirmation(true)
                    }
                    setNewApi(null)
                }
            } else {
                const errorMessage = await response.json()
                if (
                    errorMessage?.status === 400 &&
                    errorMessage?.data?.isDuplicateName === true &&
                    errorMessage.message &&
                    isApiFormEnabled
                ) {
                    setFormErrors({
                        apiName: {
                            error: true,
                            message: errorMessage?.message
                        }
                    })
                } else if (
                    errorMessage?.status === 400 &&
                    errorMessage?.data?.isDuplicateName === true &&
                    errorMessage.message
                ) {
                    setFormErrors({
                        operation: {
                            error: true,
                            message: errorMessage?.message
                        }
                    })
                } else if (
                    errorMessage?.status === 400 ||
                    errorMessage?.status === 401
                ) {
                    setSessionError(
                        errorMessage?.status === 400
                            ? 'Session expired. Please log in again.'
                            : errorMessage?.message
                    )
                    return
                }
            }
            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Box
            id='apiFormRow'
            style={{
                paddingTop: '20px'
            }}
        >
            <Box className={styles.DomainApiForm}>
                <h5 data-testid={DOMAIN_TEST_IDS.formHeading}>
                    {isApiFormEnabled
                        ? isApiEdit
                            ? `Editing API - ${data?.api_nm}`
                            : 'Adding New API'
                        : apiEndpointData?.endpoint_operation
                          ? `Editing Operation - ${apiEndpointData?.endpoint_operation}`
                          : 'Proposing Operation'}
                </h5>
                {!isApiFormEnabled && (
                    <Text fontSize='sm' color='gray.500'>
                        Note: For putting an operation in draft click on
                        &apos;Save&apos;, only the Operation name is required
                        and other fields can be left empty.
                    </Text>
                )}
                {isApiFormEnabled ? (
                    <ApiDetailsForm
                        domainId={domainId}
                        domainOptions={domainOptions}
                        formErrors={formErrors}
                        formValues={formValues}
                        onChange={onChange}
                        onChangeMultiSelect={onChangeMultiSelect}
                        onChangeSelectSingle={onChangeSelectSingle}
                        selectStyles={selectStyles}
                        subDomainOptions={subDomainOptions}
                    />
                ) : (
                    <OperationDetailsForm
                        apiEndpoints={apiEndpoints}
                        consumerDomainOptions={consumerDomainOptions}
                        ebcmLevelsDataLabel='ebcm'
                        formErrors={formErrors}
                        formValues={formValues}
                        hasLockedApiSelection={!!api_nm || !!newApi?.label}
                        levels={levels}
                        setSelectedEBCM={setSelectedEBCM}
                        setFormValues={setFormValues}
                        setLevels={setLevels}
                        onChange={onChange}
                        onChangeMultiSelect={onChangeMultiSelect}
                        onChangeSelectSingle={onChangeSelectSingle}
                        onLevel1Change={handleLevel1Change}
                        onLevel2Change={handleLevel2Change}
                        onLevel3Change={handleLevel3Change}
                        onLevel4Change={handleLevel4Change}
                        onRemoveEBCM={label =>
                            setSelectedEBCM(
                                selectedEBCM.filter(
                                    item => item?.label !== label
                                )
                            )
                        }
                        selectedEBCM={selectedEBCMOptions}
                        showRegisterMessage={!isEditRow.api_id}
                        sortedList1={sortedList1}
                        selectStyles={selectStyles}
                    />
                )}
                <DomainApiAddItemActions
                    cancelAdd={cancelAdd}
                    data={data}
                    formValues={formValues}
                    handleSave={handleSave}
                    isApiEdit={isApiEdit}
                    isApiFormEnabled={isApiFormEnabled}
                    isChangesAdded={isChangesAdded}
                    isDraftStatus={isDraftStatus}
                    isEditRowApiId={isEditRow.api_id}
                    isFormValid={isFormValid}
                    isSubmitReviewAction={isSubmitReviewAction}
                    loading={loading}
                    openCoEditorsModal={openCoEditorsModal}
                    openReviewConfirmation={openReviewConfirmation}
                    reloadData={reloadData}
                    sessionError={sessionError}
                    setIsChangesAdded={setIsChangesAdded}
                    setIsSubmitReviewAction={setIsSubmitReviewAction}
                    setIsValuesChanged={setIsValuesChanged}
                    setOpenCoEditorsModal={setOpenCoEditorsModal}
                    setOpenReviewConfirmation={setOpenReviewConfirmation}
                    setSessionError={setSessionError}
                />
            </Box>
        </Box>
    )
}
