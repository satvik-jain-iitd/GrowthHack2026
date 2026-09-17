/* istanbul ignore file */
'use client'
import { useState, useEffect, ReactNode } from 'react'
import { Box, Flex, Input, InputGroup, Text, Button } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { User } from '@/app/layout/AuthBlueSso'
import { useUserContext, useDirectoryContext } from '@/context'
import { IconSearch } from '@americanexpress/dls-icons'
import { DomainApiTable } from './DomainApiTable'
import { useGetReviewer, useEBCMLevels } from '@/app/company-domains/hooks'
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'
import { showAdmin } from '@/app/admin/utils'
import { ErrorModal, DelegateModal } from '../Modals'
import { QuickFilter } from '@/app/company-domains/components/DomainAPIs/QuickFilter'

export default function DomainApiSearchableTable({
    domainId,
    children,
    handleTimeOutModalOpen = () => {},
    viewOnly,
    handleEdit = () => {},
    domainName = ''
}: {
    domainId: string
    children: ReactNode | null
    handleTimeOutModalOpen?: () => void
    viewOnly: boolean
    handleEdit?: (
        index: string,
        data: ApiEndpoint & ApiMetadata,
        api_nm: string,
        isApiEdit?: boolean
    ) => void
    domainName: string
}) {
    const [searchVal, setSearchValue] = useState('')
    const [reviewers, setReviewers] = useState<Reviewer>()
    const [delegates, setDelegates] = useState<string[]>([])
    const [isDelegateModalOpen, setDelegateModalOpen] = useState(false)
    const [isDraggingDisabled, setIsDraggingDisabled] = useState(true)
    const [orderedData, setOrderedData] = useState<ApiMetadata[]>([])
    const [refreshDomainData, setRefreshDomainData] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [quickFilter, setQuickFilter] = useState('')
    const { setCompanyDomainApiData } = useDirectoryContext()

    const user: User | undefined = useUserContext()
    const isAdminEnabled = showAdmin(user?.groups || [])

    const handleSearch = (value: string) => {
        setSearchValue(value)
    }

    const { isLoading: isReviewersLoading, data: reviewerData } =
        useGetReviewer(domainId)

    const handleReorderSave = () => {
        setIsDraggingDisabled(true)
    }

    useEffect(() => {
        if (!domainId) return
        setReviewers(prev =>
            reviewerData && prev !== reviewerData ? reviewerData : prev
        )
    }, [reviewerData, domainId])

    const { fetchData: getEBCMLevels } = useEBCMLevels()

    useEffect(() => {
        if (user?.attributes?.email) {
            getEBCMLevels()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Set API data in context for use in markdown generation for company domain APIs
    useEffect(() => {
        setCompanyDomainApiData(orderedData)
    }, [orderedData])

    return (
        <div>
            <Flex direction='column'>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    paddingY={'1rem'}
                    justifyContent='space-between'
                    alignItems='flex-end'
                    className={`${styles.showHistorySection} flex-align-center border-b margin-2-b pad-2-tb`}
                >
                    {children || (
                        <Text fontSize='14px'>
                            Use the table below to view, manage and propose
                            Company Domain APIs.
                        </Text>
                    )}
                    <Flex
                        mt={{ mdDown: 2 }}
                        width={{ base: '50%', mdDown: '100%' }}
                        justifyContent={{
                            base: 'flex-end',
                            mdDown: 'flex-start'
                        }}
                        direction={{
                            base: 'column',
                            md: 'row'
                        }}
                    >
                        <Box
                            width={{ base: '70%', mdDown: '100%' }}
                            padding={0.5}
                            mr={3}
                            minW={'200px'}
                            maxW={'500px'}
                        >
                            <InputGroup
                                flex='1'
                                endElement={<IconSearch />}
                                backgroundColor={{
                                    base: 'rgb(247, 248, 249)',
                                    _dark: 'rgb(8,7,6)'
                                }}
                            >
                                <Input
                                    onChange={e => handleSearch(e.target.value)}
                                    value={searchVal}
                                    placeholder='Search'
                                    focusRing={'none'}
                                />
                            </InputGroup>
                        </Box>
                        {!viewOnly && isAdminEnabled && (
                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                gap={1}
                                mt={1}
                            >
                                <Box>
                                    <Button
                                        border='1px solid #006fcf'
                                        backgroundColor='#fff'
                                        color='#006fcf'
                                        onClick={() =>
                                            setDelegateModalOpen(true)
                                        }
                                        mr={3}
                                        size='sm'
                                    >
                                        Add / View Delegate(s)
                                    </Button>
                                </Box>
                                {isDraggingDisabled ? (
                                    <Box>
                                        <Button
                                            border='1px solid #006fcf'
                                            backgroundColor='#fff'
                                            color='#006fcf'
                                            onClick={() =>
                                                setIsDraggingDisabled(false)
                                            }
                                            mr={5}
                                            size='sm'
                                        >
                                            Reorder APIs
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Button
                                            border='1px solid #006fcf'
                                            backgroundColor='#fff'
                                            color='#006fcf'
                                            onClick={handleReorderSave}
                                            mr={3}
                                            size='sm'
                                        >
                                            Done
                                        </Button>
                                    </Box>
                                )}
                            </Flex>
                        )}
                        {!viewOnly && (
                            <QuickFilter
                                filter={quickFilter}
                                setQuickFilter={setQuickFilter}
                            />
                        )}
                    </Flex>
                </Flex>
                <Box>
                    <DomainApiTable
                        searchVal={searchVal}
                        reviewers={reviewers}
                        domainId={domainId}
                        setIsEditRow={handleEdit}
                        isReviewersLoading={isReviewersLoading}
                        handleTimeOutModalOpen={handleTimeOutModalOpen}
                        refreshTableData={refreshDomainData}
                        setRefreshDomainData={setRefreshDomainData}
                        setApiData={() => {}}
                        viewOnly={viewOnly}
                        isDraggingDisabled={isDraggingDisabled}
                        orderedData={orderedData}
                        setOrderedData={setOrderedData}
                        quickFilter={quickFilter}
                    />
                </Box>
            </Flex>
            <DelegateModal
                isOpen={isDelegateModalOpen}
                onClose={() => setDelegateModalOpen(false)}
                domainId={domainId}
                setDelegatesData={setDelegates}
                delegateList={delegates}
                domainName={domainName}
            />
            <ErrorModal
                isOpen={errorMessage?.length != 0}
                errorMessage={errorMessage}
                onClose={() => setErrorMessage('')}
            />
        </div>
    )
}
