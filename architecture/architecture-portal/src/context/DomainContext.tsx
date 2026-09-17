/* istanbul ignore file */
'use client'
import React, { createContext, useContext } from 'react'
import { useGetDomains, useGetSubDomains } from '@/app/company-domains/hooks'
import { DomainContextType } from '@/app/company-domains/types'

const DataContext = createContext<DomainContextType | undefined>(undefined)

export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
    const { domains, loading, error } = useGetDomains()
    const {
        subDomains,
        loading: subDomainLoading,
        error: subDomainError
    } = useGetSubDomains()

    return (
        <DataContext.Provider
            value={{
                domains: domains || [],
                loading: loading,
                error: error,
                subDomains: subDomains || [],
                subDomainError: subDomainError,
                subDomainLoading: subDomainLoading
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useDomainContext = () => {
    return useContext(DataContext)
}
