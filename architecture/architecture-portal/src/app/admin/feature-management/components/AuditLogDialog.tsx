'use client'
import {
    CloseButton,
    Dialog,
    Heading,
    Separator,
    Spinner,
    Table,
    Text
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { AuditLogEntry } from '@/types/AuditLog'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'

type AuditLogDialogProps = {
    isOpen: boolean
    onClose: () => void
    entries: AuditLogEntry[]
    isLoading: boolean
    title: string
}

export const AuditLogDialog = ({
    isOpen,
    onClose,
    entries,
    isLoading,
    title
}: AuditLogDialogProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={() => onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    maxW='800px'
                    width='92vw'
                    data-testid={FEATURE_MANAGEMENT_TEST_IDS.auditLogDialog}
                >
                    <Dialog.Header px={6}>
                        <Dialog.Title asChild>
                            <Heading size='lg' fontWeight='700'>
                                {title}
                            </Heading>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body px={6} overflowY='auto' maxH='60vh'>
                        {isLoading ? (
                            <Spinner
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.auditLogLoading
                                }
                            />
                        ) : entries.length === 0 ? (
                            <Text
                                data-testid={
                                    FEATURE_MANAGEMENT_TEST_IDS.auditLogEmpty
                                }
                            >
                                No audit history available.
                            </Text>
                        ) : (
                            <Table.Root variant='outline'>
                                <Table.Header backgroundColor='bg.info'>
                                    <Table.Row>
                                        <Table.ColumnHeader>
                                            Action
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Details
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Changed By
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Changed At
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {entries.map((entry, idx) => (
                                        <Table.Row
                                            key={`${entry.changedAt}-${entry.action}-${idx}`}
                                        >
                                            <Table.Cell>
                                                {entry.action}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {entry.details}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {entry.changedBy}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {dayjs(entry.changedAt).format(
                                                    'MMM D, YYYY h:mm A'
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        )}
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size='sm' />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
