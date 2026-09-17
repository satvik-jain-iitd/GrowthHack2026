/* istanbul ignore file */
'use client'
import { API_ENDPOINTS } from '@/constants'
import { useCallback, useState } from 'react'
import { fetchWithToken } from '@/utils/client'

export const useEBCMMapping = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [serverError, setServerError] = useState<string | null>(null)

    const fetchData = useCallback(
        async (
            payload: {
                car_id: string
                capability: string | { id: string }
                email_id: string | undefined
            },
            isLinked: boolean
        ) => {
            setIsLoading(true)
            try {
                const resp = isLinked
                    ? await fetchWithToken(API_ENDPOINTS.ADD_EBCM_MAPPING, {
                          body: JSON.stringify(payload),
                          method: 'DELETE',
                          credentials: 'include',
                          headers: {
                              'Content-Type': 'application/json'
                          }
                      })
                    : await fetchWithToken(API_ENDPOINTS.ADD_EBCM_MAPPING, {
                          body: JSON.stringify(payload),
                          method: 'POST',
                          credentials: 'include',
                          headers: {
                              'Content-Type': 'application/json'
                          }
                      })
                const response = await resp.json()
                const status = await response?.data?.success
                setStatus(status)
                setIsLoading(false)
                setServerError(null)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setServerError(error.message || 'An error occurred.')
                } else {
                    setServerError('An error occurred.')
                }
                setIsLoading(false)
            }
        },
        []
    )

    return { isLoading, status, serverError, fetchData }
}
