/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants'
import { Markets } from '../types'
import { fetchWithToken } from '@/utils/client'

export const useSaveApiData = () => {
    const mutation = useMutation({
        mutationFn: async ({
            isApiFormEnabled,
            requestBody
        }: {
            isApiFormEnabled: boolean
            requestBody: {
                pageLink?: string
                api_metadata_id: string | null
                api_nm?: string
                api_ds?: string
                prvd_company_domain_id?: string[]
                consm_company_domain_id?: string[]
                prim_company_domain_id?: string
                prvd_company_sub_domain_id?: string[]
                consm_company_sub_domain_id?: string[] | null
                prim_company_sub_domain_id?: string | null
                ebcm_da?: (string | undefined)[]
                co_editors?: string[]
                add_da?: {
                    api_resource?: string
                    architecturePortalUrl?: string
                    slas?: {
                        response_time: string
                        average_rps: string
                        peak_rps: string
                        error_rate: string
                        availability: string
                    }
                }
                action_type?: string
                api_endpoint_metadata_id?: string
                endpoint_operation?: string
                input?: string
                output?: string
                endpoint_type?: string
                endpoint_style?: string
                journey_link?: string
                intended_markets?: Markets[]
                actual_markets?: Markets[]
                endpoint_ds?: string
                consm_co_dmn_da?: string[]
            }
        }) => {
            const apiUrl = isApiFormEnabled
                ? API_ENDPOINTS.DOMAINS_API
                : API_ENDPOINTS.DOMAINS_API_ENDPOINT

            const res = await fetchWithToken(apiUrl, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' as RequestCredentials
            })

            return res
        }
    })
    return mutation
}
