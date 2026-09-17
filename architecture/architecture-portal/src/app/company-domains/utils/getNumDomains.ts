import { VERSION_1_DOMAINS_LABEL, VERSION_1_DOMAINS_UUIDS } from '../constants'
import { Domain, DomainCategory } from '../types/domains'

interface DomainCount {
    [DomainCategory.SystemsOfEngagement]: number
    [DomainCategory.SystemsOfProcessing]: number
    [DomainCategory.ToolsAndUtilities]: number
    [DomainCategory.Others]: number
    viewAll: number
    [VERSION_1_DOMAINS_LABEL]: number
}

export const getNumDomains = (domains?: Domain[], isV1?: boolean) => {
    let totalDomains = 0
    const domainCount: Partial<DomainCount> = {}
    const categories = [
        ...new Set(
            domains
                ?.filter(x => x.domain_category_nm !== DomainCategory.Others)
                .map(x => x.domain_category_nm)
        )
    ]
    for (const categoryName of categories) {
        const count =
            domains?.filter(
                x =>
                    x.playbook_id &&
                    (isV1
                        ? VERSION_1_DOMAINS_UUIDS.has(x.company_domain_id)
                        : true) &&
                    x.domain_category_nm === categoryName
            ).length || 0

        totalDomains = totalDomains + count
        domainCount[categoryName] = count
    }
    domainCount['viewAll'] = totalDomains
    domainCount[VERSION_1_DOMAINS_LABEL] = VERSION_1_DOMAINS_UUIDS.size
    return domainCount
}
