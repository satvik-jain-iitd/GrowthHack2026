/* istanbul ignore file */
'use client'
import React, { createContext, useState, useContext } from 'react'

type NavbarContextType = {
    slug: string | undefined
    setSlug: (_: string | undefined) => void
    label: string | undefined
    setLabel: (_: string | undefined) => void
    hidden: boolean
    setHidden: (_: boolean) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export function NavbarProvider({ children }: { children: React.ReactNode }) {
    const [slug, setSlug] = useState<string | undefined>(undefined)
    const [label, setLabel] = useState<string | undefined>(undefined)
    const [hidden, setHidden] = useState(false)

    return (
        <NavbarContext.Provider
            value={{ slug, setSlug, label, setLabel, hidden, setHidden }}
        >
            {children}
        </NavbarContext.Provider>
    )
}

export function useNavbarContext() {
    const ctx = useContext(NavbarContext)
    if (!ctx)
        throw new Error('useNavbarContext must be used within NavbarProvider')
    return ctx
}

export function NavbarTypeSetter({
    slug,
    label
}: {
    slug?: string
    label?: string
}) {
    const { setSlug, setLabel } = useNavbarContext()
    React.useEffect(() => {
        setSlug(slug)
        setLabel(label)
        return () => {
            setSlug(undefined)
            setLabel(undefined)
        }
    }, [slug, label, setSlug, setLabel])
    return null
}

/** Hides the global navbar while the component is mounted. */
export function NavbarHider() {
    const { setHidden } = useNavbarContext()
    React.useEffect(() => {
        setHidden(true)
        return () => setHidden(false)
    }, [setHidden])
    return null
}
