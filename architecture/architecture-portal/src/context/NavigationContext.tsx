/* istanbul ignore file */
'use client'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import { usePathname } from 'next/navigation'
import { trackPage } from '@/utils/client'

type NavigationContextValue = {
    isNavigating: boolean
    startNavigation: (nextPath: string) => void
    endNavigation: () => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

/**
 * NavigationProvider tracks navigation state for the app.
 * It exposes isNavigating, startNavigation, and endNavigation via context.
 *
 * - Listens for changes in pathname (Next.js navigation)
 * - When the URL changes, it automatically calls endNavigation()
 * - startNavigation() must be called manually (e.g., from NoPrefetchLink or useNavigation)
 * - Useful for showing loading indicators or blocking UI during navigation
 */
export function NavigationProvider({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isNavigating, setIsNavigating] = useState(false)
    const lastUrlRef = useRef<string | null>(null)

    // Manually start navigation (sets isNavigating to true)
    const startNavigation = useCallback(
        (nextPath: string) => {
            // Only start navigation if the intended path is different
            if (nextPath !== pathname) {
                setIsNavigating(true)
                console.log(
                    '[NavigationProvider] startNavigation: isNavigating=true, nextPath=',
                    nextPath
                )
            } else {
                console.log(
                    '[NavigationProvider] startNavigation: nextPath is same as current, no state change'
                )
            }
        },
        [pathname]
    )

    // Manually end navigation (sets isNavigating to false)
    const endNavigation = useCallback(() => {
        setIsNavigating(false)
        console.log('[NavigationProvider] endNavigation: isNavigating=false')
    }, [])

    // Listen for URL changes and update navigation state
    useEffect(() => {
        const prevUrl = lastUrlRef.current
        const hasChanged = prevUrl !== null && prevUrl !== pathname

        lastUrlRef.current = pathname

        // If this is the first load or the URL changed, track the page
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).__trackPageLoad || hasChanged) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any).__trackPageLoad = true
            trackPage()
        }

        // If the URL changed, reset isNavigating to false
        if (hasChanged) {
            console.log(
                '[NavigationProvider] pathname changed:',
                prevUrl,
                '->',
                pathname,
                '| Calling endNavigation()'
            )
            // eslint-disable-next-line react-hooks/set-state-in-effect
            endNavigation()
        } else {
            console.log(
                '[NavigationProvider] pathname did not change:',
                pathname
            )
        }
    }, [pathname, endNavigation])

    // Listen for browser back/forward navigation and bfcache restores
    useEffect(() => {
        console.log(
            '[NavigationProvider] MOUNTED (popstate/pageshow listeners added)'
        )
        const handlePopState = () => {
            console.log('[NavigationProvider] popstate event')
            endNavigation()
        }
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                console.log(
                    '[NavigationProvider] pageshow (bfcache restore): resetting navigation state'
                )
                endNavigation()
            }
        }
        window.addEventListener('popstate', handlePopState)
        window.addEventListener('pageshow', handlePageShow)
        return () => {
            console.log(
                '[NavigationProvider] UNMOUNTED (popstate/pageshow listeners removed)'
            )
            window.removeEventListener('popstate', handlePopState)
            window.removeEventListener('pageshow', handlePageShow)
        }
    }, [endNavigation])

    // Memoize context value to avoid unnecessary re-renders
    const value = useMemo(
        () => ({
            isNavigating,
            startNavigation,
            endNavigation
        }),
        [isNavigating, startNavigation, endNavigation]
    )

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    )
}

// Hook to access navigation context
export function useNavigationContext() {
    const ctx = useContext(NavigationContext)
    if (!ctx) {
        throw new Error(
            'useNavigationContext must be used within NavigationProvider'
        )
    }
    return ctx
}
