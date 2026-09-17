/* istanbul ignore file */
import { API_ENDPOINTS } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'
import { fetchWithToken } from '@/utils/client'

export const CUSTOMER_JOURNEYS_QUERY_KEY = ['customer_journeys']

export const fetchCustomerJourneys = async (): Promise<CustomerJourney[]> => {
    const apiUrl = API_ENDPOINTS.GET_CUSTOMER_JOURNEYS
    const res = await fetchWithToken(apiUrl)
    if (!res.ok) {
        throw new Error(
            `Failed to fetch customer journeys list: ${res.status} ${res.statusText}`
        )
    }
    const customer_journey = await res.json()
    return Array.isArray(customer_journey) ? customer_journey : []
}

export const useCustomerJourneys = () => {
    const { data, isLoading, error } = useQuery<CustomerJourney[], Error>({
        queryKey: CUSTOMER_JOURNEYS_QUERY_KEY,
        queryFn: fetchCustomerJourneys
    })
    return { customer_journey: data, loading: isLoading, error }
}
