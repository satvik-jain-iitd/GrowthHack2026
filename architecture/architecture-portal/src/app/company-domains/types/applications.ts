export interface ApplicationCentralInfo {
    name?: string
    ownershipInfo?: {
        applicationOwner?: { fullName?: string; email?: string }
        applicationOwnerLeader1?: {
            fullName?: string
            email?: string
        }
        applicationOwnerLeader2?: {
            fullName?: string
            email?: string
        }
        businessOwner?: { fullName?: string; email?: string }
        businessOwnerLeader1?: {
            fullName?: string
            email?: string
        }
        unitCIO?: {
            fullName?: string
            email?: string
        }
        ownerSVP?: {
            fullName?: string
            email?: string
        }
        pmo?: {
            fullName?: string
            email?: string
        }
        productionSupportOwner?: {
            fullName?: string
            email?: string
        }
        productionSupportOwnerLeader1?: {
            fullName?: string
            email?: string
        }
    }
    lineOfBusiness?: { lineOfBusiness2?: string }
    lifeCycleStatus?: string
    appType?: string
    description?: string
    id?: string
    application_name?: string
    domainName?: string
    domainId?: string
}
export interface Application {
    application_nm: string
    application_id: string
    life_cycle_status_nm: string
    domain_nm: string
    proposed_domain_nm?: string
    sub_domain_nm?: string
    count: number
    company_domain_id: string
    ebc_level_4_nm: string
    ebc_level_3_nm: string
    last_update_ts: string
    last_update_user_id: string
    unlink: boolean
    metadata?: object[]
    adr_core?: { id: string; name: string }[]
    adr_non_core?: { id: string; name: string }[]
    bvb_core?: { id: string; name: string }[]
    bvb_non_core?: { id: string; name: string }[]
    playbook_core?: { id: string; name: string }[]
    playbook_non_core?: { id: string; name: string }[]
    linked_playbook_names?: string[]
    sub_domain_id: string
    central_application_da?: {
        name?: string
        ownershipInfo?: {
            applicationOwner?: { fullName?: string; email?: string }
            applicationOwnerLeader1?: {
                fullName?: string
                email?: string
            }
            applicationOwnerLeader2?: {
                fullName?: string
                email?: string
            }
            businessOwner?: { fullName?: string; email?: string }
            businessOwnerLeader1?: {
                fullName?: string
                email?: string
            }
            unitCIO?: {
                fullName?: string
                email?: string | null
            }
            ownerSVP?: {
                fullName?: string
                email?: string
            }
            pmo?: {
                fullName?: string
                email?: string
            }
            productionSupportOwner?: {
                fullName?: string
                email?: string
            }
            productionSupportOwnerLeader1?: {
                fullName?: string
                email?: string
            }
        }
        lineOfBusiness?: { lineOfBusiness2?: string }
        lifeCycleStatus?: string
        appType?: string
        description?: string
    }
}
