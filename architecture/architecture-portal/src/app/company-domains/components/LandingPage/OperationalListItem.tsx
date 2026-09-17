/* istanbul ignore file */
import { Flex, HStack, IconButton, Table } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import { scrollToExpandedData } from '@/app/company-domains/utils'
import Status, { ApiType } from './Status'
import {
    IconChevronDown,
    IconChevronRight,
    IconLinkOut
} from '@americanexpress/dls-icons'
import OperationalDetailsPage from './OperationalDetailsPage'
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'
import { DesignScoreBadge, NoPrefetchLink } from '@/components/ui'
import { useUserContext } from '@/context/UserContext'
import { User } from '@/app/layout/AuthBlueSso'
import {
    DraggableProvidedDraggableProps,
    DraggableProvidedDragHandleProps,
    DraggableStyle
} from '@hello-pangea/dnd'
import { CopyApiUrlButton } from './CopyApiUrlButton'
import { getAbsoluteApiUrl } from '../../constants'
import { IconTrash } from '@americanexpress/dls-icons'
import { ConfirmationModal, OperationScoreModal } from '../Modals'
import Image from 'next/image'
import { useOperationScoreData } from '../../hooks/useOperationScoreData'

interface OperationalListItemProps {
    data: ApiMetadata & ApiEndpoint
    domainId: string
    reloadData: () => void
    reviewers: Reviewer | undefined
    setIsEditRow: (
        id: string,
        data: ApiMetadata & ApiEndpoint,
        name: string
    ) => void
    rowExpanded: boolean
    rowIndex: number
    api_metadata_id: string
    api_nm: string
    apiData: { co_editors?: string[] }
    handleExpandRowClick: (id: string) => void
    viewOnly: boolean
    colLength: number
    draggableRef: (element?: HTMLElement | null | undefined) => void
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps: DraggableProvidedDragHandleProps | null
    isDraggingDisabled: boolean
    providedStyle: DraggableStyle | undefined
    isDragging?: boolean
    tableData: ApiMetadata
    isDeletedApi?: boolean
    allowedUsers?: boolean
}

export const OperationalListItem = ({
    data,
    domainId,
    reloadData,
    reviewers,
    setIsEditRow,
    rowExpanded,
    api_metadata_id,
    api_nm,
    apiData,
    handleExpandRowClick,
    viewOnly,
    colLength,
    draggableRef,
    draggableProps,
    dragHandleProps,
    isDraggingDisabled,
    providedStyle,
    isDragging,
    tableData,
    isDeletedApi,
    allowedUsers
}: OperationalListItemProps) => {
    const {
        endpoint_operation,
        journey_link,
        draft_user_email,
        api_endpoint_metadata_id,
        api_catalog_url,
        api_onboarding_url
    } = data

    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
        useState(false)
    const { co_editors } = apiData || {}
    const editorEmail = Array.isArray(co_editors)
        ? co_editors.map(email => email.toLowerCase())
        : []
    const reviewerEmail = reviewers?.email?.toLowerCase() || ''
    const draftEmail = draft_user_email?.toLowerCase() || ''
    const isUserAllowedToEdit =
        draftEmail === reviewerEmail || editorEmail.includes(reviewerEmail)
    const user: User | undefined = useUserContext()
    const isAdmin = user?.userDirectoryAccess?.admin
    const domainOwner = user?.userDirectoryAccess?.domains
    const isDomainOwner = domainOwner?.includes(domainId)
    const showEditAction =
        isAdmin ||
        (data?.draft &&
            (isUserAllowedToEdit || isDomainOwner) &&
            !(
                data?.proposed?.toLowerCase() === 'proposed' ||
                data?.darb_eng?.toLowerCase() === 'approved' ||
                data?.darb_arch?.toLowerCase() === 'approved' ||
                data?.earb?.toLowerCase() === 'approved'
            ))
    // Allow partial edit if user is admin, domain owner or co-editor or the requestor
    const canEditPartially = isAdmin || isDomainOwner || isUserAllowedToEdit

    const operationUrl = getAbsoluteApiUrl(
        domainId,
        api_endpoint_metadata_id || ''
    )
    const isDeleteVisible =
        data?.status?.toLowerCase() === 'draft' && allowedUsers && !isDeletedApi
    const isDeletedApiOperation = data?.delete?.toLowerCase() === 'deleted'
    const isRestoreVisible =
        allowedUsers && isDeletedApiOperation && !isDeletedApi
    const [status, setStatus] = useState('')

    const handleClick = (value: string) => {
        setStatus(value)
        setOpenDeleteConfirmationModal(true)
    }
    const [showModal, setShowModal] = useState(false)

    const { apiScoreData, fetchData } = useOperationScoreData()

    const handleClickScore = () => {
        setShowModal(true)
        fetchData(domainId, data?.api_endpoint_metadata_id)
    }

    useEffect(() => {
        if (rowExpanded) {
            scrollToExpandedData(
                api_endpoint_metadata_id || '',
                `operation-row-${api_endpoint_metadata_id}`,
                `row-${api_metadata_id}`
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowExpanded])

    return (
        <>
            <Table.Row
                ref={draggableRef}
                {...draggableProps}
                {...dragHandleProps}
                lineHeight={3}
                data-testid={`operation-row-${api_endpoint_metadata_id}`}
                id={api_endpoint_metadata_id}
                className={
                    rowExpanded
                        ? styles.expandedRowOverride
                        : `company-directory-table-row`
                }
                backgroundColor={{ base: 'white', _dark: 'black' }}
                style={{
                    ...providedStyle,
                    boxShadow: isDragging
                        ? '0px 4px 8px rgba(0, 0, 0, 0.2)'
                        : 'none',
                    cursor: isDraggingDisabled ? 'default' : 'grab',
                    backgroundColor: isDragging ? '#e3f2ff' : 'white'
                }}
                _dark={{
                    backgroundColor: isDragging
                        ? '#1b5e99 !important'
                        : rowExpanded
                          ? '#1b5e99 !important'
                          : '#3c3c3c !important'
                }}
            >
                <Table.Cell
                    id={
                        rowExpanded
                            ? 'domain-api-table-cell-expanded'
                            : 'domain-api-table-cell'
                    }
                    onClick={() =>
                        handleExpandRowClick(api_endpoint_metadata_id)
                    }
                    textAlign={'center'}
                >
                    {rowExpanded ? (
                        <IconChevronDown color='white' />
                    ) : (
                        <IconChevronRight />
                    )}
                </Table.Cell>
                <Table.Cell
                    id={
                        rowExpanded
                            ? 'domain-api-table-cell-expanded'
                            : 'domain-api-table-cell'
                    }
                >
                    {endpoint_operation || '--'}
                </Table.Cell>
                <Table.Cell
                    id={
                        rowExpanded
                            ? 'domain-api-table-cell-expanded'
                            : 'domain-api-table-cell'
                    }
                >
                    <ApiType
                        data={{
                            ...data,
                            endpoint_type:
                                data.endpoint_type ||
                                data.endpoint_operation ||
                                'default_type',
                            api_endpoint_type_nm: 'default_name'
                        }}
                    />
                </Table.Cell>
                <Table.Cell
                    id={
                        rowExpanded
                            ? 'domain-api-table-cell-expanded'
                            : 'domain-api-table-cell'
                    }
                >
                    {journey_link ? (
                        <NoPrefetchLink
                            href={journey_link}
                            title='Journey Link'
                            target='_blank'
                            rel='noopener noreferrer'
                            className={
                                rowExpanded
                                    ? styles.journeyLinkIconExpanded
                                    : styles.journeyLinkIcon
                            }
                        >
                            <Flex alignItems='center'>
                                <IconLinkOut /> Link
                            </Flex>
                        </NoPrefetchLink>
                    ) : (
                        '--'
                    )}
                </Table.Cell>
                <Table.Cell
                    id={
                        rowExpanded
                            ? 'domain-api-table-cell-expanded'
                            : 'domain-api-table-cell'
                    }
                >
                    <Status
                        data={{
                            ...data,
                            status: data.status
                        }}
                        rowExpanded={rowExpanded}
                    />
                </Table.Cell>
                <Table.Cell
                    id={
                        rowExpanded
                            ? 'domain-api-table-cell-expanded'
                            : 'domain-api-table-cell'
                    }
                >
                    {api_catalog_url && (
                        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href={api_catalog_url}
                            title='API Catalog Link'
                            className={
                                rowExpanded
                                    ? styles.journeyLinkIconExpanded
                                    : styles.journeyLinkIcon
                            }
                        >
                            <Flex alignItems='center'>
                                <IconLinkOut /> Explorer
                            </Flex>
                        </a>
                    )}
                    {!api_catalog_url && api_onboarding_url && (
                        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href={api_onboarding_url}
                            title='API Catalog Onboarding Link'
                            className={
                                rowExpanded
                                    ? styles.journeyLinkIconExpanded
                                    : styles.journeyLinkIcon
                            }
                        >
                            <Flex alignItems='center'>
                                <IconLinkOut /> Onboarding
                            </Flex>
                        </a>
                    )}
                    {!api_catalog_url && !api_onboarding_url && '--'}
                </Table.Cell>
                <Table.Cell
                    id={
                        rowExpanded
                            ? 'domain-api-table-cell-expanded'
                            : 'domain-api-table-cell'
                    }
                >
                    <HStack>
                        <DesignScoreBadge
                            score={data.operationTotalScore}
                            onClick={handleClickScore}
                        />
                        {isDeleteVisible && (
                            <IconButton
                                title='Delete'
                                variant='ghost'
                                size='md'
                                ml={'auto'}
                                onClick={() => handleClick('DELETE')}
                            >
                                <IconTrash className={styles.deleteIcon} />
                            </IconButton>
                        )}
                        {isRestoreVisible && (
                            <IconButton
                                title='Restore'
                                variant='ghost'
                                size='md'
                                ml={'auto'}
                                onClick={() => handleClick('RESTORE')}
                            >
                                <Image
                                    src='/unDelete.svg'
                                    alt='Restore'
                                    width={30}
                                    height={30}
                                />
                            </IconButton>
                        )}
                        <CopyApiUrlButton
                            operationUrl={operationUrl}
                            isTableRow={!(isDeleteVisible || isRestoreVisible)}
                            isExpanded={rowExpanded}
                        />
                    </HStack>
                </Table.Cell>
            </Table.Row>
            {rowExpanded && (
                <Table.Row>
                    <Table.Cell colSpan={colLength}>
                        <OperationalDetailsPage
                            reviewers={reviewers}
                            api_nm={api_nm}
                            setIsEditRow={setIsEditRow}
                            showEditAction={showEditAction || false}
                            reloadData={reloadData}
                            domainId={domainId}
                            api_endpoint_metadata_id={
                                api_endpoint_metadata_id || ''
                            }
                            api_metadata_id={api_metadata_id}
                            viewOnly={viewOnly}
                            canEditPartially={canEditPartially}
                            tableData={tableData}
                            allowedUsers={allowedUsers}
                            isRestoreVisible={isRestoreVisible}
                            isDeleteVisible={isDeleteVisible}
                            handleClick={handleClick}
                            isDeletedApi={isDeletedApi}
                            isDeletedApiOperation={isDeletedApiOperation}
                        />
                    </Table.Cell>
                </Table.Row>
            )}
            {openDeleteConfirmationModal && (
                <ConfirmationModal
                    isOpen={openDeleteConfirmationModal}
                    closeDialog={() => setOpenDeleteConfirmationModal(false)}
                    data={data}
                    status={status}
                    isRevert={false}
                    isApiData={false}
                    reloadData={reloadData}
                    domainId={domainId}
                    api_metadata_id={api_metadata_id}
                />
            )}
            {showModal && (
                <OperationScoreModal
                    isOpen={showModal}
                    closeDialog={() => setShowModal(false)}
                    operationName={data?.endpoint_operation || ''}
                    apiScoreData={apiScoreData || { apiScore: {} }}
                    api_catalog_url={api_catalog_url}
                />
            )}
        </>
    )
}
