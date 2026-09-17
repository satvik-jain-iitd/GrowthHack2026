'use client'
import {
    useDeferredValue,
    useMemo,
    useRef,
    useState,
    useCallback,
    memo
} from 'react'
import {
    Badge,
    Box,
    CloseButton,
    Dialog,
    Flex,
    IconButton,
    Input,
    NativeSelect,
    Portal,
    Spinner,
    Table,
    Text
} from '@chakra-ui/react'
import { IconHelp, IconLinkOut } from '@americanexpress/dls-icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useDashboard } from '@/app/resources/tech-investment-planning-dashboard/context/DashboardContext'
import { ActorChip } from '@/app/resources/tech-investment-planning-dashboard/components/shared/ActorChip'
import { ExportButton } from '@/app/resources/tech-investment-planning-dashboard/components/shared/ExportButton'
import { EpicDetailModal } from '@/app/resources/tech-investment-planning-dashboard/components/panels/EpicDetailModal'
import { formatDuration } from '@/app/resources/tech-investment-planning-dashboard/utils/formatDuration'
import {
    parseAdvancedQuery,
    QUERY_FIELDS
} from '@/app/resources/tech-investment-planning-dashboard/utils/queryFilter'
import type {
    EpicSummaryRow,
    StrategicEpic
} from '@/app/resources/tech-investment-planning-dashboard/types'
import { SYSTEM_ACTORS } from '@/app/resources/tech-investment-planning-dashboard/constants'
import { NoPrefetchLink } from '@/components/ui/NoPrefetchLink'

const TP_EPIC_URL = (id: string) =>
    `https://aexptechportfoliomgt.tpondemand.com/restui/board.aspx?#page=portfolioepic/${id}`

type ExtendedRow = EpicSummaryRow & {
    retainedJourneys: number
    retainedCapabilities: number
    timeSpentMs: number | null
}
type SortKey = keyof ExtendedRow
type SortDir = 'asc' | 'desc'

function SortHeader({
    label,
    sortKey,
    currentKey,
    dir,
    onClick,
    narrow = false
}: {
    label: string
    sortKey: SortKey
    currentKey: SortKey
    dir: SortDir
    onClick: (k: SortKey) => void
    narrow?: boolean
}) {
    const active = sortKey === currentKey
    return (
        <Table.ColumnHeader
            cursor='pointer'
            userSelect='none'
            onClick={() => onClick(sortKey)}
            w={narrow ? '16' : undefined}
            minW={narrow ? '14' : undefined}
            textAlign={narrow ? 'center' : undefined}
            whiteSpace='nowrap'
            verticalAlign='bottom'
            _hover={{ color: 'text.emphasis' }}
            transition='color 0.1s'
        >
            <Flex
                as='span'
                align='center'
                justify={narrow ? 'center' : undefined}
                gap={1}
                display='inline-flex'
            >
                <Text
                    as='span'
                    display='block'
                    lineHeight='tight'
                    whiteSpace={narrow ? 'normal' : 'nowrap'}
                    textAlign={narrow ? 'center' : undefined}
                >
                    {label}
                </Text>
                <Text
                    as='span'
                    display='inline-block'
                    w='3'
                    textAlign='center'
                    color={
                        active
                            ? { base: 'blue.500', _dark: 'blue.400' }
                            : 'transparent'
                    }
                    fontSize='xs'
                    aria-hidden={!active}
                >
                    {dir === 'asc' ? '↑' : '↓'}
                </Text>
            </Flex>
        </Table.ColumnHeader>
    )
}

export function EpicDetailTable() {
    const {
        filteredEpicRows: epicRows,
        epicDetails,
        epicActors,
        strategicEpics,
        systemExceptionsMode
    } = useDashboard()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [aiFilter, setAiFilter] = useState<string>('all')
    const [actorFilter, setActorFilter] = useState<string>('all')
    const [actorQuery, setActorQuery] = useState<string>('')
    const [sortKey, setSortKey] = useState<SortKey>('epicName' as SortKey)
    const [sortDir, setSortDir] = useState<SortDir>('asc')
    const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [advancedQuery, setAdvancedQuery] = useState('')
    const [showQueryHelp, setShowQueryHelp] = useState(false)

    // Deferred values so the UI stays responsive while heavy re-renders settle
    const deferredSearch = useDeferredValue(search)
    const deferredStatusFilter = useDeferredValue(statusFilter)
    const deferredAiFilter = useDeferredValue(aiFilter)
    const deferredActorFilter = useDeferredValue(actorFilter)
    const deferredSortKey = useDeferredValue(sortKey)
    const deferredSortDir = useDeferredValue(sortDir)
    const deferredAdvancedQuery = useDeferredValue(advancedQuery)

    const isPending =
        deferredSearch !== search ||
        deferredStatusFilter !== statusFilter ||
        deferredAiFilter !== aiFilter ||
        deferredActorFilter !== actorFilter ||
        deferredSortKey !== sortKey ||
        deferredSortDir !== sortDir ||
        deferredAdvancedQuery !== advancedQuery

    const queryResult = useMemo(
        () => parseAdvancedQuery(deferredAdvancedQuery),
        [deferredAdvancedQuery]
    )

    // Collect all unique human actors across all epics
    const allActors = useMemo(() => {
        const set = new Set<string>()
        for (const actors of Object.values(epicActors)) {
            for (const a of actors) {
                if (!SYSTEM_ACTORS.has(a)) set.add(a)
            }
        }
        return Array.from(set).sort()
    }, [epicActors])

    const filtered = useMemo(() => {
        let rows = epicRows
        if (deferredSearch) {
            const q = deferredSearch.toLowerCase()
            rows = rows.filter(
                r =>
                    r.epicName.toLowerCase().includes(q) || r.epicId.includes(q)
            )
        }
        if (deferredStatusFilter !== 'all')
            rows = rows.filter(r => r.status === deferredStatusFilter)
        if (deferredAiFilter === 'no_journey_rec')
            rows = rows.filter(r => r.recJourneyCount === 0)
        else if (deferredAiFilter === 'no_capability_rec')
            rows = rows.filter(r => r.recCapabilityCount === 0)
        else if (deferredAiFilter === 'accepted_ecj_as_is')
            rows = rows.filter(
                r =>
                    r.recJourneyCount > 0 &&
                    r.addedJourneys === 0 &&
                    r.removedJourneys === 0
            )
        else if (deferredAiFilter === 'accepted_ebc_as_is')
            rows = rows.filter(
                r =>
                    r.recCapabilityCount > 0 &&
                    r.addedCapabilities === 0 &&
                    r.removedCapabilities === 0
            )
        else if (deferredAiFilter !== 'all')
            rows = rows.filter(r => r.aiMatch === deferredAiFilter)
        if (deferredActorFilter !== 'all') {
            rows = rows.filter(r => {
                const actors = epicActors[r.epicId]
                return actors && actors.includes(deferredActorFilter)
            })
        }
        if (systemExceptionsMode === 'without_system_exceptions') {
            rows = rows.filter(
                r => r.recJourneyCount > 0 || r.recCapabilityCount > 0
            )
        }

        const extended: ExtendedRow[] = rows.map(r => ({
            ...r,
            retainedJourneys:
                r.recJourneyCount > 0
                    ? r.recJourneyCount - r.removedJourneys
                    : -1,
            retainedCapabilities:
                r.recCapabilityCount > 0
                    ? r.recCapabilityCount - r.removedCapabilities
                    : -1,
            timeSpentMs: epicDetails[r.epicId]?.timeSpentMs ?? null
        }))

        let result = extended
        if (deferredAdvancedQuery.trim() && queryResult.ok) {
            result = result.filter(queryResult.matches)
        }

        return result.sort((a, b) => {
            const av = a[deferredSortKey]
            const bv = b[deferredSortKey]
            const an = av === null ? Infinity : av
            const bn = bv === null ? Infinity : bv
            const cmp =
                typeof an === 'number' && typeof bn === 'number'
                    ? an - bn
                    : String(av).localeCompare(String(bv))
            return deferredSortDir === 'asc' ? cmp : -cmp
        })
    }, [
        epicRows,
        deferredSearch,
        deferredStatusFilter,
        deferredAiFilter,
        deferredActorFilter,
        epicActors,
        epicDetails,
        deferredSortKey,
        deferredSortDir,
        systemExceptionsMode,
        deferredAdvancedQuery,
        queryResult
    ])

    function handleSort(key: SortKey) {
        if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
        else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    const strategicEpicMap = useMemo(() => {
        const map = new Map<string, StrategicEpic>()
        for (const epic of strategicEpics) {
            map.set(String(epic.id), epic)
        }
        return map
    }, [strategicEpics])

    const selectedDetail = selectedEpicId ? epicDetails[selectedEpicId] : null
    const selectedStrategicEpic = selectedEpicId
        ? (strategicEpicMap.get(selectedEpicId) ?? null)
        : null

    return (
        <>
            <EpicDetailModal
                open={!!selectedDetail}
                detail={selectedDetail}
                strategicEpic={selectedStrategicEpic}
                onClose={() => setSelectedEpicId(null)}
            />

            <Box
                bg='surface.foreground'
                border='1px solid'
                borderColor='border.subtle'
                borderRadius='xl'
                p={5}
            >
                <Flex
                    wrap='wrap'
                    align='center'
                    justify='space-between'
                    gap={3}
                    mb={4}
                >
                    <Box>
                        <Flex align='center' gap={2}>
                            <Text fontWeight='semibold' color='text.emphasis'>
                                Strategic Epic Detail
                            </Text>
                            {isPending && (
                                <Spinner size='xs' color='blue.500' />
                            )}
                        </Flex>
                        <Text color='text.subtle' fontSize='xs'>
                            Click a Strategic Epic ID to drill into ECJs and
                            EBCs
                        </Text>
                    </Box>
                    <ExportButton
                        rows={filtered}
                        strategicEpicMap={strategicEpicMap}
                        epicActors={epicActors}
                        epicDetails={epicDetails}
                    />
                </Flex>

                {/* Filters */}
                <Flex
                    align='center'
                    gap={3}
                    mb={4}
                    overflow='visible'
                    flexWrap='wrap'
                >
                    <Input
                        size='sm'
                        placeholder='Search epic name or ID...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        flex='1'
                        minW='0'
                        borderColor='border.subtle'
                    />
                    <NativeSelect.Root
                        size='sm'
                        flexShrink={0}
                        w={{ base: 'full', sm: '36' }}
                    >
                        <NativeSelect.Field
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            borderColor='border.subtle'
                        >
                            <option value='all'>All Statuses</option>
                            <option value='submitted'>Saved</option>
                            <option value='abandoned'>Abandoned</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <NativeSelect.Root
                        size='sm'
                        flexShrink={0}
                        w={{ base: 'full', sm: '44' }}
                    >
                        <NativeSelect.Field
                            value={aiFilter}
                            onChange={e => setAiFilter(e.target.value)}
                            borderColor='border.subtle'
                        >
                            <option value='all'>All AI Match</option>
                            <option value='no_change'>Accepted as-is</option>
                            <option value='delta'>Modified</option>
                            <option value='n/a'>Not applicable</option>
                            <option value='no_rec'>No AI rec.</option>
                            <option value='no_journey_rec'>No ECJ rec.</option>
                            <option value='no_capability_rec'>
                                No EBC rec.
                            </option>
                            <option value='accepted_ecj_as_is'>
                                Accepted ECJ rec. As Is
                            </option>
                            <option value='accepted_ebc_as_is'>
                                Accepted EBC rec. As Is
                            </option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <ActorTypeahead
                        actors={allActors}
                        value={actorFilter}
                        query={actorQuery}
                        onQueryChange={setActorQuery}
                        onChange={val => {
                            setActorFilter(val)
                            setActorQuery(val === 'all' ? '' : val)
                        }}
                    />
                    <Text
                        color='text.subtle'
                        fontSize='xs'
                        whiteSpace='nowrap'
                        flexShrink={0}
                    >
                        {filtered.length} Strategic Epics
                    </Text>
                    <Box
                        as='button'
                        onClick={() => setShowAdvanced(s => !s)}
                        fontSize='xs'
                        color='text.subtle'
                        _hover={{ color: 'text.emphasis' }}
                        whiteSpace='nowrap'
                        flexShrink={0}
                    >
                        {showAdvanced ? '▾' : '▸'} Advanced filter
                    </Box>
                    <IconButton
                        aria-label='Advanced filter help'
                        size='2xs'
                        variant='ghost'
                        onClick={() => setShowQueryHelp(true)}
                        flexShrink={0}
                    >
                        <IconHelp />
                    </IconButton>
                </Flex>

                {showAdvanced && (
                    <Flex
                        align='start'
                        direction='column'
                        gap={1}
                        mb={4}
                        overflow='visible'
                    >
                        <Flex align='center' gap={2} w='full'>
                            <Input
                                size='sm'
                                placeholder='e.g. AI_EBCs>=1 and AI_ECJs>=3 and Time_Taken<=2min'
                                value={advancedQuery}
                                onChange={e => setAdvancedQuery(e.target.value)}
                                flex='1'
                                minW='0'
                                borderColor='border.subtle'
                                fontFamily='mono'
                            />
                            {advancedQuery && (
                                <Box
                                    as='button'
                                    onClick={() => setAdvancedQuery('')}
                                    color='text.subtle'
                                    _hover={{ color: 'text.emphasis' }}
                                    lineHeight='none'
                                    flexShrink={0}
                                    aria-label='Clear advanced filter'
                                    fontSize='lg'
                                    px={1}
                                >
                                    ×
                                </Box>
                            )}
                        </Flex>
                        {advancedQuery.trim() !== '' && !queryResult.ok && (
                            <Text color='red.500' fontSize='xs'>
                                {queryResult.error}
                            </Text>
                        )}
                    </Flex>
                )}

                <AdvancedQueryHelpDialog
                    open={showQueryHelp}
                    onClose={() => setShowQueryHelp(false)}
                />

                {/* Table */}
                <Box
                    overflowX='auto'
                    overflowY='auto'
                    maxH='600px'
                    borderRadius='lg'
                    borderWidth='1px'
                    borderColor='border.subtle'
                    opacity={isPending ? 0.6 : 1}
                    transition='opacity 0.15s'
                >
                    <Table.Root size='sm'>
                        <Table.Header>
                            <Table.Row
                                bg={{ base: 'gray.50', _dark: 'gray.800' }}
                                position='sticky'
                                top={0}
                                zIndex={1}
                                boxShadow='0 1px 0 var(--chakra-colors-border-subtle)'
                            >
                                <Table.ColumnHeader whiteSpace='nowrap'>
                                    Epic ID
                                </Table.ColumnHeader>
                                <SortHeader
                                    label='Epic Name'
                                    sortKey='epicName'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                />
                                <Table.ColumnHeader whiteSpace='nowrap'>
                                    Status
                                </Table.ColumnHeader>
                                <Table.ColumnHeader whiteSpace='nowrap'>
                                    AI Match
                                </Table.ColumnHeader>
                                <Table.ColumnHeader whiteSpace='nowrap'>
                                    Actors
                                </Table.ColumnHeader>
                                <SortHeader
                                    label='AI ECJs'
                                    sortKey='recJourneyCount'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='Saved ECJs'
                                    sortKey='savedJourneyCount'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='Added ECJ'
                                    sortKey='addedJourneys'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='Retained ECJ'
                                    sortKey='retainedJourneys'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='AI EBCs'
                                    sortKey='recCapabilityCount'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='Saved EBCs'
                                    sortKey='savedCapabilityCount'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='Added EBC'
                                    sortKey='addedCapabilities'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='Retained EBC'
                                    sortKey='retainedCapabilities'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                                <SortHeader
                                    label='Time Taken'
                                    sortKey='timeSpentMs'
                                    currentKey={sortKey}
                                    dir={sortDir}
                                    onClick={handleSort}
                                    narrow
                                />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filtered.map((row, i) => {
                                const actors = epicActors[row.epicId]
                                const humanActors = actors
                                    ? actors.filter(a => !SYSTEM_ACTORS.has(a))
                                    : []
                                return (
                                    <Table.Row
                                        key={row.epicId}
                                        bg={
                                            i % 2 !== 0
                                                ? {
                                                      base: 'gray.50/40',
                                                      _dark: 'gray.900/40'
                                                  }
                                                : undefined
                                        }
                                        _hover={{
                                            bg: {
                                                base: 'gray.50',
                                                _dark: 'gray.800/40'
                                            }
                                        }}
                                    >
                                        <Table.Cell>
                                            <Flex align='center' gap={1}>
                                                <Box
                                                    as='button'
                                                    fontFamily='mono'
                                                    fontSize='xs'
                                                    color={{
                                                        base: 'blue.600',
                                                        _dark: 'blue.400'
                                                    }}
                                                    _hover={{
                                                        color: {
                                                            base: 'blue.700',
                                                            _dark: 'blue.300'
                                                        },
                                                        textDecoration:
                                                            'underline'
                                                    }}
                                                    cursor='pointer'
                                                    onClick={() =>
                                                        setSelectedEpicId(
                                                            row.epicId
                                                        )
                                                    }
                                                >
                                                    {row.epicId}
                                                </Box>
                                                <NoPrefetchLink
                                                    href={TP_EPIC_URL(
                                                        row.epicId
                                                    )}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'inherit'
                                                    }}
                                                >
                                                    <IconLinkOut />
                                                </NoPrefetchLink>
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell
                                            color='text.emphasis'
                                            maxW='xs'
                                        >
                                            <Box
                                                as='span'
                                                display='block'
                                                overflow='hidden'
                                                textOverflow='ellipsis'
                                                whiteSpace='nowrap'
                                                title={row.epicName}
                                            >
                                                {row.epicName}
                                            </Box>
                                        </Table.Cell>
                                        <Table.Cell whiteSpace='nowrap'>
                                            {row.status === 'submitted' ? (
                                                <Badge
                                                    colorPalette='green'
                                                    variant='subtle'
                                                    borderRadius='full'
                                                    fontSize='xs'
                                                >
                                                    Saved
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    colorPalette='orange'
                                                    variant='subtle'
                                                    borderRadius='full'
                                                    fontSize='xs'
                                                >
                                                    Abandoned
                                                </Badge>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell whiteSpace='nowrap'>
                                            {row.aiMatch === 'no_change' && (
                                                <Badge
                                                    colorPalette='cyan'
                                                    variant='subtle'
                                                    borderRadius='full'
                                                    fontSize='xs'
                                                >
                                                    Accepted as-is
                                                </Badge>
                                            )}
                                            {row.aiMatch === 'delta' && (
                                                <Badge
                                                    colorPalette='purple'
                                                    variant='subtle'
                                                    borderRadius='full'
                                                    fontSize='xs'
                                                >
                                                    Modified
                                                </Badge>
                                            )}
                                            {row.aiMatch === 'n/a' && (
                                                <Badge
                                                    colorPalette='gray'
                                                    variant='subtle'
                                                    borderRadius='full'
                                                    fontSize='xs'
                                                >
                                                    Not applicable
                                                </Badge>
                                            )}
                                            {row.aiMatch === 'no_rec' && (
                                                <Badge
                                                    colorPalette='orange'
                                                    variant='subtle'
                                                    borderRadius='full'
                                                    fontSize='xs'
                                                >
                                                    No AI rec.
                                                </Badge>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell maxW='52'>
                                            {humanActors.length > 0 ? (
                                                <Flex
                                                    direction='column'
                                                    gap={1}
                                                >
                                                    {humanActors
                                                        .slice(0, 2)
                                                        .map(email => (
                                                            <ActorChip
                                                                key={email}
                                                                email={email}
                                                                variant='chip'
                                                                size='xs'
                                                            />
                                                        ))}
                                                    {humanActors.length > 2 && (
                                                        <Text
                                                            fontSize='2xs'
                                                            color='text.subtle'
                                                        >
                                                            +
                                                            {humanActors.length -
                                                                2}{' '}
                                                            more
                                                        </Text>
                                                    )}
                                                </Flex>
                                            ) : (
                                                <Text
                                                    as='span'
                                                    color='text.disabled'
                                                >
                                                    —
                                                </Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='center'
                                            color='text.emphasis'
                                        >
                                            {row.recJourneyCount}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='center'
                                            color='text.emphasis'
                                        >
                                            {row.savedJourneyCount}
                                        </Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            {row.addedJourneys > 0 ? (
                                                <Text
                                                    as='span'
                                                    color={{
                                                        base: 'blue.600',
                                                        _dark: 'blue.400'
                                                    }}
                                                    fontWeight='medium'
                                                >
                                                    +{row.addedJourneys}
                                                </Text>
                                            ) : (
                                                <Text
                                                    as='span'
                                                    color='text.disabled'
                                                >
                                                    0
                                                </Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            {(() => {
                                                if (row.recJourneyCount === 0)
                                                    return (
                                                        <Text
                                                            as='span'
                                                            color='text.disabled'
                                                        >
                                                            —
                                                        </Text>
                                                    )
                                                const retained =
                                                    row.recJourneyCount -
                                                    row.removedJourneys
                                                return retained > 0 ? (
                                                    <Text
                                                        as='span'
                                                        color={{
                                                            base: 'green.600',
                                                            _dark: 'green.400'
                                                        }}
                                                        fontWeight='medium'
                                                    >
                                                        {retained}
                                                    </Text>
                                                ) : (
                                                    <Text
                                                        as='span'
                                                        color='text.disabled'
                                                    >
                                                        0
                                                    </Text>
                                                )
                                            })()}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='center'
                                            color='text.emphasis'
                                        >
                                            {row.recCapabilityCount}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='center'
                                            color='text.emphasis'
                                        >
                                            {row.savedCapabilityCount}
                                        </Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            {row.addedCapabilities > 0 ? (
                                                <Text
                                                    as='span'
                                                    color={{
                                                        base: 'blue.600',
                                                        _dark: 'blue.400'
                                                    }}
                                                    fontWeight='medium'
                                                >
                                                    +{row.addedCapabilities}
                                                </Text>
                                            ) : (
                                                <Text
                                                    as='span'
                                                    color='text.disabled'
                                                >
                                                    0
                                                </Text>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            {(() => {
                                                if (
                                                    row.recCapabilityCount === 0
                                                )
                                                    return (
                                                        <Text
                                                            as='span'
                                                            color='text.disabled'
                                                        >
                                                            —
                                                        </Text>
                                                    )
                                                const retained =
                                                    row.recCapabilityCount -
                                                    row.removedCapabilities
                                                return retained > 0 ? (
                                                    <Text
                                                        as='span'
                                                        color={{
                                                            base: 'green.600',
                                                            _dark: 'green.400'
                                                        }}
                                                        fontWeight='medium'
                                                    >
                                                        {retained}
                                                    </Text>
                                                ) : (
                                                    <Text
                                                        as='span'
                                                        color='text.disabled'
                                                    >
                                                        0
                                                    </Text>
                                                )
                                            })()}
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign='center'
                                            color='text.emphasis'
                                        >
                                            {row.timeSpentMs !== null ? (
                                                formatDuration(row.timeSpentMs)
                                            ) : (
                                                <Text
                                                    as='span'
                                                    color='text.disabled'
                                                >
                                                    —
                                                </Text>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                            {filtered.length === 0 && (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={14}
                                        textAlign='center'
                                        color='text.disabled'
                                        py={8}
                                    >
                                        No Strategic Epics match the current
                                        filters
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>
        </>
    )
}

const ActorTypeahead = memo(
    function ActorTypeahead({
        actors,
        value,
        query,
        onQueryChange,
        onChange
    }: {
        actors: string[]
        value: string
        query: string
        onQueryChange: (q: string) => void
        onChange: (val: string) => void
    }) {
        const [open, setOpen] = useState(false)
        const containerRef = useRef<HTMLDivElement>(null)
        // Resolve display name for the currently-selected actor so the input shows a name, not an email
        const { userInfo: selectedUserInfo } = useUserInfo(
            value !== 'all' ? value : ''
        )

        const suggestions = useMemo(() => {
            const q = query.trim().toLowerCase()
            if (!q) return actors
            return actors.filter(a => a.toLowerCase().includes(q))
        }, [actors, query])

        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                onQueryChange(e.target.value)
                setOpen(true)
            },
            [onQueryChange]
        )

        const handleSelect = useCallback(
            (actor: string) => {
                onChange(actor)
                setOpen(false)
            },
            [onChange]
        )

        const handleClear = useCallback(() => {
            onChange('all')
            onQueryChange('')
            setOpen(false)
        }, [onChange, onQueryChange])

        const handleBlur = useCallback(
            (e: React.FocusEvent) => {
                if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                    setOpen(false)
                    if (value === 'all') onQueryChange('')
                }
            },
            [value, onQueryChange]
        )

        const isFiltered = value !== 'all'
        // When filtered: show resolved display name (falls back to email while loading)
        const inputDisplayValue = isFiltered
            ? (selectedUserInfo?.displayName ?? value)
            : query

        return (
            <Box
                ref={containerRef}
                position='relative'
                onBlur={handleBlur}
                flexShrink={0}
                w={{ base: 'full', sm: 'auto' }}
            >
                <Flex
                    align='center'
                    bg={{ base: 'gray.100', _dark: 'gray.800' }}
                    border='1px solid'
                    borderColor={isFiltered ? 'blue.500' : 'border.subtle'}
                    borderRadius='md'
                    px={3}
                    py={1.5}
                    gap={1.5}
                    _focusWithin={isFiltered ? {} : { borderColor: 'blue.500' }}
                >
                    <input
                        type='text'
                        placeholder='Filter by actor...'
                        value={inputDisplayValue}
                        onChange={handleInputChange}
                        onFocus={() => setOpen(true)}
                        style={{
                            background: 'transparent',
                            fontSize: '14px',
                            outline: 'none',
                            width: '100%',
                            border: 'none'
                        }}
                    />
                    {isFiltered && (
                        <Box
                            as='button'
                            onClick={handleClear}
                            color='text.subtle'
                            _hover={{ color: 'text.emphasis' }}
                            lineHeight='none'
                            flexShrink={0}
                            aria-label='Clear actor filter'
                        >
                            ×
                        </Box>
                    )}
                </Flex>

                {open && (
                    <Box
                        position='absolute'
                        zIndex={20}
                        top='full'
                        mt={1}
                        left={0}
                        w={{ base: 'xs', sm: '80' }}
                        bg={{ base: 'white', _dark: 'gray.900' }}
                        border='1px solid'
                        borderColor='border.subtle'
                        borderRadius='lg'
                        boxShadow='lg'
                        maxH='72'
                        overflowY='auto'
                    >
                        <Box
                            as='button'
                            onMouseDown={(e: React.MouseEvent) => {
                                e.preventDefault()
                                handleClear()
                            }}
                            w='full'
                            textAlign='left'
                            px={3}
                            py={2}
                            fontSize='xs'
                            color='text.subtle'
                            _hover={{
                                bg: { base: 'gray.50', _dark: 'gray.800' }
                            }}
                            borderBottomWidth='1px'
                            borderColor='border.subtle'
                        >
                            All Actors
                        </Box>
                        {suggestions.length === 0 ? (
                            <Text
                                px={3}
                                py={3}
                                fontSize='xs'
                                color='text.disabled'
                            >
                                No matching actors
                            </Text>
                        ) : (
                            suggestions.map(email => (
                                <Box
                                    key={email}
                                    as='button'
                                    onMouseDown={(e: React.MouseEvent) => {
                                        e.preventDefault()
                                        handleSelect(email)
                                    }}
                                    w='full'
                                    textAlign='left'
                                    px={3}
                                    py={2}
                                    _hover={{
                                        bg: {
                                            base: 'gray.50',
                                            _dark: 'gray.800'
                                        }
                                    }}
                                    bg={
                                        value === email
                                            ? {
                                                  base: 'blue.50',
                                                  _dark: 'blue.900/30'
                                              }
                                            : undefined
                                    }
                                    outline={
                                        value === email
                                            ? '2px solid'
                                            : undefined
                                    }
                                    outlineColor={
                                        value === email ? 'blue.500' : undefined
                                    }
                                    outlineOffset='-2px'
                                >
                                    <ActorChip
                                        email={email}
                                        variant='chip'
                                        size='xs'
                                    />
                                </Box>
                            ))
                        )}
                    </Box>
                )}
            </Box>
        )
    },
    (prevProps, nextProps) => {
        // Custom comparison: only re-render if these specific props change
        return (
            prevProps.actors === nextProps.actors &&
            prevProps.value === nextProps.value &&
            prevProps.query === nextProps.query
        )
    }
)

function AdvancedQueryHelpDialog({
    open,
    onClose
}: {
    open: boolean
    onClose: () => void
}) {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={e => {
                if (!e.open) onClose()
            }}
            size='lg'
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW='2xl'
                        maxH='85vh'
                        display='flex'
                        flexDir='column'
                    >
                        <Dialog.Header
                            borderBottomWidth='1px'
                            borderColor='border.subtle'
                        >
                            <Dialog.Title
                                fontSize='lg'
                                fontWeight='semibold'
                                color='text.emphasis'
                            >
                                Advanced Filter Query
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size='sm' />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body overflowY='auto' py={4}>
                            <Box display='flex' flexDirection='column' gap={5}>
                                <Text fontSize='sm' color='text.subtle'>
                                    Combine numeric conditions across columns
                                    into a single expression. This narrows the
                                    rows already selected by the filters above.
                                </Text>

                                <Box>
                                    <Text
                                        fontWeight='medium'
                                        fontSize='sm'
                                        color='text.emphasis'
                                        mb={2}
                                    >
                                        Fields
                                    </Text>
                                    <Table.Root size='sm'>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>
                                                    Name
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader>
                                                    Description
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {QUERY_FIELDS.map(field => (
                                                <Table.Row key={field.id}>
                                                    <Table.Cell
                                                        fontFamily='mono'
                                                        color='text.emphasis'
                                                        whiteSpace='nowrap'
                                                    >
                                                        {field.label}
                                                    </Table.Cell>
                                                    <Table.Cell color='text.subtle'>
                                                        {field.description}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>

                                <Box>
                                    <Text
                                        fontWeight='medium'
                                        fontSize='sm'
                                        color='text.emphasis'
                                        mb={2}
                                    >
                                        Operators
                                    </Text>
                                    <Text fontSize='sm' color='text.subtle'>
                                        <Text
                                            as='span'
                                            fontFamily='mono'
                                            color='text.emphasis'
                                        >
                                            {'>  >=  <  <=  =  ==  !='}
                                        </Text>
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontWeight='medium'
                                        fontSize='sm'
                                        color='text.emphasis'
                                        mb={2}
                                    >
                                        Combining conditions
                                    </Text>
                                    <Text fontSize='sm' color='text.subtle'>
                                        Use{' '}
                                        <Text
                                            as='span'
                                            fontFamily='mono'
                                            color='text.emphasis'
                                        >
                                            and
                                        </Text>{' '}
                                        /{' '}
                                        <Text
                                            as='span'
                                            fontFamily='mono'
                                            color='text.emphasis'
                                        >
                                            or
                                        </Text>{' '}
                                        to combine conditions, and parentheses
                                        to group them.{' '}
                                        <Text as='span' fontFamily='mono'>
                                            and
                                        </Text>{' '}
                                        binds tighter than{' '}
                                        <Text as='span' fontFamily='mono'>
                                            or
                                        </Text>
                                        , so{' '}
                                        <Text
                                            as='span'
                                            fontFamily='mono'
                                            color='text.emphasis'
                                        >
                                            a or b and c
                                        </Text>{' '}
                                        means{' '}
                                        <Text
                                            as='span'
                                            fontFamily='mono'
                                            color='text.emphasis'
                                        >
                                            a or (b and c)
                                        </Text>
                                        .
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontWeight='medium'
                                        fontSize='sm'
                                        color='text.emphasis'
                                        mb={2}
                                    >
                                        Time units (Time_Taken only)
                                    </Text>
                                    <Text fontSize='sm' color='text.subtle'>
                                        <Text
                                            as='span'
                                            fontFamily='mono'
                                            color='text.emphasis'
                                        >
                                            ms, s, min, h, d
                                        </Text>{' '}
                                        (e.g.{' '}
                                        <Text
                                            as='span'
                                            fontFamily='mono'
                                            color='text.emphasis'
                                        >
                                            Time_Taken&lt;=2min
                                        </Text>
                                        ). Time_Taken always requires a unit.
                                        Rows without a recorded duration never
                                        match a Time_Taken condition.
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontWeight='medium'
                                        fontSize='sm'
                                        color='text.emphasis'
                                        mb={2}
                                    >
                                        Examples
                                    </Text>
                                    <Box
                                        display='flex'
                                        flexDirection='column'
                                        gap={1}
                                        fontFamily='mono'
                                        fontSize='xs'
                                        color='text.emphasis'
                                        bg={{
                                            base: 'gray.50',
                                            _dark: 'gray.800'
                                        }}
                                        borderRadius='md'
                                        p={3}
                                    >
                                        <Text as='span'>
                                            AI_EBCs&gt;=1 and AI_ECJs&gt;=3 and
                                            Time_Taken&lt;=2min
                                        </Text>
                                        <Text as='span'>
                                            (AI_EBCs&gt;=1 or AI_ECJs&gt;=3) and
                                            Time_Taken&lt;=2min
                                        </Text>
                                        <Text as='span'>
                                            Retained_ECJ&gt;0 and Added_EBC==0
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
