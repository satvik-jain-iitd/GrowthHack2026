import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getDomainList } from '@/app/api-docs/components/hooks/useGetApiDocsSidebar'
import type { domainsLeftNav } from '@/app/api-docs/types/apiDocs'

export const getApiDocsSidebar = async () => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_APIDOCS_SIDEBAR)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch API docs sidebar: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return {
        sidebarData: json.data,
        domainsList: Object.values(json.data) as domainsLeftNav[],
        operationsList: getDomainList(json.data)
    }
}
