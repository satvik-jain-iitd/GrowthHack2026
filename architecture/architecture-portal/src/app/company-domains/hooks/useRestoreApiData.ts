/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'

import { fetchWithToken } from '@/utils/client'
export const useRestoreApiData = () => {
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
                ? API_ENDPOINTS.RESTORE_API_DATA(metadataID, domainID)
                : API_ENDPOINTS.RESTORE_API_ENDPOINT_DATA(
                      metadataID,
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
