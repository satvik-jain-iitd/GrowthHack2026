import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

interface PlaybookItem {
    playbook_id: string
    playbook_name: string
}

interface PlaybookType {
    playbook_type_id: string
    playbook_type_nm: string
    playbooks: PlaybookItem[]
}

export interface PlaybookOption {
    label: string
    value: string
}

export const PLAYBOOK_TYPES_GENAI_QUERY_KEY = ['playbookTypesGenAi']

async function fetchPlaybookTypesGenAi(): Promise<PlaybookOption[]> {
    const res = await fetchWithToken(API_ENDPOINTS.GET_PLAYBOOK_TYPES_GENAI)
    if (!res.ok) {
        throw new Error(`Failed to fetch genai playbook types: ${res.status}`)
    }
    const data: PlaybookType[] = await res.json().then(res => res.data)
    return data.flatMap(type =>
        type.playbooks.map(pb => ({
            label: pb.playbook_name,
            value: pb.playbook_id
        }))
    )
}

export function usePlaybookTypesGenAi() {
    return useQuery<PlaybookOption[]>({
        queryKey: PLAYBOOK_TYPES_GENAI_QUERY_KEY,
        queryFn: fetchPlaybookTypesGenAi
    })
}
