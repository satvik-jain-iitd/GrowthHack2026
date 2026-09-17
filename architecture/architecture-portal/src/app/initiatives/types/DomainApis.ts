export interface AllOperationsResponse {
    operation_id: string
    operation_name: string
    operation_desc: string
    operation_type: string
    operation_consm_company_domain_id: string[]
    operation_seq_no: number
    operation_path: string
    status: string
}

export interface AllApisResponse {
    api_id: string
    api_name: string
    api_desc: string
    api_seq_no: number
    operations: { [operation_id: string]: AllOperationsResponse }
}

export interface AllDomainApis {
    company_domain_id: string
    company_domain_name: string
    domain_seq_no: number
    apis: {
        [key: string]: AllApisResponse
    }
}

export interface AllDomainApisResponse {
    [key: string]: AllDomainApis
}

export interface ConsumerApiInitiative {
    api_desc: string
    api_id: string
    api_name: string
    api_seq_no: number | null
    company_domain_id: string
    company_domain_name: string
    domain_seq_no: number | null
    operation_consm_company_domain_id: string[]
    operation_desc: string
    operation_id: string
    operation_name: string
    operation_seq_no: number | null
    operation_type: string
    status: string
    init_consumer_domain_id: string[]
    explorer_id?: string
    catalog_url?: string
    application_company_domain_id?: string
    application_company_domain_name?: string
}
