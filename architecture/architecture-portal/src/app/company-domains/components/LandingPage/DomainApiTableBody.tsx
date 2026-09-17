/* istanbul ignore file */
import styles from '@/app/company-domains/domain-api-page.module.css'
import { DomainApiListItem } from './DomainApiListItem'
import DetailsPageAPI from './DetailsPageApi'
import {
    ApiAddDa,
    ApiEndpoint,
    ApiMetadata,
    Reviewer
} from '@/app/company-domains/types'
import { NoDataComponent } from './DomainApiTable.constants'
import { Box, Spinner, Table } from '@chakra-ui/react'
import { Draggable, Droppable } from '@hello-pangea/dnd'

interface DomainApiTableBodyProps {
    orderedData: ApiMetadata[]
    isLoading: boolean
    isReviewersLoading: boolean
    noDataMessage: string
    columnCount: number
    expandedRowId: string | number | null
    domainId: string
    reviewers: Reviewer | undefined
    viewOnly: boolean
    isDraggingDisabled: boolean
    isAdmin: boolean
    domainOwner: string[]
    loggedInUserEmail: string
    onExpandRowClick: (id: string) => void
    onReloadData: () => void
    setIsEditRow: (
        id: string,
        data: ApiEndpoint & ApiMetadata,
        name: string,
        isApiEdit?: boolean
    ) => void
    setOperationDragInProgress: (isDragging: boolean) => void
}

const parseAdditionalData = (addDa: ApiMetadata['add_da']): ApiAddDa => {
    if (!addDa) return {}

    if (typeof addDa === 'string') {
        try {
            return JSON.parse(addDa)
        } catch (error) {
            console.error('invalid JSON in add_da:', error)
            return {}
        }
    }

    return typeof addDa === 'object' ? addDa : {}
}

export function DomainApiTableBody({
    orderedData,
    isLoading,
    isReviewersLoading,
    noDataMessage,
    columnCount,
    expandedRowId,
    domainId,
    reviewers,
    viewOnly,
    isDraggingDisabled,
    isAdmin,
    domainOwner,
    loggedInUserEmail,
    onExpandRowClick,
    onReloadData,
    setIsEditRow,
    setOperationDragInProgress
}: DomainApiTableBodyProps) {
    return (
        <Droppable droppableId='domain-api-table'>
            {provided => (
                <Table.Body
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    _dark={{ color: 'white' }}
                >
                    {(isLoading || isReviewersLoading) && (
                        <Table.Row>
                            <Table.Cell colSpan={6} textAlign='center'>
                                <div className={styles.noDataContainer}>
                                    <Spinner className={styles.loader} />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {!isReviewersLoading &&
                        !isLoading &&
                        orderedData.length === 0 && (
                            <NoDataComponent
                                message={noDataMessage}
                                colLength={columnCount}
                            />
                        )}
                    {!isLoading &&
                        orderedData.length > 0 &&
                        orderedData.map((row, index) => {
                            const additionalData = parseAdditionalData(
                                row.add_da
                            )
                            const normalizedLoggedInUserEmail =
                                loggedInUserEmail.toLowerCase()
                            const allowedUsers =
                                isAdmin ||
                                row.created_user_email?.toLowerCase() ===
                                    normalizedLoggedInUserEmail ||
                                row.co_editors?.includes(
                                    normalizedLoggedInUserEmail
                                ) ||
                                domainOwner?.includes(domainId)
                            const isRowDraggableDisabled =
                                row.add_da?.status?.toLowerCase() === 'deleted'
                            return (
                                <Draggable
                                    key={row.api_metadata_id}
                                    draggableId={row.api_metadata_id.toString()}
                                    index={index}
                                    isDragDisabled={
                                        isDraggingDisabled ||
                                        isRowDraggableDisabled
                                    }
                                >
                                    {(draggableProvided, snapshot) => (
                                        <>
                                            <Table.Row
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                style={{
                                                    ...draggableProvided
                                                        .draggableProps.style,
                                                    boxShadow:
                                                        snapshot.isDragging
                                                            ? '0px 4px 8px rgba(0, 0, 0, 0.2)'
                                                            : 'none',
                                                    cursor: isDraggingDisabled
                                                        ? 'default'
                                                        : 'grab',
                                                    backgroundColor:
                                                        snapshot.isDragging
                                                            ? '#e3f2ff'
                                                            : 'inherit'
                                                }}
                                                _dark={{
                                                    backgroundColor:
                                                        snapshot.isDragging
                                                            ? '#1b5e99 !important'
                                                            : 'inherit'
                                                }}
                                                data-testid={`row-${row.api_metadata_id}`}
                                                id={row.api_metadata_id}
                                                className={
                                                    row.api_metadata_id ===
                                                    expandedRowId
                                                        ? `company-domain-api-table-row-expanded ${styles.domainApiListItemRow}`
                                                        : 'company-directory-table-row'
                                                }
                                            >
                                                <DomainApiListItem
                                                    data={row}
                                                    rowExpanded={
                                                        row.api_metadata_id ===
                                                        expandedRowId
                                                    }
                                                    handleExpandRowClick={
                                                        onExpandRowClick
                                                    }
                                                    domainId={domainId}
                                                    reloadData={onReloadData}
                                                    allowedUsers={allowedUsers}
                                                />
                                            </Table.Row>
                                            {row.api_metadata_id ===
                                                expandedRowId && (
                                                <Table.Row>
                                                    <Table.Cell colSpan={6}>
                                                        <Box
                                                            id='domain-api-table-expandable-content'
                                                            padding={3}
                                                            backgroundColor={{
                                                                base: 'rgb(245, 243, 243)',
                                                                _dark: 'black'
                                                            }}
                                                        >
                                                            <DetailsPageAPI
                                                                api_nm={
                                                                    row.api_nm
                                                                }
                                                                reviewers={
                                                                    reviewers
                                                                }
                                                                setIsEditRow={
                                                                    setIsEditRow
                                                                }
                                                                data={
                                                                    row as ApiMetadata &
                                                                        ApiEndpoint
                                                                }
                                                                additionalData={
                                                                    additionalData
                                                                }
                                                                reloadData={
                                                                    onReloadData
                                                                }
                                                                domainId={
                                                                    domainId
                                                                }
                                                                api_metadata_id={
                                                                    row.api_metadata_id
                                                                }
                                                                endpointMetadata={
                                                                    row.api_endpoint
                                                                }
                                                                rowExpanded={
                                                                    row.api_metadata_id ===
                                                                    expandedRowId
                                                                }
                                                                viewOnly={
                                                                    viewOnly ??
                                                                    false
                                                                }
                                                                setOperationDragInProgress={
                                                                    setOperationDragInProgress
                                                                }
                                                                allowedUsers={
                                                                    allowedUsers
                                                                }
                                                            />
                                                        </Box>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </>
                                    )}
                                </Draggable>
                            )
                        })}
                    {provided.placeholder}
                </Table.Body>
            )}
        </Droppable>
    )
}
