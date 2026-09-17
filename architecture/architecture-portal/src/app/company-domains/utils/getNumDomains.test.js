import { getNumDomains } from './getNumDomains'

const domains = [
    {
        domain_category_nm: 'Retail',
        company_domain_id: 'id-1',
        playbook_id: 'pb-1'
    },
    {
        domain_category_nm: 'Retail',
        company_domain_id: 'id-2',
        playbook_id: 'pb-2'
    },
    {
        domain_category_nm: 'Banking',
        company_domain_id: 'id-3',
        playbook_id: 'pb-3'
    },
    {
        domain_category_nm: 'Others',
        company_domain_id: 'id-4',
        playbook_id: 'pb-4'
    },
    {
        domain_category_nm: 'Banking',
        company_domain_id: 'id-5',
        playbook_id: null
    }
]
jest.mock('@/app/company-domains/constants', () => ({
    VERSION_1_DOMAINS_LABEL: 'V1 Domains',
    VERSION_1_DOMAINS_UUIDS: new Set(['id-1', 'id-3'])
}))

describe('getNumDomains', () => {
    it('returns correct counts for isV1 = false (all platforms)', () => {
        const result = getNumDomains(domains, false)
        expect(result).toEqual({
            Retail: 2,
            Banking: 1,
            viewAll: 3,
            'V1 Domains': 2
        })
    })
    it('returns correct counts for isV1 = true (filtered by UUID set)', () => {
        const result = getNumDomains(domains, true)
        expect(result).toEqual({
            Retail: 1,
            Banking: 1,
            viewAll: 2,
            'V1 Domains': 2
        })
    })
    it('skips entries without playbook_id', () => {
        const result = getNumDomains(domains, false)
        expect(result.Banking).toBe(1)
    })
    it('ignores domain_category_nm === "Others"', () => {
        const result = getNumDomains(domains, false)
        expect(result).not.toHaveProperty('Others')
    })
    it('includes VERSION_1_DOMAINS_LABEL and correct UUID count', () => {
        const result = getNumDomains(domains, true)
        expect(result['V1 Domains']).toBe(2)
    })
})
