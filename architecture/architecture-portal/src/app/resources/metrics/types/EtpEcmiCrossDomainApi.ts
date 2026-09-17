export interface EtpEcmiCrossDomainApiRow {
    initiative_id: string
    initiative_name: string
    etp_ecmi_id: string | null
    is_etp: boolean
    is_ecmi: boolean
    unit_cio: string
    unit_cio_email: string | null
    principal_architect: string
    principal_architect_email: string | null
    planning_cycle: string
    playbook_onboarded: boolean
    identified_apis: number
    cross_domain_type_ab_apis: number
    earb_approved_type_ab: number
    prod_certified_type_ab: number
    earb_approved_pct: number
    prod_certified_pct: number
    is_identified: boolean
}

export interface EtpEcmiUnitCioGroupRow {
    unit_cio: string
    unit_cio_email: string | null
    initiative_count: number
    etp_count: number
    ecmi_count: number
    playbook_onboarded_count: number
    identified_apis: number
    cross_domain_type_ab_apis: number
    earb_approved_type_ab: number
    prod_certified_type_ab: number
    earb_approved_pct: number
    prod_certified_pct: number
}

export interface EtpEcmiCrossDomainSummary {
    totalInitiatives: number
    identifiedInitiatives: number
    notIdentifiedInitiatives: number
    statusDistribution: {
        earbApproved: number
        designCertified: number
        prodCertified: number
    }
}

export interface EtpEcmiCrossDomainApiResponse {
    initiatives: EtpEcmiCrossDomainApiRow[]
    summary: EtpEcmiCrossDomainSummary
}

export interface EtpEcmiCrossDomainGroupedResponse {
    groups: EtpEcmiUnitCioGroupRow[]
    summary: EtpEcmiCrossDomainSummary
}
