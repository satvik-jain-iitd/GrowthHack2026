import { Api } from '@/app/business-architecture/types'

export interface Domain {
    company_domain_id: string
    domain_nm: string
    playbook_id: string
    description: string
    apis: Api[]
}
