import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { toast } from 'react-toastify'
import { fetchWithToken } from '@/utils/client'

export function useAddAdr() {
    const queryClent = useQueryClient()

    return useMutation({
        mutationFn: async ({
            playbookId,
            repo,
            adrName,
            reviewers,
            deciders,
            eaArchitects,
            requester,
            user,
            status,
            fileId,
            approvedDate,
            adr_type
        }: {
            playbookId: string
            repo: string
            adrName: string
            reviewers: string[]
            deciders: string[]
            eaArchitects: string[]
            requester: string
            user: { email: string; fullName: string }
            status?: string
            fileId?: string
            approvedDate?: string
            adr_type?: string
        }) => {
            const res = await fetchWithToken(API_ENDPOINTS.ADD_ADR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playbookId,
                    repo,
                    adrName,
                    reviewers,
                    deciders,
                    eaArchitects,
                    requester,
                    user,
                    status,
                    fileId,
                    approvedDate,
                    adr_type
                })
            })

            if (!res.ok) {
                toast.error('Failed to add ADR, please try again.')
                throw new Error('Failed to add ADR')
            }

            if (fileId) {
                await queryClent.invalidateQueries({
                    queryKey: ['adr', fileId]
                })
            }

            toast.success('ADR added successfully!')

            const { data } = await res.json()

            return data as { success: boolean }
        }
    })
}
