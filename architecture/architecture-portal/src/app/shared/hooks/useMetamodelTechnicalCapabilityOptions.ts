import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface MetamodelTechnicalCapabilityOption {
    technicalCapabilityId: string
    name: string
}

interface MetamodelTechnicalCapabilityListResponse {
    page: number
    pageSize: number
    total: number
    data: MetamodelTechnicalCapabilityOption[]
}

export const METAMODEL_TECHNICAL_CAPABILITY_OPTIONS_QUERY_KEY = [
    'metamodelTechnicalCapabilityOptions'
]

async function fetchMetamodelTechnicalCapabilityOptions(): Promise<
    MetamodelTechnicalCapabilityOption[]
> {
    const res = await fetchWithToken(
        `${API_ENDPOINTS.METAMODEL_LIST_TECHNICAL_CAPABILITIES}?pageSize=500`
    )
    if (!res.ok) {
        throw new Error(
            `Failed to fetch metamodel technical capabilities: ${res.status}`
        )
    }
    const json: MetamodelTechnicalCapabilityListResponse = await res.json()
    return json.data
}

export function useMetamodelTechnicalCapabilityOptions() {
    const { data, isLoading, error } = useQuery<
        MetamodelTechnicalCapabilityOption[]
    >({
        queryKey: METAMODEL_TECHNICAL_CAPABILITY_OPTIONS_QUERY_KEY,
        queryFn: fetchMetamodelTechnicalCapabilityOptions
    })

    return { technicalCapabilityOptions: data, loading: isLoading, error }
}
