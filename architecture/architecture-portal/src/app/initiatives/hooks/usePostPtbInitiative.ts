/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface Body {
    metadata: {
        startDate: string
        tentativeEndDate: string
        years: number[]
        initiativeCategory: string
        unitCIO: string
        companyDomains: string[]
        impactedApplications: string[]
        adrCore: string[]
        adrNonCore: string[]
        bvbCore: string[]
        bvbNonCore: string[]
        userEmail: string
        initiativeFrameworks: string[]
        playbookCore: string[]
        playbookNonCore: string[]
        clarityId: string
        ucioDelegates: string[]
        headEngineers: string[]
        principalArchitects: string[]
        eaArchitects: string[]
        techOwners: string[]
    }
}

export function useAddPtbInitiative(initiativeId: string) {
    const mutation = useMutation({
        mutationFn: async (body: Body) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.PUT_PTB_INITIATIVE(initiativeId),
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...body })
                }
            )
            if (!res.ok) {
                throw new Error('Failed to edit PTB initiative')
            }
            return await res.json()
        }
    })
    return mutation
}
