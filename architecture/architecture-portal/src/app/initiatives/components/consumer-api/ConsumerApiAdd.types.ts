/* istanbul ignore file */

import { AllDomainApisResponse } from '@/app/initiatives/types/DomainApis'

export type ApiType = 'Type A' | 'Type B' | 'Type C'

export type PortalSearchResult = {
    id: string
    source: 'portal'
    apiType: 'Type A' | 'Type B' | 'Type C'
    apiName: string
    providerCompanyDomainId: string
    operationName: string
    operationType: string
    operationStatus: string
    operationPath: string | undefined
    providerCompanyDomain: string
    operationId: string
    portalUrl: string
}

export type ExplorerSearchResult = {
    id: string
    source: 'explorer'
    apiType: 'Type A' | 'Type B' | 'Type C'
    operationName: string
    operationDescription: string
    explorerApiId: string
    explorerUrl: string
    applicationId: string | undefined
    method: string | undefined
    path: string | undefined
}

export type SearchResult = PortalSearchResult | ExplorerSearchResult

export type DomainApisData = AllDomainApisResponse | undefined

export type InitiativeUserRole = {
    isUnitCio: boolean
    isHeadEngineer: boolean
    isUcioDelegate: boolean
    isEnterpriseArchitect: boolean
    isPrincipalArchitect: boolean
    isTechOwner: boolean
    isStatusReportOwner: boolean
    isAdditionalArchitect: boolean
}
