/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const useDeleteApiData = () => {
    const mutation = useMutation({
        mutationFn: async ({
            domainID,
            apiID,
            metadataID,
            isApiData,
            requestBody
        }: {
            domainID: string
            apiID: string
            metadataID: string
            isApiData: boolean
            requestBody: {
                comment: string
            }
        }) => {
            const apiUrl = isApiData
                ? API_ENDPOINTS.DELETE_API_DATA(metadataID, domainID)
                : API_ENDPOINTS.DELETE_API_ENDPOINT_DATA(
                      metadataID,
                      domainID,
                      apiID
                  )

            const res = await fetchWithToken(apiUrl, {
                method: 'DELETE',
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
