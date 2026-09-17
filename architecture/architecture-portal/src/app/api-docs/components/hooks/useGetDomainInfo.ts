/* istanbul ignore file */

import { Domain } from '@/app/company-domains/types/domains'
import { DomainInfo } from '@/app/api-docs/types/apiDocs'

export const useGetDomainInfo = (
    domainId: string,
    data: {
        domains: Domain[] | undefined
        loading: boolean
        error: Error | null
    }
): DomainInfo => {
    const domainData = data.domains?.find(
        (d: Domain) => d.company_domain_id === domainId
    )

    return {
        id: domainData?.company_domain_id || '',
        name: domainData?.domain_nm || '',
        description: domainData?.domain_ds || '',
        lightIcon: domainData?.im_light_tx || '',
        darkIcon: domainData?.im_dark_tx || '',
        filledLightIcon: domainData?.im_fill_light_tx || '',
        filledDarkIcon: domainData?.im_fill_dark_tx || '',
        playbookId: domainData?.playbook_id || '',
        loading: data.loading ?? false,
        error: data.error ?? undefined,
        sortOrder: domainData?.disp_sort_ord ?? 0
    }
}
