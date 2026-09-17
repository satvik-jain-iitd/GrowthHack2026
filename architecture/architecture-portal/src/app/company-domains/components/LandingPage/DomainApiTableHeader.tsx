/* istanbul ignore file */
import styles from '@/app/company-domains/domain-api-page.module.css'
import { StatusBadge } from './Status'
import { statusMap } from '@/app/company-domains/constants'
import { ApiMetadata } from '@/app/company-domains/types'
import { ApiTableColumn } from './DomainApiTable.constants'
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Menu,
    Portal,
    Table
} from '@chakra-ui/react'
import {
    IconArrowDown,
    IconArrowUp,
    IconFilter
} from '@americanexpress/dls-icons'

interface DomainApiTableHeaderProps {
    columns: ApiTableColumn[]
    sortColumn: keyof ApiMetadata | ''
    sortOrder: '' | 'ASC' | 'DESC'
    isSmallScreen: boolean
    isStatusChecked: (value: string) => boolean
    onStatusToggle: (value: string) => void
    onViewAllClick: () => void
    onSort: (isSortable: boolean, key: keyof ApiMetadata) => void
}

const getSortIcon = (
    column: ApiTableColumn,
    sortColumn: keyof ApiMetadata | '',
    sortOrder: '' | 'ASC' | 'DESC'
) => {
    if (!column.isSortable) return null

    if (sortColumn === column.key) {
        if (sortOrder === 'ASC') {
            return <IconArrowUp size='xs' />
        }

        if (sortOrder === 'DESC') {
            return <IconArrowDown size='xs' />
        }

        return (
            <Flex direction='column' alignItems='center'>
                <IconArrowUp size='xs' style={{ opacity: 0.6 }} />
                <IconArrowDown size='xs' style={{ opacity: 0.6 }} />
            </Flex>
        )
    }

    return (
        <Flex direction='column' alignItems='center'>
            <IconArrowUp size='xs' style={{ opacity: 0.2 }} />
            <IconArrowDown size='xs' style={{ opacity: 0.2 }} />
        </Flex>
    )
}

const getColumnName = (column: ApiTableColumn, isSmallScreen: boolean) =>
    isSmallScreen ? column.shortName || column.name : column.name

const renderFilterIcon = (
    column: ApiTableColumn,
    isStatusChecked: (value: string) => boolean,
    onStatusToggle: (value: string) => void,
    onViewAllClick: () => void
) => (
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
                    size='sm'
                    className={styles.filterIcon}
                    title={column.filterTitle || 'Filter'}
                    titleId={`statusFilter_${column.key}`}
                />
            </IconButton>
        </Menu.Trigger>
        <Portal>
            <Menu.Positioner>
                <Menu.Content minW={0} p={0} w='auto'>
                    <Menu.ItemGroup>
                        {column.filterableValues?.map(status => (
                            <Menu.CheckboxItem
                                key={status}
                                value={status}
                                checked={
                                    status === 'viewAll'
                                        ? false
                                        : isStatusChecked(status)
                                }
                                onCheckedChange={() => {
                                    if (status !== 'viewAll') {
                                        onStatusToggle(status)
                                    }
                                }}
                                onClick={() => {
                                    if (status === 'viewAll') {
                                        onViewAllClick()
                                    }
                                }}
                                className={
                                    status === 'viewAll'
                                        ? styles.viewAllOption
                                        : styles.StatusBadge
                                }
                            >
                                {status === 'viewAll' ? (
                                    'VIEW ALL'
                                ) : (
                                    <StatusBadge
                                        status={
                                            status as keyof typeof statusMap
                                        }
                                        rowExpanded={false}
                                    />
                                )}
                                <Menu.ItemIndicator />
                            </Menu.CheckboxItem>
                        ))}
                    </Menu.ItemGroup>
                </Menu.Content>
            </Menu.Positioner>
        </Portal>
    </Menu.Root>
)

export function DomainApiTableHeader({
    columns,
    sortColumn,
    sortOrder,
    isSmallScreen,
    isStatusChecked,
    onStatusToggle,
    onViewAllClick,
    onSort
}: DomainApiTableHeaderProps) {
    return (
        <Table.Header
            className={styles.tableHeader}
            _dark={{ color: 'white' }}
            backgroundColor={{
                base: 'e3f2ff',
                _dark: '#333'
            }}
            top={0}
        >
            <Table.Row id='domain-api-table-head-row'>
                <Table.ColumnHeader _dark={{ color: 'white' }} width='3%' />
                {columns.map(column => (
                    <Table.ColumnHeader
                        _dark={{ color: 'white' }}
                        key={String(column.key)}
                        onClick={() => onSort(column.isSortable, column.key)}
                        title={column.title}
                        width={column.width}
                    >
                        {!column.isSortable && !column.isFilterable ? (
                            <Box
                                className={styles.columnName}
                                justifyContent='flex-start'
                            >
                                {getColumnName(column, isSmallScreen)}
                            </Box>
                        ) : (
                            <HStack justifyContent='flex-start'>
                                <Box
                                    textAlign='left'
                                    className={styles.columnName}
                                >
                                    {getColumnName(column, isSmallScreen)}
                                </Box>
                                {column.isFilterable
                                    ? renderFilterIcon(
                                          column,
                                          isStatusChecked,
                                          onStatusToggle,
                                          onViewAllClick
                                      )
                                    : getSortIcon(
                                          column,
                                          sortColumn,
                                          sortOrder
                                      )}
                            </HStack>
                        )}
                    </Table.ColumnHeader>
                ))}
            </Table.Row>
        </Table.Header>
    )
}
