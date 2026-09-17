/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { AuditAppResponse } from '../types'
import { fetchWithToken } from '@/utils/client'

export const useDomainHistorySearch = () => {
    const mutation = useMutation({
        mutationFn: async (payload: {
            domainId?: string
            link?: boolean
            unlink?: boolean
            search_string?: string
            startDate?: string
            endDate?: string
            page?: string
            offset?: string
            sortBy?: string
            orderBy?: string
        }) => {
            const res = await fetchWithToken(
                API_ENDPOINTS.DOMAIN_SEARCH_HISTORY,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (res?.status === 200) {
                const resp = await res?.json()

                if (resp?.success) {
                    const responseData = resp.data
                    const data = responseData?.domainData?.map(
                        (obj: AuditAppResponse) => ({
                            ...obj,
                            userName: {
                                name: obj.userName,
                                email: obj.userEmail
                            }
                        })
                    )

                    return { data, recordCount: +responseData?.recordCount }
                } else {
                    return { data: [], recordCount: 0 }
                }
            } else {
                return { data: [], recordCount: 0 }
            }
        }
    })

    return mutation
}
