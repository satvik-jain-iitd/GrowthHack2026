import type {
    ApiEndpoint,
    ApiMetadata,
    CapabilitiesTree,
    Domain,
    SubDomain
} from '@/app/company-domains/types'

export interface ErrorType {
    error: boolean
    message: string
}

export interface EditRowType {
    api_id: string
    api_data: ApiMetadata & ApiEndpoint
    api_nm: string
    isApiEdit: boolean
}

export interface DomainApiAddItemPropsType {
    cancelAdd: () => void
    domainId: string
    reloadData: () => void
    isEditRow: EditRowType
    ebcmLevelsData: CapabilitiesTree
    setIsValuesChanged: (value: boolean) => void
    handleTimeOutModalOpen: () => void
    apiData: ApiMetadata[]
    apiEndpointData: ApiEndpoint
    companyDomains: Domain[]
    companySubDomains: SubDomain[]
    domainAPIData?: ApiMetadata
}
