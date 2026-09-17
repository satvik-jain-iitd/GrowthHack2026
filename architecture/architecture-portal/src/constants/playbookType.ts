/* istanbul ignore file */
export const PLAYBOOK_TYPE_IDS = {
    ADR: '23e10939-906a-451c-b13f-932ef78481b4',
    BUILD_VS_BUY: '8d5c9f86-90dc-4ff6-8e36-edcff0b4af21',
    EXAMPLE: 'a5f3c415-4e9d-44b7-8906-e11b17a4cad0',
    INITIATIVE: '302a01a7-d8c6-47ed-b7e9-b5182206e261',
    FOUNDATIONAL_TECHNOLOGY: '1900b224-fca7-4420-a368-94fc68ef20f9',
    PAPER: 'e9d408b0-a825-428e-bcef-4e8e4d68185d',
    COMPANY_DOMAIN: 'c1966ed3-19b4-4a96-bf7b-f213f133a11f',
    COMPANY_SUBDOMAIN: 'd5864bda-607b-4116-a9e7-352cddb92181',
    COMPANY_DOMAIN_CATEGORY: '6735c573-c744-4acd-bb89-05223af5fe76',
    REFERENCE_ARCHITECTURE: 'c44a9020-93b5-4341-bbd4-668162650a3b',
    STANDARDS_AND_COMPLIANCE: 'f5977b96-44c8-437a-8aad-228caaad3d08'
} as const

export const BUILD_VS_BUY_PARENT_PLAYBOOK_ID =
    '951830f3-7db0-4ca0-b209-7b3adac0241f'

export type PlaybookTypeId =
    (typeof PLAYBOOK_TYPE_IDS)[keyof typeof PLAYBOOK_TYPE_IDS]
export const PLAYBOOK_TYPE_SLUGS: Record<PlaybookTypeId, string> = {
    [PLAYBOOK_TYPE_IDS.ADR]: 'adrs',
    [PLAYBOOK_TYPE_IDS.BUILD_VS_BUY]: 'BuildvsBuy',
    [PLAYBOOK_TYPE_IDS.EXAMPLE]: 'contribute',
    [PLAYBOOK_TYPE_IDS.INITIATIVE]: 'initiatives',
    [PLAYBOOK_TYPE_IDS.FOUNDATIONAL_TECHNOLOGY]: 'company-domains',
    [PLAYBOOK_TYPE_IDS.PAPER]: 'papers',
    [PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN]: 'company-domains',
    [PLAYBOOK_TYPE_IDS.COMPANY_SUBDOMAIN]: 'company-domains',
    [PLAYBOOK_TYPE_IDS.COMPANY_DOMAIN_CATEGORY]: 'company-domains',
    [PLAYBOOK_TYPE_IDS.REFERENCE_ARCHITECTURE]: 'reference-architecture',
    [PLAYBOOK_TYPE_IDS.STANDARDS_AND_COMPLIANCE]: 'standards-&-compliance'
}
