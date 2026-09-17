export interface AttestationSummary {
    attestationId: string
    attestationDate: string | null
}

export interface ChangeEventActor {
    name: string | null
    email: string | null
}

export interface ChangeEvent {
    eventId: string
    changeType: string
    entityType: string
    entityId: string
    changedAt: string | null
    changedBy: ChangeEventActor
    summary: string | null
    currentProps?: unknown
}

export interface ChangeEventListResponse {
    page: number
    pageSize: number
    total: number
    data: ChangeEvent[]
}

export interface CapturedAttestationItem {
    id: string
    name: string
    description: string
}

export interface CreateAttestationBody {
    attestationBy?: {
        name?: string
        email?: string
    }
    additionalDetails?: string[]
    attestationType?: string
    capturedAttestations?: CapturedAttestationItem[]
}

export interface InitiativeOwnerMM {
    title: string
    name: string | null
    email: string | null
}

export interface CompanyDomainMM {
    companyDomainId: string
    companyDomainName: string
}

export interface SubdomainMM {
    subdomainId: string
    subdomainName: string
}

export interface InitiativeReferenceMM {
    initiativeId: string
    initiativeName: string
    isCore: boolean
}

export interface ApplicationReferenceMM {
    applicationId: string
    applicationName: string
}

export interface ADRReferenceMM {
    adrId: string
    title: string
    isCore: boolean
}

export interface BVBReferenceMM {
    bvbId: string
    title: string
    isCore: boolean
}

export interface PlaybookReferenceMM {
    playbookId: string
    isCore: boolean
}

export interface InitiativeMM {
    initiativeId: string
    initiativeName: string
    startDate: string | null
    endDate: string | null
    yearsActive: string[] | null
    initiativeOwners: InitiativeOwnerMM[]
    lineOfBusiness: string | null
    strategicEpics: string[]
    etp_ecmi_id: string | null
    legacy_etp_ecmi_id: string | null
    impactedCompanyDomains: CompanyDomainMM[]
    impactedSubdomains: SubdomainMM[]
    linkedInitiatives: InitiativeReferenceMM[]
    supportedBusinessUnits: string[]
    businessCapabilities: string[]
    foundationalTechnologies: string[]
    supportedMarkets: string[]
    technologyStacks: string[]
    techCapabilities: string[]
    impactedApplications: ApplicationReferenceMM[]
    architectureDecisionRecords: ADRReferenceMM[]
    buildVsBuyAssessments: BVBReferenceMM[]
    playbooks: PlaybookReferenceMM[]
    attestations: AttestationSummary[]
    lastUserUpdateTs: string | null
    lastSystemUpdateTs: string | null
}

export interface InitiativeAttestationDetail {
    attestationId: string
    attestationDate: string | null
    attestationBy: string | null
    attestationSnapshot: InitiativeMM
    additionalDetails: string[]
    attestationType: string | null
    capturedAttestations: CapturedAttestationItem[]
}

export interface ApplicationOwnerMM {
    title: string
    name: string | null
    email: string | null
}

export interface DeploymentArchitectureMM {
    deploymentUnits: string[]
    deploymentPatterns: string[]
    availabilityPatterns: string[]
    systemEnvironments: string[]
}

export interface TestingStrategyMM {
    testingFrameworks: string[]
    testingMethodologies: string[]
}

export interface NFRMm {
    availability: number | null
    responseTime: number | null
}

export interface DataInterfaceMM {
    interfaceType: string | null
    interfaceDescription: string | null
}

export interface ApplicationMM {
    applicationId: string
    applicationName: string
    description: string | null
    lifecycleState: string | null
    applicationOwners: ApplicationOwnerMM[]
    lineOfBusiness: string | null
    countriesSupported: string[]
    applicationType: string[]
    linkedCompanyDomain: CompanyDomainMM | null
    linkedSubdomain: SubdomainMM | null
    linkedInitiatives: InitiativeReferenceMM[]
    supportedBusinessUnits: string[]
    businessCapabilities: string[]
    linkedFoundationalTechnologies: string[]
    marketsSupported: string[]
    technologyStacks: string[]
    techCapabilities: string[]
    deploymentArchitecture: DeploymentArchitectureMM | null
    testingStrategy: TestingStrategyMM | null
    nonFunctionalRequirements: NFRMm | null
    dataInterfaces: DataInterfaceMM | null
    linkedArchitectureDecisionRecords: ADRReferenceMM[]
    linkedBuildVsBuyAssessments: BVBReferenceMM[]
    linkedPlaybooks: string[]
    attestations: AttestationSummary[]
    lastUserUpdateTs: string | null
    lastSystemUpdateTs: string | null
}

export interface ApplicationAttestationDetail {
    attestationId: string
    attestationDate: string | null
    attestationBy: string | null
    attestationSnapshot: ApplicationMM
    additionalDetails: string[]
    attestationType: string | null
    capturedAttestations: CapturedAttestationItem[]
}

export type EntityType = 'initiative' | 'application'
