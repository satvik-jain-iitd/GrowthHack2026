import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { ApplicationMM } from '../types/metamodel'
import { fetchWithToken } from '@/utils/client'
import {
    RecommendedValueIds,
    diffApplicationRecommendations,
    emptyRecommendedValueIds
} from '../utils/recommendationDiff'
import { useMetamodelApplication } from './useMetamodelApplication'

export const STAGED_METAMODEL_APPLICATION_QUERY_KEY = (id: string) => [
    'staged_metamodel_application',
    id
]

export const fetchStagedMetamodelApplication = async (
    id: string
): Promise<ApplicationMM | null> => {
    const res = await fetchWithToken(
        API_ENDPOINTS.METAMODEL_GET_STAGED_APPLICATION(id)
    )
    if (res.status === 404) return null
    if (!res.ok) {
        throw new Error(
            `Failed to fetch staged metamodel application: ${res.status} ${res.statusText}`
        )
    }
    const data: ApplicationMM[] = await res.json()
    return data[0] ?? null
}

export interface MetamodelApplicationView {
    /** Staged entity for never-edited applications, authoritative otherwise. */
    data: ApplicationMM | null | undefined
    authoritative: ApplicationMM | null | undefined
    isStaged: boolean
    recommendedValues: RecommendedValueIds
    isLoading: boolean
    refetch: () => void
}

/**
 * Reads an application authoritatively, then falls back to the staged read when
 * the record has never been edited by a user (`lastUserUpdateTs === null`), so
 * recommendations are only shown for records with nothing confirmed. The values
 * the staged read added on top of the authoritative one are the recommendations.
 */
export function useMetamodelApplicationView(
    applicationId: string
): MetamodelApplicationView {
    const {
        data: authoritative,
        isLoading: authoritativeLoading,
        refetch: refetchAuthoritative
    } = useMetamodelApplication(applicationId)

    const wantsStaged =
        !!applicationId && !!authoritative && !authoritative.lastUserUpdateTs

    const {
        data: staged,
        isLoading: stagedLoading,
        refetch: refetchStaged
    } = useQuery<ApplicationMM | null, Error>({
        queryKey: STAGED_METAMODEL_APPLICATION_QUERY_KEY(applicationId),
        queryFn: () => fetchStagedMetamodelApplication(applicationId),
        enabled: wantsStaged
    })

    const isStaged = wantsStaged && !!staged

    return {
        data: isStaged ? staged : authoritative,
        authoritative,
        isStaged,
        recommendedValues: isStaged
            ? diffApplicationRecommendations(authoritative, staged)
            : emptyRecommendedValueIds(),
        isLoading: authoritativeLoading || (wantsStaged && stagedLoading),
        refetch: () => {
            refetchAuthoritative()
            if (wantsStaged) refetchStaged()
        }
    }
}
