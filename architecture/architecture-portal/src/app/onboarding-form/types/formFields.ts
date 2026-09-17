export type InitiativeFormValues = {
    isEtp?: string // "true" | "false"
    etp?: string
    ecmi?: string // "true" | "false"
    title: string
    years: string
    initiativeCategory?: string
    businessUnit: string
    unitCIO: string[]
    eaLead?: string[]
    engLead?: string[]
    repoName: string
    docsRoot: string
    initiativeFrameworks?: string[]
    contactInfo: string[]
}

export type FoundationalTechnologyFormValues = {
    ftCategory: string
    title: string
    businessUnit: string
    unitCIO: string[]
    eaLead?: string[]
    engLead?: string[]
    repoName: string
    docsRoot: string
    contactInfo: string[]
}

export type CompanySubdomainFormValues = {
    companyDomain: string
    title: string
    techOwner: string[]
    repoName: string
    docsRoot: string
    businessUnit: string
    contactInfo: string[]
    shortDescription: string
    description: string
}

export type BuildBuyFormValues = {
    title: string
    etpImpacting?: string
    overallRisk?: string // "true" | "false"
    estimatedCost: string
    isExistingDocs: string // "true" | "false"
    repoName?: string
    docsRoot?: string
    targetedEndDate: string
    requester: string[]
    reviewers: string[]
    deciders: string[]
    owners: string[]
    stakeholders: string[]
    eaArchitects: string[]
    prim_pfrm_nm: string[]
    description: string
}
