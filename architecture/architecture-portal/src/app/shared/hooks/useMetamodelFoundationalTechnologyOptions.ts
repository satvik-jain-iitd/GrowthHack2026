import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export interface MetamodelFoundationalTechnologyOption {
    foundationalTechnologyId: string
    name: string
}

interface MetamodelFoundationalTechnologyListResponse {
    page: number
    pageSize: number
    total: number
    data: MetamodelFoundationalTechnologyOption[]
}

export const METAMODEL_FOUNDATIONAL_TECHNOLOGY_OPTIONS_QUERY_KEY = [
    'metamodelFoundationalTechnologyOptions'
]

async function fetchMetamodelFoundationalTechnologyOptions(): Promise<
    MetamodelFoundationalTechnologyOption[]
> {
    const res = await fetchWithToken(
        `${API_ENDPOINTS.METAMODEL_LIST_FOUNDATIONAL_TECHNOLOGIES}?pageSize=500`
    )
    if (!res.ok) {
        throw new Error(
            `Failed to fetch metamodel foundational technologies: ${res.status}`
        )
    }
    const json: MetamodelFoundationalTechnologyListResponse = await res.json()
    return json.data
}

export function useMetamodelFoundationalTechnologyOptions() {
    const { data, isLoading, error } = useQuery<
        MetamodelFoundationalTechnologyOption[]
    >({
        queryKey: METAMODEL_FOUNDATIONAL_TECHNOLOGY_OPTIONS_QUERY_KEY,
        queryFn: fetchMetamodelFoundationalTechnologyOptions
    })

    return { foundationalTechnologyOptions: data, loading: isLoading, error }
}
