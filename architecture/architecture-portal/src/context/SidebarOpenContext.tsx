/* istanbul ignore file */
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarOpenContextType {
    sidebarOpen: boolean
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    toggleSidebar: () => void
}

const SidebarOpenContext = createContext<SidebarOpenContextType | undefined>(
    undefined
)

export function useSidebarOpen() {
    const context = useContext(SidebarOpenContext)
    if (!context) {
        throw new Error(
            'useSidebarOpen must be used within a SidebarOpenProvider'
        )
    }
    return context
}

export function SidebarOpenProvider({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setSidebarOpen(open => !open)
    }

    return (
        <SidebarOpenContext.Provider
            value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}
        >
            {children}
        </SidebarOpenContext.Provider>
    )
}
