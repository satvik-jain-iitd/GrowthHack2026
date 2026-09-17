/* istanbul ignore file */
'use client'

import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'

import {
    useGetAllTechnicalCapabilities,
    TechnicalCapabilityListItem
} from '../hooks/useGetAllTechnicalCapabilities'
import { MetamodelDataTable } from '../../components/MetamodelDataTable'
import { TextCell } from '../../components/cells'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import { notFound } from 'next/navigation'

const columnHelper = createColumnHelper<TechnicalCapabilityListItem>()

const FILTER_PLACEHOLDERS: Record<string, string> = {
    id: 'Filter by ID…',
    name: 'Filter by name…'
}

function useTechnicalCapabilitiesColumns() {
    return useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Name',
                size: 360,
                minSize: 200,
                cell: info => (
                    <TextCell value={info.getValue()} fontWeight={600} />
                ),
                filterFn: 'includesString'
            }),
            columnHelper.accessor('id', {
                header: 'Technical Capability ID',
                size: 320,
                minSize: 160,
                cell: info => <TextCell value={info.getValue()} />,
                filterFn: 'includesString'
            })
        ],
        []
    )
}

export default function TechnicalCapabilitiesTable() {
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const { technicalCapabilities, loading, error } =
        useGetAllTechnicalCapabilities()
    const columns = useTechnicalCapabilitiesColumns()

    if (!isAdmin) {
        return notFound()
    }

    return (
        <MetamodelDataTable
            title='Technical Capabilities'
            subtitle='Browse and filter technical capabilities.'
            data={technicalCapabilities}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            droppableId='technical-capabilities-table'
            emptyMessage='No technical capabilities match the current filters.'
        />
    )
}
