/* istanbul ignore file */
'use client'
import { useDelayedSpinner } from '@/hooks'
import { useNavigationContext } from '@/context'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const NAVIGATION_TRANSITION_DELAY_MS = 200

/**
 * NavigationTransition displays a loading spinner when navigation is in progress.
 * - Waits 200ms before showing the spinner to avoid flashing on fast navigations.
 * - Hides the spinner immediately when navigation ends.
 * - Uses navigation state from context (isNavigating).
 * @returns LoadingSpinner component during navigation, otherwise null.
 */
export default function NavigationTransition() {
    const { isNavigating } = useNavigationContext()
    const show = useDelayedSpinner(isNavigating, NAVIGATION_TRANSITION_DELAY_MS)
    if (!show) return null
    return <LoadingSpinner />
}
