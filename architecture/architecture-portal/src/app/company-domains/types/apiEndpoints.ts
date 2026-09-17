import { MultiValue, StylesConfig } from 'react-select'
export interface Reviewer {
    isEnggReviewer: boolean
    isArchReviewer: boolean
    isEArbReviewer: boolean
    email: string
    earbReviewers: string[]
    headEngineer: string
    principalArchitect: string
    delegateType?: string
}

export interface ApiHistory {
    [key: string]: string | number | null | undefined | boolean
    creat_user_nm?: string
    userid?: string
    wkflow_step_nm?: string
    wkflow_sta_val_tx?: string
    aprv_ts?: string
    is_delegate_approval?: boolean | null
    is_delegate_to?: string | null
}

export interface Column {
    key: string
    name: string
    title: string
    isSortable: boolean
    shortName?: string
    filterType?: string
    filterTitle?: string
    filterableValues?: string[]
}

export interface Markets {
    code: string
    value: string
    label: string
}

export interface ApiAddDa {
    apiOnboardingUrl?: string
    api_resource?: string
    apiCatalogUrl?: string
    status?: string
}

export interface EbcmCapability {
    capability_id: string
    capability_nm: string
}

export interface ApiMetadata {
    api_metadata_id: string
    api_nm: string
    api_ds: string
    prim_company_domain_id: string
    prvd_company_domain_id: string[]
    consm_company_domain_id: string[]
    consm_co_dmn_da: string[]
    prvd_company_sub_domain_id: string[]
    consm_company_sub_domain_id: string[]
    prim_company_sub_domain_id: string
    prim_company_domain_nm: string
    prvd_company_domain_nm: string[]
    consm_company_domain_nm: string[]
    prvd_company_sub_domain_nm: string[]
    consm_company_sub_domain_nm: string[]
    prim_company_sub_domain_nm: string
    ebcm_names: string[]
    ebcm_v10?: EbcmCapability[]
    co_editors: string[]
    status: string
    api_endpoint: ApiEndpoint[]
    add_da?: ApiAddDa
    ebcm_da?: string[]
    api_resource?: string
    apiOnboardingUrl?: string
    /**
     * FYI these properties don't get returned by the API.
     * They've only been added here to remove TS errors in the migrated components.
     */
    sub_company_domain_name: string
    draft_user_email: string
    expanded?: boolean
    history?: ApiHistory[]
    api_endpoint_metadata_type?: string
    proposed?: string
    darb_arch?: string
    darb_eng?: string
    earb?: string
    company_domain_id?: string
    created_user_email?: string
    api_endpoint_metadata_id?: string
}

export interface ApiEndpoint {
    api_endpoint_metadata_id: string
    endpoint_operation: string
    endpoint_ds: string
    endpoint_type: string
    endpoint_style: string
    journey_link: string
    intended_markets: Markets[]
    actual_markets: Markets[]
    input: string
    output: string
    verb: string
    uri: string
    schema: string
    catalog_status: string
    api_catalog_url: string
    darb_arch: string
    darb_arch_user_email: string
    darb_arch_user_name: string
    darb_eng: string
    darb_eng_user_email: string
    darb_eng_user_name: string
    draft: string
    draft_user_email: string
    draft_user_name: string
    proposed: string
    proposed_user_email: string
    proposed_user_name: string
    earb: string
    earb_user_email: string
    earb_user_name: string
    prodcert: string
    isrejected: string
    precert: string
    precert_user_email: string
    precert_user_name: string
    status: string
    preCert: string
    prodCert: string
    expanded: boolean
    api_status: string
    hasApproveAction: boolean
    sub_company_domain_name: string
    api_nm: string
    api_onboarding_url?: string
    api_endpoint_type_nm?: string
    operationTotalScore?: number | null
    consm_co_dmn_da: string[]
    slas?: {
        response_time: string
        average_rps: string
        peak_rps: string
        error_rate: string
        availability: string
    }
    ebcm_names?: string[]
    ebcm_v10?: EbcmCapability[]
    api_metadata_id?: string
    delete?: string
    apiData?: ApiMetadata
}

export interface FilterStatus {
    apiType: {
        typeA: boolean
        typeB: boolean
    }
    status: {
        draft: boolean
        proposed: boolean
        darbAppr: boolean
        earbAppr: boolean
        preCert: boolean
        prodCert: boolean
        catalog: boolean
        deleted: boolean
    }
}

export interface SelectOptions {
    label: string
    value: string
    api_metadata_id?: string
    isFixed?: boolean
    company_domain_id?: string
    domain_nm?: string
}

export interface ApiFormType {
    id: string
    subDomain: SelectOptions | null
    apiName: string
    apiResource: string
    apiDesc: string
    apiType: SelectOptions | null
    prvdDomain: SelectOptions[]
    cnsmDomain: SelectOptions[]
    input: string
    output: string
    ebcm: string | SelectOptions
    intendedMarkets: Markets[]
    actualMarkets: Markets[]
    journeyLink: string
    apiCoeditors: string[]
    apiStyle: string
    api: SelectOptions | null
    operation: string
    endpoint_ds: string
    slaResponseTime: string
    slaAverageRps: string
    slaPeakRps: string
    slaErrorRate: string
    slaAvailability: string
    ebcm_da: string[]
}

export interface SelectedOptionAction {
    action: string
    removedValue: SelectOptions
}

export interface ApiStatusHistoryTableProps {
    columns: Column[]
    data: ApiHistory[] | undefined
    isLoading: boolean
    isModal?: boolean
}

export interface SortTable {
    sortOrder: 'ASC' | 'DESC' | null
    sortColumn: string | null
}

export interface ApiStatusHistoryModalProps {
    columns: Column[]
    data: ApiHistory[]
    isOpen: boolean
    onClose: () => void
    operationName?: string
    isLoading: boolean
}

export interface DelegateModalProps {
    isOpen: boolean
    onClose: () => void
    domainId: string
    setDelegatesData: (delegates: string[]) => void
    delegateList: string[]
    domainName: string
}

export interface ConfirmationSummary {
    title: string
    body: string
}

export interface Delegate {
    email: string
    type: string
}

export interface SelectOptions {
    label: string
    value: string
}

export interface ConsumerCompanyDomainOption {
    value: string
    label: string
}

export interface ErrorType {
    error: boolean
    message: string
}

export interface OperationalFieldsProps {
    api_endpoint_metadata_id: string
    viewOnly: boolean
    canEditPartially?: boolean
    tableData: ApiMetadata
    isDeletedApi?: boolean
    isDeletedApiOperation?: boolean
    consumerCompanyDomainValue: ConsumerCompanyDomainOption[]
    handleConsumerCompanyDomainChange: (
        value: MultiValue<ConsumerCompanyDomainOption>
    ) => void
    handleConsumerCompanyDomainCancel: () => void
    isEditConsumerCompanyDomain: boolean
    setIsEditConsumerCompanyDomain: (value: boolean) => void
    handleChange: (name: string, newValue: Markets[]) => void
    handleSubmit: () => void
    actualMarkets: Markets[]
    handleConsumerCompanyDomainSave: () => void
    consumerCompanyDomainName: string | undefined
    isEditActualMarkets: boolean
    setIsEditActualMarkets: (value: boolean) => void
    intendedMarketsLabels: React.ReactNode
    actualMarketsLabels: React.ReactNode
    consumerCompanyDomainOptions: SelectOptions[]
    errorMessage: string
    setErrorMessage: (value: string) => void
    formValues: { actualMarkets: Markets[] }
    setFormValues: (value: { actualMarkets: Markets[] }) => void
}

export interface OperationalDataProps {
    reviewers: Reviewer | undefined
    setIsEditRow: (
        id: string,
        data: ApiMetadata & ApiEndpoint,
        name: string
    ) => void
    showEditAction: boolean
    reloadData: () => void
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
    handleDialog: (value: string) => void
    setShowRevert: (value: boolean) => void
    handleShowHistory: () => void
    consumerCompanyDomainValue: ConsumerCompanyDomainOption[]
    handleConsumerCompanyDomainChange: (
        value: MultiValue<ConsumerCompanyDomainOption>
    ) => void
    handleConsumerCompanyDomainCancel: () => void
    isEditConsumerCompanyDomain: boolean
    setIsEditConsumerCompanyDomain: (value: boolean) => void
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
    handleSlaSave: () => void
    handleCancelSlaEdit: () => void
    isSlaEdit: boolean
    slaFormErrors: { [key: string]: ErrorType }
    setIsSlaEdit: (value: boolean) => void
    slaFormValues: {
        slaResponseTime: string
        slaAverageRps: string
        slaPeakRps: string
        slaErrorRate: string
        slaAvailability: string
    }
}

export interface EbcmLevelState {
    level1: SelectOptions | null
    level2: SelectOptions | null
    level3: SelectOptions | null
    level4: SelectOptions | null
    level2Options: Array<{ id: string; name: string }>
    level3Options: Array<{ id: string; name: string }>
    level4Options: Array<{ id: string; name: string }>
}

export interface OperationDetailsFormProps {
    apiEndpoints: SelectOptions[]
    consumerDomainOptions: SelectOptions[]
    ebcmLevelsDataLabel: string
    formErrors: { [key: string]: ErrorType }
    formValues: ApiFormType
    hasLockedApiSelection: boolean
    levels: EbcmLevelState
    onChange: (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | { target: { name: string; value: SelectOptions } }
    ) => void
    onChangeMultiSelect: (
        name: string,
        newValue: SelectOptions[] | Markets[],
        actionMeta: SelectedOptionAction
    ) => void
    onChangeSelectSingle: (name: string, value: SelectOptions) => void
    onLevel1Change: (value: SelectOptions | null) => void
    onLevel2Change: (
        newValue: SelectOptions,
        actionMeta: { action: string }
    ) => void
    onLevel3Change: (
        newValue: string | SelectOptions,
        actionMeta: { action: string }
    ) => void
    onLevel4Change: (value: SelectOptions | null) => void
    onRemoveEBCM: (label: string) => void
    selectedEBCM: SelectOptions[]
    showRegisterMessage: boolean
    sortedList1: Array<{ id: string; name: string }>
    selectStyles: StylesConfig<SelectOptions, boolean>
    setSelectedEBCM: (value: SelectOptions[]) => void
    setFormValues: (value: ApiFormType) => void
    setLevels: (value: EbcmLevelState) => void
}

export interface EBCMFieldsProps {
    formErrors: { [key: string]: ErrorType }
    formValues: ApiFormType
    levels: EbcmLevelState
    onLevel1Change: (value: SelectOptions | null) => void
    onLevel2Change: (
        newValue: SelectOptions,
        actionMeta: { action: string }
    ) => void
    onLevel3Change: (
        newValue: string | SelectOptions,
        actionMeta: { action: string }
    ) => void
    onLevel4Change: (value: SelectOptions | null) => void
    onRemoveEBCM: (label: string) => void
    selectedEBCM: SelectOptions[]
    sortedList1: Array<{ id: string; name: string }>
    selectStyles: StylesConfig<SelectOptions, boolean>
    setSelectedEBCM: (value: SelectOptions[]) => void
    setFormValues: (value: ApiFormType) => void
    setLevels: (value: EbcmLevelState) => void
}
