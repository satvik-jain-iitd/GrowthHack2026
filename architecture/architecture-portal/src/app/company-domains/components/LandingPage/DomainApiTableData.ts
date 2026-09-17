/* istanbul ignore file */
import { RefObject, useEffect, useMemo } from 'react'
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'
import {
    getApiStatus,
    getOperationStatus,
    getStatusFiltersfromUrl
} from '@/app/company-domains/utils/'
import { isEqual } from 'lodash'
import { getStatusRank } from './DomainApiTable.constants'

export type SortOrder = '' | 'ASC' | 'DESC'

export interface SortTableState {
    sortOrder: SortOrder
    sortColumn: keyof ApiMetadata | ''
}

interface DomainApiTableDataParams {
    apiEndpointData: ApiMetadata[] | undefined
    apiEndpointStatus: { status: string; statusText?: string }
    searchVal: string
    statusValues: string[]
    reviewers: Reviewer | undefined
    sortTable: SortTableState
    isReviewersLoading: boolean
    quickFilter?: string
    handleTimeOutModalOpen: (status: string, statusText: string) => void
    orderedData: ApiMetadata[]
    setOrderedData: (data: ApiMetadata[]) => void
    filterKey: string
    userIsDraggingRef: RefObject<boolean>
    lastFilterKeyRef: RefObject<string | null>
}

const getSortedList = (apiItem: ApiMetadata, reviewers?: Reviewer) => {
    if (
        (apiItem.proposed &&
            reviewers?.isEnggReviewer &&
            !reviewers.isArchReviewer &&
            !apiItem.darb_eng) ||
        (apiItem.proposed &&
            reviewers?.isArchReviewer &&
            !reviewers.isEnggReviewer &&
            !apiItem.darb_arch) ||
        (reviewers?.isEArbReviewer &&
            !reviewers.isEnggReviewer &&
            !reviewers.isArchReviewer &&
            !apiItem.earb &&
            apiItem.darb_arch &&
            apiItem.darb_eng) ||
        (apiItem.darb_eng &&
            apiItem.darb_arch &&
            !apiItem.earb &&
            reviewers?.isEArbReviewer)
    ) {
        return true
    }

    return false
}

const isRequestor = (email: string, reviewers?: Reviewer) =>
    email?.toLowerCase() === reviewers?.email?.toLowerCase()

const matchesSearch = (item: ApiMetadata, searchValLower: string) => {
    if (!searchValLower) return true

    if (
        Object.values(item).some(value =>
            value?.toString().toLowerCase().includes(searchValLower)
        )
    ) {
        return true
    }

    if (
        item.api_resource &&
        item.api_resource.toLowerCase().includes(searchValLower)
    ) {
        return true
    }

    if (
        Array.isArray(item.api_endpoint) &&
        item.api_endpoint.some((endpoint: ApiEndpoint) =>
            Object.values(endpoint || {}).some(value =>
                value?.toString().toLowerCase().includes(searchValLower)
            )
        )
    ) {
        return true
    }

    return false
}

export const DomainApiTableData = ({
    apiEndpointData,
    apiEndpointStatus,
    searchVal,
    statusValues,
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
}: DomainApiTableDataParams) => {
    const filteredData = useMemo(() => {
        if (!apiEndpointData && apiEndpointStatus.status === 'error') {
            handleTimeOutModalOpen(
                apiEndpointStatus.status,
                apiEndpointStatus.statusText || ''
            )
            return []
        }

        if (isReviewersLoading || !Array.isArray(apiEndpointData)) return []

        const searchValLower = searchVal?.toLowerCase() || ''

        let data = apiEndpointData
            .map(item => ({
                ...item,
                api_status: getApiStatus(item),
                hasApproveAction: getSortedList(item, reviewers),
                status:
                    item.add_da?.status?.toLowerCase() === 'deleted'
                        ? 'deleted'
                        : item.status
            }))
            .filter(item => {
                const matchesSearchCriteria = matchesSearch(
                    item,
                    searchValLower
                )
                const matchesStatus =
                    statusValues.length > 0 &&
                    statusValues.includes(item.api_status)

                return matchesSearchCriteria && matchesStatus
            })
            .filter(item => {
                if (quickFilter !== '') {
                    const endpoints = item.api_endpoint
                        .map(endpoint => {
                            const status = getOperationStatus(endpoint)
                            endpoint.api_status = status
                            return endpoint
                        })
                        .filter(endpoint => {
                            const statusFilters = getStatusFiltersfromUrl()
                            return statusFilters.some(
                                value =>
                                    endpoint.api_status?.toLowerCase() ===
                                    value.toLowerCase()
                            )
                        })

                    return endpoints.length > 0
                }

                return true
            })
            .sort((a, b) => {
                if (
                    a.add_da?.status?.toLowerCase() === 'deleted' &&
                    b.add_da?.status?.toLowerCase() !== 'deleted'
                ) {
                    return 1
                }

                if (
                    a.add_da?.status?.toLowerCase() !== 'deleted' &&
                    b.add_da?.status?.toLowerCase() === 'deleted'
                ) {
                    return -1
                }

                if (a.hasApproveAction !== b.hasApproveAction) {
                    return a.hasApproveAction ? -1 : 1
                }

                if ('seq_no' in a && 'seq_no' in b && a.seq_no !== b.seq_no) {
                    return (
                        parseInt(String(a.seq_no)) - parseInt(String(b.seq_no))
                    )
                }

                if (a.sub_company_domain_name !== b.sub_company_domain_name) {
                    return (a.sub_company_domain_name || '')
                        .toLowerCase()
                        .localeCompare(
                            (b.sub_company_domain_name || '').toLowerCase()
                        )
                }

                const statusComparison =
                    getStatusRank(a.api_status) - getStatusRank(b.api_status)

                if (statusComparison !== 0) return statusComparison

                if (a.api_status === 'draft' && b.api_status === 'draft') {
                    if (isRequestor(a.draft_user_email, reviewers)) return -1
                    if (isRequestor(b.draft_user_email, reviewers)) return 1
                }

                if (a.api_nm && b.api_nm) {
                    return a.api_nm
                        .toLowerCase()
                        .localeCompare(b.api_nm.toLowerCase())
                }

                return 0
            })

        if (data && sortTable.sortColumn && sortTable.sortOrder) {
            const { sortOrder, sortColumn } = sortTable

            data = [...data].sort((a, b) => {
                const aVal = a[sortColumn] ?? ''
                const bVal = b[sortColumn] ?? ''

                return sortOrder === 'ASC'
                    ? aVal.toString().localeCompare(bVal.toString())
                    : bVal.toString().localeCompare(aVal.toString())
            })
        }

        return data
    }, [
        apiEndpointData,
        apiEndpointStatus,
        handleTimeOutModalOpen,
        isReviewersLoading,
        quickFilter,
        reviewers,
        searchVal,
        sortTable,
        statusValues
    ])

    useEffect(() => {
        if (!filteredData) return
        if (userIsDraggingRef.current) return

        const isInitialLoad = lastFilterKeyRef.current === null
        const needsInitialRows =
            orderedData.length === 0 && filteredData.length > 0

        if (isInitialLoad || needsInitialRows) {
            lastFilterKeyRef.current = filterKey
            setOrderedData(filteredData)
            return
        }

        if (lastFilterKeyRef.current !== filterKey) {
            lastFilterKeyRef.current = filterKey
            setOrderedData(filteredData)
            return
        }

        const filteredIds = filteredData.map(d => d.api_metadata_id)
        const orderedIds = orderedData.map(d => d.api_metadata_id)
        const sameIdSet =
            filteredIds.length === orderedIds.length &&
            filteredIds.every(id => orderedIds.includes(id))

        if (sameIdSet) {
            const filteredMap = new Map(
                filteredData.map(item => [item.api_metadata_id, item])
            )
            const merged = orderedData
                .map(item => filteredMap.get(item.api_metadata_id) || item)
                .sort((a, b) => {
                    if (
                        a.add_da?.status?.toLowerCase() === 'deleted' &&
                        b.add_da?.status?.toLowerCase() !== 'deleted'
                    ) {
                        return 1
                    }

                    if (
                        a.add_da?.status?.toLowerCase() !== 'deleted' &&
                        b.add_da?.status?.toLowerCase() === 'deleted'
                    ) {
                        return -1
                    }

                    return 0
                })

            if (!isEqual(merged, orderedData)) {
                setOrderedData(merged)
            }

            return
        }

        if (!isEqual(filteredData, orderedData)) {
            setOrderedData(filteredData)
        }
    }, [
        filterKey,
        filteredData,
        lastFilterKeyRef,
        orderedData,
        setOrderedData,
        userIsDraggingRef
    ])

    return filteredData
}
