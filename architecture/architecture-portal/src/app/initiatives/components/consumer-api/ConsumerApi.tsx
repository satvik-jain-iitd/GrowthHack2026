/* istanbul ignore file */

'use client'

import { VStack } from '@chakra-ui/react'
import { ConsumerApiHeader } from './ConsumerApiHeader'
import { usePlaybook } from '@/hooks'
import { useState } from 'react'
import { ConsumerApiAdd } from './ConsumerApiAdd'
import { ConsumerApiTable } from './ConsumerApiTable'
import {
    useGetInitiativeConsumerApi,
    useGetInitiativeUserRole,
    useGetPlaybookCrossDomainMetrics
} from '@/app/initiatives/hooks'
import { useGetDomains } from '@/app/company-domains/hooks/useGetDomains'
import { useUserContext } from '@/context/UserContext'
import { useUserDetails } from '@/app/company-domains/hooks/useUserDetails'

export function ConsumerApi({
    playbookId
}: {
    playbookId: string | undefined
}) {
    const { data: playbook } = usePlaybook(playbookId || '')
    const { domains } = useGetDomains()
    const {
        data: consumerApis,
        isLoading: isTableDataLoading,
        refetch: refetchConsumerApis
    } = useGetInitiativeConsumerApi(playbookId)
    const { data: crossDomainMetrics, isLoading: isMetricsLoading } =
        useGetPlaybookCrossDomainMetrics(playbookId)
    const [isAdd, setIsAdd] = useState(false)
    const userContext = useUserContext()
    const { isAdmin } = useUserDetails()
    const { data: userRole } = useGetInitiativeUserRole(
        playbookId || '',
        userContext?.attributes?.email || ''
    )
    const isUserAuthorizedToEdit =
        isAdmin ||
        userRole?.isUnitCio ||
        userRole?.isHeadEngineer ||
        userRole?.isUcioDelegate ||
        userRole?.isEnterpriseArchitect ||
        userRole?.isPrincipalArchitect ||
        userRole?.isTechOwner ||
        userRole?.isStatusReportOwner ||
        userRole?.isAdditionalArchitect ||
        false

    const handleAdd = (value: boolean) => {
        setIsAdd(value)
    }

    return (
        <VStack w='100%' gap={0}>
            <ConsumerApiHeader
                playbook={playbook}
                isAdd={isAdd}
                handleAdd={handleAdd}
                isUserAuthorizedToEdit={isUserAuthorizedToEdit}
                metrics={crossDomainMetrics}
                isMetricsLoading={isMetricsLoading}
            />
            {isAdd && isUserAuthorizedToEdit && (
                <ConsumerApiAdd
                    isAdd={isAdd}
                    playbook={playbook}
                    handleAdd={handleAdd}
                    domains={domains}
                    refetchConsumerApis={refetchConsumerApis}
                />
            )}
            <ConsumerApiTable
                data={consumerApis}
                isLoading={isTableDataLoading}
                refetch={refetchConsumerApis}
                domains={domains}
                playbookId={playbookId}
                isUserAuthorizedToEdit={isUserAuthorizedToEdit}
            />
        </VStack>
    )
}
