/* istanbul ignore file */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { Playbook } from '@/types/Playbook'
import { OnboardingRequestPlaybook } from '@/app/onboarding-form/types'
import { fetchWithToken } from '@/utils/client'

export const PLAYBOOKS_QUERY_KEY = ['playbooks']

export const fetchPlaybooks = async (): Promise<Playbook[]> => {
    const apiUrl = API_ENDPOINTS.GET_PLAYBOOKS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbooks: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return Array.isArray(data) ? data : []
}

export const usePlaybooks = () => {
    const { data, isLoading, error } = useQuery<Playbook[]>({
        queryKey: PLAYBOOKS_QUERY_KEY,
        queryFn: fetchPlaybooks
    })

    return { playbooks: data ?? [], loading: isLoading, error }
}

export const PLAYBOOK_QUERY_KEY = (id: string) => ['playbook', id]

export const fetchPlaybook = async (id: string): Promise<Playbook> => {
    const apiUrl = API_ENDPOINTS.GET_PLAYBOOK_BY_ID(id)
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch playbook: ${res.status} ${res.statusText}`
        )
    }
    const { data } = await res.json()
    return data
}

export function usePlaybook(playbookId: string) {
    return useQuery<Playbook, Error>({
        queryKey: PLAYBOOK_QUERY_KEY(playbookId),
        queryFn: () => fetchPlaybook(playbookId),
        enabled: !!playbookId
    })
}

export function useCreatePlaybook() {
    const mutation = useMutation({
        mutationFn: async (playbook: OnboardingRequestPlaybook) => {
            const res = await fetchWithToken(API_ENDPOINTS.POST_PLAYBOOK_V2, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...playbook })
            })
            if (!res.ok) {
                throw new Error('Failed to create playbook')
            }
            return await res.json()
        }
    })
    return mutation
}

export function useUpdatePlaybook() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            playbook_id,
            ...properties
        }: Partial<Playbook>) => {
            const res = await fetchWithToken(API_ENDPOINTS.POST_PLAYBOOK_V2, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playbook_id, ...properties })
            })

            if (!res.ok) {
                throw new Error('Failed to update playbook')
            }

            if (playbook_id) {
                await queryClient.invalidateQueries({
                    queryKey: PLAYBOOK_QUERY_KEY(playbook_id)
                })
            }

            const { data } = await res.json()
            return data
        }
    })
}
