/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

export const UNIT_CIO_QUERY_KEY = ['unitCIO']

const fetchUnitCIOs = async () => {
    const apiUrl = API_ENDPOINTS.GET_UNIT_CIOS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch Unit CIOs: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return json.data || []
}

export const useGetUnitCioData = () => {
    const { data } = useQuery({
        queryKey: UNIT_CIO_QUERY_KEY,
        queryFn: fetchUnitCIOs
    })

    return { data }
}
