import { API_ENDPOINTS } from '@/constants'
import {
    ALL_APPLICATIONS_QUERY_KEY,
    ApplicationListItem
} from './useGetAllApplications'
import { useMetamodelUpdate } from '../../hooks/useMetamodelUpdate'

export type UpdateApplicationPayload = {
    id: string
    patch: Partial<ApplicationListItem>
}

/**
 * Maps an application row patch to the metamodel `UpdateApplicationDto` body.
 * `PATCH /api/v1/applications/:id`.
 */
function buildApplicationBody(
    patch: Partial<ApplicationListItem>,
    userEmail: string
): Record<string, unknown> {
    const body: Record<string, unknown> = { userEmail }
    if (patch.name !== undefined) body.applicationName = patch.name
    return body
}

export function useUpdateApplication() {
    return useMetamodelUpdate<ApplicationListItem>({
        queryKey: ALL_APPLICATIONS_QUERY_KEY,
        endpoint: API_ENDPOINTS.METAMODEL_UPDATE_APPLICATION,
        buildBody: buildApplicationBody
    })
}
