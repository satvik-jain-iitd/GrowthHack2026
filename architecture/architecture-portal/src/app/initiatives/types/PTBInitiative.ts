export interface PTBInitiative {
    actualOnboardingDate: string
    adrCore: { id: string; name: string }[]
    adrNonCore: { id: string; name: string }[]
    applicationsImpacted: string[]
    bvbCore: { id: string; name: string }[]
    bvbNonCore: { id: string; name: string }[]
    eaLead: string[]
    engineeringLead: string[]
    etp_id: string
    initiativeCategory: string
    initiativeId: string
    metadata: object[]
    name: string
    startDate: string
    tentativeEndDate: string
    unitCIO: string
    years: string[]
    companyDomainId: string[]
    companyDomainName: string[]
    clarityId: string
    initiativeFrameworks: string[]
    playbookCore: { id: string; name: string }[]
    playbookNonCore: { id: string; name: string }[]
    techOwners: string[]
    principalArchitects: string[]
    enterpriseArchitects: string[]
    ucioDelegates: string[]
    headEngineers: string[]
    delegates: string[]
    statusReportOwnerPrimary: string[]
    statusReportOwnerSecondary: string[]
    additionalArchitects: string[]
    markets: string[]
    companyDomains: { company_domain_id: string; domain_nm: string }[]
    ebc: { id: string; name: string }[]
    /**
     * Owner display names resolved from the metamodel, aligned by index with the
     * matching email arrays above. Entries are '' when the metamodel has no name.
     */
    ownerNames?: {
        unitCIO: string[]
        techOwners: string[]
        headEngineers: string[]
        principalArchitects: string[]
        enterpriseArchitects: string[]
        additionalArchitects: string[]
    }
}
