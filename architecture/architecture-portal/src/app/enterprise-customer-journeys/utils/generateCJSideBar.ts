/* istanbul ignore file */
import { SidebarItem } from '@/types/SidebarItem'
import { JOURNEY_GROUP_ORDER } from '@/app/enterprise-customer-journeys/constants'
import { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

/**
 * Generates a sidebar from the customer journey JSON data.
 * Groups are ordered by JOURNEY_GROUP_ORDER; unknown groups are appended alphabetically.
 * URLs use the flat route: /{baseRoute}/{journey_id} (no group segment).
 *
 * @param baseRoute - e.g. 'enterprise-customer-journeys'
 * @param currentJourneyId - the active journey_id, used to auto-expand the correct group
 */
export function getCJSidebarFromJson(
    baseRoute: string,
    customer_journey: CustomerJourney[],
    currentJourneyId?: string
): SidebarItem[] {
    const filteredJourneys = customer_journey.filter(
        journey => !journey.user_proposed
    )
    // 1. Group journeys by journey_grp_tx
    const groupMap = new Map<string, CustomerJourney[]>()
    for (const journey of filteredJourneys) {
        const group = journey.journey_grp_tx
        if (!groupMap.has(group)) groupMap.set(group, [])
        groupMap.get(group)!.push(journey)
    }

    // 2. Sort groups: configured order first, unknown groups appended alphabetically
    const knownGroups = JOURNEY_GROUP_ORDER.filter(g => groupMap.has(g))
    const unknownGroups = [...groupMap.keys()]
        .filter(g => !JOURNEY_GROUP_ORDER.includes(g))
        .sort()
    const orderedGroups = [...knownGroups, ...unknownGroups]

    // 3. Build SidebarItem[] — one folder per group, one file per journey
    return orderedGroups.map(group => {
        const journeys = groupMap.get(group)!
        const isExpanded = journeys.some(j => j.journey_id === currentJourneyId)

        return {
            type: 'folder',
            name: group,
            expanded: isExpanded,
            children: journeys.map(j => ({
                type: 'file' as const,
                name: j.journey_statement,
                href: `/${baseRoute}/${j.journey_id}`,
                expanded: false
            }))
        } satisfies SidebarItem
    })
}
