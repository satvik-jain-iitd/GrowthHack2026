/* istanbul ignore file */
'use client'

import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'

import { useGetAllAdrs, AdrListItem } from '../hooks/useGetAllAdrs'
import { MetamodelDataTable } from '../../components/MetamodelDataTable'
import {
    TextCell,
    ListPopover,
    LinkCell,
    StatusBadge
} from '../../components/cells'
import { useLinkedNames } from '../../hooks/useLinkedNames'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import { notFound } from 'next/navigation'

const columnHelper = createColumnHelper<AdrListItem>()

const FILTER_PLACEHOLDERS: Record<string, string> = {
    id: 'Filter by ID…',
    name: 'Filter by name…'
}

/** List column whose row values are ids resolved to names for display. */
function resolvedColumn(
    id: keyof AdrListItem,
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

function useAdrsColumns(
    initiativeName: (id: string) => string,
    applicationName: (id: string) => string
) {
    return useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Name',
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
            columnHelper.accessor('displayUrl', {
                header: 'Display URL',
                size: 120,
                minSize: 90,
                enableSorting: false,
                cell: info => <LinkCell href={info.getValue()} />
            }),
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
            )
        ],
        [initiativeName, applicationName]
    )
}

export default function AdrsTable() {
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const { adrs, loading, error } = useGetAllAdrs()

    const initiativeIds = useMemo(
        () => adrs.flatMap(adr => adr.linkedInitiatives),
        [adrs]
    )
    const applicationIds = useMemo(
        () => adrs.flatMap(adr => adr.linkedApplications),
        [adrs]
    )
    const { initiativeName, applicationName } = useLinkedNames({
        initiativeIds,
        applicationIds
    })

    const columns = useAdrsColumns(initiativeName, applicationName)

    if (!isAdmin) {
        return notFound()
    }

    return (
        <MetamodelDataTable
            title='ADRs'
            subtitle='Browse and filter architecture decision records.'
            data={adrs}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            droppableId='adrs-table'
            emptyMessage='No ADRs match the current filters.'
        />
    )
}
