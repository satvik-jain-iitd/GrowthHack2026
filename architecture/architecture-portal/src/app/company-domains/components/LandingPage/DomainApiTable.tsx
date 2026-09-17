import styles from '@/app/company-domains/domain-api-page.module.css'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Box, Table, useCheckboxGroup } from '@chakra-ui/react'
import {
    useDomainApiWithEndpointDetails,
    useUserDetails
} from '@/app/company-domains/hooks'
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'
import { getStatusFiltersfromUrl } from '@/app/company-domains/utils/'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useReorderDomainApis } from '@/app/company-domains/hooks'
import {
    apiTableColumns,
    getTableEmptyStateMessage,
    statusFilterOptions,
    viewOnlyStatusOptions
} from './DomainApiTable.constants'
import { DomainApiTableHeader } from './DomainApiTableHeader'
import { DomainApiTableBody } from './DomainApiTableBody'
import { SortOrder, DomainApiTableData } from './DomainApiTableData'

interface DomainApiTableProps {
    searchVal: string
    reviewers: Reviewer | undefined
    domainId: string
    setIsEditRow: (
        id: string,
        data: ApiEndpoint & ApiMetadata,
        name: string,
        isApiEdit?: boolean
    ) => void
    isReviewersLoading: boolean
    handleTimeOutModalOpen: (status: string, statusText: string) => void
    refreshTableData: boolean
    setRefreshDomainData: (val: boolean) => void
    setApiData: (data: ApiMetadata[]) => void
    viewOnly: boolean
    isDraggingDisabled: boolean
    orderedData: ApiMetadata[]
    setOrderedData: (data: ApiMetadata[]) => void
    quickFilter?: string
}

export const DomainApiTable = React.memo(function DomainApiTable({
    searchVal,
    reviewers,
    domainId,
    setIsEditRow,
    isReviewersLoading,
    handleTimeOutModalOpen,
    refreshTableData,
    setRefreshDomainData,
    viewOnly,
    isDraggingDisabled,
    orderedData,
    setOrderedData,
    quickFilter
}: DomainApiTableProps) {
    const [sortTable, setSortTable] = useState({
        sortOrder: '' as SortOrder,
        sortColumn: '' as keyof ApiMetadata | ''
    })
    const [expandedRowId, setExpandedRowId] = useState<string | number | null>(
        null
    )
    const [isDragInProgress, setIsDragInProgress] = useState(false)
    const [isOperationDragInProgress, setIsOperationDragInProgress] =
        useState(false)
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

    const filterableStatusOptions = viewOnly
        ? viewOnlyStatusOptions
        : statusFilterOptions?.filter(item => item != 'deleted')

    const tableColumns = useMemo(
        () =>
            apiTableColumns.map(column =>
                column.key === 'status'
                    ? {
                          ...column,
                          filterableValues: [
                              'viewAll',
                              ...(viewOnly
                                  ? viewOnlyStatusOptions
                                  : statusFilterOptions)
                          ]
                      }
                    : column
            ),
        [viewOnly]
    )

    const statusGroup = useCheckboxGroup({
        defaultValue: filterableStatusOptions
    })

    const lastFilterKeyRef = useRef<string | null>(null)
    const didInitFiltersRef = useRef(false)
    const userIsDraggingRef = useRef(false)

    const { reorderDomainApis } = useReorderDomainApis()

    const statusValueKey = useMemo(
        () => statusGroup.value.slice().sort().join('|'),
        [statusGroup.value]
    )

    const filterKey = useMemo(
        () =>
            [
                searchVal?.toLowerCase() || '',
                statusValueKey,
                sortTable.sortColumn || '',
                sortTable.sortOrder || ''
            ].join('|'),
        [searchVal, statusValueKey, sortTable.sortColumn, sortTable.sortOrder]
    )

    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window != 'undefined' ? window.innerWidth < 1500 : false
    )

    const {
        isLoading,
        data: apiEndpointData,
        status: apiEndpointStatus = { status: '' },
        refresh: refreshApiEndpointData
    } = useDomainApiWithEndpointDetails(domainId)

    useEffect(() => {
        if (refreshTableData) {
            refreshApiEndpointData()
            setRefreshDomainData(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTableData])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let hash = window.location.hash
            hash = hash.substring(1)
            if (hash) {
                const matchedApi = apiEndpointData?.find(
                    api => api.api_metadata_id.toString() === hash
                )
                if (matchedApi) {
                    setExpandedRowId(matchedApi.api_metadata_id)
                    return
                }
                const matchedEndpoint = apiEndpointData
                    ?.flatMap(api =>
                        api.api_endpoint.map(endpoint => ({
                            api_metadata_id: api.api_metadata_id,
                            endpoint_id: endpoint.api_endpoint_metadata_id
                        }))
                    )
                    .find(item => item.endpoint_id.toString() === hash)

                if (matchedEndpoint) {
                    setExpandedRowId(matchedEndpoint.api_metadata_id)
                }
            }
        }
    }, [apiEndpointData])

    useEffect(() => {
        if (quickFilter === '') {
            statusGroup.setValue(filterableStatusOptions)
            return
        }

        const statusFilter = getStatusFiltersfromUrl(true)
        if (statusFilter.length > 0) {
            statusGroup.setValue(statusFilter)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quickFilter])

    useEffect(() => {
        if (didInitFiltersRef.current) return

        if (statusGroup.value.length === 0) {
            statusGroup.setValue(filterableStatusOptions)
        }
        didInitFiltersRef.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterableStatusOptions, statusGroup.value.length])

    const filteredData = DomainApiTableData({
        apiEndpointData,
        apiEndpointStatus,
        searchVal,
        statusValues: statusGroup.value,
        reviewers,
        sortTable,
        isReviewersLoading,
        quickFilter,
        handleTimeOutModalOpen,
        orderedData,
        setOrderedData,
        filterKey,
        userIsDraggingRef,
        lastFilterKeyRef
    })

    const handleBeforeCapture = () => {
        userIsDraggingRef.current = true
        flushSync(() => {
            setExpandedRowId(null)
            setIsDragInProgress(true)
        })
    }

    const handleDragEnd = async (result: DropResult) => {
        userIsDraggingRef.current = false
        setIsDragInProgress(false)

        if (!result.destination) return
        if (result.source.index === result.destination.index) return

        const items = Array.from(orderedData)
        const [movedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, movedItem)

        setOrderedData(items)
        const payload = {
            api_metadata_id: movedItem.api_metadata_id,
            seq_no: result.destination.index + 1
        }

        const fromPosition = result.source.index + 1
        const toPosition = result.destination.index + 1
        const apiName = movedItem.api_nm || 'API'

        try {
            await reorderDomainApis(
                domainId,
                movedItem.api_metadata_id,
                payload
            )
            setRefreshDomainData(true)
            addDragFeedback(
                `"${apiName}" moved from position ${fromPosition} to position ${toPosition}`,
                'success'
            )
        } catch (error) {
            console.error('Error during API call:', error)
            addDragFeedback('Failed to move row. Please try again.', 'error')
        }
    }

    const handleSort = (isSortable: boolean, key: keyof ApiMetadata) => {
        if (!isSortable) return
        if (sortTable.sortColumn !== key) {
            setSortTable({ sortOrder: 'ASC', sortColumn: key })
            return
        }

        if (sortTable.sortOrder === 'ASC') {
            setSortTable({ sortOrder: 'DESC', sortColumn: key })
            return
        }

        if (sortTable.sortOrder === 'DESC') {
            setSortTable({ sortOrder: '', sortColumn: '' })
            return
        }

        setSortTable({ sortOrder: 'ASC', sortColumn: key })
    }

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1500)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleViewAllClick = () => {
        if (statusGroup.value.length == filterableStatusOptions.length) {
            statusGroup.setValue([])
        } else {
            statusGroup.setValue(filterableStatusOptions)
        }
    }

    const handleExpandRowClick = (id: string) => {
        setExpandedRowId(prevId => (prevId === id ? null : id))
        if (typeof window !== 'undefined') {
            const link = new URL(window.location.href)
            link.hash = ''
            link.hash = expandedRowId !== id ? id.toString() : ''
            window.history.pushState({}, '', link.toString())
        }
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        const handlePopState = () => {
            if (typeof window === 'undefined') return
            const hash = window.location.hash.substring(1)
            // check if the hash matches any api_endpoint_metadata_id first, if so it needs to be expanded and scrolled into view.
            const matchedEndpoint = apiEndpointData
                ?.flatMap(api =>
                    api.api_endpoint.map(endpoint => ({
                        api_metadata_id: api.api_metadata_id,
                        endpoint_id: endpoint.api_endpoint_metadata_id
                    }))
                )
                .find(item => item.endpoint_id.toString() === hash)
            if (matchedEndpoint) {
                setExpandedRowId(matchedEndpoint.api_metadata_id)
            } else {
                setExpandedRowId(hash || null)
            }
        }
        window.addEventListener('popstate', handlePopState)
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandedRowId])

    // Check if no filters are selected for both status and apiType
    const noStatusSelected = statusGroup.value.length == 0
    const noFiltersSelected = noStatusSelected
    const noDataMessage = getTableEmptyStateMessage(
        isLoading,
        apiEndpointData,
        apiEndpointStatus,
        searchVal,
        filteredData,
        noFiltersSelected
    )
    const { isAdmin, domainOwner, loggedInUserEmail } = useUserDetails()

    return (
        <Box
            width={{ base: '100%', mdDown: '82dvw' }}
            overflowX={
                isDragInProgress || isOperationDragInProgress
                    ? 'visible'
                    : 'auto'
            }
        >
            {dragFeedback.map(feedback => (
                <Box
                    key={feedback.id}
                    p={3}
                    mb={3}
                    borderRadius='md'
                    backgroundColor={
                        feedback.type === 'success' ? 'green.100' : 'red.100'
                    }
                    color={
                        feedback.type === 'success' ? 'green.800' : 'red.800'
                    }
                    _dark={{
                        backgroundColor:
                            feedback.type === 'success'
                                ? 'green.900'
                                : 'red.900',
                        color:
                            feedback.type === 'success'
                                ? 'green.100'
                                : 'red.100'
                    }}
                    borderLeft={`4px solid ${feedback.type === 'success' ? '#48bb78' : '#f56565'}`}
                >
                    {feedback.message}
                </Box>
            ))}
            <DragDropContext
                onBeforeCapture={handleBeforeCapture}
                onDragEnd={handleDragEnd}
            >
                <Table.Root
                    variant='outline'
                    border='0'
                    id='domain-api-table'
                    data-testid='domain-api-table'
                    className={styles.domainApiTable}
                    display='block'
                    stickyHeader={
                        !isDragInProgress && !isOperationDragInProgress
                    }
                >
                    <DomainApiTableHeader
                        columns={tableColumns}
                        sortColumn={sortTable.sortColumn}
                        sortOrder={sortTable.sortOrder}
                        isSmallScreen={isSmallScreen}
                        isStatusChecked={status =>
                            statusGroup.isChecked(status)
                        }
                        onStatusToggle={status =>
                            statusGroup.toggleValue(status)
                        }
                        onViewAllClick={handleViewAllClick}
                        onSort={handleSort}
                    />
                    <DomainApiTableBody
                        orderedData={orderedData}
                        isLoading={isLoading}
                        isReviewersLoading={isReviewersLoading}
                        noDataMessage={noDataMessage}
                        columnCount={tableColumns.length}
                        expandedRowId={expandedRowId}
                        domainId={domainId}
                        reviewers={reviewers}
                        viewOnly={viewOnly}
                        isDraggingDisabled={isDraggingDisabled}
                        isAdmin={Boolean(isAdmin)}
                        domainOwner={domainOwner || []}
                        loggedInUserEmail={loggedInUserEmail || ''}
                        onExpandRowClick={handleExpandRowClick}
                        onReloadData={refreshApiEndpointData}
                        setIsEditRow={setIsEditRow}
                        setOperationDragInProgress={
                            setIsOperationDragInProgress
                        }
                    />
                </Table.Root>
            </DragDropContext>
        </Box>
    )
})
