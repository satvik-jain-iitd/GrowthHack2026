/* istanbul ignore file */
'use client'
import { useCallback, useState } from 'react'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const useDomainMapping = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [status, setStatus] = useState<boolean | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)

    const fetchData = useCallback(
        async (domainId: string, payload: object, isLinked: boolean) => {
            setIsLoading(true)
            try {
                let resp: Response
                if (isLinked) {
                    resp = await fetchWithToken(
                        API_ENDPOINTS.ADD_DOMAIN_MAPPING(domainId),
                        {
                            method: 'DELETE',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        }
                    )
                } else {
                    resp = await fetchWithToken(
                        API_ENDPOINTS.ADD_DOMAIN_MAPPING(domainId),
                        {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        }
                    )
                }
                if (!resp.ok) {
                    throw resp
                }
                const data = await resp.json()
                setStatus(data?.success ?? false)
                setIsLoading(false)
                setServerError(null)
            } catch (error) {
                let errorMessage = 'Unknown error'
                if ((error as Error).message) {
                    errorMessage = (error as Error).message
                }
                setStatus(false)
                setServerError(errorMessage)
                setIsLoading(false)
            }
        },
        []
    )

    return { isLoading, status, serverError, fetchData, setServerError }
}
