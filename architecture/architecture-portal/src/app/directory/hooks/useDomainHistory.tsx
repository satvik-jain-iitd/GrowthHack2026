/* istanbul ignore file */
'use client'
import { API_ENDPOINTS } from '@/constants'
import { useCallback, useState } from 'react'
import { fetchWithToken } from '@/utils/client'

export const useDomainHistory = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [historyData, setHistoryData] = useState<Record<
        string,
        string
    > | null>(null)
    const [serverError, setServerError] = useState<unknown | null>(null)
    const [recordCount, setRecordCount] = useState(0)

    const fetchData = useCallback(async (payload: object) => {
        setIsLoading(true)
        try {
            const resp = await fetchWithToken(
                API_ENDPOINTS.GET_DOMAIN_HISTORY,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            )

            if (resp.status === 200 || resp.status === 201) {
                const responseData = (await resp.json())?.data
                const data = responseData?.domainData?.map(
                    (obj: Record<string, string>) => ({
                        ...obj,
                        userName: {
                            name: obj.userName,
                            email: obj.userEmail
                        }
                    })
                )
                setRecordCount(+responseData?.recordCount)
                setHistoryData(data)
                setIsLoading(false)
                setServerError(null)
                return { data, recordCount: +responseData?.recordCount }
            } else {
                setRecordCount(0)
                setHistoryData(null)
                setIsLoading(false)
                setServerError(null)
                return { data: [], recordCount: 0 }
            }
        } catch (error) {
            setServerError(error)
            setIsLoading(false)
        }
    }, [])

    return { isLoading, historyData, serverError, recordCount, fetchData }
}
