/* istanbul ignore file */
import { Domain, SubDomain } from '../types'

export function useDomainMap(
    companyDomains: Domain[],
    companySubDomain: SubDomain[]
) {
    const companyDomainsData = companyDomains
        .map(item => ({
            ...item,
            label: item.domain_nm,
            value: item.company_domain_id
        }))
        .filter(item => item.domain_category_nm !== 'Others')
        .sort((a, b) => a.domain_nm.localeCompare(b.domain_nm))

    // ToDo: Optimize these two maps
    const subDomainsMap = companySubDomain.reduce(
        (map: { [key: string]: SubDomain[] }, subDomain) => {
            const { company_domain_id } = subDomain
            if (!map[company_domain_id]) {
                map[company_domain_id] = []
            }
            map[company_domain_id].push({
                ...subDomain,
                value: subDomain.company_sub_domain_id,
                label: subDomain.sub_domain_nm
            })
            return map
        },
        {}
    )

    const domainMap = companyDomainsData.reduce(
        (map: { [key: string]: Domain }, domain) => {
            const { company_domain_id, domain_nm } = domain
            map[company_domain_id] = {
                ...domain,
                id: company_domain_id,
                name: domain_nm,
                subDomains: subDomainsMap[company_domain_id] || []
            }
            return map
        },
        {}
    )
    return {
        companyDomainsData,
        subDomainsMap,
        domainMap
    }
}
