/* istanbul ignore file */
'use client'
import React, {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    useEffect
} from 'react'
import { useScrollContext } from '@/context'

interface TocProviderProps {
    toc: { level: number; text: string; anchor: string }[]
    children: React.ReactNode
}

interface TocContextType {
    activeId: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onTocClick: (e: React.MouseEvent<any>, id: string) => void
}

// Debounce time for scroll event to detect scroll end
const SCROLL_LISTENER_DEBOUNCE_MS = 150
// Fallback timeout to release lock if no scroll event fires
const SCROLL_DEFAULT_RELEASE_TIMEOUT_MS = 500
const TocContext = createContext<TocContextType | undefined>(undefined)

export function TocProvider({ toc, children }: TocProviderProps) {
    const [activeId, setActiveId] = useState<string | null>(null)
    // Prevents IntersectionObserver from updating activeId during smooth scroll
    const hashLockRef = useRef(false)
    const { scrollRef, scrollTo } = useScrollContext()

    /**
     * Locks hash-based highlight until scrolling stops.
     * - Sets hashLockRef to true to prevent IntersectionObserver highlight changes.
     * - Adds a scroll listener that debounces scroll events and releases the lock after scrolling ends.
     * - Uses a fallback timeout to release the lock if no scroll event fires (e.g., already at target).
     * - Tracks all timeouts and listeners for cleanup.
     */
    const scrollTimeoutsRef = useRef<NodeJS.Timeout[]>([])
    const scrollListenerRef = useRef<(() => void) | null>(null)
    const lockUntilScrollStops = useCallback(() => {
        hashLockRef.current = true
        // Clear any previous timeouts (in case of rapid navigation)
        scrollTimeoutsRef.current.forEach(tid => clearTimeout(tid))
        scrollTimeoutsRef.current = []
        // Debounced scroll handler
        const onScroll = () => {
            // Reset debounce timer on every scroll event
            scrollTimeoutsRef.current.forEach(tid => clearTimeout(tid))
            scrollTimeoutsRef.current = []
            const tid = setTimeout(() => {
                hashLockRef.current = false
                window.removeEventListener('scroll', onScroll)
                scrollListenerRef.current = null
            }, SCROLL_LISTENER_DEBOUNCE_MS)
            scrollTimeoutsRef.current.push(tid)
        }
        window.addEventListener('scroll', onScroll)
        scrollListenerRef.current = onScroll
        // Fallback: release lock if no scroll event fires within timeout
        const fallbackTid = setTimeout(() => {
            hashLockRef.current = false
            window.removeEventListener('scroll', onScroll)
            scrollListenerRef.current = null
        }, SCROLL_DEFAULT_RELEASE_TIMEOUT_MS)
        scrollTimeoutsRef.current.push(fallbackTid)
    }, [])

    /**
     * Handles TOC/heading click:
     * - Smoothly scrolls to heading
     * - Sets activeId for highlight
     * - Locks hash-based highlight until scroll stops
     */
    const onTocClick = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: React.MouseEvent<any>, id: string) => {
            e.preventDefault()
            window.history.replaceState(null, '', `#${id}`)
            const el = document.getElementById(id)
            if (el && scrollRef.current) {
                scrollTo(el.offsetTop - 80, { behavior: 'smooth' })
                setActiveId(id)
                lockUntilScrollStops()
            }
        },
        [lockUntilScrollStops, scrollRef, scrollTo]
    )

    useEffect(() => {
        // On initial load, scroll to hash and set activeId
        // Locks highlight until scroll stops
        if (window.location.hash) {
            const id = window.location.hash.slice(1)
            // Use requestAnimationFrame to ensure DOM is ready after hydration
            requestAnimationFrame(() => {
                const el = document.getElementById(id)
                if (el && scrollRef.current) {
                    scrollTo(el.offsetTop - 80, { behavior: 'smooth' })
                    setActiveId(id)
                    lockUntilScrollStops()
                }
            })
        }

        /**
         * IntersectionObserver:
         * - Observes all headings in TOC
         * - Updates activeId to the first visible heading (unless hashLockRef is set)
         * - rootMargin/threshold configures when headings are considered visible
         */
        const observer = new IntersectionObserver(
            entries => {
                if (hashLockRef.current) return // Don't update highlight during scroll lock
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
                    )
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id)
                }
            },
            {
                rootMargin: '0px 0px -70% 0px',
                threshold: 0
            }
        )

        toc.forEach(item => {
            const el = document.getElementById(item.anchor)
            if (el) observer.observe(el)
        })

        // Cleanup: disconnect observer, clear timeouts, remove scroll listeners
        return () => {
            if (observer) observer.disconnect()
            scrollTimeoutsRef.current.forEach(tid => clearTimeout(tid))
            scrollTimeoutsRef.current = []
            if (scrollListenerRef.current) {
                window.removeEventListener('scroll', scrollListenerRef.current)
                scrollListenerRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toc, lockUntilScrollStops])

    return (
        <TocContext.Provider value={{ activeId, onTocClick }}>
            {children}
        </TocContext.Provider>
    )
}

export function useTocContext() {
    const ctx = useContext(TocContext)
    if (!ctx) throw new Error('useTocContext must be used within TocProvider')
    return ctx
}
