/* istanbul ignore file */
'use client'
import { DEFAULT_DOCUMENT_WIDTH } from '@/constants'
import React, { createContext, useContext, useState, useMemo } from 'react'

type DocumentContextValue = {
    fullWidth: boolean
    maxWidth: number | string
    setLayout: (opts: {
        fullWidth?: boolean
        maxWidth?: number | string
    }) => void
}

const DocumentContext = createContext<DocumentContextValue | null>(null)

export function DocumentProvider({
    children,
    initialFullWidth = false,
    initialMaxWidth = DEFAULT_DOCUMENT_WIDTH
}: {
    children: React.ReactNode
    initialFullWidth?: boolean
    initialMaxWidth?: number | string
}) {
    const [fullWidth, setFullWidth] = useState(initialFullWidth)
    const [maxWidth, setMaxWidth] = useState<number | string>(initialMaxWidth)
    const setLayout = ({
        fullWidth: fw,
        maxWidth: mw
    }: {
        fullWidth?: boolean
        maxWidth?: number | string
    }) => {
        if (typeof fw !== 'undefined') setFullWidth(fw)
        if (typeof mw !== 'undefined') setMaxWidth(mw)
    }
    const value = useMemo(
        () => ({ fullWidth, maxWidth, setLayout }),
        [fullWidth, maxWidth]
    )
    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    )
}

export function useDocumentContext() {
    const ctx = useContext(DocumentContext)
    if (!ctx) {
        throw new Error(
            'useDocumentContext must be used within DocumentProvider'
        )
    }
    return ctx
}
