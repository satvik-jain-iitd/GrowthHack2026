import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import isEqual from 'lodash.isequal'
import {
    ApiEndpoint,
    ApiFormType,
    ApiMetadata,
    CapabilitiesTree,
    Domain,
    Markets,
    SelectedOptionAction,
    SelectOptions,
    SubDomain
} from '@/app/company-domains/types'
import {
    getEBCMLevelOptions,
    getEBCMLevelValue,
    getEbcmValues,
    getLevel1Value,
    getLevel2Options,
    parseMarketEnablement
} from '@/app/company-domains/utils'
import { useEBCMSearch, useDomainMap } from '@/app/company-domains/hooks'
import { B2B_GATEWAY_DOMAIN } from '@/app/company-domains/constants'
import {
    getFilteredValues,
    validateDomainApiForm
} from './domainApiAddItemValidation'
import type { EditRowType, ErrorType } from './DomainApiAddItem.types'
import { getDomainApiSelectStyles } from '../../utils/reactSelectStyles'

interface UseDomainApiAddItemFormArgs {
    apiData: ApiMetadata[]
    apiEndpointData: ApiEndpoint
    companyDomains: Domain[]
    companySubDomains: SubDomain[]
    domainId: string
    ebcmLevelsData: CapabilitiesTree
    isEditRow: EditRowType
    setIsValuesChanged: (value: boolean) => void
    domainAPIData?: ApiMetadata
}

export const useDomainApiAddItemForm = ({
    apiData,
    apiEndpointData,
    companyDomains,
    companySubDomains,
    domainId,
    ebcmLevelsData,
    isEditRow,
    setIsValuesChanged,
    domainAPIData
}: UseDomainApiAddItemFormArgs) => {
    const {
        api_data: data,
        api_nm,
        api_id,
        isApiEdit = false
    } = isEditRow || {}
    const [newApi, setNewApi] = useState<{
        label: string
        value: string
        api_metadata_id: string
    } | null>(null)
    const { sortedList1 } = useEBCMSearch(ebcmLevelsData)
    const { companyDomainsData, domainMap } = useDomainMap(
        companyDomains,
        companySubDomains
    )

    const orderOptions = (values: SelectOptions[]) => {
        return values
            .filter(value => value?.isFixed)
            .concat(values.filter(value => !value?.isFixed))
            .map(value => ({
                label: value.label || value.domain_nm || '',
                value: value.value || value.company_domain_id || '',
                isFixed: value?.isFixed,
                api_metadata_id: value?.api_metadata_id,
                company_domain_id: value?.company_domain_id,
                domain_nm: value?.domain_nm
            }))
    }

    const domainOptions = orderOptions(companyDomainsData || [])
    const consumerDomainOptions = domainOptions.concat({
        label: B2B_GATEWAY_DOMAIN.NAME,
        value: B2B_GATEWAY_DOMAIN.ID,
        company_domain_id: B2B_GATEWAY_DOMAIN.ID,
        isFixed: undefined,
        api_metadata_id: undefined,
        domain_nm: B2B_GATEWAY_DOMAIN.NAME
    })

    const getFormattedValue = (value: string) => ({ label: value, value })

    const getSubDomainId = (subDomainId: string[]) => {
        const subDomainDetails =
            domainMap?.[domainId]?.subDomains
                ?.filter(item => item.company_sub_domain_id === subDomainId[0])
                .map(item => ({
                    label: item.label || '',
                    value: item.value || ''
                })) || []
        return subDomainDetails.length > 0 ? subDomainDetails[0] : null
    }

    const apiEndpoints = apiData.map((item: ApiMetadata) => ({
        ...item,
        label: item.api_nm,
        value: item.api_metadata_id,
        api_metadata_id: item.api_metadata_id
    }))

    const { add_da = '' } = data || {}
    const ebcm_da = data?.ebcm_da || []
    const additionalData =
        typeof add_da === 'string' && add_da.length > 0
            ? JSON.parse(add_da)
            : add_da

    const [formValue, setFormValue] = useState({ label: 'API', value: 'api' })
    const defaultValues = useMemo(
        () => ({
            id: domainId,
            subDomain:
                data?.prvd_company_sub_domain_id &&
                data?.sub_company_domain_name
                    ? getSubDomainId(data.prvd_company_sub_domain_id)
                    : null,
            apiName: data?.api_nm || '',
            apiResource: data?.api_resource || '',
            apiDesc: data?.api_ds || '',
            apiType: apiEndpointData?.endpoint_type
                ? getFormattedValue(apiEndpointData.endpoint_type)
                : null,
            prvdDomain: (domainAPIData || data)?.prvd_company_domain_id
                ? (domainAPIData || data)?.prvd_company_domain_id.map(
                      (item: string) => domainMap[item]
                  )
                : orderOptions([domainMap[domainId]] as SelectOptions[]),
            cnsmDomain: (() => {
                if (
                    !data?.consm_co_dmn_da ||
                    !Array.isArray(data.consm_co_dmn_da)
                ) {
                    return []
                }
                return data.consm_co_dmn_da
                    .map(
                        (id: string) =>
                            consumerDomainOptions.find(
                                option => String(option.value) === String(id)
                            ) || {
                                label: domainMap?.[id]?.label || id,
                                value: domainMap?.[id]?.value || id
                            }
                    )
                    .filter(Boolean)
            })(),
            input: apiEndpointData?.input || '',
            output: apiEndpointData?.output || '',
            ebcm: '',
            intendedMarkets:
                parseMarketEnablement(apiEndpointData?.intended_markets) || [],
            actualMarkets:
                parseMarketEnablement(apiEndpointData?.actual_markets) || [],
            journeyLink: apiEndpointData?.journey_link || '',
            apiCoeditors: data.co_editors || [],
            apiStyle: apiEndpointData?.endpoint_style || '',
            api: api_nm
                ? {
                      label: api_nm,
                      value: api_id,
                      api_metadata_id: api_id
                  }
                : null,
            operation: apiEndpointData?.endpoint_operation || '',
            endpoint_ds: apiEndpointData?.endpoint_ds || '',
            slaResponseTime: apiEndpointData?.slas?.response_time || '',
            slaAverageRps: apiEndpointData?.slas?.average_rps || '',
            slaPeakRps: apiEndpointData?.slas?.peak_rps || '',
            slaErrorRate: apiEndpointData?.slas?.error_rate || '',
            slaAvailability: apiEndpointData?.slas?.availability || ''
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, domainId, domainMap]
    )

    const isApiFormEnabled =
        (formValue.label === 'API' && !isEditRow.api_id) || isApiEdit
    const [formValues, setFormValues] = useState<ApiFormType>(
        defaultValues as ApiFormType
    )
    const [formErrors, setFormErrors] = useState<{ [key: string]: ErrorType }>(
        {}
    )
    const [isVisible, setIsVisible] = useState(false)
    const [selectedEBCM, setSelectedEBCM] = useState(
        getEbcmValues(ebcm_da, ebcmLevelsData)
    )

    const ebcmLevel1 = getLevel1Value(defaultValues.ebcm || '', sortedList1)
    const ebcmLevel2Options = getLevel2Options(
        ebcmLevel1?.label || '',
        ebcmLevelsData
    )
    const ebcmLevel2 = getEBCMLevelValue(
        defaultValues.ebcm || '',
        ebcmLevel2Options,
        3
    )
    const ebcmLevel3Options = getEBCMLevelOptions(
        ebcmLevel2?.label || '',
        ebcmLevel2Options
    )
    const ebcmLevel3 = getEBCMLevelValue(
        defaultValues.ebcm || '',
        ebcmLevel3Options,
        5
    )
    const ebcmLevel4Options = getEBCMLevelOptions(
        ebcmLevel3?.label || '',
        ebcmLevel3Options
    )
    const ebcmLevel4 = getEBCMLevelValue(
        defaultValues.ebcm || '',
        ebcmLevel4Options,
        7
    )

    const [levels, setLevels] = useState({
        level1: ebcmLevel1,
        level2: ebcmLevel2,
        level3: ebcmLevel3,
        level4: ebcmLevel4,
        level2Options: defaultValues.ebcm ? ebcmLevel2Options : [],
        level3Options: defaultValues.ebcm ? ebcmLevel3Options : [],
        level4Options: defaultValues.ebcm ? ebcmLevel4Options : []
    })

    const clearFormErrors = (name: string) => {
        setFormErrors(prev => ({
            ...prev,
            [name]: { error: false, message: '' }
        }))
    }

    const onChangeMultiSelect = (
        name: string,
        newValue: SelectOptions[] | Markets[],
        actionMeta: SelectedOptionAction
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                if (
                    (actionMeta.removedValue.isFixed ||
                        actionMeta.removedValue?.company_domain_id ===
                            domainId) &&
                    name === 'prvdDomain'
                ) {
                    return
                }
                break
            case 'clear':
                newValue = formValues.prvdDomain.filter(
                    (
                        value:
                            | (Domain & SubDomain & Markets)
                            | { label: string; value: string }
                    ) =>
                        ('isFixed' in value && value.isFixed) ||
                        (name === 'prvdDomain' && value?.value === domainId)
                )
                break
        }

        if (name === 'intendedMarkets' || name === 'actualMarkets') {
            const isGlobal = newValue.some(
                item =>
                    ('code' in item && item.code === 'GLOBAL') ||
                    item.value === 'GLOBAL'
            )
            const selectedMarkets = Array.isArray(
                name === 'actualMarkets'
                    ? formValues.actualMarkets
                    : formValues.intendedMarkets
            )
                ? name === 'actualMarkets'
                    ? formValues.actualMarkets
                    : formValues.intendedMarkets
                : []
            const hasGlobal = selectedMarkets.some(
                (item: Markets) =>
                    item.code === 'GLOBAL' || item.value === 'GLOBAL'
            )

            if (hasGlobal && newValue.length > 1) {
                setFormErrors(prev => ({
                    ...prev,
                    [name]: {
                        error: true,
                        message:
                            'Global selection cannot be combined with other markets'
                    }
                }))
                return
            }
            if (isGlobal) {
                newValue = [
                    {
                        label: 'Global',
                        value: 'GLOBAL',
                        code: 'GLOBAL'
                    } as Domain & SubDomain & Markets
                ]
            }
        }

        clearFormErrors(name)
        setFormValues({
            ...formValues,
            [name]: orderOptions(newValue as SelectOptions[])
        })
        setIsValuesChanged(true)
    }

    const onChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | { target: { name: string; value: SelectOptions } }
    ) => {
        const { name, value } = event.target
        clearFormErrors(name)
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }))
        setIsValuesChanged(true)
    }

    const onChangeSelectSingle = (name: string, value: SelectOptions) => {
        onChange({
            target: {
                name,
                value
            }
        })
    }

    const isFormValid = () => {
        const errors = validateDomainApiForm({
            formValueLabel: formValue.label,
            formValues,
            isApiEdit,
            isApiFormEnabled,
            isEditRow
        })
        setFormErrors(errors)
        return Object.values(errors).every(error => !error.error)
    }

    useEffect(() => {
        setFormValues(defaultValues as ApiFormType)
        setLevels({
            level1: ebcmLevel1,
            level2: ebcmLevel2,
            level3: ebcmLevel3,
            level4: ebcmLevel4,
            level2Options: defaultValues.ebcm ? ebcmLevel2Options : [],
            level3Options: defaultValues.ebcm ? ebcmLevel3Options : [],
            level4Options: defaultValues.ebcm ? ebcmLevel4Options : []
        })
        setSelectedEBCM(getEbcmValues(ebcm_da, ebcmLevelsData))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditRow])

    useEffect(() => {
        const changed =
            !isEqual(
                getFilteredValues(formValues),
                getFilteredValues(defaultValues)
            ) || !isEqual(selectedEBCM, getEbcmValues(ebcm_da, ebcmLevelsData))
        setIsVisible(changed)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValues, formValues])

    useEffect(() => {
        if (formValues.ebcm) {
            setFormErrors(prev => ({
                ...prev,
                ebcm: { error: false, message: '' }
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levels.level1, levels.level2, levels.level3, levels.level4])

    useEffect(() => {
        if (newApi?.label) {
            setFormValues(prev => ({ ...prev, api: newApi }))
        }
    }, [newApi])

    const { theme } = useTheme()

    const selectStyles = getDomainApiSelectStyles(theme, domainId)

    const subDomainOptions =
        domainMap?.[domainId]?.subDomains?.map(subdomain => ({
            label: subdomain.label || '',
            value: subdomain.value || ''
        })) || []
    const selectedEBCMOptions = selectedEBCM.filter(
        (item): item is SelectOptions => item !== null
    )

    return {
        additionalData,
        apiEndpoints,
        consumerDomainOptions,
        domainOptions,
        formValue,
        formValues,
        formErrors,
        isApiEdit,
        isApiFormEnabled,
        isVisible,
        levels,
        newApi,
        onChange,
        onChangeMultiSelect,
        onChangeSelectSingle,
        setFormValues,
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
        setLevels
    }
}
