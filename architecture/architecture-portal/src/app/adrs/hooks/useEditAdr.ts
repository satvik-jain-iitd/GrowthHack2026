import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { toast } from 'react-toastify'
import { fetchWithToken } from '@/utils/client'

export function useEditAdr() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            adrId,
            adrName,
            reviewers,
            deciders,
            eaArchitects,
            adr_type,
            user
        }: {
            adrId: string
            fileId: string
            adrName?: string
            reviewers?: string[]
            deciders?: string[]
            eaArchitects?: string[]
            adr_type?: string
            user?: string
        }) => {
            const res = await fetchWithToken(API_ENDPOINTS.EDIT_ADR(adrId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    adrName,
                    reviewers,
                    deciders,
                    eaArchitects,
                    adr_type,
                    user
                })
            })

            if (!res.ok) {
                toast.error('Failed to update ADR, please try again.')
                throw new Error('Failed to update ADR')
            }

            toast.success('ADR updated successfully!')

            const { data } = await res.json()

            return data as { success: boolean }
        },
        onSuccess: (_, variables) => {
            // Invalidate the specific ADR query to refetch updated data
            queryClient.invalidateQueries({
                queryKey: ['adr', variables.fileId]
            })
        }
    })
}
