'use client'
import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Flex,
    Spinner,
    Table,
    Text
} from '@chakra-ui/react'
import { useAuditHistory } from '../hooks/useAuditHistory'
import { EntityType } from '../types/metamodel'
import dayjs from 'dayjs'
import { AvatarTableRow } from '@/components/ui'

interface MetamodelAuditHistoryModalProps {
    isOpen: boolean
    onClose: () => void
    entityType: EntityType
    entityId: string
}

export default function MetamodelAuditHistoryModal({
    isOpen,
    onClose,
    entityType,
    entityId
}: MetamodelAuditHistoryModalProps) {
    const [page, setPage] = useState(1)
    const rowsPerPage = 15

    const { data: auditData, isLoading } = useAuditHistory(
        entityType,
        entityId,
        undefined,
        undefined,
        isOpen
    )

    const events = auditData?.data ?? []

    const totalItems = events.length
    const startIndex = (page - 1) * rowsPerPage
    const paginatedData = events.slice(startIndex, startIndex + rowsPerPage)

    useEffect(() => {
        if (isOpen) {
            setPage(1)
        }
    }, [isOpen])

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={e => {
                if (!e.open) onClose()
            }}
            placement='center'
            size='xl'
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW='900px' w='90vw' borderRadius='12px' p={6}>
                    <Dialog.Header p={0} mb={4}>
                        <Flex
                            justifyContent='space-between'
                            alignItems='center'
                            w='100%'
                        >
                            <Text fontSize='xl' fontWeight='bold'>
                                Audit History
                            </Text>
                            <CloseButton onClick={onClose} />
                        </Flex>
                    </Dialog.Header>

                    <Dialog.Body p={0}>
                        {isLoading ? (
                            <Flex
                                justifyContent='center'
                                alignItems='center'
                                minH='200px'
                            >
                                <Spinner />
                            </Flex>
                        ) : (
                            <>
                                <Box
                                    overflowX='auto'
                                    border='1px solid #E2E8F0'
                                    borderRadius='8px'
                                >
                                    <Table.Root size='sm'>
                                        <Table.Header>
                                            <Table.Row bg='blue.50'>
                                                <Table.ColumnHeader
                                                    py={3}
                                                    fontWeight='600'
                                                    color='gray.700'
                                                >
                                                    Reviewer
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader
                                                    py={3}
                                                    fontWeight='600'
                                                    color='gray.700'
                                                >
                                                    Action
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader
                                                    py={3}
                                                    fontWeight='600'
                                                    color='gray.700'
                                                >
                                                    Action Date
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {paginatedData.length === 0 ? (
                                                <Table.Row>
                                                    <Table.Cell colSpan={4}>
                                                        <Text
                                                            py={4}
                                                            textAlign='center'
                                                        >
                                                            No audit history
                                                            found.
                                                        </Text>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ) : (
                                                paginatedData.map(entry => {
                                                    const actionLabel =
                                                        entry.changeType ===
                                                        'CREATE_ATTESTATION'
                                                            ? 'Attested'
                                                            : 'Updated'
                                                    const actionColor =
                                                        actionLabel ===
                                                        'Attested'
                                                            ? 'green'
                                                            : 'blue'

                                                    return (
                                                        <Table.Row
                                                            key={entry.eventId}
                                                        >
                                                            <Table.Cell py={3}>
                                                                <Flex
                                                                    alignItems='center'
                                                                    gap={2}
                                                                >
                                                                    <AvatarTableRow
                                                                        email={
                                                                            entry
                                                                                .changedBy
                                                                                .email ??
                                                                            ''
                                                                        }
                                                                    />
                                                                </Flex>
                                                            </Table.Cell>
                                                            <Table.Cell py={3}>
                                                                <Text
                                                                    fontSize='xs'
                                                                    fontWeight='500'
                                                                    px={3}
                                                                    py={1}
                                                                    borderRadius='full'
                                                                    display='inline-block'
                                                                    border='1px solid'
                                                                    borderColor={`${actionColor}.500`}
                                                                    color={`${actionColor}.600`}
                                                                >
                                                                    {
                                                                        actionLabel
                                                                    }
                                                                </Text>
                                                            </Table.Cell>
                                                            <Table.Cell py={3}>
                                                                <Text fontSize='sm'>
                                                                    {entry.changedAt
                                                                        ? dayjs(
                                                                              entry.changedAt
                                                                          ).format(
                                                                              'MM/DD/YYYY'
                                                                          )
                                                                        : '-'}
                                                                </Text>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    )
                                                })
                                            )}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>

                                {totalItems > 0 && (
                                    <Flex
                                        justifyContent='flex-end'
                                        alignItems='center'
                                        mt={3}
                                        gap={2}
                                    >
                                        <Text fontSize='sm' color='gray.600'>
                                            {startIndex + 1}-
                                            {Math.min(
                                                startIndex + rowsPerPage,
                                                totalItems
                                            )}{' '}
                                            of {totalItems}
                                        </Text>
                                        <Flex gap={1}>
                                            <Button
                                                size='xs'
                                                variant='ghost'
                                                disabled={page <= 1}
                                                onClick={() =>
                                                    setPage(p => p - 1)
                                                }
                                            >
                                                {'<'}
                                            </Button>
                                            <Button
                                                size='xs'
                                                variant='ghost'
                                                disabled={
                                                    startIndex + rowsPerPage >=
                                                    totalItems
                                                }
                                                onClick={() =>
                                                    setPage(p => p + 1)
                                                }
                                            >
                                                {'>'}
                                            </Button>
                                        </Flex>
                                    </Flex>
                                )}
                            </>
                        )}
                    </Dialog.Body>

                    <Dialog.Footer p={0} mt={4}>
                        <Flex justifyContent='flex-end' w='100%'>
                            <Button
                                variant='outline'
                                onClick={onClose}
                                borderRadius='md'
                            >
                                Close
                            </Button>
                        </Flex>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
