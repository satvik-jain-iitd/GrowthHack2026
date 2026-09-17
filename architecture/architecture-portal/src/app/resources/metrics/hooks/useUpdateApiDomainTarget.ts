/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_DOMAIN_TARGETS_QUERY_KEY } from './useGetApiDomainTargets'
import { fetchWithToken } from '@/utils/client'

interface UpdateApiDomainTargetParams {
    company_domain_id: string
    domainApiTarget: number
}

const updateApiDomainTarget = async (
    params: UpdateApiDomainTargetParams
): Promise<{
    data?: { company_domain_id?: string; domainapitarget?: string | number }
}> => {
    const response = await fetchWithToken(
        API_ENDPOINTS.UPDATE_API_DOMAIN_TARGET,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(params)
        }
    )
    if (!response.ok) {
        throw new Error('Failed to update target')
    }
    return response.json()
}

export const useUpdateApiDomainTarget = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateApiDomainTarget,
        onSuccess: (payload, variables) => {
            const updatedDomainId =
                payload?.data?.company_domain_id || variables.company_domain_id
            const updatedTarget = Number(payload?.data?.domainapitarget)
            const resolvedTarget = Number.isFinite(updatedTarget)
                ? updatedTarget
                : variables.domainApiTarget

            queryClient.setQueryData<Record<string, number>>(
                API_DOMAIN_TARGETS_QUERY_KEY,
                (prev = {}) => ({
                    ...prev,
                    [updatedDomainId]: resolvedTarget
                })
            )
        }
    })
}
