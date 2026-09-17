/* istanbul ignore file */

import {
    apisLeftNav,
    domainsLeftNav,
    operationsLeftNav
} from '@/app/api-docs/types/apiDocs'
import { STATUS_FILTER_VALUES } from '@/app/api-docs/constants'

export const getFilteredData = (
    sidebarData: { [key: string]: domainsLeftNav } | undefined,
    filter: string
): { [key: string]: domainsLeftNav } => {
    if (filter === STATUS_FILTER_VALUES.ALL) {
        return sidebarData || {}
    }
    const filtered: { [key: string]: domainsLeftNav } = {}
    const source = sidebarData || {}
    Object.keys(source).forEach(domainId => {
        const domain = source[domainId]
        const filteredApis: { [key: string]: apisLeftNav } = {}
        Object.keys(domain.apis).forEach(apiId => {
            const api = domain.apis[apiId]
            const filteredOperations: { [key: string]: operationsLeftNav } = {}
            Object.keys(api.operations).forEach(operationId => {
                const operation = api.operations[operationId]
                if (
                    filter === STATUS_FILTER_VALUES.DESIGN_CERTIFIED &&
                    operation.statusId &&
                    [
                        '802a6837-3c0b-4058-8bd5-6c2bbea1c69a',
                        '1f16ec95-d399-41ff-856e-ff517b7772f4'
                    ].includes(operation.statusId)
                ) {
                    filteredOperations[operationId] = operation
                } else if (
                    filter === STATUS_FILTER_VALUES.PRODUCTION_CERTIFIED &&
                    operation.statusId &&
                    ['1f16ec95-d399-41ff-856e-ff517b7772f4'].includes(
                        operation.statusId
                    )
                ) {
                    filteredOperations[operationId] = operation
                }
            })
            if (Object.keys(filteredOperations).length > 0) {
                filteredApis[apiId] = {
                    ...api,
                    operations: filteredOperations
                }
            }
        })
        if (Object.keys(filteredApis).length > 0) {
            filtered[domainId] = {
                ...domain,
                apis: filteredApis
            }
        }
    })
    return filtered || {}
}
