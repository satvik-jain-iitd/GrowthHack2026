/* istanbul ignore file */

import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'

export const getDomainMetrics = (domainsList: domainsLeftNav[]) => ({
    totalCompanyDomains: domainsList.length,
    totalAPIs: domainsList.reduce((acc, domain: domainsLeftNav) => {
        return acc + Object.keys(domain.apis).length
    }, 0),
    totalOperations: domainsList.reduce((acc, domain: domainsLeftNav) => {
        const apiCount = Object.values(domain.apis).reduce((apiAcc, api) => {
            return apiAcc + Object.keys(api.operations).length
        }, 0)
        return acc + apiCount
    }, 0)
})
