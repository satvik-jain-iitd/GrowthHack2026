/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface Body {
    metadata: {
        proposedCompanyDomain: string | undefined
        companySubDomainId: string | undefined
        userEmail: string
        playbookCore: string[]
        playbookNonCore: string[]
        adrCore: string[]
        adrNonCore: string[]
        bvbCore: string[]
        bvbNonCore: string[]
    }
}

export function useAddPtbApplication(centralId: string) {
    const mutation = useMutation({
        mutationFn: async (body: Body) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.PUT_PTB_APPLICATION(centralId),
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...body })
                }
            )
            if (!res.ok) {
                throw new Error('Failed to edit PTB application')
            }
            return await res.json()
        }
    })
    return mutation
}
