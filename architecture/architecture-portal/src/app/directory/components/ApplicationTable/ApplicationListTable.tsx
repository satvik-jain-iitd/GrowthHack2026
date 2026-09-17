/* istanbul ignore file */
import React, { useState, useEffect, useContext } from 'react'
import {
    Box,
    ButtonGroup,
    Flex,
    Grid,
    GridItem,
    IconButton,
    Pagination,
    Spinner,
    Text
} from '@chakra-ui/react'
// import DirectoryTable from '../DirectoryTable'
import debounce from 'lodash.debounce'
import { ApplicationTableInfo } from '../../types'
import { useDirectoryContext, UserContext } from '@/context'
import { useApplicationsList, useDashboardApplicationList } from '../../hooks'
import {
    Application,
    ApplicationCentralInfo
} from '@/app/company-domains/types'
import ApplicationDirectorySearch from './ApplicationDirectorySearch'
import { IconChevronLeft, IconChevronRight } from '@americanexpress/dls-icons'
import { ApplicationDirectoryTable } from './ApplicationDirectoryTable'

const ApplicationListTable = ({
    modalView = false,
    dashboardData = {}
}: {
    modalView?: boolean
    dashboardData?: { application_count?: number }
}) => {
    const [applications, setApplications] = useState<
        (Application & ApplicationCentralInfo)[]
    >([])
    const [totalAppCount, setTotalAppCount] = useState(0)
    const [loader, setLoader] = useState(false)
    const { page, setPage, setApplicationExpandedIndex } = useDirectoryContext()
    const [tableInput, setTableInput] = useState<ApplicationTableInfo>({
        filterOptions: {
            mapped: 'true',
            ebcm_orphaned: 'true',
            com_dom_orphaned: 'true'
        },
        searchVal: ''
    })
    const {
        searchVal,
        filterOptions: { mapped, ebcm_orphaned, com_dom_orphaned } = {}
    } = tableInput || {}
    const pageNum = page || 1
    const user = useContext(UserContext)
    const isApplicationUnlinked = user?.isApplicationUnlinkedCD
    const dashboardAppMutate = useDashboardApplicationList()
    const appListMutate = useApplicationsList()
    const mutation = modalView ? dashboardAppMutate : appListMutate

    const rows = applications?.map(data => {
        return {
            column1: data?.application_id || data?.id,
            column2: data?.application_nm || data?.name,
            column3: {
                name:
                    data?.central_application_da?.ownershipInfo
                        ?.applicationOwner?.fullName ||
                    data?.ownershipInfo?.applicationOwner?.fullName,
                email:
                    data?.central_application_da?.ownershipInfo
                        ?.applicationOwner?.email ||
                    data?.ownershipInfo?.applicationOwner?.email
            },
            column4: modalView ? data?.domainName : data?.domain_nm,
            column5: 'action'
        }
    })

    const handleChange = (page: number) => {
        setPage(page)
        setApplicationExpandedIndex(null)
    }

    const fetchApplicationData = async (isSearchActive = false) => {
        setLoader(true)
        setApplications([])
        try {
            const payload = modalView
                ? {
                      page: 10,
                      offset: (pageNum - 1) * 10
                  }
                : {
                      mapped,
                      ebcm_orphaned,
                      com_dom_orphaned,
                      page_num: pageNum,
                      page_len: 10,
                      search_string: isSearchActive ? searchVal : ''
                  }

            const body = modalView ? payload : { payload, isSearchActive }

            const data = await mutation.mutateAsync(body)

            if (data && data?.appData) {
                setApplications(data?.appData)
                setTotalAppCount(data?.recordCount)
            } else {
                setApplications([])
            }

            if (modalView) {
                setApplications(data)
                setTotalAppCount(dashboardData?.application_count || 0)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoader(false)
        }
    }

    const debounceSearch = debounce(() => {
        fetchApplicationData(true)
    }, 1000)

    useEffect(() => {
        if (searchVal?.length >= 3) {
            setLoader(true)
            setApplications([])
            debounceSearch()
        } else if (searchVal?.length == 0) {
            setLoader(true)
            setApplications([])
            fetchApplicationData()
        }
        return () => debounceSearch.cancel()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNum, searchVal, mapped, ebcm_orphaned, com_dom_orphaned])

    useEffect(() => {
        if (isApplicationUnlinked) {
            setLoader(true)
            setApplications([])
            if (searchVal?.length >= 3) {
                fetchApplicationData(true)
            } else {
                fetchApplicationData()
            }
            user?.setAppUnlinkedCD(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isApplicationUnlinked])

    return (
        <>
            {!modalView && (
                <Box>
                    <ApplicationDirectorySearch
                        tableInput={tableInput}
                        setTableInput={setTableInput}
                        setPage={setPage}
                    />
                </Box>
            )}
            {loader && (
                <Flex justify='center' align='center' minH='200px'>
                    <Spinner />
                </Flex>
            )}
            {!loader && applications?.length === 0 && (
                <Box ml='12px' mt='20px'>
                    No Applications Found
                </Box>
            )}
            {!loader && applications?.length > 0 && (
                <>
                    <ApplicationDirectoryTable
                        columnNames={[
                            'Application ID',
                            'Application Name',
                            'Owner',
                            'Company Domain',
                            'Action'
                        ]}
                        rows={rows}
                        data={applications}
                        actionsActive='Applications'
                        modalView={modalView}
                    />
                    <div>
                        <Grid
                            templateColumns='repeat(7, 1fr)'
                            gap={6}
                            className='audit-history-bottom-section'
                        >
                            <GridItem colSpan={4}>
                                <Text color={'gray'} padding={'16px'}>
                                    Showing {applications?.length} of{' '}
                                    {totalAppCount} Results
                                </Text>
                            </GridItem>
                            {totalAppCount > 10 && (
                                <GridItem
                                    colSpan={3}
                                    textAlign={'right'}
                                    pr={5}
                                >
                                    <Pagination.Root
                                        count={totalAppCount}
                                        pageSize={10}
                                        page={page}
                                        onPageChange={details =>
                                            handleChange(details.page)
                                        }
                                    >
                                        <ButtonGroup variant='ghost' size='sm'>
                                            <Pagination.PrevTrigger asChild>
                                                <IconButton
                                                    color={{
                                                        base: '#006fcf'
                                                    }}
                                                >
                                                    <IconChevronLeft />
                                                    Previous
                                                </IconButton>
                                            </Pagination.PrevTrigger>

                                            <Pagination.Items
                                                render={page => (
                                                    <IconButton
                                                        variant={{
                                                            base: 'ghost',
                                                            _selected: 'solid'
                                                        }}
                                                        backgroundColor={{
                                                            _selected: '#006fcf'
                                                        }}
                                                    >
                                                        {page.value}
                                                    </IconButton>
                                                )}
                                            />

                                            <Pagination.NextTrigger asChild>
                                                <IconButton
                                                    color={{
                                                        base: '#006fcf'
                                                    }}
                                                >
                                                    Next
                                                    <IconChevronRight />
                                                </IconButton>
                                            </Pagination.NextTrigger>
                                        </ButtonGroup>
                                    </Pagination.Root>
                                </GridItem>
                            )}
                        </Grid>
                    </div>
                </>
            )}
        </>
    )
}

export default ApplicationListTable
