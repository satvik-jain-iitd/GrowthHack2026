/* istanbul ignore file */
'use client'

import { useState, useEffect, useMemo, type CSSProperties } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    ColumnResizeMode,
    SortingState,
    ColumnFiltersState,
    PaginationState
} from '@tanstack/react-table'
import {
    Box,
    Flex,
    Icon,
    Skeleton,
    Spinner,
    Table,
    Text
} from '@chakra-ui/react'
import { IconSortDown, IconSortUp } from '@americanexpress/dls-icons'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from '@hello-pangea/dnd'

import { DragHandle } from './cells/DragHandle'
import { ResizeHandle } from './cells/ResizeHandle'
import { FilterPopover } from './cells/FilterPopover'
import { PaginationControls } from './cells/PaginationControls'
import { SkeletonCell } from './cells/SkeletonCell'
import { MetamodelTableHeader } from './MetamodelTableHeader'
import { getRowRangeLabel } from './rowRange'
import { getPinnedColumnStyles } from './pinnedColumns'

/** Horizontal padding of the scroll container, in px (`px={6}`). */
const SCROLL_AREA_PADDING_PX = 0

const DEFAULT_PINNED_COLUMN_IDS = ['name']

export interface MetamodelDataTableProps<TData extends { id: string }> {
    /** Page banner title */
    title: string
    /** Page banner subtitle */
    subtitle: string
    /** Row data — must include an `id` field for drag-and-drop keying */
    data: TData[]
    loading: boolean
    error: Error | null
    /** TanStack column definitions (drag-handle column is prepended automatically) */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<TData, any>[]
    /** Maps column id → filter input placeholder text */
    filterPlaceholders?: Record<string, string>
    /**
     * Maps column id → the options its filter renders as a dropdown instead of
     * a free-text input (e.g. Yes/No columns).
     */
    filterOptions?: Record<string, { label: string; value: string }[]>
    /**
     * Columns whose `filterOptions` render as a checkbox multiselect, filtering
     * on every selected value.
     */
    multiSelectColumnIds?: string[]
    /**
     * Columns that expose a filter control. Defaults to every column; supply it
     * when only some columns can be searched (e.g. server-side search).
     */
    filterableColumnIds?: string[]
    /** Reports the active column filters so a consumer can search server-side. */
    onFiltersChange?: (filters: ColumnFiltersState) => void
    /** Reports the active sorting so a consumer can sort server-side. */
    onSortingChange?: (sorting: SortingState) => void
    /**
     * Filtering and sorting are performed by the API, so the client row models
     * for them are skipped (they would otherwise re-apply both to the rows
     * already loaded).
     */
    manualFilterSort?: boolean
    /**
     * Row count reported by the API. Defaults to the number of loaded rows;
     * supply it when the server filters, so the label reflects the full match
     * count rather than what is loaded.
     */
    totalCount?: number
    /** Must be unique across all Droppable contexts on the page */
    droppableId: string
    /** Shown when no rows match the active filters */
    emptyMessage?: string
    /** Called after the user drops a row into a new position */
    onRowReorder?: (reorderedData: TData[]) => void
    /**
     * Enables client-side pagination. Drag-to-reorder is disabled while
     * paginated. Defaults to false (render every row).
     */
    paginated?: boolean
    /** Page size when `paginated`. Defaults to 25. */
    pageSize?: number
    /**
     * When `paginated`, reports the ids of the rows on the current page
     * whenever they change. Used for lazy detail enrichment. The callback
     * should be referentially stable (wrap in `useCallback`).
     */
    onVisibleIdsChange?: (ids: string[]) => void
    /**
     * Ids of rows whose lazily-fetched columns are still loading. Those cells
     * render placeholders instead of the empty values the row currently holds.
     */
    pendingRowIds?: ReadonlySet<string>
    /**
     * Columns backed by data that is available before enrichment, so they keep
     * rendering real values while a row is pending. The drag column is always
     * treated as eager.
     */
    eagerColumnIds?: string[]
    /**
     * Columns that stay in place while the grid scrolls horizontally, pinned to
     * the left edge in render order. The drag column is pinned alongside them so
     * rows never slide under it. Ids no column defines are ignored.
     */
    pinnedColumnIds?: string[]
}

/**
 * Generic, reusable Metamodel data table with:
 * - Sortable, resizable, filterable columns
 * - Drag-to-reorder rows (disabled while sorted)
 * - Company Domains–style page header
 */
export function MetamodelDataTable<TData extends { id: string }>({
    title,
    subtitle,
    data,
    loading,
    error,
    columns: userColumns,
    filterPlaceholders = {},
    filterOptions = {},
    multiSelectColumnIds = [],
    filterableColumnIds,
    onFiltersChange,
    onSortingChange,
    manualFilterSort = false,
    totalCount,
    droppableId,
    emptyMessage = 'No results match the current filters.',
    onRowReorder,
    paginated = false,
    pageSize = 25,
    onVisibleIdsChange,
    pendingRowIds,
    eagerColumnIds = [],
    pinnedColumnIds = DEFAULT_PINNED_COLUMN_IDS
}: MetamodelDataTableProps<TData>) {
    const [rowData, setRowData] = useState<TData[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize
    })

    useEffect(() => {
        setRowData(data)
    }, [data])

    // Dragging reorders the underlying array, which is meaningless once the
    // grid only renders a slice, so disable it while paginated (or sorted).
    const isDragDisabled = paginated || sorting.length > 0

    // Prepend fixed drag-handle column so consumers don't need to define it
    const columns = useMemo<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ColumnDef<TData, any>[]
    >(
        () => [
            {
                id: '_drag',
                size: 36,
                minSize: 36,
                maxSize: 36,
                enableResizing: false,
                enableSorting: false,
                header: () => null,
                cell: () => <DragHandle />
            },
            ...userColumns
        ],
        [userColumns]
    )

    const table = useReactTable({
        data: rowData,
        columns,
        state: {
            sorting,
            columnFilters,
            ...(paginated ? { pagination } : {})
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        ...(manualFilterSort
            ? { manualFiltering: true, manualSorting: true }
            : {
                  getSortedRowModel: getSortedRowModel(),
                  getFilteredRowModel: getFilteredRowModel()
              }),
        ...(paginated
            ? { getPaginationRowModel: getPaginationRowModel() }
            : {}),
        // Rows are re-created on every lazy enrichment, which would otherwise
        // bounce the user back to page 1; page resets are handled explicitly.
        autoResetPageIndex: false,
        columnResizeMode: 'onChange' as ColumnResizeMode,
        enableColumnResizing: true,
        defaultColumn: { minSize: 60, maxSize: 800 }
    })

    // Report the ids of the rows on the current page so the consumer can
    // lazily enrich just those rows. Keyed on the joined ids so it only fires
    // when the visible page actually changes (not on every enrichment).
    // Filtering can shrink the row set past the current page.
    const filterKey = JSON.stringify(columnFilters)
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, [filterKey])

    useEffect(() => {
        onFiltersChange?.(JSON.parse(filterKey) as ColumnFiltersState)
    }, [filterKey, onFiltersChange])

    const sortingKey = JSON.stringify(sorting)
    useEffect(() => {
        onSortingChange?.(JSON.parse(sortingKey) as SortingState)
    }, [sortingKey, onSortingChange])

    const pageRowIds = table.getRowModel().rows.map(row => row.original.id)
    const pageRowIdsKey = pageRowIds.join(',')
    useEffect(() => {
        if (!paginated || !onVisibleIdsChange) return
        onVisibleIdsChange(pageRowIdsKey ? pageRowIdsKey.split(',') : [])
    }, [pageRowIdsKey, paginated, onVisibleIdsChange])

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return
        if (result.source.index === result.destination.index) return

        const rendered = table.getRowModel().rows
        const sourceId = rendered[result.source.index]?.original.id
        const destId = rendered[result.destination.index]?.original.id
        if (!sourceId || !destId) return

        setRowData(prev => {
            const sourceIdx = prev.findIndex(r => r.id === sourceId)
            const destIdx = prev.findIndex(r => r.id === destId)
            const next = [...prev]
            const [moved] = next.splice(sourceIdx, 1)
            next.splice(destIdx, 0, moved)
            onRowReorder?.(next)
            return next
        })
    }

    const eagerColumns = useMemo(
        () => new Set(['_drag', ...eagerColumnIds]),
        [eagerColumnIds]
    )

    const isCellPending = (rowId: string, columnId: string) =>
        Boolean(pendingRowIds?.has(rowId)) && !eagerColumns.has(columnId)

    const leafColumns = table.getAllLeafColumns()
    // Offsets follow the live column sizes so they stay correct after resizing.
    const leafSizesKey = leafColumns
        .map(column => `${column.id}:${column.getSize()}`)
        .join(',')
    const pinnedStyles = useMemo(
        () =>
            getPinnedColumnStyles(
                leafSizesKey.split(',').map(entry => {
                    const [id, size] = entry.split(':')
                    return { id, size: Number(size) }
                }),
                pinnedColumnIds.length ? ['_drag', ...pinnedColumnIds] : []
            ),
        [leafSizesKey, pinnedColumnIds]
    )

    /** Sticky styles for a pinned cell, or `undefined` when it isn't pinned. */
    const pinnedCellStyle = (
        columnId: string,
        zIndex: number
    ): CSSProperties | undefined => {
        const pinned = pinnedStyles[columnId]
        if (!pinned) return undefined
        return {
            position: 'sticky',
            left: SCROLL_AREA_PADDING_PX + pinned.left,
            zIndex,
            background: 'inherit',
            ...(pinned.isLast
                ? {
                      boxShadow:
                          'inset -1px 0 0 var(--chakra-colors-border), 2px 0 4px -2px rgba(0, 0, 0, 0.15)'
                  }
                : {})
        }
    }

    // A paginated grid loads its lightweight list fast, so show the real header
    // over placeholder rows instead of a spinner that swaps the whole layout.
    const showSkeletonRows = loading && paginated

    const canFilter = (columnId: string) =>
        !filterableColumnIds || filterableColumnIds.includes(columnId)

    const getFilterValue = (columnId: string): string | string[] =>
        (columnFilters.find(f => f.id === columnId)?.value as
            | string
            | string[]) ?? (multiSelectColumnIds.includes(columnId) ? [] : '')

    const setFilterValue = (columnId: string, value: string | string[]) => {
        setColumnFilters(prev => {
            const rest = prev.filter(f => f.id !== columnId)
            return value.length ? [...rest, { id: columnId, value }] : rest
        })
    }

    return (
        <Box w='100%'>
            <MetamodelTableHeader title={title} subtitle={subtitle} />

            {loading && !showSkeletonRows ? (
                <Flex justify='center' align='center' minH='300px'>
                    <Spinner size='xl' color='blue.500' />
                </Flex>
            ) : error ? (
                <Flex
                    justify='center'
                    align='center'
                    minH='200px'
                    direction='column'
                    gap={2}
                >
                    <Text color='red.500' fontWeight='semibold'>
                        Failed to load data
                    </Text>
                    <Text fontSize='sm' color='fg.muted'>
                        {error.message}
                    </Text>
                </Flex>
            ) : (
                <Box w='100%'>
                    <Flex
                        px={6}
                        pb={2}
                        gap={4}
                        align='center'
                        justify='space-between'
                        wrap='wrap'
                    >
                        <Text fontSize='sm' color='fg.muted' textAlign='left'>
                            {showSkeletonRows ? (
                                <Skeleton
                                    height='16px'
                                    width='140px'
                                    borderRadius='sm'
                                />
                            ) : (
                                getRowRangeLabel({
                                    filteredCount: manualFilterSort
                                        ? (totalCount ?? data.length)
                                        : table.getFilteredRowModel().rows
                                              .length,
                                    totalCount: totalCount ?? data.length,
                                    ...(paginated
                                        ? {
                                              pageIndex:
                                                  table.getState().pagination
                                                      .pageIndex,
                                              pageSize:
                                                  table.getState().pagination
                                                      .pageSize
                                          }
                                        : {})
                                })
                            )}
                        </Text>
                        {paginated && !showSkeletonRows && (
                            <PaginationControls
                                pageIndex={
                                    table.getState().pagination.pageIndex
                                }
                                pageCount={Math.max(table.getPageCount(), 1)}
                                onPageChange={pageIndex =>
                                    table.setPageIndex(pageIndex)
                                }
                            />
                        )}
                    </Flex>
                    {isDragDisabled && (
                        <Text
                            fontSize='xs'
                            color='fg.muted'
                            px={4}
                            pb={1}
                            textAlign='right'
                        >
                            Clear sort to enable row dragging
                        </Text>
                    )}
                    <Table.ScrollArea
                        minH='300px'
                        maxH='80vh'
                        px={6}
                        scrollbar={'hidden'}
                    >
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Table.Root
                                size='md'
                                stickyHeader
                                style={{
                                    tableLayout: 'fixed',
                                    width: '100%',
                                    minWidth: table.getTotalSize() + 'px'
                                }}
                            >
                                <Table.Header>
                                    {/* Chakra sticks the header row at z-index 1,
                                        which the pinned body cells would cover as
                                        they scroll past. */}
                                    <Table.Row
                                        bg='bg.subtle'
                                        h='56px'
                                        style={{ zIndex: 4 }}
                                    >
                                        {table
                                            .getHeaderGroups()
                                            .flatMap(hg => hg.headers)
                                            .map(header => {
                                                const colId = header.id
                                                const isDragCol =
                                                    colId === '_drag'
                                                const canSort =
                                                    header.column.getCanSort()
                                                const sortDir =
                                                    header.column.getIsSorted()
                                                const hasFilter =
                                                    getFilterValue(colId)
                                                        .length > 0

                                                return (
                                                    <Table.ColumnHeader
                                                        key={colId}
                                                        verticalAlign='middle'
                                                        colorPalette='gray.subtle'
                                                        position='relative'
                                                        style={{
                                                            width: header.getSize(),
                                                            overflow: 'hidden',
                                                            ...pinnedCellStyle(
                                                                colId,
                                                                3
                                                            )
                                                        }}
                                                    >
                                                        {!isDragCol && (
                                                            <Flex
                                                                align='center'
                                                                gap={1}
                                                                justify='space-between'
                                                            >
                                                                {/* Sort icon + label */}
                                                                <Flex
                                                                    align='center'
                                                                    gap={1}
                                                                    flex={1}
                                                                    minW={0}
                                                                    overflow='hidden'
                                                                    fontWeight='semibold'
                                                                    fontSize='sm'
                                                                    cursor={
                                                                        canSort
                                                                            ? 'pointer'
                                                                            : 'default'
                                                                    }
                                                                    userSelect='none'
                                                                    onClick={header.column.getToggleSortingHandler()}
                                                                >
                                                                    {canSort && (
                                                                        <Icon
                                                                            as={
                                                                                sortDir ===
                                                                                'asc'
                                                                                    ? IconSortUp
                                                                                    : IconSortDown
                                                                            }
                                                                            boxSize={
                                                                                4
                                                                            }
                                                                            color={
                                                                                sortDir
                                                                                    ? 'fg'
                                                                                    : 'fg.subtle'
                                                                            }
                                                                            opacity={
                                                                                sortDir
                                                                                    ? 1
                                                                                    : 0.35
                                                                            }
                                                                            flexShrink={
                                                                                0
                                                                            }
                                                                        />
                                                                    )}
                                                                    <Text
                                                                        as='span'
                                                                        overflow='hidden'
                                                                        textOverflow='ellipsis'
                                                                        whiteSpace='nowrap'
                                                                    >
                                                                        {flexRender(
                                                                            header
                                                                                .column
                                                                                .columnDef
                                                                                .header,
                                                                            header.getContext()
                                                                        )}
                                                                    </Text>
                                                                </Flex>

                                                                {/* Filter icon + active dot */}
                                                                <Flex
                                                                    align='center'
                                                                    gap={1}
                                                                    flexShrink={
                                                                        0
                                                                    }
                                                                >
                                                                    {canFilter(
                                                                        colId
                                                                    ) && (
                                                                        <FilterPopover
                                                                            columnId={
                                                                                colId
                                                                            }
                                                                            value={getFilterValue(
                                                                                colId
                                                                            )}
                                                                            onChange={v =>
                                                                                setFilterValue(
                                                                                    colId,
                                                                                    v
                                                                                )
                                                                            }
                                                                            placeholder={
                                                                                filterPlaceholders[
                                                                                    colId
                                                                                ] ??
                                                                                'Filter…'
                                                                            }
                                                                            options={
                                                                                filterOptions[
                                                                                    colId
                                                                                ]
                                                                            }
                                                                            multiple={multiSelectColumnIds.includes(
                                                                                colId
                                                                            )}
                                                                        />
                                                                    )}
                                                                    {hasFilter && (
                                                                        <Box
                                                                            w='6px'
                                                                            h='6px'
                                                                            borderRadius='full'
                                                                            bg='blue.500'
                                                                            flexShrink={
                                                                                0
                                                                            }
                                                                        />
                                                                    )}
                                                                </Flex>
                                                            </Flex>
                                                        )}

                                                        {header.column.getCanResize() && (
                                                            <ResizeHandle
                                                                onMouseDown={e =>
                                                                    header.getResizeHandler()(
                                                                        e
                                                                    )
                                                                }
                                                                onTouchStart={e =>
                                                                    header.getResizeHandler()(
                                                                        e
                                                                    )
                                                                }
                                                                isResizing={header.column.getIsResizing()}
                                                            />
                                                        )}
                                                    </Table.ColumnHeader>
                                                )
                                            })}
                                    </Table.Row>
                                </Table.Header>

                                <Droppable droppableId={droppableId}>
                                    {provided => (
                                        <Table.Body
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {showSkeletonRows ? (
                                                Array.from({
                                                    length: pageSize
                                                }).map((_, rowIndex) => (
                                                    <Table.Row
                                                        key={`skeleton-${rowIndex}`}
                                                        bg='bg.muted'
                                                    >
                                                        {leafColumns.map(
                                                            column => (
                                                                <Table.Cell
                                                                    key={`skeleton-${rowIndex}-${column.id}`}
                                                                    verticalAlign='middle'
                                                                    py={3}
                                                                    style={{
                                                                        width: column.getSize(),
                                                                        overflow:
                                                                            'hidden',
                                                                        ...pinnedCellStyle(
                                                                            column.id,
                                                                            1
                                                                        )
                                                                    }}
                                                                >
                                                                    {column.id ===
                                                                    '_drag' ? null : (
                                                                        <SkeletonCell
                                                                            rowId={`skeleton-${rowIndex}`}
                                                                            columnId={
                                                                                column.id
                                                                            }
                                                                        />
                                                                    )}
                                                                </Table.Cell>
                                                            )
                                                        )}
                                                    </Table.Row>
                                                ))
                                            ) : table.getRowModel().rows
                                                  .length === 0 ? (
                                                <Table.Row>
                                                    <Table.Cell
                                                        colSpan={columns.length}
                                                        textAlign='center'
                                                        py={12}
                                                        color='fg.muted'
                                                    >
                                                        {emptyMessage}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ) : (
                                                table
                                                    .getRowModel()
                                                    .rows.map((row, index) => (
                                                        <Draggable
                                                            key={
                                                                row.original.id
                                                            }
                                                            draggableId={
                                                                row.original.id
                                                            }
                                                            index={index}
                                                            isDragDisabled={
                                                                isDragDisabled
                                                            }
                                                        >
                                                            {(
                                                                dragProvided,
                                                                snapshot
                                                            ) => (
                                                                <Table.Row
                                                                    ref={
                                                                        dragProvided.innerRef
                                                                    }
                                                                    {...dragProvided.draggableProps}
                                                                    bg={
                                                                        snapshot.isDragging
                                                                            ? 'bg.emphasized'
                                                                            : 'bg.muted'
                                                                    }
                                                                    _hover={{
                                                                        bg: snapshot.isDragging
                                                                            ? 'bg.emphasized'
                                                                            : 'bg.subtle'
                                                                    }}
                                                                    boxShadow={
                                                                        snapshot.isDragging
                                                                            ? 'lg'
                                                                            : 'none'
                                                                    }
                                                                    transition='background 0.15s'
                                                                    style={{
                                                                        ...dragProvided
                                                                            .draggableProps
                                                                            .style
                                                                    }}
                                                                >
                                                                    {row
                                                                        .getVisibleCells()
                                                                        .map(
                                                                            cell => {
                                                                                const isDragCell =
                                                                                    cell
                                                                                        .column
                                                                                        .id ===
                                                                                    '_drag'
                                                                                return (
                                                                                    <Table.Cell
                                                                                        key={
                                                                                            cell.id
                                                                                        }
                                                                                        verticalAlign='middle'
                                                                                        py={
                                                                                            3
                                                                                        }
                                                                                        style={{
                                                                                            width: cell.column.getSize(),
                                                                                            maxWidth:
                                                                                                cell.column.getSize(),
                                                                                            overflow:
                                                                                                'hidden',
                                                                                            ...pinnedCellStyle(
                                                                                                cell
                                                                                                    .column
                                                                                                    .id,
                                                                                                1
                                                                                            )
                                                                                        }}
                                                                                        {...(isDragCell
                                                                                            ? dragProvided.dragHandleProps
                                                                                            : {})}
                                                                                        cursor={
                                                                                            isDragCell
                                                                                                ? isDragDisabled
                                                                                                    ? 'not-allowed'
                                                                                                    : 'grab'
                                                                                                : undefined
                                                                                        }
                                                                                    >
                                                                                        {isCellPending(
                                                                                            row
                                                                                                .original
                                                                                                .id,
                                                                                            cell
                                                                                                .column
                                                                                                .id
                                                                                        ) ? (
                                                                                            <SkeletonCell
                                                                                                rowId={
                                                                                                    row
                                                                                                        .original
                                                                                                        .id
                                                                                                }
                                                                                                columnId={
                                                                                                    cell
                                                                                                        .column
                                                                                                        .id
                                                                                                }
                                                                                            />
                                                                                        ) : (
                                                                                            flexRender(
                                                                                                cell
                                                                                                    .column
                                                                                                    .columnDef
                                                                                                    .cell,
                                                                                                cell.getContext()
                                                                                            )
                                                                                        )}
                                                                                    </Table.Cell>
                                                                                )
                                                                            }
                                                                        )}
                                                                </Table.Row>
                                                            )}
                                                        </Draggable>
                                                    ))
                                            )}
                                            {provided.placeholder}
                                        </Table.Body>
                                    )}
                                </Droppable>
                            </Table.Root>
                        </DragDropContext>
                    </Table.ScrollArea>
                </Box>
            )}
        </Box>
    )
}
