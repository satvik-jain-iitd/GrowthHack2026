export enum DomainCategory {
    SystemsOfEngagement = 'Systems of Engagement',
    SystemsOfProcessing = 'Systems of Processing',
    ToolsAndUtilities = 'IT Management, Foundational Technologies, Tools & Utilities',
    Others = 'Others'
}

export type Filters = DomainCategory | 'Version 1 Domains' | 'viewAll'

export interface Domain {
    company_domain_id: string
    domain_nm: string
    domain_ds: string
    last_update_user_id: string
    last_update_ts: string
    domain_category_id: string
    dmn_shrt_ds: string
    dmn_shrt_nm: string
    disp_sort_ord: number
    domain_category_nm: DomainCategory
    domain_category_sort: number
    company_domain_sort: number
    playbook_id: string
    im_light_tx: string
    im_dark_tx: string
    im_fill_light_tx: string
    im_fill_dark_tx: string
    cntrb_in: string
    unit_cio_email_ad_da: string[]
    tech_own_email_ad_da: string[]
    princ_ea_archt_email_ad_da: string[]
    ea_archt_dlgte_email_ad_da: string[]
    ea_archt_email_ad_da: string[]
    head_engnr_email_ad_da: string[]
    ea_architect_delegate_nm: string
    ea_architect_nm: string
    principal_ea_architect_nm: string
    head_engineer_nm: string
    tech_owner_nm: string
    unit_cio_nm: string
    prim_company_domain_id?: string
    earb_approved_names_api?: string
    design_certified_names_api?: string
    prod_certified_names_api?: string
    earb_approved_apis?: number
    design_certified_apis?: number
    prod_certified_apis?: number
    darb_approved_apis?: number
    proposed_apis?: number
    opsProposed?: number
    opsDarb?: number
    opsEarb?: number
    opsDesign?: number
    opsProd?: number
    id?: string
    name?: string
    subDomains?: SubDomain[]
    isFixed?: boolean
    label?: string
    value?: string
    app_count?: number
    onboarded_catalog_names_api?: string
    onboarded_catalog_apis?: number
}

export interface SubDomain {
    company_sub_domain_id: string
    sub_domain_nm: string
    sub_domain_ds: string
    company_domain_id: string
    value?: string
    label?: string
}

export interface SeletedOptionsTypes {
    unit_cio?: string
    unit_cio_email?: string
    tech_owner?: string
    tech_owner_email?: string
    principal_ea_architect?: string
    principal_ea_architect_email?: string
    ea_architect?: string
    ea_architect_email?: string
    head_engineer?: string
    head_engineer_email?: string
    ea_architect_delegate?: string[]
    ea_architect_delegate_email?: string[]
    unit_cio_architects?: string
}
