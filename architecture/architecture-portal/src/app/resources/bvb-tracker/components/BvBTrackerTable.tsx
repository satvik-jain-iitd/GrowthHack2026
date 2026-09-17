/* istanbul ignore file */
'use client'
import { useMemo, useState } from 'react'
import { useGetBvBPlaybooks } from '@/app/resources/bvb-tracker/hooks/useGetBvBPlaybooks'
import {
    Box,
    Flex,
    IconButton,
    Menu,
    Portal,
    Spinner,
    Table,
    Text,
    useCheckboxGroup
} from '@chakra-ui/react'
import BvBTrackerHeader from '@/app/resources/bvb-tracker/components/BvBTrackerHeader'
import { Playbook } from '@/types/Playbook'
import { columns } from './columns'
import { IconFilter } from '@americanexpress/dls-icons'
import StatusBadge, {
    getStatusByTask
} from '@/app/build-vs-buys/components/StatusBadge'
const DEFAULT_VISIBLE_COLUMNS = [
    'playbook_nm',
    'status',
    'owner',
    'requester',
    'reviewers',
    'deciders',
    'eaArchitect',
    'createdAt',
    'estimatedCost'
]
export default function BvBTrackerTable() {
    const { playbooks, loading, error } = useGetBvBPlaybooks()
    const [search, setSearch] = useState('')
    const [filterState, setFilterState] = useState<Record<string, boolean>>(
        Object.fromEntries(
            columns.map(col => [
                col.key,
                DEFAULT_VISIBLE_COLUMNS.includes(col.key)
            ])
        )
    )
    const playbookStatus = useMemo(() => {
        if (!playbooks?.length) return []
        const statuses = playbooks
            .map(pb => {
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const da = pb.add_da as any
                const workflow = da?.workflowData || {}
                let status: string | undefined
                if (workflow?.currentTask) {
                    status = getStatusByTask(
                        workflow.currentTask.step,
                        workflow
                    )
                }
                if (!status) {
                    status = workflow.status ?? da?.status ?? ''
                }
                return status
            })
            .filter((status): status is string => Boolean(status))
        return [...new Set(statuses)]
    }, [playbooks])
    const statusGroup = useCheckboxGroup({
        defaultValue: playbookStatus
    })
    const selectedStatuses = useMemo(
        () => new Set(statusGroup.value),
        [statusGroup.value]
    )
    const handleSearchChange = (value: string) => setSearch(value)
    const onChangeColumnFilter = (selected: string[]) => {
        setFilterState(
            Object.fromEntries(
                columns.map(col => [col.key, selected.includes(col.key)])
            )
        )
    }
    const filteredPlaybooks = useMemo(() => {
        // if (!search && statusGroup.value.length === 0) return playbooks
        const lower = (search || '').toLowerCase()
        return playbooks
            .filter(
                pb =>
                    pb.playbook_nm.toLowerCase().includes(lower) ||
                    pb.playbook_type_nm.toLowerCase().includes(lower)
            )
            .filter(pb => {
                /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
                const da = pb.add_da as any
                const workflow = da?.workflowData || {}
                let status: string | undefined
                if (workflow?.currentTask) {
                    status = getStatusByTask(
                        workflow.currentTask.step,
                        workflow
                    )
                }
                if (!status) {
                    status = workflow.status ?? da?.status ?? ''
                }
                return selectedStatuses.has(status || '')
            })
    }, [playbooks, search, selectedStatuses])
    const visibleColumns = columns.filter(col => filterState[col.key])
    const handleViewAllClick = () => {
        if (statusGroup.value.length == playbookStatus.length) {
            statusGroup.setValue([])
        } else {
            statusGroup.setValue(playbookStatus)
        }
    }
    const getFilterIcon = (column: {
        key: string
        filterType?: string
        filterTitle?: string
        filterableValues?: string[]
    }) => {
        return (
            <Menu.Root closeOnSelect={false}>
                <Menu.Trigger asChild>
                    <IconButton
                        variant='plain'
                        data-testid={
                            column.filterType === 'status'
                                ? 'status-filter-trigger'
                                : undefined
                        }
                    >
                        <IconFilter
                            size={'sm'}
                            title={column.filterTitle || 'Filter'}
                            titleId={`statusFilter_${column.key}`}
                        />
                    </IconButton>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content minW={0} p={0}>
                            <Menu.ItemGroup>
                                {column?.filterableValues?.map(
                                    (status: string) => {
                                        return (
                                            <Menu.CheckboxItem
                                                key={status}
                                                value={status}
                                                checked={
                                                    status === 'viewAll'
                                                        ? false
                                                        : statusGroup.isChecked(
                                                              status
                                                          )
                                                }
                                                onCheckedChange={() => {
                                                    if (status !== 'viewAll') {
                                                        statusGroup.toggleValue(
                                                            status
                                                        )
                                                    }
                                                }}
                                                onClick={() => {
                                                    if (status === 'viewAll') {
                                                        handleViewAllClick()
                                                    }
                                                }}
                                            >
                                                <StatusBadge
                                                    status={status || ''}
                                                    fullWidth
                                                />
                                                <Menu.ItemIndicator />
                                            </Menu.CheckboxItem>
                                        )
                                    }
                                )}
                            </Menu.ItemGroup>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        )
    }
    return (
        <Box px={0} mx={0} py={0}>
            <BvBTrackerHeader
                search={search}
                onSearchChange={handleSearchChange}
                filterState={filterState}
                onChangeColumnFilter={onChangeColumnFilter}
                filterOptions={columns.map(col => col.key)}
                keyToLabel={(key: string) =>
                    columns.find(col => col.key === key)?.label || key
                }
                cardBgSrc='/company-domains/BKG.png'
            />
            {loading ? (
                <Flex justify='center' align='center' minH='200px'>
                    <Spinner />
                </Flex>
            ) : error ? (
                <Text color='red.500'>Failed to load playbooks.</Text>
            ) : (
                <Box w='100vw' ml='-50vw' mr='-50vw' px={0} mx={0}>
                    <Table.ScrollArea maxH='80vh' scrollbar={'hidden'}>
                        <Table.Root size='md' minWidth='1200px' stickyHeader>
                            <Table.Header>
                                <Table.Row bg={'bg.subtle'} h='56px'>
                                    {visibleColumns.map(col => {
                                        if (col.label == 'Status') {
                                            return (
                                                <Table.ColumnHeader
                                                    key={col.key}
                                                    whiteSpace='nowrap'
                                                    textOverflow='ellipsis'
                                                    overflow='hidden'
                                                    verticalAlign='middle'
                                                    colorPalette='gray.subtle'
                                                >
                                                    {col.label}
                                                    {getFilterIcon({
                                                        key: col.key,
                                                        filterType: 'status',
                                                        filterableValues: [
                                                            'viewAll',
                                                            ...playbookStatus
                                                        ]
                                                    })}
                                                </Table.ColumnHeader>
                                            )
                                        }
                                        return (
                                            <Table.ColumnHeader
                                                key={col.key}
                                                whiteSpace='nowrap'
                                                textOverflow='ellipsis'
                                                overflow='hidden'
                                                verticalAlign='middle'
                                                colorPalette='gray.subtle'
                                            >
                                                {col.label}
                                            </Table.ColumnHeader>
                                        )
                                    })}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filteredPlaybooks.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell
                                            colSpan={visibleColumns.length}
                                            textAlign='center'
                                            verticalAlign='top'
                                        >
                                            No playbooks found.
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    filteredPlaybooks.map((pb: Playbook) => (
                                        <Table.Row
                                            bg={'bg.muted'}
                                            key={pb.playbook_id}
                                        >
                                            {visibleColumns.map(col => (
                                                <Table.Cell
                                                    key={col.key}
                                                    verticalAlign='top'
                                                >
                                                    {col.render(pb)}
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Box>
            )}
        </Box>
    )
}
