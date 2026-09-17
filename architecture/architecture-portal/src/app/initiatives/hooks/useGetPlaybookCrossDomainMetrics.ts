/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import {
    EtpEcmiCrossDomainApiResponse,
    EtpEcmiCrossDomainApiRow
} from '@/app/resources/metrics/types/EtpEcmiCrossDomainApi'
import { fetchWithToken } from '@/utils/client'

export function useGetPlaybookCrossDomainMetrics(
    playbookId: string | undefined
) {
    const query = useQuery({
        queryKey: ['playbookCrossDomainMetrics', playbookId],
        enabled: !!playbookId,
        queryFn: async (): Promise<EtpEcmiCrossDomainApiRow | undefined> => {
            const res = await fetchWithToken(
                API_ENDPOINTS.GET_PLAYBOOK_CROSS_DOMAIN_METRICS(playbookId!),
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (!res.ok) {
                const errorData = await res.json()
                console.log(
                    `Failed to get Cross-Domain metrics: ${errorData.message || res.statusText}`,
                    {
                        isGetPlaybookCrossDomainMetricsError: true
                    }
                )
                throw new Error(
                    errorData.message || 'Failed to get Cross-Domain metrics'
                )
            }
            const response: {
                data: EtpEcmiCrossDomainApiResponse
                success: boolean
            } = await res.json()
            return response.data?.initiatives?.[0]
        }
    })
    return { ...query, refresh: query.refetch }
}
