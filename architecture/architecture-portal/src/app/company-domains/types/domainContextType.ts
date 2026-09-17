import { Domain, SubDomain } from './domains'

export interface DomainContextType {
    domains: Domain[]
    loading: boolean
    error: unknown
    subDomains: SubDomain[]
    subDomainLoading: boolean
    subDomainError: unknown
}
