/* istanbul ignore file */

import { useEffect } from 'react'

const isTypingTarget = (element: Element | null) => {
    if (!element) return false
    const tag = element.tagName
    return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        (element as HTMLElement).isContentEditable
    )
}

export const useSearchHotkeys = (open: boolean, onOpen: () => void) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const withModifier = event.metaKey || event.ctrlKey
            const key = event.key.toLowerCase()

            if (withModifier && (key === 'k' || key === 'f')) {
                // Firefox binds Cmd+K to the address bar search.
                event.preventDefault()
                if (!open) onOpen()
                return
            }

            if (event.key === '/' && !withModifier && !event.altKey) {
                if (open) return
                if (isTypingTarget(document.activeElement)) return
                event.preventDefault()
                onOpen()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, onOpen])
}
