/* istanbul ignore file */
'use client'

import { useCallback, useMemo, useState } from 'react'
import {
    createColumnHelper,
    type ColumnFiltersState,
    type SortingState
} from '@tanstack/react-table'

import {
    useGetAllInitiatives,
    useGetAllInitiativesLazy,
    InitiativeListItem,
    toInitiativeListFilters,
    INITIATIVE_FILTER_PARAMS,
    INITIATIVE_SORT_FIELDS,
    INITIATIVES_LAZY_ENRICHMENT,
    INITIATIVES_PAGE_SIZE
} from '../hooks/useGetAllInitiatives'
import { MetamodelDataTable } from '../../components/MetamodelDataTable'
import {
    TextCell,
    ListPopover,
    ActorCell,
    ActorsCell,
    InitiativeTypeCell,
    getInitiativeType,
    Actor
} from '../../components/cells'
import { TechStacksCell } from './TechStacksCell'
import { useLinkedNames } from '../../hooks/useLinkedNames'
import { usePlaybooks } from '@/hooks/usePlaybooks'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import { usePilotGroup } from '@/hooks/usePilotGroup'
import { getPilotGroupId } from '@/constants/pilotGroups'
import { notFound } from 'next/navigation'

const columnHelper = createColumnHelper<InitiativeListItem>()

const FILTER_PLACEHOLDERS: Record<string, string> = {
    id: 'Filter by ID…',
    name: 'Filter by name…',
    lineOfBusiness: 'Filter by line of business…',
    etpEcmiId: 'Filter by ETP/ECMI ID…',
    legacyEtpEcmiId: 'Filter by legacy ETP/ECMI ID…',
    ownerUnitCio: 'Filter by Unit CIO…',
    ownerTechVp: 'Filter by Tech VP…',
    ownerHeadEngineer: 'Filter by head engineer…',
    ownerPrincipalArchitect: 'Filter by principal architect…',
    ownerEnterpriseArchitect: 'Filter by enterprise architect…',
    additionalArchitects: 'Filter by additional architect…',
    yearsActive: 'Filter by year…',
    initiativeType: 'Select types…'
}

/** Selecting ETP also matches ECMIs, since every ECMI is an ETP. */
const INITIATIVE_TYPE_OPTIONS = [
    { label: 'None', value: 'none' },
    { label: 'ETP', value: 'etp' },
    { label: 'ECMI', value: 'ecmi' }
]

/** Columns whose filter renders as a dropdown rather than a text input. */
const FILTER_OPTIONS: Record<string, { label: string; value: string }[]> = {
    initiativeType: INITIATIVE_TYPE_OPTIONS
}

/** Columns whose dropdown filter accepts several values at once. */
const MULTI_SELECT_COLUMN_IDS = ['initiativeType']

const TITLE = 'Initiatives'
const SUBTITLE = 'Browse and filter all initiatives, ETPs and ECMIs.'

/** Columns served by the lightweight list, so they never show a placeholder. */
const EAGER_COLUMN_IDS = ['id', 'name']

/** Columns architecture-metamodel can search, so only they offer a filter. */
const FILTERABLE_COLUMN_IDS = Object.keys(INITIATIVE_FILTER_PARAMS)

/** Sorting is server-side, so only the columns the API orders by are sortable. */
const isSortable = (columnId: string) => columnId in INITIATIVE_SORT_FIELDS

function listColumn(
    id: keyof InitiativeListItem,
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

/** List column whose row values are ids resolved to names for display. */
function resolvedListColumn(
    id: keyof InitiativeListItem,
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

/** Tech Stacks column: names resolved on demand from architecture-api. */
function techStacksColumn() {
    return columnHelper.accessor('technologyStacks', {
        header: 'Tech Stacks',
        size: 170,
        minSize: 120,
        enableSorting: false,
        cell: info => (
            <TechStacksCell
                initiativeId={info.row.original.id}
                count={(info.getValue() as string[])?.length ?? 0}
            />
        )
    })
}

/** Architecture Docs column: playbook ids resolved to names via architecture-api. */
function architectureDocsColumn(resolve: (id: string) => string) {
    return columnHelper.accessor('playbooks', {
        header: 'Architecture Docs',
        size: 190,
        minSize: 140,
        enableSorting: false,
        cell: info => {
            const playbooks = info.getValue() ?? []
            const items = playbooks.map(playbook =>
                resolve(playbook.playbookId)
            )
            return (
                <ListPopover
                    count={items.length}
                    items={items}
                    label='Architecture Docs'
                    colorPalette='pink'
                    badgeText={count => `${count} Architecture Docs`}
                />
            )
        }
    })
}

/** Derived type column rendered as a colored pill, filtered by multiselect. */
function initiativeTypeColumn() {
    return columnHelper.accessor(
        row => getInitiativeType(row.isEtp, row.isEcmi) ?? '',
        {
            id: 'initiativeType',
            header: 'Initiative Type',
            size: 150,
            minSize: 110,
            cell: info => (
                <InitiativeTypeCell
                    isEtp={info.row.original.isEtp}
                    isEcmi={info.row.original.isEcmi}
                />
            )
        }
    )
}

function textColumn(id: keyof InitiativeListItem, header: string, size = 200) {
    return columnHelper.accessor(id, {
        header,
        size,
        minSize: 120,
        enableSorting: isSortable(id),
        cell: info => <TextCell value={info.getValue() as string} />,
        filterFn: 'includesString'
    })
}

function actorColumn(id: keyof InitiativeListItem, header: string, size = 200) {
    return columnHelper.accessor(row => (row[id] as Actor)?.name ?? '', {
        id,
        header,
        size,
        minSize: 120,
        cell: info => <ActorCell actor={info.row.original[id] as Actor} />,
        filterFn: 'includesString'
    })
}

function actorsColumn(
    id: keyof InitiativeListItem,
    header: string,
    size = 200
) {
    return columnHelper.accessor(
        row => (row[id] as Actor[]).map(actor => actor.name).join(' '),
        {
            id,
            header,
            size,
            minSize: 120,
            cell: info => (
                <ActorsCell actors={info.row.original[id] as Actor[]} />
            ),
            filterFn: 'includesString'
        }
    )
}

/**
 * Search and sort are performed by architecture-metamodel, so the grid's
 * filter/sort state is translated into the list request. The metamodel list
 * response only carries id + name, so the searchable owner and attribute
 * columns act purely as server-side controls.
 */
function useServerSideFilters() {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])

    const filters = useMemo(
        () => toInitiativeListFilters(columnFilters, sorting),
        [columnFilters, sorting]
    )

    return {
        filters,
        onFiltersChange: setColumnFilters,
        onSortingChange: setSorting
    }
}

interface InitiativesColumnResolvers {
    businessCapabilityName: (id: string) => string
    technicalCapabilityName: (id: string) => string
    foundationalTechnologyName: (id: string) => string
    playbookName: (id: string) => string
}

function useInitiativesColumns({
    businessCapabilityName,
    technicalCapabilityName,
    foundationalTechnologyName,
    playbookName
}: InitiativesColumnResolvers) {
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
            textColumn('startDate', 'Start Date', 130),
            textColumn('endDate', 'End Date', 130),
            textColumn('yearsActive', 'Years Active', 140),
            textColumn('lineOfBusiness', 'Line of Business'),
            listColumn(
                'strategicEpics',
                'Strategic Epics',
                'Strategic Epics',
                'yellow'
            ),
            textColumn('etpEcmiId', 'ETP/ECMI ID', 140),
            textColumn('legacyEtpEcmiId', 'Legacy ETP/ECMI ID', 160),
            initiativeTypeColumn(),
            actorColumn('ownerUnitCio', 'Unit CIO', 200),
            actorColumn('ownerTechVp', 'Tech VP', 200),
            actorColumn('ownerHeadEngineer', 'Head Engineer', 200),
            actorColumn('ownerPrincipalArchitect', 'Principal Architect', 210),
            actorColumn(
                'ownerEnterpriseArchitect',
                'Enterprise Architect',
                210
            ),
            actorsColumn('additionalArchitects', 'Additional Architects', 210),
            listColumn(
                'supportedBusinessUnits',
                'Business Units',
                'Supported Business Units',
                'blue'
            ),
            listColumn(
                'supportedMarkets',
                'Markets',
                'Supported Markets',
                'teal'
            ),
            techStacksColumn(),
            resolvedListColumn(
                'techCapabilities',
                'Tech Capabilities',
                'Technical Capabilities',
                'cyan',
                technicalCapabilityName
            ),
            resolvedListColumn(
                'businessCapabilities',
                'Business Capabilities',
                'Business Capabilities',
                'green',
                businessCapabilityName
            ),
            resolvedListColumn(
                'foundationalTechnologies',
                'Foundational Tech',
                'Foundational Technologies',
                'orange',
                foundationalTechnologyName
            ),
            architectureDocsColumn(playbookName),
            listColumn(
                'linkedInitiatives',
                'Linked Initiatives',
                'Linked Initiatives',
                'blue'
            ),
            listColumn(
                'impactedApplications',
                'Impacted Applications',
                'Impacted Applications',
                'teal'
            ),
            listColumn('linkedAdrs', 'Linked ADRs', 'Linked ADRs', 'purple'),
            listColumn('linkedBvbs', 'Linked BvBs', 'Linked BvBs', 'orange'),
            listColumn(
                'impactedCompanyDomains',
                'Company Domains',
                'Impacted Company Domains',
                'green'
            )
        ],
        [
            businessCapabilityName,
            technicalCapabilityName,
            foundationalTechnologyName,
            playbookName
        ]
    )
}

/**
 * Resolves the linked-entity id → name maps the grid's popover columns need.
 * Only ids present on the supplied rows are looked up, so with lazy
 * enrichment this is scoped to the visible page.
 */
function useResolvedColumns(initiatives: InitiativeListItem[]) {
    const businessCapabilityIds = useMemo(
        () =>
            initiatives.flatMap(initiative => initiative.businessCapabilities),
        [initiatives]
    )
    const technicalCapabilityIds = useMemo(
        () => initiatives.flatMap(initiative => initiative.techCapabilities),
        [initiatives]
    )
    const foundationalTechnologyIds = useMemo(
        () =>
            initiatives.flatMap(
                initiative => initiative.foundationalTechnologies
            ),
        [initiatives]
    )

    const {
        businessCapabilityName,
        technicalCapabilityName,
        foundationalTechnologyName
    } = useLinkedNames({
        businessCapabilityIds,
        technicalCapabilityIds,
        foundationalTechnologyIds
    })

    const { playbooks } = usePlaybooks()
    const playbookName = useMemo(() => {
        const map: Record<string, string> = {}
        for (const playbook of playbooks) {
            map[playbook.playbook_id] = playbook.playbook_nm
        }
        return (id: string) => map[id] ?? id
    }, [playbooks])

    return useInitiativesColumns({
        businessCapabilityName,
        technicalCapabilityName,
        foundationalTechnologyName,
        playbookName
    })
}

/** Paginated grid that enriches only the rows on the current page. */
function LazyInitiativesTable() {
    const [visibleIds, setVisibleIds] = useState<string[]>([])
    const onVisibleIdsChange = useCallback((ids: string[]) => {
        setVisibleIds(prev => (prev.join(',') === ids.join(',') ? prev : ids))
    }, [])

    const { filters, onFiltersChange, onSortingChange } = useServerSideFilters()
    const { initiatives, loading, error, total, pendingIds } =
        useGetAllInitiativesLazy(visibleIds, filters)
    const columns = useResolvedColumns(initiatives)

    return (
        <MetamodelDataTable
            title={TITLE}
            subtitle={SUBTITLE}
            data={initiatives}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            filterOptions={FILTER_OPTIONS}
            multiSelectColumnIds={MULTI_SELECT_COLUMN_IDS}
            filterableColumnIds={FILTERABLE_COLUMN_IDS}
            onFiltersChange={onFiltersChange}
            onSortingChange={onSortingChange}
            manualFilterSort
            totalCount={total}
            droppableId='initiatives-table'
            emptyMessage='No initiatives match the current filters.'
            paginated
            pageSize={INITIATIVES_PAGE_SIZE}
            onVisibleIdsChange={onVisibleIdsChange}
            pendingRowIds={pendingIds}
            eagerColumnIds={EAGER_COLUMN_IDS}
        />
    )
}

/** Eager grid that enriches every row up front (used when lazy is disabled). */
function EagerInitiativesTable() {
    const { filters, onFiltersChange, onSortingChange } = useServerSideFilters()
    const { initiatives, loading, error, total } = useGetAllInitiatives(filters)
    const columns = useResolvedColumns(initiatives)

    return (
        <MetamodelDataTable
            title={TITLE}
            subtitle={SUBTITLE}
            data={initiatives}
            loading={loading}
            error={error}
            columns={columns}
            filterPlaceholders={FILTER_PLACEHOLDERS}
            filterOptions={FILTER_OPTIONS}
            multiSelectColumnIds={MULTI_SELECT_COLUMN_IDS}
            filterableColumnIds={FILTERABLE_COLUMN_IDS}
            onFiltersChange={onFiltersChange}
            onSortingChange={onSortingChange}
            manualFilterSort
            totalCount={total}
            droppableId='initiatives-table'
            emptyMessage='No initiatives match the current filters.'
        />
    )
}

export default function InitiativesTable() {
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const userEmail = user?.attributes?.email || ''

    const pilotGroupId = getPilotGroupId('INITIATIVES_TABLE_PILOT_GROUP')
    const { pilotGroup, isLoading } = usePilotGroup(pilotGroupId)
    const InitiativesTablePilotGroupMembers = pilotGroup?.members || []

    const showTable =
        InitiativesTablePilotGroupMembers.some(
            member => member === userEmail.toLowerCase()
        ) || isAdmin

    if (!isLoading && !showTable) {
        return notFound()
    }

    if (!showTable) {
        return null
    }

    return INITIATIVES_LAZY_ENRICHMENT ? (
        <LazyInitiativesTable />
    ) : (
        <EagerInitiativesTable />
    )
}
