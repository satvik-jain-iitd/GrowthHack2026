/* istanbul ignore file */

import {
    DomainApisData,
    ExplorerSearchResult,
    PortalSearchResult
} from './ConsumerApiAdd.types'
import {
    getAbsoluteOperationUrl,
    getExplorerUrl
} from '@/app/company-domains/constants/domainApiMap'

export const API_TYPE_OPTIONS = ['Type A', 'Type B', 'Type C'] as const
export const PORTAL_PAGE_SIZE = 20

function normalizeType(
    type: string | undefined
): 'Type A' | 'Type B' | 'Type C' {
    const value = (type || '').toLowerCase()
    if (value.includes('type b')) {
        return 'Type B'
    }
    if (value.includes('type a')) {
        return 'Type A'
    }
    return 'Type C'
}

export function normalizeExplorerResult(
    result: Record<string, unknown>
): ExplorerSearchResult {
    const operationName =
        (result.operationName as string) ||
        (result.apiName as string) ||
        (result.name as string) ||
        ''
    const explorerApiId =
        (result.explorerApiId as string) ||
        (result.apiId as string) ||
        (result.id as string) ||
        operationName
    const explorerUrl = getExplorerUrl(explorerApiId)

    return {
        id: explorerApiId,
        source: 'explorer',
        apiType: normalizeType(result.apiType as string | undefined),
        operationName,
        operationDescription:
            (result.operationDescription as string) ||
            (result.apiDescription as string) ||
            (result.description as string) ||
            '',
        explorerApiId,
        explorerUrl,
        applicationId: result.cid as string | undefined,
        method: result.method as string | undefined,
        path: result.basePath as string | undefined
    }
}

export function getPortalResults(domainApis: DomainApisData) {
    const results: PortalSearchResult[] = []

    Object.values(domainApis || {}).forEach(domain => {
        Object.values(domain.apis || {}).forEach(api => {
            Object.values(api.operations || {}).forEach(operation => {
                const type = normalizeType(operation.operation_type)
                const portalUrl = getAbsoluteOperationUrl(
                    domain.company_domain_id,
                    operation.operation_id
                )

                results.push({
                    id: operation.operation_id,
                    source: 'portal',
                    apiType: type,
                    apiName: api.api_name,
                    providerCompanyDomainId: domain.company_domain_id,
                    operationName: operation.operation_name,
                    operationType: operation.operation_type,
                    operationStatus: operation.status,
                    operationPath: operation.operation_path,
                    providerCompanyDomain: domain.company_domain_name,
                    operationId: operation.operation_id,
                    portalUrl
                })
            })
        })
    })

    return results
}
