import { API_ENDPOINTS } from '@/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { METAMODEL_APPLICATION_QUERY_KEY } from './useMetamodelApplication'
import { fetchWithToken } from '@/utils/client'

export interface UpdateMetamodelApplicationBody {
    applicationName?: string
    lifecycleState?: string
    applicationType?: string
    businessUnit?: string
    owners?: {
        application_owner?: string | null
        application_owner_leader1?: string | null
        application_owner_leader2?: string | null
        business_owner?: string | null
        unit_cio?: string | null
        owner_svp?: string | null
        pmo?: string | null
    }
    adrCore?: string[]
    adrNonCore?: string[]
    bvbCore?: string[]
    bvbNonCore?: string[]
    linkedInitiativesCore?: string[]
    linkedInitiativesNonCore?: string[]
    linkedCompanyDomainId?: string | null
    linkedPlaybooks?: string[]
    technologyStacks?: string[]
    marketsSupported?: string[]
    businessCapabilities?: string[]
    foundationalTechnologies?: string[]
    techCapabilities?: string[]
    userEmail?: string
}

export function useUpdateMetamodelApplication(applicationId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (body: UpdateMetamodelApplicationBody) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.METAMODEL_UPDATE_APPLICATION(applicationId),
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }
            )
            if (!res.ok) {
                throw new Error('Failed to update metamodel application')
            }
            return await res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: METAMODEL_APPLICATION_QUERY_KEY(applicationId)
            })
        }
    })
}
