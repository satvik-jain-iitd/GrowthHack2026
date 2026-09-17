import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { PlaybookEditableFields } from '@/app/build-vs-buys/components/bvb-index/BvBIndex'
import { fetchWithToken } from '@/utils/client'

export function useEditBvB(playbookId: string) {
    const mutation = useMutation({
        mutationFn: async (editedFields: Partial<PlaybookEditableFields>) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.UPDATE_BVB(playbookId),
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...editedFields })
                }
            )
            if (!res.ok) {
                throw new Error('Failed to edit playbook')
            }
            return await res.json()
        }
    })
    return mutation
}
