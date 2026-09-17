import { API_ENDPOINTS, CDAAS_URL } from '@/constants'
import { CompanyDomainIndexHeader } from './CompanyDomainIndexHeader'
import { DomainOwners } from './DomainOwner'
import { DomainDescription } from './DomainDescription'
import { Box, Flex } from '@chakra-ui/react'
import { DomainMetrics } from './DomainMetrics'
import { DomainTabs } from './DomainTabs'
import styles from '@/app/company-domains/company-domain-landing.module.css'
import { fetchArchitecture } from '@/utils/server'
import {
    Application,
    Domain,
    PlatformConfiguration
} from '@/app/company-domains/types'
import { PrevNext } from '@/types/PrevNext'

export default async function CompanyDomainLanding({
    domain,
    prevNext,
    repo
}: {
    domain: Domain
    prevNext: PrevNext
    repo?: string
}) {
    const [apiData, applications, platformConfigurations] = await Promise.all([
        fetchArchitecture(
            API_ENDPOINTS.GET_STATUS_COUNT(domain.company_domain_id)
        )
            .then(res => res.json())
            .then(res => res.data),
        fetchArchitecture(
            API_ENDPOINTS.GET_DOMAIN_DETAILS_APPLICATIONS(
                domain.company_domain_id
            )
        )
            .then(res => res.json())
            .then(res =>
                res?.data?.sort((a: Application, b: Application) =>
                    a?.application_nm?.localeCompare(b?.application_nm)
                )
            ),
        fetchArchitecture(
            `${CDAAS_URL}/enterprise-platforms/capabilities/platform-configurations.json`
        )
            .then(res => res.json())
            .then(res => res)
    ])

    const capabilityMap = Object.values(
        platformConfigurations as Record<string, PlatformConfiguration>
    ).find(x => x.architecturePortalIdentifier === domain.company_domain_id)

    return (
        <div className={styles.domainLandingPage}>
            <CompanyDomainIndexHeader
                prevNext={prevNext}
                domain={domain}
                playbookId={domain.playbook_id}
                repo={repo}
            />
            <DomainOwners domain={domain} />
            <Flex
                style={{
                    paddingTop: '32px',
                    paddingBottom: '24px'
                }}
                flexDirection={{ base: 'row', lgDown: 'column' }}
            >
                <Box width={{ base: '60%', lgDown: '100%' }}>
                    <DomainDescription
                        domain_name={domain.domain_nm}
                        domain_description={domain.domain_ds}
                    />
                </Box>
                <Box width={{ base: '40%', lgDown: '100%' }}>
                    <DomainMetrics subDomains={0} />
                </Box>
            </Flex>
            <DomainTabs
                domain={domain}
                applications={applications}
                capabilityMap={capabilityMap}
                TotalApplicationsCount={applications.length || 0}
                domainApi={apiData?.domainStatusCount?.eARB_Approved || 0}
            />
        </div>
    )
}
