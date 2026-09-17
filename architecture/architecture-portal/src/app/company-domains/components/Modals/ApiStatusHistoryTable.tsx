/* istanbul ignore file */
import React, { useState, useEffect } from 'react'
import { IconArrowUp, IconArrowDown } from '@americanexpress/dls-icons'
import { Box, HStack, Table, Spinner, Badge } from '@chakra-ui/react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import {
    UserAvatar,
    UserAvatarWithName
} from '@/app/company-domains/components/'
import {
    ApiHistory,
    Column,
    ApiStatusHistoryTableProps,
    SortTable
} from '@/app/company-domains/types'

export const ApiStatusHistoryTable: React.FC<ApiStatusHistoryTableProps> = ({
    columns,
    data,
    isLoading,
    isModal = false
}) => {
    const [sortTable, setSortTable] = useState<SortTable>({
        sortOrder: null,
        sortColumn: null
    })
    const [tableData, setTableData] = useState<ApiHistory[] | undefined>()

    useEffect(() => {
        setTableData(data)
    }, [data])

    const handleSort = (isSortable: boolean, key: string) => {
        if (!isSortable) return

        let direction: 'ASC' | 'DESC' = 'ASC'
        if (sortTable.sortColumn === key && sortTable.sortOrder === 'ASC') {
            direction = 'DESC'
        }
        const sortedData = [...(tableData || [])].sort((a, b) => {
            const aValueToCompare = (a[key] ?? '').toString()
            const bValueToCompare = (b[key] ?? '').toString()
            return direction === 'ASC'
                ? aValueToCompare.localeCompare(bValueToCompare)
                : bValueToCompare.localeCompare(aValueToCompare)
        })
        setTableData(sortedData)
        setSortTable({ sortOrder: direction, sortColumn: key })
    }

    const getSortIcon = (column: Column) => {
        if (!column.isSortable) return null
        if (sortTable.sortColumn === column.key) {
            return sortTable.sortOrder === 'ASC' ? (
                <IconArrowUp size='xs' />
            ) : (
                <IconArrowDown size='xs' />
            )
        }
        return (
            <span style={{ display: 'flex', flexDirection: 'column' }}>
                <IconArrowUp size='xs' /> <IconArrowDown size='xs' />{' '}
            </span>
        )
    }

    return (
        <Table.Root
            display={'table'}
            variant='outline'
            width='100%'
            id='domain-api-table'
            className={`${
                isModal
                    ? styles.domainApiHistoryModal
                    : styles.domainApiHistoryTable
            } ${isLoading && styles.tableLoader}`}
            stickyHeader
        >
            <Table.Header
                className={styles.tableHeader}
                backgroundColor={{ base: '#e3f2ff', _dark: '#333' }}
                top={0}
            >
                <Table.Row className='tableRow theadTr'>
                    {columns.map(column => (
                        <Table.ColumnHeader
                            className={'history-modal-table-header'}
                            key={column.key}
                            onClick={() =>
                                handleSort(column.isSortable, column.key)
                            }
                            title={column.title}
                        >
                            {!column.isSortable ? (
                                <Box
                                    textAlign={'left'}
                                    _dark={{ color: 'white !important' }}
                                >
                                    {column?.name}
                                </Box>
                            ) : (
                                <HStack>
                                    <Box
                                        textAlign={'left'}
                                        _dark={{ color: 'white !important' }}
                                    >
                                        {column?.name}
                                    </Box>
                                    {getSortIcon(column)}
                                </HStack>
                            )}
                        </Table.ColumnHeader>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body className={styles.statusHistoryModalBody}>
                {isLoading && (
                    <Table.Row>
                        <Table.Cell colSpan={4} textAlign='center'>
                            <Spinner />
                        </Table.Cell>
                    </Table.Row>
                )}
                {!isLoading &&
                    tableData?.map((row, index) => (
                        <Table.Row
                            className='tableRow logsModalTableRow'
                            key={index}
                            id={row?.api_metadata_id as string}
                        >
                            {columns?.map(obj => {
                                if (obj.key === 'creat_user_nm') {
                                    return (
                                        <Table.Cell key={`${obj.key}_${index}`}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {row?.userid && (
                                                    <UserAvatar
                                                        email={row?.userid}
                                                        name={
                                                            row?.creat_user_nm
                                                        }
                                                    />
                                                )}
                                                <div
                                                    style={{
                                                        marginLeft: '8px'
                                                    }}
                                                >
                                                    {row?.creat_user_nm}
                                                    {row?.is_delegate_approval && (
                                                        <Badge
                                                            colorScheme='yellow'
                                                            ml={2}
                                                        >
                                                            {row?.is_delegate_to ? (
                                                                <>
                                                                    {`Delegate
                                                                    ${row?.wkflow_sta_val_tx?.toLowerCase() === 'rejected' ? 'Rejected' : 'Approved'} for`}
                                                                    <UserAvatarWithName
                                                                        email={
                                                                            row?.is_delegate_to ??
                                                                            undefined
                                                                        }
                                                                        nameFirst
                                                                    />
                                                                </>
                                                            ) : (
                                                                'Delegate Approval'
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </Table.Cell>
                                    )
                                }
                                if (obj.key === 'wkflow_step_nm') {
                                    return (
                                        <Table.Cell key={`${obj.key}_${index}`}>
                                            {row?.wkflow_step_nm
                                                ?.toLowerCase()
                                                .split(' ')
                                                .map(
                                                    w =>
                                                        w
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        w.slice(1)
                                                )
                                                .join(' ')}
                                        </Table.Cell>
                                    )
                                }
                                if (obj.key === 'aprv_ts') {
                                    const date = new Date(
                                        row?.aprv_ts as string
                                    ).toLocaleString()
                                    return (
                                        <Table.Cell key={`${obj.key}_${index}`}>
                                            {date}
                                        </Table.Cell>
                                    )
                                }
                                if (obj.key === 'wkflow_sta_val_tx') {
                                    return (
                                        <Table.Cell key={`${obj.key}_${index}`}>
                                            {row?.wkflow_sta_val_tx
                                                ?.toLowerCase()
                                                .split(' ')
                                                .map(
                                                    w =>
                                                        w
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        w.slice(1)
                                                )
                                                .join(' ')}
                                        </Table.Cell>
                                    )
                                }
                                return (
                                    <Table.Cell key={`${obj.key}_${index}`}>
                                        {row[obj.key] || ''}
                                    </Table.Cell>
                                )
                            })}
                        </Table.Row>
                    ))}
            </Table.Body>
        </Table.Root>
    )
}
