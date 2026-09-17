/* istanbul ignore file */
import styles from '@/app/company-domains/domain-api-page.module.css'
import { ReactNode } from 'react'
import {
    Box,
    HStack,
    IconButton,
    Menu,
    Portal,
    Spinner,
    Table
} from '@chakra-ui/react'
import { IconFilter } from '@americanexpress/dls-icons'
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult
} from '@hello-pangea/dnd'
import { OperationalListItem } from './OperationalListItem'
import { StatusBadge } from './Status'
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'
import { statusMap } from '@/app/company-domains/constants'
import {
    OperationTableColumnTypes,
    operationTableColumns
} from './OperationTableConfig'

type OperationTableGridProps = {
    columns: OperationTableColumnTypes[]
    isDragInProgress: boolean
    handleBeforeCapture: () => void
    handleDragEnd: (result: DropResult) => void | Promise<void>
    isLoading: boolean
    isReviewersLoading: boolean
    isAdd: boolean
    data: ApiMetadata
    tableData: ApiMetadata
    searchVal: string
    noFiltersSelected: boolean
    getColumnName: (column: OperationTableColumnTypes) => string
    onColumnSort: (column: OperationTableColumnTypes) => void
    renderColumnAction: (column: OperationTableColumnTypes) => ReactNode
    loggedInUserEmail?: string
    isAdmin: boolean
    isCoeditor?: boolean
    isDomainOwner?: boolean
    isDraggingDisabled: boolean
    domainId: string
    refreshTableData: () => void
    reviewers: Reviewer | undefined
    setIsEditRow: (
        id: string,
        rowData: ApiMetadata & ApiEndpoint,
        name: string
    ) => void
    handleExpandRowClick: (id: string) => void
    viewOnly: boolean
    api_nm: string
    isDeletedApi?: boolean
}

type DragFeedbackItem = {
    id: number
    message: string
    type: 'success' | 'error'
}

type OperationTableFeedbackProps = {
    feedback: DragFeedbackItem[]
}

type OperationTableFilterMenuProps = {
    column: OperationTableColumnTypes
    statusValues: string[]
    typeValues: string[]
    statusFilterOptions: string[]
    typeFilterOptions: string[]
    isStatusChecked: (value: string) => boolean
    isTypeChecked: (value: string) => boolean
    toggleStatusValue: (value: string) => void
    toggleTypeValue: (value: string) => void
    setStatusValues: (value: string[]) => void
    setTypeValues: (value: string[]) => void
}

const NoDataRow = ({ message }: { message: string }) => (
    <Table.Row>
        <Table.Cell
            colSpan={operationTableColumns.length}
            className={styles.noDataTableCell}
        >
            <div className={styles.noDataContainer}>
                <p className={styles.noDataText}>{message}</p>
            </div>
        </Table.Cell>
    </Table.Row>
)

const getNoDataMessage = (searchVal: string, noFiltersSelected: boolean) => {
    if (searchVal) {
        return 'No operations found for the search, please try a different search term.'
    }

    if (noFiltersSelected) {
        return 'Please select a filter to view the APIs.'
    }

    return "No operations registered for this domain. Please click on the 'Add / propose Operations' to add."
}

export const OperationTableFeedback = ({
    feedback
}: OperationTableFeedbackProps) => {
    return (
        <>
            {feedback.map(item => (
                <Box
                    key={item.id}
                    p={3}
                    mb={3}
                    borderRadius='md'
                    backgroundColor={
                        item.type === 'success' ? 'green.100' : 'red.100'
                    }
                    color={item.type === 'success' ? 'green.800' : 'red.800'}
                    _dark={{
                        backgroundColor:
                            item.type === 'success' ? 'green.900' : 'red.900',
                        color: item.type === 'success' ? 'green.100' : 'red.100'
                    }}
                    borderLeft={`4px solid ${item.type === 'success' ? '#48bb78' : '#f56565'}`}
                >
                    {item.message}
                </Box>
            ))}
        </>
    )
}

export const OperationTableFilterMenu = ({
    column,
    statusValues,
    typeValues,
    statusFilterOptions,
    typeFilterOptions,
    isStatusChecked,
    isTypeChecked,
    toggleStatusValue,
    toggleTypeValue,
    setStatusValues,
    setTypeValues
}: OperationTableFilterMenuProps) => {
    const handleViewAllClick = () => {
        if (column.filterType === 'apiType') {
            if (typeValues.length === typeFilterOptions.length) {
                setTypeValues([])
            } else {
                setTypeValues(typeFilterOptions)
            }
            return
        }

        const visibleStatusOptions = statusFilterOptions.filter(
            item => item !== 'deleted'
        )

        if (statusValues.length === visibleStatusOptions.length) {
            setStatusValues([])
        } else {
            setStatusValues(visibleStatusOptions)
        }
    }

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
                        size='sm'
                        className={styles.filterIcon}
                        title={column.filterTitle || 'Filter'}
                        titleId={`statusFilter_${column.key}`}
                    />
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content minW={0} p={0} w='auto' zIndex={3}>
                        <Menu.ItemGroup className={styles.statusContainer}>
                            {column.filterableValues?.map(value => (
                                <Menu.CheckboxItem
                                    key={value}
                                    value={value}
                                    checked={
                                        value === 'viewAll'
                                            ? false
                                            : column.filterType === 'apiType'
                                              ? isTypeChecked(value)
                                              : isStatusChecked(value)
                                    }
                                    onCheckedChange={() => {
                                        if (value === 'viewAll') {
                                            return
                                        }

                                        if (column.filterType === 'apiType') {
                                            toggleTypeValue(value)
                                        } else {
                                            toggleStatusValue(value)
                                        }
                                    }}
                                    onClick={() => {
                                        if (value === 'viewAll') {
                                            handleViewAllClick()
                                        }
                                    }}
                                    className={
                                        value === 'viewAll'
                                            ? styles.viewAllOption
                                            : styles.StatusBadge
                                    }
                                >
                                    {value === 'viewAll' ? (
                                        'VIEW ALL'
                                    ) : (
                                        <StatusBadge
                                            status={
                                                value as keyof typeof statusMap
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
}

export const OperationTableGrid = ({
    columns,
    isDragInProgress,
    handleBeforeCapture,
    handleDragEnd,
    isLoading,
    isReviewersLoading,
    isAdd,
    data,
    tableData,
    searchVal,
    noFiltersSelected,
    getColumnName,
    onColumnSort,
    renderColumnAction,
    loggedInUserEmail,
    isAdmin,
    isCoeditor,
    isDomainOwner,
    isDraggingDisabled,
    domainId,
    refreshTableData,
    reviewers,
    setIsEditRow,
    handleExpandRowClick,
    viewOnly,
    api_nm,
    isDeletedApi
}: OperationTableGridProps) => {
    return (
        <Box style={{ paddingBottom: '20px' }}>
            <DragDropContext
                onBeforeCapture={handleBeforeCapture}
                onDragEnd={handleDragEnd}
            >
                <Droppable droppableId='operational-table'>
                    {provided => (
                        <Table.Root
                            variant='outline'
                            id='operational-table'
                            data-testid='operational-table'
                            className={styles.operationalTable}
                            display='table'
                            stickyHeader={!isDragInProgress}
                            style={{
                                width: '100%',
                                marginBottom: '20px'
                            }}
                        >
                            <Table.Header
                                className={styles.tableHeader}
                                backgroundColor={{
                                    base: '#e1e3e7',
                                    _dark: '#3c3c3c'
                                }}
                                top={0}
                            >
                                <Table.Row id='operations-table-head-row'>
                                    <Table.ColumnHeader width='2%'></Table.ColumnHeader>
                                    {columns.map(column => (
                                        <Table.ColumnHeader
                                            className='operations-table-head-cell'
                                            key={column.key}
                                            onClick={() => onColumnSort(column)}
                                            title={column.title}
                                            w={column.width}
                                        >
                                            {!column.isSortable &&
                                            !column.isFilterable ? (
                                                <Box
                                                    className={
                                                        styles.columnName
                                                    }
                                                    textAlign='left'
                                                    alignItems='center'
                                                >
                                                    {getColumnName(column)}
                                                </Box>
                                            ) : (
                                                <HStack>
                                                    <Box
                                                        textAlign='left'
                                                        className={
                                                            styles.columnName
                                                        }
                                                    >
                                                        {getColumnName(column)}
                                                    </Box>
                                                    {renderColumnAction(column)}
                                                </HStack>
                                            )}
                                        </Table.ColumnHeader>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body
                                backgroundColor={{ _dark: 'black' }}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                _dark={{ color: 'white' }}
                            >
                                {(isLoading || isReviewersLoading) && (
                                    <Table.Row>
                                        <Table.Cell
                                            className={styles.noDataContainer}
                                        >
                                            <Spinner
                                                className={styles.loader}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {!isReviewersLoading &&
                                    !isLoading &&
                                    !isAdd &&
                                    (!data ||
                                        (Array.isArray(
                                            tableData?.api_endpoint
                                        ) &&
                                            tableData.api_endpoint.length ===
                                                0)) && (
                                        <NoDataRow
                                            message={getNoDataMessage(
                                                searchVal,
                                                noFiltersSelected
                                            )}
                                        />
                                    )}
                                {Array.isArray(tableData?.api_endpoint) &&
                                    tableData.api_endpoint.map(
                                        (row: ApiEndpoint, index: number) => {
                                            const allowedUsers =
                                                isAdmin ||
                                                row?.draft_user_email?.toLowerCase() ===
                                                    loggedInUserEmail ||
                                                isCoeditor ||
                                                isDomainOwner
                                            const isRowDraggableDisabled =
                                                row?.status?.toLowerCase() ===
                                                'deleted'

                                            return (
                                                <Draggable
                                                    key={
                                                        row.api_endpoint_metadata_id
                                                    }
                                                    draggableId={row.api_endpoint_metadata_id.toString()}
                                                    index={index}
                                                    isDragDisabled={
                                                        isDraggingDisabled ||
                                                        isRowDraggableDisabled
                                                    }
                                                >
                                                    {(
                                                        draggableProvided,
                                                        snapshot
                                                    ) => (
                                                        <OperationalListItem
                                                            isDraggingDisabled={
                                                                isDraggingDisabled
                                                            }
                                                            draggableRef={
                                                                draggableProvided.innerRef
                                                            }
                                                            draggableProps={
                                                                draggableProvided.draggableProps
                                                            }
                                                            dragHandleProps={
                                                                draggableProvided.dragHandleProps
                                                            }
                                                            providedStyle={
                                                                draggableProvided
                                                                    .draggableProps
                                                                    .style
                                                            }
                                                            data={
                                                                row as ApiMetadata &
                                                                    ApiEndpoint
                                                            }
                                                            domainId={domainId}
                                                            reloadData={
                                                                refreshTableData
                                                            }
                                                            reviewers={
                                                                reviewers
                                                            }
                                                            setIsEditRow={
                                                                setIsEditRow
                                                            }
                                                            rowExpanded={
                                                                row.expanded
                                                            }
                                                            rowIndex={index + 2}
                                                            api_metadata_id={
                                                                data?.api_metadata_id
                                                            }
                                                            api_nm={api_nm}
                                                            apiData={tableData}
                                                            handleExpandRowClick={
                                                                handleExpandRowClick
                                                            }
                                                            viewOnly={viewOnly}
                                                            colLength={
                                                                operationTableColumns.length +
                                                                1
                                                            }
                                                            isDragging={
                                                                snapshot.isDragging
                                                            }
                                                            tableData={data}
                                                            isDeletedApi={
                                                                isDeletedApi
                                                            }
                                                            allowedUsers={
                                                                allowedUsers
                                                            }
                                                        />
                                                    )}
                                                </Draggable>
                                            )
                                        }
                                    )}
                                {provided.placeholder}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    )
}
