import { Option } from './option'

export type FieldData = GraphAPIUser | string | Option | EtpTitle

export type GraphAPIUser = {
    '@odata.type'?: string
    displayName: string
    jobTitle: string
    userPrincipalName: string
    extension_ee871ce5fcfd4b20869cbd9d712306f7_axppband?: string
}

export type GraphAPIResponse = {
    '@odata.context': string
    '@odata.count': number
    '@odata.nextLink': string
    value: GraphAPIUser[]
}

export interface EtpTitle {
    etp_id: string
    initiative_title: string
    ecmi: boolean
    business_unit: string
    unit_cio: string
    year: string[]
}
