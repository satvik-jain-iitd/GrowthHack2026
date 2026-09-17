import { API_ENDPOINTS, PLAYBOOK_TYPE_IDS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import type { Playbook } from '@/types/Playbook'

export const getBvBPlaybooks = async (): Promise<Playbook[]> => {
    const res = await fetchArchitecture(
        API_ENDPOINTS.GET_PLAYBOOKS_BY_TYPE(PLAYBOOK_TYPE_IDS.BUILD_VS_BUY)
    )
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
}
