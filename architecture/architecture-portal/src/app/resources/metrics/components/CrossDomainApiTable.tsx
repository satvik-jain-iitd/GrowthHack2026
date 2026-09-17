/* istanbul ignore file */
import { ReactNode, useMemo, useState } from 'react'
import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    HStack,
    IconButton,
    Pagination,
    Table,
    Text
} from '@chakra-ui/react'
import { IconChevronLeft, IconChevronRight } from '@americanexpress/dls-icons'
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import metricStyles from '../metrics.module.css'
import { METRIC3_COLUMNS, METRIC3_UNIT_CIO_COLUMNS } from '../constants'
import { downloadCrossDomainApiExcel } from '../crossDomainApiExport'
import { EtpEcmiCrossDomainApiRow, EtpEcmiUnitCioGroupRow } from '../types'
import MetricProgressCell from './MetricProgressCell'
import TableSortIcon from './TableSortIcon'

const PAGE_SIZE = 10

type TableRow = EtpEcmiCrossDomainApiRow | EtpEcmiUnitCioGroupRow
type SortableKey = keyof EtpEcmiCrossDomainApiRow | keyof EtpEcmiUnitCioGroupRow
type Column = {
    label: string
    key: string
    type?: string
    sortable?: boolean
    emailKey?: string
    numeratorKey?: string
    denominatorKey?: string
    width?: string
}

const ROW_HEIGHT = '64px'

const isDetailRow = (row: TableRow): row is EtpEcmiCrossDomainApiRow =>
    'initiative_id' in row

export default function CrossDomainApiTable({
    rows,
    groupRows,
    groupBy,
    search,
    typeFilter,
    toolbar
}: {
    rows: EtpEcmiCrossDomainApiRow[]
    groupRows: EtpEcmiUnitCioGroupRow[]
    groupBy: string
    search: string
    typeFilter: 'all' | 'etp' | 'ecmi'
    toolbar?: ReactNode
}) {
    const isGrouped = groupBy === 'unitCIO'
    const columns: readonly Column[] = isGrouped
        ? METRIC3_UNIT_CIO_COLUMNS
        : METRIC3_COLUMNS
    const sourceRows: TableRow[] = isGrouped ? groupRows : rows

    const [sortBy, setSortBy] = useState<SortableKey>('identified_apis')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [page, setPage] = useState(1)
    const filterKey = `${search}|${typeFilter}|${groupBy}`
    const [lastFilterKey, setLastFilterKey] = useState(filterKey)
    const [lastGroupBy, setLastGroupBy] = useState(groupBy)

    if (lastFilterKey !== filterKey) {
        setLastFilterKey(filterKey)
        setPage(1)
    }

    // the column sets only overlap partially — a stale sort key would sort on nothing
    if (lastGroupBy !== groupBy) {
        setLastGroupBy(groupBy)
        setSortBy('identified_apis')
        setSortOrder('desc')
    }

    const sortedRows = useMemo(() => {
        const term = search.trim().toLowerCase()
        const filtered = sourceRows
            .filter(row => {
                if (!isDetailRow(row)) return true
                if (typeFilter === 'etp') return row.is_etp
                if (typeFilter === 'ecmi') return row.is_ecmi
                return true
            })
            .filter(row => {
                if (!term) return true
                const haystack = isDetailRow(row)
                    ? row.initiative_name
                    : row.unit_cio
                return (haystack || '').toLowerCase().includes(term)
            })

        return filtered.sort((a, b) => {
            const left = a[sortBy as keyof typeof a]
            const right = b[sortBy as keyof typeof b]
            const comparison =
                typeof left === 'number' || typeof right === 'number'
                    ? Number(left ?? 0) - Number(right ?? 0)
                    : String(left ?? '').localeCompare(String(right ?? ''))
            return sortOrder === 'desc' ? -comparison : comparison
        })
    }, [sourceRows, search, typeFilter, sortBy, sortOrder])

    // a shrinking result set must not strand the user on a page that no longer exists
    const pageCount = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
    const currentPage = Math.min(page, pageCount)
    const pagedRows = sortedRows.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )
    // only pad once there is more than one page — a single short page should
    // still hug its content rather than reserve ten rows of empty space
    const fillerCount =
        sortedRows.length > PAGE_SIZE ? PAGE_SIZE - pagedRows.length : 0

    const handleSort = (key: SortableKey) => {
        setPage(1)
        if (key === sortBy) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
            return
        }
        setSortBy(key)
        setSortOrder('asc')
    }

    const renderCell = (column: Column, row: TableRow) => {
        const cellValue = (key?: string) =>
            row[key as keyof typeof row] as number

        if (column.type === 'badges' && isDetailRow(row)) {
            if (!row.is_etp && !row.is_ecmi) return <Text>—</Text>
            return (
                <HStack gap='0.25rem'>
                    {row.is_etp && (
                        <Badge
                            colorPalette='green'
                            variant='subtle'
                            borderRadius='full'
                            fontSize='2xs'
                        >
                            ETP
                        </Badge>
                    )}
                    {row.is_ecmi && (
                        <Badge
                            colorPalette='purple'
                            variant='subtle'
                            borderRadius='full'
                            fontSize='2xs'
                        >
                            ECMI
                        </Badge>
                    )}
                </HStack>
            )
        }
        if (column.type === 'name' && isDetailRow(row)) {
            return (
                <Text
                    fontWeight='700'
                    color={{ base: '#006FCF', _dark: '#61C5FF' }}
                    lineClamp={2}
                    title={row.initiative_name}
                >
                    {row.initiative_name}
                </Text>
            )
        }
        if (column.type === 'avatar') {
            const name = String(row[column.key as keyof typeof row] || '')
            // an absent email skips the photo lookup and leaves just the initials
            const email =
                (row[column.emailKey as keyof typeof row] as string) ||
                undefined
            return (
                <HStack gap='0.5rem' overflow='hidden'>
                    <Box flexShrink={0}>
                        <UserAvatar email={email} name={name} />
                    </Box>
                    <Text lineClamp={2} title={name}>
                        {name || '—'}
                    </Text>
                </HStack>
            )
        }
        if (column.type === 'years') {
            const years = String(row[column.key as keyof typeof row] || '')
                .split(',')
                .map(year => year.trim())
                .filter(Boolean)
            if (years.length === 0) return <Text>—</Text>
            return (
                <HStack gap='0.25rem' overflow='hidden'>
                    {years.map(year => (
                        <Badge
                            key={year}
                            colorPalette='blue'
                            variant='subtle'
                            borderRadius='full'
                            fontSize='2xs'
                        >
                            {year}
                        </Badge>
                    ))}
                </HStack>
            )
        }
        if (column.type === 'boolean-badge') {
            const onboarded = Boolean(row[column.key as keyof typeof row])
            return (
                <Badge
                    colorPalette={onboarded ? 'green' : 'gray'}
                    variant='subtle'
                    borderRadius='full'
                    fontSize='2xs'
                >
                    {onboarded ? 'Yes' : 'No'}
                </Badge>
            )
        }
        if (column.type === 'fraction') {
            return (
                <Text>
                    {cellValue(column.key) ?? 0} /{' '}
                    {cellValue(column.denominatorKey) ?? 0}
                </Text>
            )
        }
        if (column.type === 'progress') {
            return (
                <MetricProgressCell
                    value={cellValue(column.key)}
                    numerator={cellValue(column.numeratorKey)}
                    denominator={cellValue(column.denominatorKey)}
                />
            )
        }
        return <Text>{row[column.key as keyof typeof row] ?? 0}</Text>
    }

    return (
        <>
            <HStack
                justifyContent='flex-end'
                alignItems={{ base: 'stretch', md: 'center' }}
                flexDirection={{ base: 'column', md: 'row' }}
                gap={4}
                marginBottom='0.75rem'
            >
                {toolbar}
                <Button
                    size={{ base: 'sm', md: 'md' }}
                    variant='outline'
                    flexShrink={0}
                    color='#006fcf'
                    borderColor='#006fcf'
                    disabled={sortedRows.length === 0}
                    onClick={() =>
                        downloadCrossDomainApiExcel({
                            rows: sortedRows,
                            columns,
                            isGrouped
                        })
                    }
                >
                    Export
                </Button>
            </HStack>
            <Table.Root
                className={`excludeExpand ${metricStyles.metricsListView} ${metricStyles.metricsTable}`}
                backgroundColor='transparent'
                padding={0}
                border={0}
                variant='outline'
                boxShadow='none'
                // fixed layout pins the columns to the widths below, so content
                // changing between pages cannot resize them
                style={{ tableLayout: 'fixed' }}
                id='cross-domain-api-table'
            >
                <Table.Header
                    backgroundColor={'var(--domains-subheading-color)'}
                >
                    <Table.Row>
                        {columns.map(column => {
                            const isSortable = column.sortable !== false
                            return (
                                <Table.ColumnHeader
                                    key={column.key}
                                    color={'#ffffff'}
                                    whiteSpace='normal'
                                    width={column.width}
                                    overflow='hidden'
                                    cursor={isSortable ? 'pointer' : 'default'}
                                    onClick={
                                        isSortable
                                            ? () =>
                                                  handleSort(
                                                      column.key as SortableKey
                                                  )
                                            : undefined
                                    }
                                >
                                    <HStack align={'center'} gap={1} minW={0}>
                                        {/* minW/overflowWrap let a long label
                                            wrap inside the cell instead of
                                            shoving the icon past its edge */}
                                        <Box
                                            as='span'
                                            minW={0}
                                            overflowWrap='anywhere'
                                        >
                                            {column.label}
                                        </Box>
                                        {isSortable && (
                                            <Box
                                                flexShrink={0}
                                                display='flex'
                                                alignItems='center'
                                            >
                                                <TableSortIcon
                                                    selectedGroup=''
                                                    tableParams={{
                                                        sortBy,
                                                        sortOrder
                                                    }}
                                                    columnKey={column.key}
                                                    color='white'
                                                />
                                            </Box>
                                        )}
                                    </HStack>
                                </Table.ColumnHeader>
                            )
                        })}
                    </Table.Row>
                </Table.Header>
                <Table.Body backgroundColor='transparent'>
                    {pagedRows.map(row => (
                        <Table.Row
                            className={metricStyles.metricsListView__item}
                            height={ROW_HEIGHT}
                            key={
                                isDetailRow(row)
                                    ? row.initiative_id
                                    : row.unit_cio_email || row.unit_cio
                            }
                        >
                            {columns.map(column => (
                                <Table.Cell
                                    key={column.key}
                                    className={
                                        metricStyles.metricsListView__itemTd
                                    }
                                    overflow='hidden'
                                >
                                    {renderCell(column, row)}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                    {/* a short final page would otherwise collapse the table height */}
                    {fillerCount > 0 &&
                        Array.from({ length: fillerCount }, (_, index) => (
                            <Table.Row
                                key={`filler-${index}`}
                                height={ROW_HEIGHT}
                                visibility='hidden'
                                aria-hidden
                            >
                                <Table.Cell colSpan={columns.length} />
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table.Root>
            {sortedRows.length === 0 && (
                <Text padding='1rem' textAlign='center'>
                    {isGrouped
                        ? 'No Unit CIOs found.'
                        : 'No ETP/ECMI initiatives found.'}
                </Text>
            )}
            {sortedRows.length > PAGE_SIZE && (
                <Pagination.Root
                    count={sortedRows.length}
                    pageSize={PAGE_SIZE}
                    defaultPage={1}
                    page={currentPage}
                    onPageChange={details => setPage(details.page)}
                    aria-label='Pagination Navigation'
                    marginTop='1rem'
                    justifyContent='center'
                    display='flex'
                >
                    <ButtonGroup variant='outline' size='sm'>
                        <Pagination.PrevTrigger asChild>
                            <IconButton>
                                <IconChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>
                        <Pagination.Items
                            render={paginationPage => (
                                <IconButton
                                    variant={{
                                        base: 'outline',
                                        _selected: 'solid'
                                    }}
                                >
                                    {paginationPage.value}
                                </IconButton>
                            )}
                        />
                        <Pagination.NextTrigger asChild>
                            <IconButton>
                                <IconChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            )}
        </>
    )
}
