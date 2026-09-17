/* istanbul ignore file */
'use client'

import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'

import {
    useGetAllCompanyDomains,
    CompanyDomainListItem
} from '../hooks/useGetAllCompanyDomains'
import { MetamodelDataTable } from '../../components/MetamodelDataTable'
import { TextCell, ListPopover, ActorCell, Actor } from '../../components/cells'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import { notFound } from 'next/navigation'

const columnHelper = createColumnHelper<CompanyDomainListItem>()

const FILTER_PLACEHOLDERS: Record<string, string> = {
    id: 'Filter by ID…',
    name: 'Filter by name…'
}

function listColumn(
    id: keyof CompanyDomainListItem,
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

function textColumn(
    id: keyof CompanyDomainListItem,
    header: string,
    size = 200
) {
    return columnHelper.accessor(id, {
        header,
        size,
        minSize: 120,
        cell: info => <TextCell value={info.getValue() as string} />,
        filterFn: 'includesString'
    })
}

function actorColumn(
    id: keyof CompanyDomainListItem,
    header: string,
    size = 200
) {
    return columnHelper.accessor(row => (row[id] as Actor)?.name ?? '', {
        id,
        header,
        size,
        minSize: 120,
        cell: info => <ActorCell actor={info.row.original[id] as Actor} />,
        filterFn: 'includesString'
    })
}

function useCompanyDomainsColumns() {
    return useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Name',
                size: 280,
                minSize: 200,
                cell: info => (
                    <TextCell value={info.getValue()} fontWeight={600} />
                ),
                filterFn: 'includesString'
            }),
            textColumn('shortDescription', 'Short Description', 260),
            textColumn('description', 'Description', 320),
            actorColumn('ownerUnitCio', 'Unit CIO', 200),
            actorColumn('ownerTechnologyOwner', 'Technology Owner', 200),
            actorColumn(
                'ownerPrincipalEaArchitect',
                'Principal EA Architect',
                210
            ),
            actorColumn('ownerEaArchitect', 'EA Architect', 200),
            actorColumn('ownerHeadEngineer', 'Head Engineer', 200),
            actorColumn(
                'ownerEaArchitectDelegate',
                'EA Architect Delegate',
                210
            ),
            listColumn(
                'linkedApplications',
                'Linked Applications',
                'Linked Applications',
                'teal'
            )
        ],
        []
    )
}

export default function CompanyDomainsTable() {
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const { companyDomains, loading, error } = useGetAllCompanyDomains()
    const columns = useCompanyDomainsColumns()

    if (!isAdmin) {
        return notFound()
    }

    return (
        <MetamodelDataTable
            title='Company Domains'
            subtitle='Browse and filter company domains.'
            data={companyDomains}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            droppableId='company-domains-table'
            emptyMessage='No company domains match the current filters.'
        />
    )
}
