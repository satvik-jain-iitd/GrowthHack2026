/* istanbul ignore file */
'use client'
import { useState, useCallback } from 'react'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'
import { SeletedOptionsTypes } from '@/app/company-domains/types'

export const useAddEditOwner = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [addEditOwnerData, setAddEditOwnerData] = useState<Record<
        string,
        string
    > | null>(null)
    const [serverError, setServerError] = useState<Error | null>(null)

    const fetchData = useCallback(
        async (payload: SeletedOptionsTypes, domainId: string) => {
            setIsLoading(true)
            try {
                const resp = await fetchWithToken(
                    API_ENDPOINTS.ADD_EDIT_OWNER(domainId),
                    {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    }
                )
                if (!resp.ok) {
                    throw new Error(`HTTP error! status: ${resp.status}`)
                }
                const data = await resp.json()
                setAddEditOwnerData(data?.data)
                setIsLoading(false)
                setServerError(null)
            } catch (err) {
                setServerError(err as Error)
                setIsLoading(false)
            }
        },
        []
    )

    return {
        isLoading,
        addEditOwnerData,
        serverError,
        fetchData,
        setServerError
    }
}
