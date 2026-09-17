/* istanbul ignore file */
'use client'
import { useState } from 'react'
import { ARCHITECTURE_API_URL } from '@/constants'
import { ApiHistory } from '@/app/company-domains/types'
import { fetchWithToken } from '@/utils/client'

interface ApiResponse<T> {
    data: T
    message?: string
    status?: string
    title?: string
}

interface Status {
    status: string
    statusText: string
    title: string
}

export interface HistoryData {
    history: ApiHistory[]
    api_metadata_id: string
    api_endpoint_metadata_id: string
    expanded: boolean
    api_endpoint_metadata_type: string
}

export function useDomainApiHistoryList<T>(
    apiResource: string,
    options?: RequestInit
) {
    const host = `${ARCHITECTURE_API_URL}${apiResource}`
    const [data, setData] = useState<HistoryData[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | undefined>(undefined)
    const [status, setStatus] = useState<Status>({
        status: 'idle',
        statusText: '',
        title: ''
    })

    const fetchData = () => {
        setIsLoading(true)
        const request = options
            ? fetchWithToken(host, options)
            : fetchWithToken(host)
        request
            .then(response => response.json())
            .then((response: ApiResponse<T>) => {
                const { data, message, status, title } = response
                setStatus({
                    status: status || 'success',
                    statusText: message || '',
                    title: title || ''
                })
                setData(Array.isArray(data) ? data : [])
            })
            .catch(err => {
                console.error('Error fetching API list:', err)
                setError(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return { status, data, isLoading, error, fetchData }
}
