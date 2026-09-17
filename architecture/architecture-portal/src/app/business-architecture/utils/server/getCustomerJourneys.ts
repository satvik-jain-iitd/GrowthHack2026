import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

export const getCustomerJourneys = async (): Promise<CustomerJourney[]> => {
    const res = await fetchArchitecture(API_ENDPOINTS.GET_CUSTOMER_JOURNEYS)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch customer journeys list: ${res.status} ${res.statusText}`
        )
    }
    const customer_journey = await res.json()
    return Array.isArray(customer_journey) ? customer_journey : []
}
