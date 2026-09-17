import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { ApplicationMM } from '../types/metamodel'
import { fetchWithToken } from '@/utils/client'

export const METAMODEL_APPLICATION_QUERY_KEY = (id: string) => [
    'metamodel_application',
    id
]

export const fetchMetamodelApplication = async (
    id: string
): Promise<ApplicationMM | null> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.METAMODEL_GET_APPLICATION(id)
    )
    if (res.status === 404) return null
    if (!res.ok) {
        throw new Error(
            `Failed to fetch metamodel application: ${res.status} ${res.statusText}`
        )
    }
    const data: ApplicationMM[] = await res.json()
    return data[0] ?? null
}

export function useMetamodelApplication(applicationId: string) {
    return useQuery<ApplicationMM | null, Error>({
        queryKey: METAMODEL_APPLICATION_QUERY_KEY(applicationId),
        queryFn: () => fetchMetamodelApplication(applicationId),
        enabled: !!applicationId
    })
}
