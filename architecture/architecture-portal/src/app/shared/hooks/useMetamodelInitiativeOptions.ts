import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface InitiativeListItem {
    initiativeId: string
    initiativeName: string
}

interface InitiativeListResponse {
    data: InitiativeListItem[]
    page: number
    pageSize: number
    total: number
}

export function useMetamodelInitiativeOptions() {
    return useQuery<{ label: string; value: string }[], Error>({
        queryKey: ['metamodel_initiative_options'],
        queryFn: async () => {
            const res = await fetchWithToken(
                `${API_ENDPOINTS.METAMODEL_LIST_INITIATIVES}?pageSize=100`
            )
            if (!res.ok) {
                throw new Error('Failed to fetch initiative options')
            }
            const json: InitiativeListResponse = await res.json()
            return json.data.map(i => ({
                label: i.initiativeName,
                value: i.initiativeId
            }))
        }
    })
}
