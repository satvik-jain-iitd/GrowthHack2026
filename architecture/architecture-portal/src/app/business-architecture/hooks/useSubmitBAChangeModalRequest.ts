import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { BAChangeModalSubmitPayload } from '@/app/business-architecture/components/BAChangeModal'
import { useSubmitBAChangeRequest } from '@/app/business-architecture/hooks/useSubmitBAChangeRequest'

export function useSubmitBAChangeModalRequest(teamName: string = 'EBA') {
    const { mutateAsync: submitBAChangeRequest, isPending: isSubmitting } =
        useSubmitBAChangeRequest()

    const handleSubmitBAChangeModal = useCallback(
        async ({
            values,
            displayName,
            userPrincipalName
        }: BAChangeModalSubmitPayload) => {
            try {
                await submitBAChangeRequest({
                    requesterName: displayName,
                    requesterEmail: userPrincipalName,
                    changeType: values.changeType,
                    capabilityKeyTx: values.capabilityKeyTx,
                    capabilityName: values.capabilityName,
                    impactedCustomerSegment: values.impactedCustomerSegment,
                    associatedSystems: values.associatedSystems,
                    impactedMarkets: values.impactedMarkets,
                    impactedAmexProducts: values.impactedAmexProducts,
                    impactedChannels: values.impactedChannels,
                    customerJourneyContext: values.customerJourneyContext,
                    additionalInformation: values.additionalInformation
                })
                toast.success(
                    `Your change request has been submitted. The ${teamName} team has been notified and will follow up shortly.`
                )
            } catch (error) {
                toast.error('Something went wrong. Please try again.')
                throw error instanceof Error
                    ? error
                    : new Error(`${teamName} change request submission failed`)
            }
        },
        [submitBAChangeRequest, teamName]
    )

    return {
        handleSubmitBAChangeModal,
        isSubmitting
    }
}
