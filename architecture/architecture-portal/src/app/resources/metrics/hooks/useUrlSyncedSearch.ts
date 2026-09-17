/* istanbul ignore file */
'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Keeps a responsive text input in sync with a debounced URL param.
 *
 * `lastCommitted` is what lets Back win without fighting keystrokes: while
 * typing, the URL eventually catches up to a value we committed, so the reset
 * guard stays false and the input never jumps mid-word; on Back the URL becomes
 * a value we never committed, so the guard fires and cancels any pending write.
 *
 * It has to be a ref, not state: the router picks up a commit in a transition,
 * so a `setLastCommitted` would flush first and briefly pair the new committed
 * value with the old URL — firing the guard and wiping what was just typed.
 */
export function useUrlSyncedSearch(
    urlValue: string,
    commit: (value: string) => void,
    delay = 300
) {
    const [input, setInput] = useState(urlValue)
    const lastCommitted = useRef(urlValue)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    /* eslint-disable react-hooks/refs -- see above: a render-phase state
       sentinel would race the router transition and clobber the input */
    if (urlValue !== lastCommitted.current) {
        lastCommitted.current = urlValue
        if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
        }
        setInput(urlValue)
    }
    /* eslint-enable react-hooks/refs */

    const onChange = (value: string) => {
        setInput(value)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            timer.current = null
            lastCommitted.current = value
            commit(value)
        }, delay)
    }

    useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current)
        },
        []
    )

    return [input, onChange] as const
}
