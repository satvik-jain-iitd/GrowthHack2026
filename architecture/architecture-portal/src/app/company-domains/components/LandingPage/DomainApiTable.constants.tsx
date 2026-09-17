/* istanbul ignore file */
import React from 'react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ApiMetadata, Column } from '@/app/company-domains/types'
import { statusOrderMap } from '@/app/company-domains/utils/'
import { Table } from '@chakra-ui/react'

export interface ApiTableColumn extends Column {
    isFilterable: boolean
    width: string
    align?: string
    key: keyof ApiMetadata
}

export const statusFilterOptions = [
    'draft',
    'proposed',
    'darbAppr',
    'earbAppr',
    'catalog',
    'preCert',
    'prodCert',
    'deleted'
]

export const viewOnlyStatusOptions = [
    'earbAppr',
    'catalog',
    'preCert',
    'prodCert'
]

export const apiTableColumns: ApiTableColumn[] = [
    {
        name: 'API Name',
        title: 'API Name',
        key: 'api_nm' as keyof ApiMetadata,
        shortName: 'API Name',
        isFilterable: false,
        isSortable: true,
        width: '13%'
    },
    {
        name: 'API Resource',
        title: 'API Resource',
        key: 'api_type_tx' as keyof ApiMetadata,
        isFilterable: false,
        isSortable: false,
        width: '13%'
    },
    {
        name: 'Sub Domain',
        title: 'Sub Domain',
        key: 'sub_company_domain_name' as keyof ApiMetadata,
        shortName: 'Sub Dom.',
        isFilterable: false,
        isSortable: true,
        width: '6%'
    },
    {
        name: 'API Description',
        title: 'API Description',
        key: 'api_ds' as keyof ApiMetadata,
        isFilterable: false,
        isSortable: true,
        shortName: 'API Desc.',
        width: '55%',
        align: 'center'
    },
    {
        name: 'Status',
        title: 'Status',
        key: 'status' as keyof ApiMetadata,
        shortName: 'Status',
        isFilterable: true,
        isSortable: false,
        filterableValues: ['viewAll', ...statusFilterOptions],
        filterTitle: 'Status Filter',
        filterType: 'status',
        width: '10%'
    }
]

export const getStatusRank = (status: keyof typeof statusOrderMap) =>
    statusOrderMap[status] || Number.MAX_SAFE_INTEGER

export const getTableEmptyStateMessage = (
    isLoading: boolean,
    apiEndpointData: ApiMetadata[] | undefined,
    apiEndpointStatus: { status: string; statusText?: string },
    searchVal: string,
    filteredData: ApiMetadata[] | undefined,
    noFiltersSelected: boolean
): string => {
    let message =
        'No data to display. Please adjust your filters or search criteria.'

    if (!isLoading && filteredData?.length === 0 && searchVal) {
        message = 'No results found. Please adjust your search criteria.'
    } else if (noFiltersSelected) {
        message =
            'No filters selected. Please select at least one filter to view data.'
    } else if (!isLoading && apiEndpointData?.length === 0) {
        message =
            'No APIs found for this company domain. Please click on the "Add Domain API" to add.'
    } else if (apiEndpointStatus.status === 'error') {
        message = 'Failed to load data. Please try refreshing the page.'
    } else if (
        (apiEndpointData?.length ?? 0) > 0 &&
        filteredData?.length === 0
    ) {
        message =
            'No APIs match the selected filters. Please adjust your filters to view APIs.'
    } else if (
        (apiEndpointData?.length ?? 0) === 0 &&
        filteredData?.length === 0
    ) {
        message =
            'No APIs are currently EARB Approved or Design Certified or Production Certified.'
    }

    return message
}

export const NoDataComponent: React.FC<{
    message: string
    colLength: number
}> = ({ message, colLength }) => (
    <Table.Row>
        <Table.Cell colSpan={colLength} className={styles.noDataTableCell}>
            <div className={styles.noDataContainer}>
                <p className={styles.noDataText}>{message}</p>
            </div>
        </Table.Cell>
    </Table.Row>
)
