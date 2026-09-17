/* istanbul ignore file */
'use client'
import { useRouter } from 'next/navigation'
import { useNavigationContext } from '@/context'

/**
 * useNavigation hook wraps Next.js router navigation methods.
 * - Calls startNavigation before push/replace to trigger navigation state.
 * - Exposes push, replace, and endNavigation for manual control.
 * - Use this hook for all programmatic navigation to ensure navigation state is tracked.
 */
export function useNavigation() {
    const router = useRouter()
    const { startNavigation, endNavigation } = useNavigationContext()

    const push = (path: string) => {
        startNavigation(path)
        router.push(path)
    }

    const replace = (path: string) => {
        startNavigation(path)
        router.replace(path)
    }

    return {
        push,
        replace,
        endNavigation
    }
}
