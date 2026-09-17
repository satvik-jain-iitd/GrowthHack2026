import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { SearchIndex, SearchIndexEntry } from '@/app/api-docs/types/search'
import { normalizeText } from './normalizeText'

export function buildSearchIndex(
    data?: { [key: string]: domainsLeftNav } | null
): SearchIndex {
    const entries: SearchIndexEntry[] = []
    const byId = new Map<string, SearchIndexEntry>()
    const apisByDomain = new Map<string, SearchIndexEntry[]>()
    const operationsByApi = new Map<string, SearchIndexEntry[]>()
    const domainOrder = new Map<string, number>()

    let order = 0
    const push = (entry: SearchIndexEntry) => {
        entries.push(entry)
        byId.set(entry.id, entry)
        return entry
    }

    Object.values(data || {}).forEach(domain => {
        if (!domain?.id) return
        const domainId = domain.id
        domainOrder.set(domainId, domainOrder.size)
        const domainName = domain.name || ''
        push({
            kind: 'domain',
            id: domainId,
            domainId,
            name: domainName,
            nameN: normalizeText(domainName),
            description: '',
            descriptionN: '',
            order: order++
        })

        const apiEntries: SearchIndexEntry[] = []
        Object.values(domain.apis || {}).forEach(api => {
            if (!api?.id) return
            const apiId = api.id
            const apiName = api.name || ''
            const apiDescription = api.description || ''
            apiEntries.push(
                push({
                    kind: 'api',
                    id: apiId,
                    domainId,
                    apiId,
                    name: apiName,
                    nameN: normalizeText(apiName),
                    description: apiDescription,
                    descriptionN: normalizeText(apiDescription),
                    order: order++
                })
            )

            const operationEntries: SearchIndexEntry[] = []
            Object.values(api.operations || {}).forEach(operation => {
                if (!operation?.id) return
                const operationName = operation.name || ''
                const operationDescription = operation.description || ''
                const uri = operation.resource || ''
                operationEntries.push(
                    push({
                        kind: 'operation',
                        id: operation.id,
                        domainId,
                        apiId,
                        name: operationName,
                        nameN: normalizeText(operationName),
                        description: operationDescription,
                        descriptionN: normalizeText(operationDescription),
                        uri,
                        uriN: normalizeText(uri),
                        method: operation.method
                            ? String(operation.method).toUpperCase()
                            : undefined,
                        status: operation.status,
                        order: order++
                    })
                )
            })
            operationsByApi.set(apiId, operationEntries)
        })
        apisByDomain.set(domainId, apiEntries)
    })

    return { entries, byId, apisByDomain, operationsByApi, domainOrder }
}
