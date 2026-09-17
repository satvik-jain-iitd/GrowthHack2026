/* istanbul ignore file */
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState
} from 'react'
import { flushSync } from 'react-dom'
import { Box, Flex, useCheckboxGroup } from '@chakra-ui/react'
import { IconArrowUp, IconArrowDown } from '@americanexpress/dls-icons'
import { DropResult } from '@hello-pangea/dnd'
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'
import {
    getStatusFiltersfromUrl,
    getOperationStatus,
    getSortedList
} from '@/app/company-domains/utils'
import {
    useReorderDomainApiEndpoints,
    useUserDetails
} from '@/app/company-domains/hooks'
import {
    OperationTableFilterMenu,
    OperationTableFeedback,
    OperationTableGrid
} from './OperationTableGrid'
import {
    operationTableColumns,
    OperationTableColumnTypes,
    statusFilterOptions,
    typeFilterOptions
} from './OperationTableConfig'

export const OperationalTable: React.FC<{
    searchVal: string
    api_nm: string
    isAdd: boolean
    reviewers: Reviewer | undefined
    domainId: string
    setIsEditRow: (
        id: string,
        data: ApiMetadata & ApiEndpoint,
        name: string
    ) => void
    isReviewersLoading: boolean
    refreshTableData: () => void
    data: ApiMetadata
    isLoading: boolean
    viewOnly?: boolean
    isDraggingDisabled: boolean
    tableData: ApiMetadata
    setTableData: Dispatch<SetStateAction<ApiMetadata>>
    setOperationDragInProgress?: (isDragging: boolean) => void
    api_metadata_id?: string
    isDeletedApi?: boolean
}> = ({
    searchVal,
    api_nm,
    isAdd,
    reviewers,
    domainId,
    setIsEditRow,
    isReviewersLoading,
    refreshTableData,
    data,
    isLoading,
    viewOnly,
    isDraggingDisabled,
    tableData,
    setTableData,
    setOperationDragInProgress,
    api_metadata_id,
    isDeletedApi
}) => {
    const [sortTable, setSortTable] = useState({
        sortOrder: 'ASC',
        sortColumn: 'sub_company_domain_name'
    })
    const [isDragInProgress, setIsDragInProgress] = useState(false)
    const [dragFeedback, setDragFeedback] = useState<
        Array<{
            id: number
            message: string
            type: 'success' | 'error'
        }>
    >([])

    const addDragFeedback = (message: string, type: 'success' | 'error') => {
        const id = Date.now() + Math.random()
        setDragFeedback(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setDragFeedback(prev => prev.filter(feedback => feedback.id !== id))
        }, 3000)
    }
    const { reorderDomainApiEndpoints } = useReorderDomainApiEndpoints()
    const statusGroup = useCheckboxGroup({
        defaultValue: statusFilterOptions?.filter(item => item != 'deleted')
    })
    const typeGroup = useCheckboxGroup({ defaultValue: typeFilterOptions })
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1500)
    const { isAdmin, domainOwner, loggedInUserEmail } = useUserDetails()
    const isCoeditor = tableData?.co_editors?.includes(loggedInUserEmail)
    const isDomainOwner = domainOwner?.includes(domainId)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const statusFilter = getStatusFiltersfromUrl()
            if (statusFilter.length > 0) {
                statusGroup.setValue(statusFilter)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        return () => {
            setOperationDragInProgress?.(false)
        }
    }, [setOperationDragInProgress])
    useEffect(() => {
        if (!data || !Array.isArray(data.api_endpoint)) return
        const apiTypeMap = {
            typeA: 'type a',
            typeB: 'type b'
        }
        const filteredData = data.api_endpoint
            ?.map((item: ApiEndpoint) => {
                const status = getOperationStatus(item)
                return {
                    ...item,
                    api_status: status, // Calculate the status
                    hasApproveAction: getSortedList(item, reviewers),
                    expanded: item.expanded ?? false,
                    api_onboarding_url:
                        status === 'earbAppr'
                            ? data?.apiOnboardingUrl
                            : undefined
                }
            })
            .filter((item: ApiEndpoint) => {
                // Filter by status
                const statusFilter = statusGroup.value.some(
                    value =>
                        item.api_status?.toLowerCase() === value.toLowerCase()
                )
                // Filter by endpoint_type
                const apiTypeFilter = typeGroup.value.some(
                    value =>
                        item.endpoint_type?.toLowerCase() ===
                        apiTypeMap[value as keyof typeof apiTypeMap]
                )
                return statusFilter && apiTypeFilter // Both filters must match
            })
            .sort((a: ApiEndpoint, b: ApiEndpoint) => {
                if (
                    a?.status?.toLowerCase() === 'deleted' &&
                    b?.status?.toLowerCase() !== 'deleted'
                )
                    return 1
                if (
                    a?.status?.toLowerCase() !== 'deleted' &&
                    b?.status?.toLowerCase() === 'deleted'
                )
                    return -1
                if ('seq_no' in a && 'seq_no' in b && a.seq_no !== b.seq_no) {
                    return (
                        parseInt(String(a.seq_no)) - parseInt(String(b.seq_no))
                    )
                }
                // Default sorting logic
                if (a.hasApproveAction !== b.hasApproveAction) {
                    return a.hasApproveAction ? -1 : 1
                }
                if (a.sub_company_domain_name !== b.sub_company_domain_name) {
                    return a.sub_company_domain_name
                        ?.toLowerCase()
                        .localeCompare(b.sub_company_domain_name?.toLowerCase())
                }
                const statusOrderMap = {
                    prodCert: 1,
                    preCert: 2,
                    catalog: 3,
                    earbAppr: 4,
                    darbAppr: 5,
                    proposed: 6,
                    draft: 7,
                    deleted: 8
                }
                const getStatusRank = (status: keyof typeof statusOrderMap) =>
                    statusOrderMap[status] || Number.MAX_SAFE_INTEGER
                const statusComparison =
                    getStatusRank(a.api_status as keyof typeof statusOrderMap) -
                    getStatusRank(b.api_status as keyof typeof statusOrderMap)
                if (statusComparison !== 0) return statusComparison
                if (a.api_nm && b.api_nm) {
                    return a.api_nm
                        ?.toLowerCase()
                        .localeCompare(b.api_nm.toLowerCase())
                }
                return 0
            })
        setTableData({ ...data, api_endpoint: filteredData })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, statusGroup.value, typeGroup.value])
    useEffect(() => {
        // if the hash inthe url corresponds to an api_endpoint_metadata_id, expand that row
        if (!data || !Array.isArray(data.api_endpoint)) return

        if (typeof window !== 'undefined') {
            let hash = window.location.hash
            hash = hash.replace(/^#/, '')
            if (hash) {
                const apiToExpand = data.api_endpoint.find(
                    (api: ApiEndpoint) =>
                        api.api_endpoint_metadata_id?.toString() === hash
                )
                let updatedEndpoints
                if (apiToExpand) {
                    updatedEndpoints = data.api_endpoint
                        .map((row: ApiEndpoint) => ({
                            ...row,
                            expanded:
                                row.api_endpoint_metadata_id?.toString() ===
                                hash
                        }))
                        .sort((a: ApiEndpoint, b: ApiEndpoint) => {
                            if (
                                a?.status?.toLowerCase() === 'deleted' &&
                                b?.status?.toLowerCase() !== 'deleted'
                            )
                                return 1
                            if (
                                a?.status?.toLowerCase() !== 'deleted' &&
                                b?.status?.toLowerCase() === 'deleted'
                            )
                                return -1
                            return 0
                        })
                    if (!statusGroup?.value?.includes('deleted')) {
                        updatedEndpoints = updatedEndpoints?.filter(
                            item => item?.status?.toLowerCase() !== 'deleted'
                        )
                    }
                    setTableData({
                        ...data,
                        api_endpoint: updatedEndpoints
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    const handleBeforeCapture = () => {
        flushSync(() => {
            setIsDragInProgress(true)
            setOperationDragInProgress?.(true)
            setTableData(prev => ({
                ...prev,
                api_endpoint: (prev.api_endpoint || []).map(row => ({
                    ...row,
                    expanded: false
                }))
            }))
        })
    }
    const handleDragEnd = useCallback(
        async (result: DropResult) => {
            setIsDragInProgress(false)
            setOperationDragInProgress?.(false)

            if (!result.destination) return
            if (result.source.index === result.destination.index) return

            const items = Array.from(tableData?.api_endpoint)

            const [movedItem] = items.splice(result.source.index, 1)
            items.splice(result.destination.index, 0, movedItem)
            setTableData({ ...data, api_endpoint: items })

            const fromPosition = result.source.index + 1
            const toPosition = result.destination.index + 1
            const operationName = movedItem.endpoint_operation || 'Operation'

            try {
                const payload = {
                    api_endpoint_metadata_id:
                        movedItem.api_endpoint_metadata_id,
                    seq_no: result.destination.index + 1
                }
                await reorderDomainApiEndpoints(
                    domainId,
                    data?.api_metadata_id,
                    payload
                )
                addDragFeedback(
                    `"${operationName}" moved from position ${fromPosition} to position ${toPosition}`,
                    'success'
                )
                refreshTableData()
            } catch (error) {
                console.error('Failed to save reordering:', error)
                addDragFeedback(
                    'Failed to move operation. Please try again.',
                    'error'
                )
            }
        },
        [
            domainId,
            tableData,
            data,
            reorderDomainApiEndpoints,
            setTableData,
            setOperationDragInProgress,
            refreshTableData
        ]
    )
    const getSortIcon = (column: OperationTableColumnTypes) => {
        if (!column.isSortable) return null
        if (sortTable.sortColumn === column.key) {
            return sortTable.sortOrder === 'ASC' ? (
                <IconArrowUp size='xs' />
            ) : (
                <IconArrowDown size='xs' />
            )
        }
        return (
            <Flex direction='column' alignItems='center'>
                <IconArrowUp size='xs' style={{ opacity: 0.2 }} />
                <IconArrowDown size='xs' style={{ opacity: 0.2 }} />
            </Flex>
        )
    }

    const handleSort = (isSortable: boolean, key: string) => {
        if (!isSortable) return
        let direction = 'ASC'
        if (sortTable.sortColumn === key && sortTable.sortOrder === 'ASC') {
            direction = 'DESC'
        }

        const sortedData = [...(tableData.api_endpoint || [])].sort((a, b) => {
            const aValueToCompare = a[key as keyof ApiEndpoint] ?? ''
            const bValueToCompare = b[key as keyof ApiEndpoint] ?? ''

            return direction === 'ASC'
                ? aValueToCompare
                      .toString()
                      .localeCompare(bValueToCompare.toString())
                : bValueToCompare
                      .toString()
                      .localeCompare(aValueToCompare.toString())
        })

        setTableData((prevState: ApiMetadata) => ({
            ...prevState,
            api_endpoint: sortedData
        }))
        setSortTable({ sortOrder: direction, sortColumn: key })
    }

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1500)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const getColumnName = (column: OperationTableColumnTypes) => {
        return isSmallScreen ? column?.shortName || column?.name : column?.name
    }

    const renderColumnAction = (column: OperationTableColumnTypes) => {
        if (column.isFilterable) {
            return (
                <OperationTableFilterMenu
                    column={column}
                    statusValues={statusGroup.value}
                    typeValues={typeGroup.value}
                    statusFilterOptions={statusFilterOptions}
                    typeFilterOptions={typeFilterOptions}
                    isStatusChecked={statusGroup.isChecked}
                    isTypeChecked={typeGroup.isChecked}
                    toggleStatusValue={statusGroup.toggleValue}
                    toggleTypeValue={typeGroup.toggleValue}
                    setStatusValues={statusGroup.setValue}
                    setTypeValues={typeGroup.setValue}
                />
            )
        }

        return getSortIcon(column)
    }
    const handleColumnSort = (column: OperationTableColumnTypes) => {
        handleSort(column.isSortable, column.key)
    }

    const handleExpandRowClick = (id: string) => {
        if (!tableData || !Array.isArray(tableData.api_endpoint)) return

        const updatedEndpoints = tableData.api_endpoint.map(
            (row: ApiEndpoint) => {
                const status = getOperationStatus(row)

                return {
                    ...row,
                    expanded:
                        row.api_endpoint_metadata_id === id
                            ? !row.expanded
                            : false,
                    api_onboarding_url:
                        status === 'earbAppr'
                            ? data?.apiOnboardingUrl
                            : undefined
                }
            }
        )
        setTableData({ ...tableData, api_endpoint: updatedEndpoints })
        if (typeof window !== 'undefined') {
            const link = new URL(window.location.href)
            const currentId =
                window.location.hash.split('#')?.length > 1
                    ? window.location.hash.split('#')[1]
                    : ''
            link.hash =
                currentId === id ? (api_metadata_id ?? '') : id.toString()
            window.history.pushState({}, '', link.toString())
        }
    }
    useEffect(() => {
        if (typeof window === 'undefined') return
        const handlePopState = () => {
            if (!tableData || !Array.isArray(tableData.api_endpoint)) return

            if (typeof window !== 'undefined') {
                let hash = window.location.hash
                hash = hash.replace(/^#/, '')
                const updatedEndpoints = tableData.api_endpoint.map(
                    (row: ApiEndpoint) => ({
                        ...row,
                        expanded:
                            row.api_endpoint_metadata_id?.toString() === hash
                    })
                )
                setTableData({ ...tableData, api_endpoint: updatedEndpoints })
            }
        }
        window.addEventListener('popstate', handlePopState)
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [tableData])
    const noStatusSelected = statusGroup.value.length == 0
    const noApiTypeSelected = typeGroup.value.length == 0
    const noFiltersSelected = noStatusSelected || noApiTypeSelected

    return (
        <Box w='100%' h='100%'>
            <OperationTableFeedback feedback={dragFeedback} />
            <OperationTableGrid
                columns={operationTableColumns}
                isDragInProgress={isDragInProgress}
                handleBeforeCapture={handleBeforeCapture}
                handleDragEnd={handleDragEnd}
                isLoading={isLoading}
                isReviewersLoading={isReviewersLoading}
                isAdd={isAdd}
                data={data}
                tableData={tableData}
                searchVal={searchVal}
                noFiltersSelected={noFiltersSelected}
                getColumnName={getColumnName}
                onColumnSort={handleColumnSort}
                renderColumnAction={renderColumnAction}
                loggedInUserEmail={loggedInUserEmail}
                isAdmin={isAdmin}
                isCoeditor={isCoeditor}
                isDomainOwner={isDomainOwner}
                isDraggingDisabled={isDraggingDisabled}
                domainId={domainId}
                refreshTableData={refreshTableData}
                reviewers={reviewers}
                setIsEditRow={setIsEditRow}
                handleExpandRowClick={handleExpandRowClick}
                viewOnly={viewOnly ?? false}
                api_nm={api_nm}
                isDeletedApi={isDeletedApi}
            />
        </Box>
    )
}
