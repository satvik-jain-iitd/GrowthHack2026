import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface MetamodelAdrOption {
    id: string
    name: string
}

interface MetamodelAdrListResponse {
    page: number
    pageSize: number
    total: number
    data: MetamodelAdrOption[]
}

export const METAMODEL_ADR_OPTIONS_QUERY_KEY = ['metamodelAdrOptions']

async function fetchMetamodelAdrOptions(): Promise<MetamodelAdrOption[]> {
    const res = await fetchWithToken(
        `${API_ENDPOINTS.METAMODEL_LIST_ADRS}?pageSize=100`
    )
    if (!res.ok) {
        throw new Error(`Failed to fetch metamodel ADRs: ${res.status}`)
    }
    const json: MetamodelAdrListResponse = await res.json()
    return json.data
}

export function useMetamodelAdrOptions() {
    const { data, isLoading, error } = useQuery<MetamodelAdrOption[]>({
        queryKey: METAMODEL_ADR_OPTIONS_QUERY_KEY,
        queryFn: fetchMetamodelAdrOptions
    })

    return { adrOptions: data, loading: isLoading, error }
}
