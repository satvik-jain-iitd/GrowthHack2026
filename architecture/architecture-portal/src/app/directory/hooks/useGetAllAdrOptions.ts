/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { fetchWithToken } from '@/utils/client'

export const ADR_ALL_QUERY_KEY = ['allAdrOptions']

export const fetchAllAdrOptions = async (): Promise<
    {
        adr_nm: string
        adr_mtda_id: string
    }[]
> => {
    const apiUrl = API_ENDPOINTS.GET_ALL_ADR
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch adr counts: ${res.status} ${res.statusText}`
        )
    }
    const data = await res.json()
    return data
}

export const useGetAllAdrOptions = () => {
    const { data, isLoading, error } = useQuery<
        {
            adr_nm: string
            adr_mtda_id: string
        }[]
    >({
        queryKey: ADR_ALL_QUERY_KEY,
        queryFn: () => fetchAllAdrOptions()
    })

    return { adrOptions: data, loading: isLoading, error }
}
