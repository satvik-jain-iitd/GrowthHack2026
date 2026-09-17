'use client'
import React, { useEffect, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import DomainApiHeader from '@/app/company-domains/components/DomainAPIs/DomainApiHeader'
import DomainApiSearchableTable from '@/app/company-domains/components/LandingPage/DomainApiSearchableTable'
import {
    ApiEndpoint,
    ApiMetadata,
    CapabilitiesTree,
    Domain,
    SubDomain,
    ResponseCount
} from '@/app/company-domains/types'
import {
    useDomainApiWithEndpointDetails,
    useEBCMLevels
} from '@/app/company-domains/hooks'
import { useUserContext } from '@/context/UserContext'
import { User } from '@/app/layout/AuthBlueSso'
import { DomainApiAddItem } from '@/app/company-domains/components/DomainAPIs/DomainApiAddItem'

export default function DomainApiPage({
    domainMetadata,
    statusCount,
    companyDomains,
    companySubDomains
}: {
    domainMetadata: Domain | undefined
    statusCount: ResponseCount
    companyDomains: Domain[]
    companySubDomains: SubDomain[]
}) {
    const domainId = domainMetadata?.company_domain_id || ''
    const domainName = domainMetadata?.domain_nm || ''

    const [isAdd, setIsAdd] = useState(false)
    const [isEditRow, setIsEditRow] = useState({
        api_id: '',
        api_data: {} as ApiEndpoint & ApiMetadata,
        api_nm: '',
        isApiEdit: false
    })
    const [isValuesChanged, setIsValuesChanged] = useState(false)
    const [refreshApiData, setRefreshApiData] = useState(0)
    const user: User | undefined = useUserContext()

    useEffect(() => {
        if (isAdd || isEditRow) {
            // Scroll to the apiForm row
            const apiFormRow = document.getElementById('apiFormRow')
            if (apiFormRow) {
                apiFormRow.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }
        }
    }, [isAdd, isEditRow])

    const { fetchData: getEBCMLevels, ebcmLevelsData } = useEBCMLevels()

    useEffect(() => {
        if (user?.attributes?.email) {
            getEBCMLevels()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { refresh: refreshApiEndpointData } =
        useDomainApiWithEndpointDetails(domainId)

    useEffect(() => {
        if (refreshApiData) {
            refreshApiEndpointData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshApiData])

    const handleAdd = () => {
        if (isEditRow && isAdd) {
            setIsValuesChanged(false)
        }
        if (isEditRow) {
            if (!isValuesChanged) {
                setIsEditRow({
                    api_id: '',
                    api_data: {} as ApiEndpoint & ApiMetadata,
                    api_nm: '',
                    isApiEdit: false
                })
                setIsAdd(true)
            }
        } else {
            setIsAdd(true)
        }
    }

    const handleEdit = (
        index: string,
        data: ApiEndpoint & ApiMetadata,
        api_nm = '',
        isApiEdit = false
    ) => {
        if (index) {
            if (isAdd || isEditRow) {
                if (!isValuesChanged) {
                    setIsEditRow({
                        api_id: index,
                        api_data: data,
                        api_nm,
                        isApiEdit
                    })
                    setIsAdd(false)
                }
            } else {
                setIsEditRow({
                    api_id: index,
                    api_data: data,
                    api_nm,
                    isApiEdit
                })
            }
        } else {
            setIsEditRow({
                api_id: '',
                api_data: {} as ApiEndpoint & ApiMetadata,
                api_nm: '',
                isApiEdit: false
            })
        }
    }

    const handleCancel = () => {
        setIsAdd(false)
        setIsEditRow({
            api_id: '',
            api_data: {} as ApiEndpoint & ApiMetadata,
            api_nm: '',
            isApiEdit: false
        })
        setIsValuesChanged(false)
    }

    const reloadData = () => {
        setRefreshApiData(prev => prev + 1)
    }

    const showForm = isAdd || (isEditRow && isEditRow.api_id)

    return (
        <Box width='100%' maxW='100%' overflowX='hidden'>
            <DomainApiHeader
                domainName={domainName}
                isAdd={isAdd}
                statusCount={statusCount}
                handleAdd={handleAdd}
            />
            <Flex direction='column'>
                {showForm && (
                    <DomainApiAddItem
                        cancelAdd={handleCancel}
                        domainId={domainId}
                        reloadData={reloadData}
                        ebcmLevelsData={
                            ebcmLevelsData || ({} as CapabilitiesTree)
                        }
                        setIsValuesChanged={setIsValuesChanged}
                        handleTimeOutModalOpen={() => {}}
                        isEditRow={isEditRow}
                        apiData={[]}
                        apiEndpointData={isEditRow.api_data}
                        companyDomains={companyDomains}
                        companySubDomains={companySubDomains}
                        domainAPIData={isEditRow.api_data?.apiData}
                    />
                )}

                <DomainApiSearchableTable
                    domainId={domainId}
                    viewOnly={false}
                    handleEdit={handleEdit}
                    domainName={domainName}
                >
                    <Flex
                        width={{ base: '50%', mdDown: '100%' }}
                        alignItems={'center'}
                    >
                        Use the table below to view, manage and propose Company
                        Domain APIs.
                    </Flex>
                </DomainApiSearchableTable>
            </Flex>
        </Box>
    )
}
