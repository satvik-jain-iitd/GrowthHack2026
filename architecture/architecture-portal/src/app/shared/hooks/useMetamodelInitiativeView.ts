import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { InitiativeMM } from '../types/metamodel'
import { fetchWithToken } from '@/utils/client'
import {
    RecommendedValueIds,
    diffInitiativeRecommendations,
    emptyRecommendedValueIds
} from '../utils/recommendationDiff'
import { useMetamodelInitiative } from './useMetamodelInitiative'

export const STAGED_METAMODEL_INITIATIVE_QUERY_KEY = (id: string) => [
    'staged_metamodel_initiative',
    id
]

export const fetchStagedMetamodelInitiative = async (
    id: string
): Promise<InitiativeMM | null> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.METAMODEL_GET_STAGED_INITIATIVE(id)
    )
    if (res.status === 404) return null
    if (!res.ok) {
        throw new Error(
            `Failed to fetch staged metamodel initiative: ${res.status} ${res.statusText}`
        )
    }
    const data: InitiativeMM[] = await res.json()
    return data[0] ?? null
}

export interface MetamodelInitiativeView {
    /** Staged entity for never-edited initiatives, authoritative otherwise. */
    data: InitiativeMM | null | undefined
    authoritative: InitiativeMM | null | undefined
    isStaged: boolean
    recommendedValues: RecommendedValueIds
    isLoading: boolean
    refetch: () => void
}

/**
 * Reads an initiative authoritatively, then falls back to the staged read when
 * the record has never been edited by a user (`lastUserUpdateTs === null`), so
 * recommendations are only shown for records with nothing confirmed. The values
 * the staged read added on top of the authoritative one are the recommendations.
 */
export function useMetamodelInitiativeView(
    initiativeId: string
): MetamodelInitiativeView {
    const {
        data: authoritative,
        isLoading: authoritativeLoading,
        refetch: refetchAuthoritative
    } = useMetamodelInitiative(initiativeId)

    const wantsStaged =
        !!initiativeId && !!authoritative && !authoritative.lastUserUpdateTs

    const {
        data: staged,
        isLoading: stagedLoading,
        refetch: refetchStaged
    } = useQuery<InitiativeMM | null, Error>({
        queryKey: STAGED_METAMODEL_INITIATIVE_QUERY_KEY(initiativeId),
        queryFn: () => fetchStagedMetamodelInitiative(initiativeId),
        enabled: wantsStaged
    })

    const isStaged = wantsStaged && !!staged

    return {
        data: isStaged ? staged : authoritative,
        authoritative,
        isStaged,
        recommendedValues: isStaged
            ? diffInitiativeRecommendations(authoritative, staged)
            : emptyRecommendedValueIds(),
        isLoading: authoritativeLoading || (wantsStaged && stagedLoading),
        refetch: () => {
            refetchAuthoritative()
            if (wantsStaged) refetchStaged()
        }
    }
}
