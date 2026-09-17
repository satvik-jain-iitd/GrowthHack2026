/* istanbul ignore file */
'use client'
import { useState, useEffect } from 'react'

/**
 * Custom hook to show a spinner after a delay
 * @param active - Boolean indicating whether the spinner should be active
 * @param delay - Delay in milliseconds before showing the spinner (default 150ms)
 * @returns Boolean indicating whether to show the spinner
 */
export function useDelayedSpinner(active: boolean, delay = 150) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        let cancelled = false
        let timeout: NodeJS.Timeout | null = null
        if (active) {
            console.log(
                '[useDelayedSpinner] active=true, will show spinner after',
                delay,
                'ms'
            )
            // Delay showing spinner to avoid flash
            timeout = setTimeout(() => {
                if (!cancelled && active) {
                    setShow(true)
                    console.log('[useDelayedSpinner] Spinner shown (delayed)')
                }
            }, delay)
        } else {
            // If done loading, hide spinner immediately
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShow(false)
            console.log(
                '[useDelayedSpinner] active=false, spinner hidden immediately'
            )
        }

        // Cleanup: prevent showing spinner after finished loading
        return () => {
            cancelled = true
            if (timeout) {
                clearTimeout(timeout)
                console.log('[useDelayedSpinner] Cleanup: timeout cleared')
            }
        }
    }, [active, delay])

    useEffect(() => {
        console.log('[useDelayedSpinner] show state changed:', show)
    }, [show])

    return show
}
