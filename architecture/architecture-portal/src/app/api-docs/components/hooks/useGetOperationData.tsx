/* istanbul ignore file */

import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { fetchWithToken } from '@/utils/client'

export const APIDOCS_OPERATION_DATA_KEY = ['operationData']

export const fetchApiDocsOperationData = async (
    apiId: string,
    operationId: string
) => {
    const apiUrl = API_ENDPOINTS.GET_OPERATION_SCHEMA(apiId, operationId)
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch API docs operation schema: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return json.data
}

export const useGetOperationData = (
    apiId: string,
    operationId: string,
    enabled: boolean
) => {
    const { data, isLoading, error, refetch, isEnabled } = useQuery({
        queryKey: [...APIDOCS_OPERATION_DATA_KEY, apiId, operationId],
        queryFn: () => fetchApiDocsOperationData(apiId, operationId),
        enabled: apiId !== '' && operationId !== '' && enabled,
        refetchOnMount: false
    })

    return { data, loading: isLoading, error, refetch, isEnabled }
}
