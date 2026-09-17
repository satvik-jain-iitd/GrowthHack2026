/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const useDashboardApplicationList = () => {
    const mutation = useMutation({
        mutationFn: async (payload: { page?: number; offset?: number }) => {
            const resp = await fetchWithToken(
                API_ENDPOINTS.GET_DASHBOARD_APPLICATIONS,
                {
                    credentials: 'include',
                    body: JSON.stringify(payload),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const res = await resp.json()
            const data = await res?.data.data?.applications
            return data
        }
    })
    return mutation
}
