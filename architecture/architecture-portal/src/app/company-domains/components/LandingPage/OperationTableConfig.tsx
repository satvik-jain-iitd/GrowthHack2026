/* istanbul ignore file */
import { Column } from '@/app/company-domains/types'

export type OperationTableColumnTypes = Column & {
    width: string
    isFilterable: boolean
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

export const typeFilterOptions = ['typeA', 'typeB']

export const operationTableColumns: OperationTableColumnTypes[] = [
    {
        name: 'Operation Name',
        title: 'Operation Name',
        key: 'endpoint_operation',
        shortName: 'Operation Name',
        isFilterable: false,
        isSortable: true,
        width: '20%'
    },
    {
        name: 'API Type',
        title: 'API Type',
        key: 'endpoint_type',
        isFilterable: true,
        isSortable: false,
        filterableValues: ['viewAll', ...typeFilterOptions],
        filterTitle: 'API Type Filter',
        filterType: 'apiType',
        width: '10%'
    },
    {
        name: 'Journey Link',
        title: 'Journey Link',
        key: 'journey_use_case',
        shortName: 'Journey Link',
        isFilterable: false,
        isSortable: false,
        width: '10%'
    },
    {
        name: 'Status',
        title: 'Status',
        key: 'status',
        shortName: 'Status',
        isFilterable: true,
        isSortable: false,
        filterableValues: ['viewAll', ...statusFilterOptions],
        filterTitle: 'Status Filter',
        filterType: 'status',
        width: '15%'
    },
    {
        name: 'API Catalog',
        title: 'API Catalog',
        key: 'api_catalog_url',
        shortName: 'API Catalog',
        isFilterable: false,
        isSortable: false,
        width: '10%'
    },
    {
        name: 'Design Score',
        title: 'Design Score',
        key: 'design_score',
        shortName: 'Design Score',
        isFilterable: false,
        isSortable: false,
        width: '5%'
    }
]
