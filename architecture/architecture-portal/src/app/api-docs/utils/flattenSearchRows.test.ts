import { MAX_OPS_PER_API } from '@/app/api-docs/constants/search'
import { apiDocsSidebar } from '@/test/mocks/apiDocsSidebar'
import { buildSearchIndex } from './buildSearchIndex'
import { flattenSearchRows, groupSearchResults } from './groupSearchResults'
import { parseSearchQuery } from './parseSearchQuery'

const index = buildSearchIndex(apiDocsSidebar)
const grouped = groupSearchResults(index, parseSearchQuery('card payments'))
const NOTHING_EXPANDED = new Set<string>()

describe('flattenSearchRows', () => {
    it('emits domain, api and operation rows in hierarchical order', () => {
        const rows = flattenSearchRows(grouped, NOTHING_EXPANDED)
        expect(rows[0].type).toBe('domain')
        expect(rows[1].type).toBe('api')
        expect(rows[2].type).toBe('operation')
    })

    it('produces unique keys across every row', () => {
        const rows = flattenSearchRows(grouped, NOTHING_EXPANDED)
        const keys = rows.map(row => row.key)
        expect(new Set(keys).size).toBe(keys.length)
    })

    it('emits an expander carrying the hidden count', () => {
        const rows = flattenSearchRows(grouped, NOTHING_EXPANDED)
        const expander = rows.find(row => row.type === 'expandOps')
        expect(expander).toEqual({
            type: 'expandOps',
            key: 'expandOps:domain-payments/api-card-payments',
            apiId: 'api-card-payments',
            hidden: 6 - MAX_OPS_PER_API
        })
    })

    it('reveals the hidden rows and drops the expander once expanded', () => {
        const key = 'expandOps:domain-payments/api-card-payments'
        const collapsed = flattenSearchRows(grouped, NOTHING_EXPANDED)
        const expanded = flattenSearchRows(grouped, new Set([key]))

        expect(expanded.filter(row => row.type === 'operation')).toHaveLength(
            collapsed.filter(row => row.type === 'operation').length + 1
        )
        expect(expanded.some(row => row.key === key)).toBe(false)
        // Existing rows keep their keys, so the highlight survives expansion.
        expect(expanded.slice(0, collapsed.length - 1).map(r => r.key)).toEqual(
            collapsed.slice(0, collapsed.length - 1).map(r => r.key)
        )
    })

    it('returns no rows for an empty result set', () => {
        expect(
            flattenSearchRows({ groups: [], totalGroups: 0 }, NOTHING_EXPANDED)
        ).toEqual([])
    })

    it('emits an expandApis row when a domain has more APIs than the cap', () => {
        const tree = {
            d1: {
                id: 'd1',
                name: 'Widgets',
                apis: Object.fromEntries(
                    Array.from({ length: 8 }, (_, i) => [
                        `a${i}`,
                        {
                            id: `a${i}`,
                            name: `API ${i}`,
                            description: '',
                            path: [],
                            operations: {}
                        }
                    ])
                )
            }
        }
        const widgetGroups = groupSearchResults(
            buildSearchIndex(tree),
            parseSearchQuery('widgets')
        )
        const rows = flattenSearchRows(widgetGroups, NOTHING_EXPANDED)
        expect(rows.at(-1)).toEqual({
            type: 'expandApis',
            key: 'expandApis:d1',
            domainId: 'd1',
            hidden: 3
        })
    })
})
