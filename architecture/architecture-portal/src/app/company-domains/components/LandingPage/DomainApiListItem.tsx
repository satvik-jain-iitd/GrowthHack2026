import { HStack, IconButton, Table, Text } from '@chakra-ui/react'
import React, { memo, useEffect, useState } from 'react'
import styles from '@/app/company-domains/domain-api-page.module.css'
import Status from './Status'
import { scrollToExpandedData } from '@/app/company-domains/utils'
import { IconChevronDown, IconChevronRight } from '@americanexpress/dls-icons'
import { ApiMetadata } from '@/app/company-domains/types'
import { CopyApiUrlButton } from './CopyApiUrlButton'
import { getAbsoluteApiUrl } from '@/app/company-domains/constants'
import CodeText from '@/components/ui/CodeText'
import { IconTrash } from '@americanexpress/dls-icons'
import { ConfirmationModal } from '../Modals'
import Image from 'next/image'

interface DomainApiListItemProps {
    data: ApiMetadata
    rowExpanded: boolean
    handleExpandRowClick: (id: string) => void
    domainId: string
    reloadData?: () => void
    allowedUsers?: boolean
}
const areEqual = (
    prevProps: DomainApiListItemProps,
    nextProps: DomainApiListItemProps
) => {
    return (
        prevProps.data === nextProps.data &&
        prevProps.rowExpanded === nextProps.rowExpanded
    )
}
export const DomainApiListItem = memo(function DomainApiListItem({
    data,
    rowExpanded,
    handleExpandRowClick,
    domainId,
    reloadData,
    allowedUsers
}: DomainApiListItemProps) {
    const { api_nm, sub_company_domain_name, api_ds, api_metadata_id } = data
    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
        useState(false)
    const [status, setStatus] = useState('')

    const handleClick = (value: string) => {
        setStatus(value)
        setOpenDeleteConfirmationModal(true)
    }

    useEffect(() => {
        if (rowExpanded) {
            scrollToExpandedData(api_metadata_id, `row-${api_metadata_id}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowExpanded])

    const apiUrl = getAbsoluteApiUrl(domainId, api_metadata_id)
    const hasOperations = data?.api_endpoint?.length > 0
    const endpointStatus = data?.api_endpoint?.map(item => {
        if (item?.delete) {
            return true
        } else {
            return false
        }
    })
    const isDeletedApi = data?.add_da?.status?.toLowerCase() === 'deleted'
    const isDeleteVisible =
        (!hasOperations || !endpointStatus?.includes(false)) &&
        allowedUsers &&
        !isDeletedApi
    const isRestoreVisible = allowedUsers && isDeletedApi

    return (
        <>
            <Table.Cell
                id={
                    rowExpanded
                        ? 'domain-api-table-cell-expanded'
                        : 'domain-api-table-cell'
                }
                onClick={() => handleExpandRowClick(api_metadata_id)}
                textAlign={'center'}
                lineHeight={'40px'}
            >
                {rowExpanded ? <IconChevronDown /> : <IconChevronRight />}
            </Table.Cell>
            <Table.Cell
                id={
                    rowExpanded
                        ? 'domain-api-table-cell-expanded'
                        : 'domain-api-table-cell'
                }
            >
                <Text fontWeight={600}>{api_nm ? api_nm : '--'}</Text>
            </Table.Cell>
            <Table.Cell
                id={
                    rowExpanded
                        ? 'domain-api-table-cell-expanded'
                        : 'domain-api-table-cell'
                }
            >
                {typeof data === 'object' && data?.api_resource ? (
                    <CodeText
                        text={data.api_resource}
                        isExpanded={rowExpanded}
                    />
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
                {sub_company_domain_name ? sub_company_domain_name : '--'}
            </Table.Cell>
            <Table.Cell
                id={
                    rowExpanded
                        ? 'domain-api-table-cell-expanded'
                        : 'domain-api-table-cell'
                }
                align='center'
            >
                <Text className={styles.apiDescriptionText}>
                    {api_ds || '--'}
                </Text>
            </Table.Cell>
            <Table.Cell
                id={
                    rowExpanded
                        ? 'domain-api-table-cell-expanded'
                        : 'domain-api-table-cell'
                }
            >
                <HStack alignItems='center' gap={2}>
                    <Status rowExpanded={rowExpanded} data={data} />
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
                        apiUrl={apiUrl}
                        isTableRow={!(isDeleteVisible || isRestoreVisible)}
                    />
                </HStack>
            </Table.Cell>
            {openDeleteConfirmationModal && (
                <ConfirmationModal
                    isOpen={openDeleteConfirmationModal}
                    closeDialog={() => setOpenDeleteConfirmationModal(false)}
                    data={data}
                    status={status}
                    isApiData={true}
                    isRevert={false}
                    reloadData={reloadData}
                    domainId={domainId}
                />
            )}
        </>
    )
}, areEqual)
