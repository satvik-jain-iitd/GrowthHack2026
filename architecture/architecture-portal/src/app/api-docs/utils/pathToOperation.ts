/* istanbul ignore file */

import {
    domainsLeftNav,
    apisLeftNav,
    operationsLeftNav
} from '@/app/api-docs/types/apiDocs'

// Get the path of Ids that lead to the item with the given id i.e. CompanyDomainID > ApiID > OperationID
export function findPathToId(
    id: string,
    items: {
        [key: string]: domainsLeftNav | apisLeftNav | operationsLeftNav
    } | null = null,
    level = 0
): string[] | null {
    if (!items) return null
    for (const [key, valueRaw] of Object.entries(items)) {
        const value = valueRaw as
            | domainsLeftNav
            | apisLeftNav
            | operationsLeftNav
        if (value.id === id) return [key]
        if (level === 0 && 'apis' in value && value.apis) {
            const childPath = findPathToId(id, value.apis, level + 1)
            if (childPath) return [key, ...childPath]
        } else if (level === 1 && 'operations' in value && value.operations) {
            const childPath = findPathToId(id, value.operations, level + 1)
            if (childPath) return [key, ...childPath]
        }
    }
    return null
}
