/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const useRevertApiData = () => {
    const mutation = useMutation({
        mutationFn: async ({
            domainID,
            apiID,
            operationID,
            requestBody
        }: {
            domainID: string
            apiID: string
            operationID: string
            requestBody: {
                comment: string
                api_endpoint_metadata_id: string
                pageLink: string
            }
        }) => {
            const apiUrl = API_ENDPOINTS.REVERT_API_ENDPOINT_DATA(
                operationID,
                domainID,
                apiID
            )

            const res = await fetchWithToken(apiUrl, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' as RequestCredentials
            })

            return res
        }
    })
    return mutation
}
