import { ApiMetadata } from '@/app/company-domains/types/apiEndpoints'

export interface DirectoryContextType {
    selectedOption: number
    applicationExpandedIndex: number | null
    setSelectedOption: (option: number) => void
    setApplicationExpandedIndex: (centralId: number | null) => void
    page: number
    setPage: (page: number) => void
    apiData: ApiMetadata[]
    setCompanyDomainApiData: (data: ApiMetadata[]) => void
}
