import { API_ENDPOINTS } from '@/constants'
import { Playbook } from '@/types/Playbook'
import { fetchArchitecture } from './fetchArchitecture'

export const getPlaybooks = async (): Promise<Playbook[]> => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_PLAYBOOKS)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return Array.isArray(data) ? data : []
}

export const getPlaybook = async (id: string): Promise<Playbook> => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_PLAYBOOK_BY_ID(id))
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbook: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return data
}
