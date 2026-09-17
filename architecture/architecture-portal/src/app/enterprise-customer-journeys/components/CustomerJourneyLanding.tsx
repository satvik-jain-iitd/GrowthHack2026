'use client'
import { CustomerJourney, CustomerJourneyDetails } from '.'
import { useCustomerJourneys } from '@/app/business-architecture/hooks/useGetCustomerJourneys'
import Index from '@/app/docs/components/Index'

export const CustomerJourneyLanding = ({ id }: { id: string }) => {
    const { customer_journey } = useCustomerJourneys()
    const journey: CustomerJourney | undefined = customer_journey?.find(
        journey => journey.journey_id === id
    )

    return (
        <>
            {journey ? (
                <CustomerJourneyDetails journey={journey} />
            ) : id.length == 0 ? (
                <Index />
            ) : null}
        </>
    )
}
