/* istanbul ignore file */
'use client'
import React, { createContext, useContext, useRef, useCallback } from 'react'

interface ScrollContextType {
    scrollRef: React.RefObject<HTMLDivElement | null>
    scrollTo: (y: number, options?: ScrollToOptions) => void
    getScrollY: () => number
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export function ScrollProvider({ children }: { children: React.ReactNode }) {
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const scrollTo = useCallback((y: number, options?: ScrollToOptions) => {
        const el = scrollRef.current
        if (el) {
            el.scrollTo({ top: y, behavior: options?.behavior || 'smooth' })
        }
    }, [])

    const getScrollY = useCallback(() => {
        const el = scrollRef.current
        return el ? el.scrollTop : 0
    }, [])

    return (
        <ScrollContext.Provider value={{ scrollRef, scrollTo, getScrollY }}>
            {children}
        </ScrollContext.Provider>
    )
}

export function useScrollContext() {
    const ctx = useContext(ScrollContext)
    if (!ctx)
        throw new Error('useScrollContext must be used within ScrollProvider')
    return ctx
}
