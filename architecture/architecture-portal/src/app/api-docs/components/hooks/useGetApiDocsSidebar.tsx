/* istanbul ignore file */

import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { fetchWithToken } from '@/utils/client'
import { domainsLeftNav } from '@/app/api-docs/types/apiDocs'

export const APIDOCS_SIDEBAR_KEY = ['apiDocsSidebar']

export const fetchApiDocsSidebar = async () => {
    const apiUrl = API_ENDPOINTS.GET_APIDOCS_SIDEBAR
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch API docs sidebar: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    const domainsList = Object.values(json.data) as domainsLeftNav[]
    const operationsList = getDomainList(json.data)
    return { sidebarData: json.data, domainsList, operationsList }
}

export const getDomainList = (sidebarData: {
    [key: string]: domainsLeftNav
}) => {
    const domainsList = Object.values(sidebarData || {})
    return domainsList.reduce<{ label: string; value: string; path: string }[]>(
        (acc, domain) => {
            if (domain.apis) {
                Object.values(domain.apis).forEach(api => {
                    if (api.operations) {
                        Object.values(api.operations).forEach(operation => {
                            acc.push({
                                label: operation.name,
                                value: operation.id,
                                path: operation.path.join(' > ')
                            })
                        })
                    }
                })
            }
            return acc
        },
        []
    )
}

export const useGetApiDocsSidebar = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: APIDOCS_SIDEBAR_KEY,
        queryFn: fetchApiDocsSidebar,
        refetchOnMount: false
    })

    return {
        ...data,
        loading: isLoading,
        error,
        refetch
    }
}
