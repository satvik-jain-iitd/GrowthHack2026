/* istanbul ignore file */
import { Box, Flex, Table, Text } from '@chakra-ui/react'
import { IconArrowDown, IconArrowUp } from '@americanexpress/dls-icons'
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import styles from '@/app/directory/directory.module.css'
import { AuditAppResponse, AuditUserName } from '../../types'

const formatTimestamp = (value?: string) => {
    if (!value) {
        return value
    }

    const parsedDate = new Date(value)

    if (Number.isNaN(parsedDate.getTime())) {
        return value
    }

    return parsedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    })
}

interface LogsModalTableProps {
    columns: Array<{ key: string; label: string }>
    sortedData: Array<AuditAppResponse>
    columnName: string
    sortType: string
    handleSort: (key: string) => void
}

const LogsModalTable = ({
    columns,
    sortedData,
    columnName,
    sortType,
    handleSort
}: LogsModalTableProps) => {
    const getColumnClassName = (key: string) => {
        if (key === 'appName') {
            return styles.logsTableColumnAppName
        }

        if (key === 'timeStamp') {
            return styles.logsTableColumnTimeStamp
        }

        if (key === 'userName') {
            return styles.logsTableColumnUserName
        }

        return styles.logsTableColumnDefault
    }

    const getSortIcon = (key: string) => {
        if (columnName === key) {
            return sortType === 'asc' ? (
                <IconArrowUp
                    style={{ marginLeft: '5px' }}
                    aria-label='sortAscending'
                />
            ) : (
                <IconArrowDown
                    style={{ marginLeft: '5px' }}
                    aria-label='sortDescending'
                />
            )
        }

        return (
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <IconArrowUp aria-label='sortAscending' />{' '}
                <IconArrowDown aria-label='sortDescending' />{' '}
            </Box>
        )
    }

    const renderCellContent = (
        row: AuditAppResponse,
        key: string,
        index: number
    ) => {
        const value = row[key as keyof AuditAppResponse]
        const columnClassName = getColumnClassName(key)
        const cellClassName = `${styles.logsTableCell} ${columnClassName}`

        if (typeof value === 'object') {
            const user = value as AuditUserName | null

            return (
                <Table.Cell key={`${key}_${index}`} className={cellClassName}>
                    <Box className={styles.logsTableUserCell}>
                        {user && (
                            <>
                                <UserAvatar
                                    email={user.email}
                                    name={user.name}
                                />
                                <Box className={styles.logsTableUserName}>
                                    {user.name}
                                </Box>
                            </>
                        )}
                    </Box>
                </Table.Cell>
            )
        }

        if (key === 'timeStamp' && typeof value === 'string') {
            return (
                <Table.Cell key={`${key}_${index}`} className={cellClassName}>
                    {formatTimestamp(value)}
                </Table.Cell>
            )
        }

        return (
            <Table.Cell key={`${key}_${index}`} className={cellClassName}>
                {value as string}
            </Table.Cell>
        )
    }

    return (
        <Table.Root
            size='sm'
            id='companyDetailTableLogs'
            variant='outline'
            className={`${styles.logsTable} excludeExpand`}
        >
            <Table.Header>
                <Table.Row className='tableRow theadTr'>
                    {columns.map(row => (
                        <Table.ColumnHeader
                            className={`${styles.logsTableHeaderCell} ${getColumnClassName(
                                row.key
                            )} history-modal-table-header`}
                            key={row.key}
                            onClick={() => {
                                handleSort(row.key)
                            }}
                        >
                            <Flex className={styles.logsTableHeaderInner}>
                                <Text mr='2'>{row.label} </Text>
                                {getSortIcon(row.key)}
                            </Flex>
                        </Table.ColumnHeader>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortedData?.map((row, index) => (
                    <Table.Row
                        className='tableRow logsModalTableRow'
                        key={index}
                    >
                        {columns.map(obj =>
                            renderCellContent(row, obj.key, index)
                        )}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}

export default LogsModalTable
