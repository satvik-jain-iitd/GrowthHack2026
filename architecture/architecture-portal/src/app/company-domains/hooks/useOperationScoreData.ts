/* istanbul ignore file */
'use client'
import { API_ENDPOINTS } from '@/constants'
import { useState } from 'react'
import { fetchWithToken } from '@/utils/client'

export const useOperationScoreData = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [apiScoreData, setApiScoreData] = useState()
    const [serverError, setServerError] = useState<string | null>(null)

    const fetchData = async (domainId: string, operationId: string) => {
        setIsLoading(true)
        try {
            const resp = await fetchWithToken(
                API_ENDPOINTS.OPERATION_SCORE_DATA(domainId, operationId)
            )
            const data = await resp?.json()

            setApiScoreData(data)
            setIsLoading(false)
            setServerError(null)
        } catch (error) {
            setServerError(
                error instanceof Error ? error.message : String(error)
            )
            setIsLoading(false)
        }
    }

    return { isLoading, apiScoreData, serverError, fetchData }
}
