import { API_ENDPOINTS } from '@/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { METAMODEL_INITIATIVE_QUERY_KEY } from './useMetamodelInitiative'
import { fetchWithToken } from '@/utils/client'

export interface OwnerPersona {
    name?: string | null
    email?: string | null
}

export interface UpdateMetamodelInitiativeBody {
    initiativeName?: string
    lineOfBusiness?: string
    strategicEpics?: string[]
    legacy_etp_ecmi_id?: string
    supportedBusinessUnits?: string[]
    supportedMarkets?: string[]
    technologyStacks?: string[]
    techCapabilities?: string[]
    foundationalTechnologies?: string[]
    owners?: {
        unitcio?: OwnerPersona | null
        principal_architect?: OwnerPersona | null
        enterprise_architect?: OwnerPersona | null
        additional_architects?: OwnerPersona[]
    }
    adrCore?: string[]
    adrNonCore?: string[]
    bvbCore?: string[]
    bvbNonCore?: string[]
    linkedInitiativesCore?: string[]
    linkedInitiativesNonCore?: string[]
    impactedCompanyDomainIds?: string[]
    businessCapabilities?: string[]
    userEmail?: string
}

export function useUpdateMetamodelInitiative(initiativeId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (body: UpdateMetamodelInitiativeBody) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.METAMODEL_UPDATE_INITIATIVE(initiativeId),
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }
            )
            if (!res.ok) {
                throw new Error('Failed to update metamodel initiative')
            }
            return await res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: METAMODEL_INITIATIVE_QUERY_KEY(initiativeId)
            })
        }
    })
}
