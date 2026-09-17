import {
    MAX_APIS_PER_DOMAIN,
    MAX_GROUPS,
    MAX_OPS_PER_API
} from '@/app/api-docs/constants/search'
import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { apiDocsSidebar } from '@/test/mocks/apiDocsSidebar'
import { buildSearchIndex } from './buildSearchIndex'
import { groupSearchResults } from './groupSearchResults'
import { parseSearchQuery } from './parseSearchQuery'

const index = buildSearchIndex(apiDocsSidebar)
const search = (query: string) =>
    groupSearchResults(index, parseSearchQuery(query))
const searchIn = (query: string, ...domainIds: string[]) =>
    groupSearchResults(index, parseSearchQuery(query), new Set(domainIds))

describe('groupSearchResults', () => {
    it('returns nothing for an empty query', () => {
        expect(search('')).toEqual({ groups: [], totalGroups: 0 })
    })

    it('returns nothing when no entry matches', () => {
        expect(search('zzzznomatch').groups).toEqual([])
    })

    it('pulls every API and operation in on a domain-name match', () => {
        const [group] = search('cartao').groups
        expect(group.entry.id).toBe('domain-cartao')
        expect(group.direct).toBe(true)
        expect(group.apis.map(api => api.entry.id)).toEqual(['api-servicing'])
        expect(group.apis[0].direct).toBe(false)
        expect(group.apis[0].operations.map(op => op.entry.id)).toEqual([
            'op-get-profile'
        ])
        expect(group.apis[0].operations[0].direct).toBe(false)
    })

    it('halves the parent score for each inherited level', () => {
        const [group] = search('cartao').groups
        // domain name exact = 40 * 4
        const api = group.apis[0]
        expect(api.score).toBe(160 * 0.5)
        expect(api.operations[0].score).toBe(160 * 0.25)
    })

    it('caps children and reports pre-slice totals', () => {
        const [group] = search('card payments').groups
        const api = group.allApis.find(
            item => item.entry.id === 'api-card-payments'
        )
        expect(api?.totalOperations).toBe(6)
        expect(api?.allOperations).toHaveLength(6)
        expect(api?.operations).toHaveLength(MAX_OPS_PER_API)
    })

    it('never lets an inherited child outrank a direct hit', () => {
        const api = search('card payments').groups[0].allApis.find(
            item => item.entry.id === 'api-card-payments'
        )
        const directCount =
            api?.allOperations.filter(op => op.direct).length ?? 0
        expect(directCount).toBeGreaterThan(0)
        expect(
            api?.allOperations.slice(0, directCount).every(op => op.direct)
        ).toBe(true)
    })

    it('dedupes an operation that matches directly and via its parent', () => {
        const api = search('card payments').groups[0].allApis.find(
            item => item.entry.id === 'api-card-payments'
        )
        const ids = api?.allOperations.map(op => op.entry.id) ?? []
        expect(new Set(ids).size).toBe(ids.length)
        expect(
            api?.allOperations.find(op => op.entry.id === 'op-create-payment')
                ?.direct
        ).toBe(true)
    })

    it('surfaces an ancestor API for a descendant-only hit', () => {
        const groups = search('reverses').groups
        expect(groups).toHaveLength(1)
        expect(groups[0].direct).toBe(false)
        expect(groups[0].apis.map(api => api.entry.id)).toEqual([
            'api-card-payments'
        ])
        expect(groups[0].apis[0].direct).toBe(false)
        // Only the matching operation is pulled in, not the whole API.
        expect(groups[0].apis[0].operations.map(op => op.entry.id)).toEqual([
            'op-delete-payment'
        ])
    })

    it('ranks a direct operation hit above a domain whose name merely matches', () => {
        const groups = search('payment').groups
        expect(groups[0].entry.id).toBe('domain-payments')
        // 100 * 3 (prefix on "Payments" fields) beats the 40 * 4 domain exact.
        expect(groups[0].score).toBeGreaterThan(160)
    })

    it('honours the method filter through the whole tree', () => {
        const [group] = search('post payment').groups
        const ids = group.allApis.flatMap(api =>
            api.allOperations.map(op => op.entry.id)
        )
        expect(ids).toEqual(['op-create-payment'])
    })

    it('drops out-of-scope company domains', () => {
        expect(
            search('get')
                .groups.map(group => group.entry.id)
                .sort()
        ).toEqual(['domain-cartao', 'domain-payments'])
        expect(
            searchIn('get', 'domain-cartao').groups.map(group => group.entry.id)
        ).toEqual(['domain-cartao'])
    })

    it('matches the unscoped result when every domain is in scope', () => {
        expect(searchIn('get', 'domain-cartao', 'domain-payments')).toEqual(
            search('get')
        )
    })

    it('treats an empty scope as every company domain', () => {
        expect(searchIn('get')).toEqual(search('get'))
    })

    it('ranks an equally-scored operation by certification status', () => {
        const api = search('card payments').groups[0].allApis.find(
            item => item.entry.id === 'api-card-payments'
        )
        const inherited = (api?.allOperations ?? []).filter(op => !op.direct)
        const ids = inherited.map(op => op.entry.id)
        // Same inherited score, but only List Refunds has a status.
        expect(new Set(inherited.map(op => op.score)).size).toBe(1)
        expect(ids.indexOf('op-list-refunds')).toBe(0)
        expect(ids).toContain('op-list-statements')
        expect(ids).toContain('op-list-disputes')
    })

    it('orders the three certification tiers ahead of everything else', () => {
        // Declared in reverse of the expected order, so tree order cannot
        // accidentally produce a passing result.
        const operations: domainsLeftNav['apis'][string]['operations'] = {
            'op-draft': {
                id: 'op-draft',
                name: 'Widget Alpha',
                description: '',
                path: [],
                status: 'Draft'
            },
            'op-catalog': {
                id: 'op-catalog',
                name: 'Widget Beta',
                description: '',
                path: [],
                status: 'API Catalog'
            },
            'op-design': {
                id: 'op-design',
                name: 'Widget Gamma',
                description: '',
                path: [],
                status: 'Design Certified'
            },
            'op-production': {
                id: 'op-production',
                name: 'Widget Delta',
                description: '',
                path: [],
                status: 'Production Certified'
            }
        }
        const tree = {
            d1: {
                id: 'd1',
                name: 'Widgets',
                apis: {
                    a1: {
                        id: 'a1',
                        name: 'Widget API',
                        description: '',
                        path: [],
                        operations
                    }
                }
            }
        }
        const [group] = groupSearchResults(
            buildSearchIndex(tree),
            parseSearchQuery('widget')
        ).groups
        expect(group.allApis[0].allOperations.map(op => op.entry.id)).toEqual([
            'op-production',
            'op-design',
            'op-catalog',
            'op-draft'
        ])
    })

    it('keeps status subordinate to relevance', () => {
        const tree = {
            d1: {
                id: 'd1',
                name: 'Widgets',
                apis: {
                    a1: {
                        id: 'a1',
                        name: 'Widget API',
                        description: '',
                        path: [],
                        operations: {
                            'op-exact': {
                                id: 'op-exact',
                                name: 'Refund',
                                description: '',
                                path: [],
                                status: 'Draft'
                            },
                            'op-partial': {
                                id: 'op-partial',
                                name: 'Refund Batch Reconciliation',
                                description: '',
                                path: [],
                                status: 'Production Certified'
                            }
                        }
                    }
                }
            }
        }
        const [group] = groupSearchResults(
            buildSearchIndex(tree),
            parseSearchQuery('refund')
        ).groups
        const [first, second] = group.allApis[0].allOperations
        expect(first.score).toBeGreaterThan(second.score)
        expect(first.entry.id).toBe('op-exact')
    })

    it('caps the number of groups and reports the pre-slice total', () => {
        const wide: { [key: string]: domainsLeftNav } = {}
        for (let i = 0; i < MAX_GROUPS + 4; i += 1) {
            wide[`d${i}`] = {
                id: `d${i}`,
                name: `Widget Domain ${i}`,
                apis: {}
            }
        }
        const result = groupSearchResults(
            buildSearchIndex(wide),
            parseSearchQuery('widget')
        )
        expect(result.totalGroups).toBe(MAX_GROUPS + 4)
        expect(result.groups).toHaveLength(MAX_GROUPS)
    })

    it('caps APIs per domain and reports the pre-slice total', () => {
        const apis: domainsLeftNav['apis'] = {}
        for (let i = 0; i < MAX_APIS_PER_DOMAIN + 3; i += 1) {
            apis[`a${i}`] = {
                id: `a${i}`,
                name: `Widget API ${i}`,
                description: '',
                path: [],
                operations: {}
            }
        }
        const tree = { d1: { id: 'd1', name: 'Widgets', apis } }
        const [group] = groupSearchResults(
            buildSearchIndex(tree),
            parseSearchQuery('widgets')
        ).groups
        expect(group.totalApis).toBe(MAX_APIS_PER_DOMAIN + 3)
        expect(group.apis).toHaveLength(MAX_APIS_PER_DOMAIN)
        expect(group.allApis).toHaveLength(MAX_APIS_PER_DOMAIN + 3)
    })
})
