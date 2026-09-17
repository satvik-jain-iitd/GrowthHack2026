/* istanbul ignore file */
'use client'

import { useCallback, useMemo, useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'

import {
    useGetAllApplications,
    useGetAllApplicationsLazy,
    ApplicationListItem,
    APPLICATIONS_LAZY_ENRICHMENT,
    APPLICATIONS_PAGE_SIZE
} from '../hooks/useGetAllApplications'
import { MetamodelDataTable } from '../../components/MetamodelDataTable'
import { TextCell, ListPopover } from '../../components/cells'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import { notFound } from 'next/navigation'

const columnHelper = createColumnHelper<ApplicationListItem>()

const FILTER_PLACEHOLDERS: Record<string, string> = {
    id: 'Filter by ID…',
    name: 'Filter by name…'
}

function listColumn(
    id: keyof ApplicationListItem,
    header: string,
    label: string,
    colorPalette: string
) {
    return columnHelper.accessor(id, {
        header,
        size: 170,
        minSize: 120,
        enableSorting: false,
        cell: info => {
            const items = (info.getValue() as string[]) ?? []
            return (
                <ListPopover
                    count={items.length}
                    items={items}
                    label={label}
                    colorPalette={colorPalette}
                    badgeText={count => `${count} ${header}`}
                />
            )
        }
    })
}

function textColumn(id: keyof ApplicationListItem, header: string, size = 200) {
    return columnHelper.accessor(id, {
        header,
        size,
        minSize: 120,
        cell: info => <TextCell value={info.getValue() as string} />,
        filterFn: 'includesString'
    })
}

function useApplicationsColumns() {
    return useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Name',
                size: 280,
                minSize: 160,
                cell: info => (
                    <TextCell value={info.getValue()} fontWeight={600} />
                ),
                filterFn: 'includesString'
            }),
            textColumn('lifecycleState', 'Lifecycle State', 150),
            textColumn('applicationType', 'Application Type', 180),
            textColumn('lineOfBusiness', 'Line of Business'),
            textColumn('linkedCompanyDomain', 'Company Domain', 180),
            listColumn(
                'supportedBusinessUnits',
                'Business Units',
                'Supported Business Units',
                'blue'
            ),
            listColumn(
                'marketsSupported',
                'Markets',
                'Markets Supported',
                'teal'
            ),
            listColumn(
                'technologyStacks',
                'Tech Stacks',
                'Technology Stacks',
                'purple'
            ),
            listColumn(
                'linkedInitiatives',
                'Linked Initiatives',
                'Linked Initiatives',
                'blue'
            ),
            listColumn('linkedAdrs', 'Linked ADRs', 'Linked ADRs', 'purple'),
            listColumn('linkedBvbs', 'Linked BvBs', 'Linked BvBs', 'orange'),
            columnHelper.accessor('id', {
                header: 'Application ID',
                size: 220,
                minSize: 140,
                cell: info => <TextCell value={info.getValue()} />,
                filterFn: 'includesString'
            })
        ],
        []
    )
}

/** Paginated grid that enriches only the rows on the current page. */
function LazyApplicationsTable() {
    const [visibleIds, setVisibleIds] = useState<string[]>([])
    const onVisibleIdsChange = useCallback((ids: string[]) => {
        setVisibleIds(prev => (prev.join(',') === ids.join(',') ? prev : ids))
    }, [])

    const { applications, loading, error } =
        useGetAllApplicationsLazy(visibleIds)
    const columns = useApplicationsColumns()

    return (
        <MetamodelDataTable
            title='Applications'
            subtitle='Browse and filter metamodel applications.'
            data={applications}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            droppableId='applications-table'
            emptyMessage='No applications match the current filters.'
            paginated
            pageSize={APPLICATIONS_PAGE_SIZE}
            onVisibleIdsChange={onVisibleIdsChange}
        />
    )
}

/** Eager grid that enriches every row up front (used when lazy is disabled). */
function EagerApplicationsTable() {
    const { applications, loading, error } = useGetAllApplications()
    const columns = useApplicationsColumns()

    return (
        <MetamodelDataTable
            title='Applications'
            subtitle='Browse and filter metamodel applications.'
            data={applications}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            droppableId='applications-table'
            emptyMessage='No applications match the current filters.'
        />
    )
}

export default function ApplicationsTable() {
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])

    if (!isAdmin) {
        return notFound()
    }

    return APPLICATIONS_LAZY_ENRICHMENT ? (
        <LazyApplicationsTable />
    ) : (
        <EagerApplicationsTable />
    )
}
