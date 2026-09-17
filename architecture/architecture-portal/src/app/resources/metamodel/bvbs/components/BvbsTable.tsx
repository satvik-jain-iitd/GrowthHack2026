/* istanbul ignore file */
'use client'

import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'

import { useGetAllBvbs, BvbListItem } from '../hooks/useGetAllBvbs'
import { MetamodelDataTable } from '../../components/MetamodelDataTable'
import { TextCell, ListPopover, StatusBadge } from '../../components/cells'
import { useLinkedNames } from '../../hooks/useLinkedNames'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import { notFound } from 'next/navigation'

const columnHelper = createColumnHelper<BvbListItem>()

const FILTER_PLACEHOLDERS: Record<string, string> = {
    id: 'Filter by ID…',
    title: 'Filter by title…'
}

function textColumn(id: keyof BvbListItem, header: string, size = 150) {
    return columnHelper.accessor(id, {
        header,
        size,
        minSize: 100,
        cell: info => <TextCell value={info.getValue() as string} />,
        filterFn: 'includesString'
    })
}

/** List column whose row values are ids resolved to names for display. */
function resolvedColumn(
    id: keyof BvbListItem,
    header: string,
    label: string,
    colorPalette: string,
    resolve: (id: string) => string
) {
    return columnHelper.accessor(id, {
        header,
        size: 170,
        minSize: 120,
        enableSorting: false,
        cell: info => {
            const ids = (info.getValue() as string[]) ?? []
            const items = ids.map(resolve)
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

function useBvbsColumns(
    initiativeName: (id: string) => string,
    applicationName: (id: string) => string,
    adrName: (id: string) => string
) {
    return useMemo(
        () => [
            columnHelper.accessor('title', {
                header: 'Title',
                size: 320,
                minSize: 200,
                cell: info => (
                    <TextCell value={info.getValue()} fontWeight={600} />
                ),
                filterFn: 'includesString'
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                size: 150,
                minSize: 100,
                cell: info => <StatusBadge value={info.getValue()} />,
                filterFn: 'includesString'
            }),
            textColumn('overallRisk', 'Overall Risk'),
            textColumn('estimatedCost', 'Estimated Cost'),
            textColumn('etpImpacting', 'ETP Impacting'),
            textColumn('creationDate', 'Creation Date'),
            textColumn('completionDate', 'Completion Date'),
            resolvedColumn(
                'linkedInitiatives',
                'Linked Initiatives',
                'Linked Initiatives',
                'blue',
                initiativeName
            ),
            resolvedColumn(
                'linkedApplications',
                'Linked Applications',
                'Linked Applications',
                'teal',
                applicationName
            ),
            resolvedColumn(
                'linkedAdrs',
                'Linked ADRs',
                'Linked ADRs',
                'purple',
                adrName
            )
        ],
        [initiativeName, applicationName, adrName]
    )
}

export default function BvbsTable() {
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const { bvbs, loading, error } = useGetAllBvbs()

    const initiativeIds = useMemo(
        () => bvbs.flatMap(bvb => bvb.linkedInitiatives),
        [bvbs]
    )
    const applicationIds = useMemo(
        () => bvbs.flatMap(bvb => bvb.linkedApplications),
        [bvbs]
    )
    const resolveAdrs = useMemo(
        () => bvbs.some(bvb => bvb.linkedAdrs.length > 0),
        [bvbs]
    )
    const { initiativeName, applicationName, adrName } = useLinkedNames({
        initiativeIds,
        applicationIds,
        resolveAdrs
    })

    const columns = useBvbsColumns(initiativeName, applicationName, adrName)

    if (!isAdmin) {
        return notFound()
    }

    return (
        <MetamodelDataTable
            title='Build vs Buy Assessments'
            subtitle='Browse and filter build-vs-buy assessments.'
            data={bvbs}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            droppableId='bvbs-table'
            emptyMessage='No BvBs match the current filters.'
        />
    )
}
