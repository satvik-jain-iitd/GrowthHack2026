/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { SidebarItem } from '@/types/SidebarItem'
import { fetchWithToken } from '@/utils/client'

export function useSidebar({
    path = '',
    playbook_id = '',
    playbook_type_id = '',
    isAdrs = false
}: {
    path?: string
    playbook_id?: string
    playbook_type_id?: string
    isAdrs?: boolean
} = {}) {
    return useQuery<SidebarItem[], Error>({
        queryKey: ['sidebar', path, playbook_id, playbook_type_id, isAdrs],
        queryFn: async () => {
            const res = await fetchWithToken(
                API_ENDPOINTS.GET_SIDEBAR_SECTION(
                    path,
                    playbook_id,
                    playbook_type_id,
                    isAdrs
                )
            )
            if (!res.ok) throw new Error('Failed to fetch sidebar')
            const { data } = await res.json()
            return data as SidebarItem[]
        },
        enabled: false
    })
}
