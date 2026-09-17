/* istanbul ignore file */
import { Domain, DomainCategory } from '@/app/company-domains/types'
import { SimpleGrid, Box, Text } from '@chakra-ui/react'
import { Fragment } from 'react'
import MetricsDomainCard from './MetricsDomainCard'

export default function MetricsDomainCardView({
    groupedData = [],
    tableViewOptions,
    domainCategories,
    companyDomains
}: {
    groupedData: Domain[]
    tableViewOptions: { filter: string; showAll: boolean }
    domainCategories: DomainCategory[]
    companyDomains: Domain[] | undefined
}) {
    const getDomain = (id: string) => {
        return (
            groupedData.find(domain => domain.prim_company_domain_id === id) ||
            ({} as Domain)
        )
    }
    const isViewAll = tableViewOptions.filter === 'viewAll'
    const selectedCategories = isViewAll
        ? domainCategories
        : [tableViewOptions.filter]

    const domainsData = companyDomains
        ?.filter(
            domain =>
                domain.domain_category_nm !== 'Others' &&
                selectedCategories.includes(domain.domain_category_nm)
        )
        .sort((a, b) => {
            const hasContribution = (domain: Domain, type: string) =>
                groupedData.some(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (d: Domain & Record<string, any>) =>
                        d.prim_company_domain_id === domain.company_domain_id &&
                        d[type] > 0
                )

            if (
                hasContribution(a, 'earbTypeACumSum') &&
                !hasContribution(b, 'earbTypeACumSum')
            )
                return -1
            if (
                !hasContribution(a, 'earbTypeACumSum') &&
                hasContribution(b, 'earbTypeACumSum')
            )
                return 1

            if (
                hasContribution(a, 'designTypeACumSum') &&
                !hasContribution(b, 'designTypeACumSum')
            )
                return -1
            if (
                !hasContribution(a, 'designTypeACumSum') &&
                hasContribution(b, 'designTypeACumSum')
            )
                return 1

            return a.company_domain_sort - b.company_domain_sort
        })

    const renderDomainCardsGrid = (
        domains: Domain[] | undefined,
        getDomainInfo: (domain: Domain) => Domain | undefined,
        getData: (domain: Domain) => Domain
    ) => (
        <SimpleGrid
            gap={4}
            templateColumns='repeat(auto-fill, minmax(300px, 1fr))'
            paddingBottom='1rem'
        >
            {domains?.map(domain => (
                <MetricsDomainCard
                    key={
                        domain?.company_domain_id ||
                        domain?.prim_company_domain_id
                    }
                    domainInfo={getDomainInfo(domain)}
                    data={getData(domain)}
                    tableViewOptions={tableViewOptions}
                />
            ))}
        </SimpleGrid>
    )

    if (tableViewOptions.filter === 'withContributions') {
        return renderDomainCardsGrid(
            groupedData,
            domain =>
                companyDomains?.find(
                    d => d.company_domain_id === domain?.prim_company_domain_id
                ),
            domain => domain
        )
    }

    return (
        <>
            {selectedCategories.map(category => (
                <Fragment key={category}>
                    <Box padding='1rem'>
                        <Text fontSize='xl' fontWeight='bold'>
                            {category}
                        </Text>
                    </Box>
                    {renderDomainCardsGrid(
                        domainsData?.filter(
                            domain => domain.domain_category_nm === category
                        ),
                        domain => domain,
                        domain => getDomain(domain?.company_domain_id)
                    )}
                </Fragment>
            ))}
        </>
    )
}
