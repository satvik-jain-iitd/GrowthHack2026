/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const useApiUpdateStatus = () => {
    const mutation = useMutation({
        mutationFn: async (requestBody: {
            api_metadata_id: string
            domainId: string
            api_endpoint_metadata_id: string
            reviewLabel: string
            isApprove: boolean
            comment: string
        }) => {
            const {
                api_metadata_id,
                domainId,
                api_endpoint_metadata_id,
                reviewLabel,
                isApprove,
                comment
            } = requestBody
            const body = {
                company_domain_id: domainId,
                api_metadata_id: api_metadata_id,
                api_endpoint_metadata_id: api_endpoint_metadata_id,
                wkflow_step_nm: reviewLabel,
                isApproved: isApprove ? true : false,
                comment: comment,
                pageLink: window.location.href
            }
            const apiUpdateOptions = {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' as RequestCredentials
            }

            const res = await fetchWithToken(
                API_ENDPOINTS.API_UPDATE_STATUS,
                apiUpdateOptions
            )
            if (!res.ok) {
                throw new Error('Failed to edit co editors')
            }
            return await res.json()
        }
    })
    return mutation
}
