/* istanbul ignore file */
'use client'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { useState } from 'react'

export const useEBCMLevels = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [ebcmLevelsData, setEBCMLevelsData] = useState()
    const [serverError, setServerError] = useState<string | null>(null)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const resp = await fetchWithToken(API_ENDPOINTS.GET_ALL_EBCM_LEVELS)
            const data = await resp?.json()

            setEBCMLevelsData(data.data)
            setIsLoading(false)
            setServerError(null)
        } catch (error) {
            setServerError(
                error instanceof Error ? error.message : String(error)
            )
            setIsLoading(false)
        }
    }

    return { isLoading, ebcmLevelsData, serverError, fetchData }
}
