/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const useApplicationsList = () => {
    const mutation = useMutation({
        mutationFn: async (requestBody: {
            payload?: {
                mapped?: string
                ebcm_orphaned?: string
                com_dom_orphaned?: string
                page_num?: number
                page_len?: number
                search_string?: string
            }
            isSearchActive?: boolean
        }) => {
            const { payload, isSearchActive } = requestBody
            const resp = await fetchWithToken(
                API_ENDPOINTS.GET_APPLICATIONS(isSearchActive ? '/search' : ''),
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const res = await resp?.json()
            const data = res.data
            return data
        }
    })

    return mutation
}
