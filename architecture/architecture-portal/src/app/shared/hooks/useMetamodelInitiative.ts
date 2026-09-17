import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { InitiativeMM } from '../types/metamodel'
import { fetchWithToken } from '@/utils/client'

export const METAMODEL_INITIATIVE_QUERY_KEY = (id: string) => [
    'metamodel_initiative',
    id
]

export const fetchMetamodelInitiative = async (
    id: string
): Promise<InitiativeMM | null> => {
    const res = await fetchWithToken(API_ENDPOINTS.METAMODEL_GET_INITIATIVE(id))
    if (res.status === 404) return null
    if (!res.ok) {
        throw new Error(
            `Failed to fetch metamodel initiative: ${res.status} ${res.statusText}`
        )
    }
    const data: InitiativeMM[] = await res.json()
    return data[0] ?? null
}

export function useMetamodelInitiative(initiativeId: string) {
    return useQuery<InitiativeMM | null, Error>({
        queryKey: METAMODEL_INITIATIVE_QUERY_KEY(initiativeId),
        queryFn: () => fetchMetamodelInitiative(initiativeId),
        enabled: !!initiativeId
    })
}
