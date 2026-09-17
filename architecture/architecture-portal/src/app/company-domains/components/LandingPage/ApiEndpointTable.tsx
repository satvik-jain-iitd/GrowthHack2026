import React, { useState, useEffect } from 'react'
import {
    IconArrowUp,
    IconArrowDown,
    IconSearch,
    IconChevronDown,
    IconChevronRight
} from '@americanexpress/dls-icons'
import {
    Box,
    Flex,
    HStack,
    Input,
    InputGroup,
    Spinner,
    Table
} from '@chakra-ui/react'
import { ApiStatusHistoryTable } from '../Modals'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { apiColumns } from '@/app/company-domains/constants'
import { scrollToExpandedData } from '@/app/company-domains/utils'
import Select from 'react-select'
import { Column } from '@/app/company-domains/types'
import { HistoryData } from '@/app/company-domains/hooks'

const ApiEndPointTable = (props: {
    columns: Column[]
    data: HistoryData[]
    isLoading?: boolean
    isSearch?: boolean
}) => {
    const { columns, data, isLoading, isSearch = true } = props
    const [sortedData, setSortedData] = useState(data)
    const [searchVal, setSearchVal] = useState('')
    const [tableData, setTableData] = useState<Array<HistoryData> | null>(null)
    const [sortTable, setSortTable] = useState<{
        sortOrder: 'ASC' | 'DESC' | null
        sortColumn: string | null
    }>({
        sortOrder: null,
        sortColumn: null
    })
    const [checkboxes, setCheckboxes] = useState<
        { label: string; value: string }[]
    >([
        { label: 'Type A', value: 'typeA' },
        { label: 'Type B', value: 'typeB' }
    ])

    useEffect(() => {
        setTableData(sortedData)
    }, [sortedData])

    useEffect(() => {
        const filteredData = data
            ?.filter((item: HistoryData) => {
                const removeKeys = [
                    'api_endpoint_metadata_id',
                    'api_metadata_id',
                    'expanded'
                ]
                const filteredItems = Object.fromEntries(
                    Object.entries(item).filter(
                        ([key]) => !removeKeys.includes(key)
                    )
                )
                return Object.values(filteredItems).some(value => {
                    return value
                        ?.toString()
                        .toLowerCase()
                        .includes(searchVal.toLowerCase())
                })
            })
            .filter((item: HistoryData) => {
                const isTypeASelected = checkboxes
                    .map(checkbox => checkbox.value)
                    .includes('typeA')

                const isTypeBSelected = checkboxes
                    .map(checkbox => checkbox.value)
                    .includes('typeB')

                return isTypeASelected === true && isTypeBSelected === false
                    ? item.api_endpoint_metadata_type?.toLowerCase() ===
                          'type a'
                    : isTypeASelected === false && isTypeBSelected === true
                      ? item.api_endpoint_metadata_type?.toLowerCase() ===
                        'type b'
                      : item
            })
        setSortedData(filteredData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchVal, checkboxes])

    useEffect(() => {
        setSortedData(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(data)])

    const handleSort = (isSortable: boolean, key: string) => {
        let direction: 'ASC' | 'DESC' | null = 'ASC'
        if (sortTable.sortColumn === key && sortTable.sortOrder === 'ASC') {
            direction = 'DESC'
        }
        const data = [...sortedData].sort((a, b) => {
            let aValueToCompare = a[key as keyof HistoryData]
            let bValueToCompare = b[key as keyof HistoryData]
            aValueToCompare = (aValueToCompare ?? '').toString()
            bValueToCompare = (bValueToCompare ?? '').toString()
            return direction === 'ASC'
                ? aValueToCompare?.localeCompare(bValueToCompare)
                : bValueToCompare?.localeCompare(aValueToCompare)
        })
        setSortedData(data)
        setSortTable({ sortOrder: direction, sortColumn: key })
    }

    const getSortIcon = (column: Column) => {
        if (!column.isSortable) return null
        if (sortTable.sortColumn === column.key) {
            return sortTable.sortOrder === 'ASC' ? (
                <IconArrowUp />
            ) : (
                <IconArrowDown />
            )
        }
        return (
            <span style={{ display: 'flex', flexDirection: 'column' }}>
                <IconArrowUp /> <IconArrowDown />{' '}
            </span>
        )
    }

    const handleExpandRowClick = (id: string) => {
        setTableData((oldState: HistoryData[] | null) => {
            const updatedRows =
                oldState?.map((row: HistoryData) => ({
                    ...row,
                    expanded: row.api_metadata_id === id ? !row.expanded : false
                })) || ([] as HistoryData[])
            return updatedRows
        })
        setTimeout(() => {
            scrollToExpandedData(id, `row-api-${id}`)
        }, 0)
    }

    return (
        <div>
            {isSearch && (
                <Flex flexDirection={{ base: 'row', mdDown: 'column' }}>
                    <Box className='col-md-4'>
                        <label
                            htmlFor='history-search-input'
                            id='history-search-input-label'
                        >
                            Search:
                        </label>
                        <InputGroup
                            id='history-search-input'
                            startElement={
                                <IconSearch id='company-domain-search-icon' />
                            }
                        >
                            <Input
                                placeholder='Search'
                                size='md'
                                type='search'
                                width={{ mdDown: '100%' }}
                                className={styles.domainApiSearch}
                                onChange={e => setSearchVal(e.target.value)}
                                value={searchVal}
                                _dark={{
                                    border: '1px solid gray'
                                }}
                            />
                        </InputGroup>
                    </Box>
                    <Box className='col-md-4'>
                        <label
                            htmlFor='history-multiselect'
                            id='history-multiselect-label'
                        >
                            Filter by:
                        </label>

                        <Select
                            isMulti
                            isClearable={false}
                            id='history-multiselect'
                            className='multi-select-container'
                            onChange={selectedOptions => {
                                setCheckboxes([...selectedOptions])
                            }}
                            value={checkboxes}
                            styles={{
                                multiValueRemove: base => {
                                    return checkboxes.length == 1
                                        ? { ...base, display: 'none' }
                                        : {
                                              ...base,
                                              color: 'var(--directory-filter-color)'
                                          }
                                },
                                control: base => ({
                                    ...base,
                                    borderColor:
                                        'var(--chakra-colors-gray-300)',
                                    maxHeight: '40px',
                                    width: '210px',
                                    backgroundColor: 'var(--bgColor-default)'
                                }),
                                menu: base => ({
                                    ...base,
                                    backgroundColor: 'var(--bgColor-default)'
                                }),
                                option: base => ({
                                    ...base,
                                    backgroundColor: 'var(--bgColor-default)'
                                }),
                                multiValue: base => ({
                                    ...base,
                                    backgroundColor: 'var(--directory-filter)'
                                }),
                                multiValueLabel: base => ({
                                    ...base,
                                    color: 'var(--directory-filter-color)'
                                })
                            }}
                            options={[
                                {
                                    label: 'Type A',
                                    value: 'typeA'
                                },
                                { label: 'Type B', value: 'typeB' }
                            ]}
                            placeholder='Select'
                        />
                    </Box>
                </Flex>
            )}
            {isLoading === false && tableData?.length === 0 ? (
                <div className='modal-error-msg'>
                    <label id='modal-error-msg-label'>No results found.</label>
                </div>
            ) : (
                <Box
                    maxHeight={{ base: '350px', mdDown: '200px' }}
                    overflow={'auto'}
                    mt={10}
                >
                    <Table.Root
                        variant={'outline'}
                        id='domain-api-table'
                        display={'table'}
                    >
                        <Table.Header
                            className={styles.tableHeader}
                            backgroundColor={{ base: '#e3f2ff', _dark: '#333' }}
                        >
                            <Table.Row className='tableRow theadTr'>
                                <Table.ColumnHeader
                                    width={'2%'}
                                ></Table.ColumnHeader>
                                {columns.map((column: Column) => {
                                    return (
                                        <Table.ColumnHeader
                                            className={
                                                'history-modal-table-header'
                                            }
                                            key={column.key}
                                            onClick={() =>
                                                handleSort(
                                                    column.isSortable,
                                                    column.key
                                                )
                                            }
                                            title={column.title}
                                        >
                                            {!column.isSortable ? (
                                                <Box textAlign={'left'}>
                                                    {column?.name}
                                                </Box>
                                            ) : (
                                                <HStack>
                                                    <Box textAlign={'left'}>
                                                        {column?.name}
                                                    </Box>
                                                    {getSortIcon(column)}
                                                </HStack>
                                            )}
                                        </Table.ColumnHeader>
                                    )
                                })}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {isLoading && (
                                <Table.Row>
                                    <Table.Cell colSpan={columns.length + 1}>
                                        <Spinner />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {isLoading === false &&
                                tableData?.map((row, index) => {
                                    return (
                                        <React.Fragment
                                            key={row?.api_metadata_id || index}
                                        >
                                            <Table.Row
                                                data-testid={`row-api-${row?.api_metadata_id}`}
                                                key={index}
                                                id={row?.api_metadata_id}
                                                className={
                                                    row?.expanded
                                                        ? styles.expandedRowOverride
                                                        : `company-directory-table-row`
                                                }
                                                backgroundColor={{
                                                    base: 'white',
                                                    _dark: '#333'
                                                }}
                                            >
                                                <Table.Cell
                                                    onClick={() =>
                                                        handleExpandRowClick(
                                                            row?.api_metadata_id
                                                        )
                                                    }
                                                >
                                                    {row?.expanded ? (
                                                        <IconChevronDown color='white' />
                                                    ) : (
                                                        <IconChevronRight />
                                                    )}
                                                </Table.Cell>
                                                {columns?.map((obj: Column) => {
                                                    return (
                                                        <Table.Cell
                                                            style={{
                                                                lineHeight:
                                                                    '40px'
                                                            }}
                                                            key={`${obj.key}_${index}`}
                                                        >
                                                            {(row[
                                                                obj.key as keyof HistoryData
                                                            ] as string) || ''}
                                                        </Table.Cell>
                                                    )
                                                })}
                                            </Table.Row>
                                            {row?.expanded && (
                                                <Table.Row id='domain-api-table-expandable-content'>
                                                    <Table.Cell
                                                        colSpan={
                                                            columns?.length + 1
                                                        }
                                                    >
                                                        <Box
                                                            maxHeight={'300px'}
                                                            overflow={'auto'}
                                                        >
                                                            <ApiStatusHistoryTable
                                                                columns={
                                                                    apiColumns
                                                                }
                                                                data={
                                                                    row?.history
                                                                }
                                                                isLoading={
                                                                    false
                                                                }
                                                            />
                                                        </Box>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </div>
    )
}
export default ApiEndPointTable
