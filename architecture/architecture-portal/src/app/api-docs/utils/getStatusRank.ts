import {
    STATUS_RANK,
    STATUS_RANK_DEFAULT
} from '@/app/api-docs/constants/search'
import { statusKeyMap } from '@/app/company-domains/components/LandingPage/Status'

// Ranked through the same map the badge renders with, so the sort order and
// the displayed label can never disagree.
export const getStatusRank = (status?: string): number => {
    const key =
        statusKeyMap[status?.trim().toUpperCase() as keyof typeof statusKeyMap]
    return STATUS_RANK[key] ?? STATUS_RANK_DEFAULT
}
