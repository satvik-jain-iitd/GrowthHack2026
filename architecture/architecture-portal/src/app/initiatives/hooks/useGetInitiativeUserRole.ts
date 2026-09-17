/* istanbul ignore file */
'use client'

import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { InitiativeUserRole } from '@/app/initiatives/components/consumer-api/ConsumerApiAdd.types'
import { fetchWithToken } from '@/utils/client'

export const useGetInitiativeUserRole = (
    initiativeId: string,
    emailId: string
) => {
    return useQuery<InitiativeUserRole, Error>({
        queryKey: ['initiativeUserRole', initiativeId, emailId],
        queryFn: async () => {
            const apiUrl = API_ENDPOINTS.GET_INITIATIVE_USER_ROLE(
                initiativeId,
                emailId
            )
            const res = await fetchWithToken(apiUrl)
            if (!res.ok) {
                throw new Error(
                    `Failed to fetch initiative user role: ${res.status} ${res.statusText}`
                )
            }
            const { data } = await res.json()
            const userRole: InitiativeUserRole = {
                isUnitCio: data.isUnitCio,
                isHeadEngineer: data.isHeadEngineer,
                isUcioDelegate: data.isUcioDelegate,
                isEnterpriseArchitect: data.isEnterpriseArchitect,
                isPrincipalArchitect: data.isPrincipalArchitect,
                isTechOwner: data.isTechOwner,
                isStatusReportOwner: data.isStatusReportOwner,
                isAdditionalArchitect: data.isAdditionalArchitect
            }
            return userRole
        },
        enabled: !!initiativeId && !!emailId
    })
}
