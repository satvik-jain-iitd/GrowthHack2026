/* istanbul ignore file */
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { ECJChangeModalSubmitPayload } from '@/app/enterprise-customer-journeys/components/ECJChangeModal'
import { useSubmitECJChangeRequest } from './useSubmitECJChangeRequest'

export function useSubmitECJChangeModalRequest() {
    const { mutateAsync: submitECJChangeRequest, isPending: isSubmitting } =
        useSubmitECJChangeRequest()

    const handleSubmitECJChangeModal = useCallback(
        async ({
            values,
            displayName,
            userPrincipalName,
            journeyStatement,
            journeyDesc
        }: ECJChangeModalSubmitPayload) => {
            try {
                await submitECJChangeRequest({
                    requesterName: displayName,
                    requesterEmail: userPrincipalName,
                    changeDetails: values.changeDetails,
                    journeyStatement,
                    journeyDesc
                })
                toast.success(
                    'Your change request has been submitted. The ECJ team has been notified and will follow up shortly.'
                )
            } catch (error) {
                toast.error('Something went wrong. Please try again.')
                throw error instanceof Error
                    ? error
                    : new Error('ECJ change request submission failed')
            }
        },
        [submitECJChangeRequest]
    )

    return {
        handleSubmitECJChangeModal,
        isSubmitting
    }
}
