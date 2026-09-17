/* istanbul ignore file */
'use client'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useDocumentContext } from '@/context'

export function useMermaid() {
    const { theme } = useTheme()
    const { fullWidth } = useDocumentContext()
    useEffect(() => {
        if (theme) {
            const mermaidBlocks = document.querySelectorAll('.mermaid')
            if (mermaidBlocks.length > 0) {
                import('mermaid').then(mermaid => {
                    mermaid.default.initialize({
                        startOnLoad: true,
                        theme: theme === 'dark' ? 'dark' : 'base'
                    })
                    mermaid.default.contentLoaded()
                })
            }
        }
    }, [theme, fullWidth])
}
