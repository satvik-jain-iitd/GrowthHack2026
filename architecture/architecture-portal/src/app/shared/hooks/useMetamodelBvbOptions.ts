import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface MetamodelBvbOption {
    id: string
    title: string
}

interface MetamodelBvbListResponse {
    page: number
    pageSize: number
    total: number
    data: MetamodelBvbOption[]
}

export const METAMODEL_BVB_OPTIONS_QUERY_KEY = ['metamodelBvbOptions']

async function fetchMetamodelBvbOptions(): Promise<MetamodelBvbOption[]> {
    const res = await fetchWithToken(
        `${API_ENDPOINTS.METAMODEL_LIST_BVBS}?pageSize=100`
    )
    if (!res.ok) {
        throw new Error(`Failed to fetch metamodel BvBs: ${res.status}`)
    }
    const json: MetamodelBvbListResponse = await res.json()
    return json.data
}

export function useMetamodelBvbOptions() {
    const { data, isLoading, error } = useQuery<MetamodelBvbOption[]>({
        queryKey: METAMODEL_BVB_OPTIONS_QUERY_KEY,
        queryFn: fetchMetamodelBvbOptions
    })

    return { bvbOptions: data, loading: isLoading, error }
}
