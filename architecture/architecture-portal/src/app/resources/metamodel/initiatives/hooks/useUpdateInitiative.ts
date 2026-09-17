import { API_ENDPOINTS } from '@/constants'
import {
    ALL_INITIATIVES_QUERY_KEY,
    InitiativeListItem
} from './useGetAllInitiatives'
import { useMetamodelUpdate } from '../../hooks/useMetamodelUpdate'

export type UpdateInitiativePayload = {
    id: string
    patch: Partial<InitiativeListItem>
}

/**
 * Maps an initiative row patch to the metamodel `UpdateInitiativeDto` body.
 * `PATCH /api/v1/initiatives/:id`.
 */
function buildInitiativeBody(
    patch: Partial<InitiativeListItem>,
    userEmail: string
): Record<string, unknown> {
    const body: Record<string, unknown> = { userEmail }
    if (patch.name !== undefined) body.initiativeName = patch.name
    return body
}

export function useUpdateInitiative() {
    return useMetamodelUpdate<InitiativeListItem>({
        queryKey: ALL_INITIATIVES_QUERY_KEY,
        endpoint: API_ENDPOINTS.METAMODEL_UPDATE_INITIATIVE,
        buildBody: buildInitiativeBody
    })
}
