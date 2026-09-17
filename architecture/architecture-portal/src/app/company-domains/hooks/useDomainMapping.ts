/* istanbul ignore file */
'use client'
import { useCallback, useState } from 'react'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const useDomainMapping = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<boolean | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)

    const fetchData = useCallback(
        async (
            domainId: string,
            payload: {
                car_id: string
                email_id: string | undefined
                domain_id: string
            },
            isLinked: boolean
        ) => {
            setIsLoading(true)
            try {
                const resp = isLinked
                    ? await fetchWithToken(
                          API_ENDPOINTS.POST_DOMAIN_DETAILS_APPLICATIONS(
                              domainId
                          ),
                          {
                              credentials: 'include',
                              body: JSON.stringify(payload),
                              method: 'DELETE',
                              headers: {
                                  'Content-Type': 'application/json'
                              }
                          }
                      )
                    : await fetchWithToken(
                          API_ENDPOINTS.POST_DOMAIN_DETAILS_APPLICATIONS(
                              domainId
                          ),
                          {
                              credentials: 'include',
                              body: JSON.stringify(payload),
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              method: 'POST'
                          }
                      )

                const response = await resp.json()

                const status = response?.success

                setStatus(!!status)
                setIsLoading(false)
                setServerError(null)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setServerError(error.message || 'An error occurred.')
                } else {
                    setServerError('An error occurred.')
                }

                setStatus(false)
                setIsLoading(false)
            }
        },
        []
    )

    return { isLoading, status, serverError, fetchData, setServerError }
}
