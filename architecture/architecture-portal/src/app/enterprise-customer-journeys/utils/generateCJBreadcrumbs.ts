/* istanbul ignore file */
import { NavLink } from '@/types/NavLink'
import { CustomerJourney } from '../components'

/**
 * Generates breadcrumbs from the customer journey JSON data.
 * Returns: [{ label: group, href: /{baseRoute} }, { label: journey_statement }]
 *
 * @param baseRoute - e.g. 'enterprise-customer-journeys'
 * @param journeyId - the active journey_id to look up
 */
export function getCJBreadcrumbsFromJson(
    baseRoute: string,
    journeyId: string,
    customerJourneys: CustomerJourney[]
): NavLink[] {
    const journey = customerJourneys.find(j => j.journey_id === journeyId)

    if (!journey) return []

    return [
        {
            label: journey.journey_grp_tx,
            href: `/${baseRoute}`
        },
        {
            label: journey.journey_statement,
            href: `/${baseRoute}/${journey.journey_id}`
        }
    ]
}
