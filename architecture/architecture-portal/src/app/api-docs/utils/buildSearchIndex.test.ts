import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'
import { apiDocsSidebar } from '@/test/mocks/apiDocsSidebar'
import { buildSearchIndex } from './buildSearchIndex'

describe('buildSearchIndex', () => {
    const index = buildSearchIndex(apiDocsSidebar)

    it('indexes every domain, api and operation', () => {
        expect(index.entries.filter(e => e.kind === 'domain')).toHaveLength(2)
        expect(index.entries.filter(e => e.kind === 'api')).toHaveLength(3)
        expect(index.entries.filter(e => e.kind === 'operation')).toHaveLength(
            8
        )
    })

    it('exposes parent/child lookups', () => {
        expect(
            index.apisByDomain.get('domain-payments')?.map(e => e.id)
        ).toEqual(['api-card-payments', 'api-settlement'])
        expect(
            index.operationsByApi.get('api-settlement')?.map(e => e.id)
        ).toEqual(['op-get-batch'])
        expect(index.domainOrder.get('domain-cartao')).toBe(1)
    })

    it('assigns strictly increasing insertion order', () => {
        const orders = index.entries.map(e => e.order)
        expect(orders).toEqual([...orders].sort((a, b) => a - b))
        expect(new Set(orders).size).toBe(orders.length)
    })

    it('upper-cases methods and normalizes text fields', () => {
        const operation = index.byId.get('op-create-payment')
        expect(operation?.method).toBe('POST')
        expect(operation?.uriN).toBe('/v1/cards/{cardid}/payments')
        expect(index.byId.get('domain-cartao')?.nameN).toBe('cartao')
    })

    it('tolerates missing path, method, resource and empty operations', () => {
        const sparse = {
            d1: {
                id: 'd1',
                name: 'Sparse',
                apis: {
                    a1: {
                        id: 'a1',
                        name: 'Sparse API',
                        operations: {
                            o1: { id: 'o1', name: 'Bare Operation' }
                        }
                    },
                    a2: { id: 'a2', name: 'No Operations API' }
                }
            }
        } as unknown as { [key: string]: domainsLeftNav }

        const sparseIndex = buildSearchIndex(sparse)
        const operation = sparseIndex.byId.get('o1')
        expect(operation?.method).toBeUndefined()
        expect(operation?.uri).toBe('')
        expect(operation?.descriptionN).toBe('')
        expect(sparseIndex.operationsByApi.get('a2')).toEqual([])
    })

    it('returns an empty index for an undefined tree', () => {
        const empty = buildSearchIndex(undefined)
        expect(empty.entries).toEqual([])
        expect(empty.byId.size).toBe(0)
    })

    it('skips entries without an id', () => {
        const broken = {
            d1: { name: 'No Id', apis: { a1: { name: 'No Id API' } } }
        } as unknown as { [key: string]: domainsLeftNav }
        expect(buildSearchIndex(broken).entries).toEqual([])
    })
})
