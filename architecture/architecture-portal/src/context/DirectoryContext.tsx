/* istanbul ignore file */
'use client'
import { ApiMetadata } from '@/app/company-domains/types/apiEndpoints'
import { DirectoryContextType } from '@/app/directory/types/DirectoryContextType'
import React, { createContext, useContext, useState } from 'react'

const DirectoryContext = createContext<DirectoryContextType>({
    setPage: () => {},
    page: 1,
    setSelectedOption: () => {},
    selectedOption: 0,
    applicationExpandedIndex: null,
    setApplicationExpandedIndex: () => {},
    apiData: [] as ApiMetadata[],
    setCompanyDomainApiData: () => {}
})

export const DirectoryProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [selectedOption, setSelectedOption] = useState(0)
    const [page, setPage] = useState(1)
    const [applicationExpandedIndex, setApplicationExpandedIndex] = useState<
        number | null
    >(null)
    const [apiData, setApiData] = useState<ApiMetadata[]>([])
    const setCompanyDomainApiData = (data: ApiMetadata[]) => {
        setApiData(data)
    }

    return (
        <DirectoryContext.Provider
            value={{
                selectedOption: selectedOption,
                applicationExpandedIndex: applicationExpandedIndex,
                setApplicationExpandedIndex: setApplicationExpandedIndex,
                setSelectedOption: setSelectedOption,
                page: page,
                setPage: setPage,
                apiData: apiData,
                setCompanyDomainApiData: setCompanyDomainApiData
            }}
        >
            {children}
        </DirectoryContext.Provider>
    )
}

export const useDirectoryContext = () => {
    return useContext(DirectoryContext)
}
