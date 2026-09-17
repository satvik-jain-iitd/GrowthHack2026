export interface Capability {
    capability_id: string
    parent_capability_id: string | null
    capability_key_tx: string
    capability_nm: string
    capability_desc_tx: string
    capability_level: number
    begins_with_tx: string
    ends_with_tx: string
    includes_tx: string
    customer_journey_id: string
    current_maturity_id?: string
    target_maturity_id?: string
    criticality_id?: string
    creat_user_email_ad_tx?: string
    creat_ts?: string
    lst_updt_user_email_ad_tx?: string
    lst_updt_ts?: string
    product_tx: string
    region_tx: string
    customer_type: string
    l1_capability_id: string
    applications?: {
        application_id: number
        application_nm: string
    }[]
}

export interface CapabilityNode extends Capability {
    children?: CapabilityNode[]
}
