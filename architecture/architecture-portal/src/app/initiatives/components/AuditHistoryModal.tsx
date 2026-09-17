/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Flex,
    Input,
    Table,
    Text
} from '@chakra-ui/react'
import { IconSearch } from '@americanexpress/dls-icons'

interface AuditHistoryEntry {
    reviewer: string
    previousDetails: string
    detailChange: string
    requestDate: string
    reviewDate: string
    action: 'Approved' | 'Rejected'
}

interface AuditHistoryModalProps {
    isOpen: boolean
    onClose: () => void
    data?: AuditHistoryEntry[]
}

const defaultData: AuditHistoryEntry[] = [
    {
        reviewer: 'Abdulrahman Bentley',
        previousDetails: 'Lifecycle Status: Development',
        detailChange: 'Lifecycle Status: Production',
        requestDate: '06/02/2026',
        reviewDate: '06/02/2026',
        action: 'Approved'
    },
    {
        reviewer: 'Abdulrahman Bentley',
        previousDetails: 'Company Domain: Tools & Utilities',
        detailChange: 'Company Domain: Customer Product',
        requestDate: '06/02/2026',
        reviewDate: '06/02/2026',
        action: 'Rejected'
    },
    {
        reviewer: 'Abdulrahman Bentley',
        previousDetails: 'Markets: –',
        detailChange: 'Markets: US',
        requestDate: '06/02/2026',
        reviewDate: '06/02/2026',
        action: 'Approved'
    },
    {
        reviewer: 'Abdulrahman Bentley',
        previousDetails: 'Lifecycle Status: Development',
        detailChange: 'Lifecycle Status: Production',
        requestDate: '06/02/2026',
        reviewDate: '06/02/2026',
        action: 'Approved'
    },
    {
        reviewer: 'Abdulrahman Bentley',
        previousDetails: 'Company Domain: Tools & Utilities',
        detailChange: 'Company Domain: Customer Product',
        requestDate: '06/02/2026',
        reviewDate: '06/02/2026',
        action: 'Rejected'
    },
    {
        reviewer: 'Abdulrahman Bentley',
        previousDetails: 'Markets: –',
        detailChange: 'Markets: US',
        requestDate: '06/02/2026',
        reviewDate: '06/02/2026',
        action: 'Approved'
    }
]

export default function AuditHistoryModal({
    isOpen,
    onClose,
    data = defaultData
}: AuditHistoryModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedReviewer, setSelectedReviewer] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [page, setPage] = useState(1)
    const rowsPerPage = 15

    const filteredData = data.filter(entry => {
        const matchesSearch =
            !searchQuery ||
            entry.reviewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.previousDetails
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            entry.detailChange.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesReviewer =
            !selectedReviewer || entry.reviewer === selectedReviewer
        const matchesStatus = !selectedStatus || entry.action === selectedStatus
        return matchesSearch && matchesReviewer && matchesStatus
    })

    const totalItems = filteredData.length
    const startIndex = (page - 1) * rowsPerPage
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + rowsPerPage
    )

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
                        {/* Filters */}
                        <Flex gap={4} mb={4} alignItems='center'>
                            <Box flex={1} position='relative'>
                                <Input
                                    placeholder='Search'
                                    value={searchQuery}
                                    onChange={e =>
                                        setSearchQuery(e.target.value)
                                    }
                                    size='sm'
                                    borderRadius='md'
                                    pr='2.5rem'
                                />
                                <Box
                                    position='absolute'
                                    right='10px'
                                    top='50%'
                                    transform='translateY(-50%)'
                                    color='gray.400'
                                >
                                    <IconSearch />
                                </Box>
                            </Box>
                            <Box>
                                <Text
                                    fontSize='xs'
                                    fontWeight='500'
                                    mb={1}
                                    color='gray.600'
                                >
                                    Reviewer
                                </Text>
                                <select
                                    value={selectedReviewer}
                                    onChange={e =>
                                        setSelectedReviewer(e.target.value)
                                    }
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E2E8F0',
                                        fontSize: '14px',
                                        minWidth: '160px'
                                    }}
                                >
                                    <option value=''>Select asset type</option>
                                    {[
                                        ...new Set(
                                            data.map(entry => entry.reviewer)
                                        )
                                    ].map(reviewer => (
                                        <option key={reviewer} value={reviewer}>
                                            {reviewer}
                                        </option>
                                    ))}
                                </select>
                            </Box>
                            <Box>
                                <Text
                                    fontSize='xs'
                                    fontWeight='500'
                                    mb={1}
                                    color='gray.600'
                                >
                                    Status
                                </Text>
                                <select
                                    value={selectedStatus}
                                    onChange={e =>
                                        setSelectedStatus(e.target.value)
                                    }
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E2E8F0',
                                        fontSize: '14px',
                                        minWidth: '140px'
                                    }}
                                >
                                    <option value=''>Select status</option>
                                    <option value='Approved'>Approved</option>
                                    <option value='Rejected'>Rejected</option>
                                </select>
                            </Box>
                        </Flex>

                        {/* Table */}
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
                                            Previous Details
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader
                                            py={3}
                                            fontWeight='600'
                                            color='gray.700'
                                        >
                                            Detail Change
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader
                                            py={3}
                                            fontWeight='600'
                                            color='gray.700'
                                        >
                                            Request Date
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader
                                            py={3}
                                            fontWeight='600'
                                            color='gray.700'
                                        >
                                            Review Date
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader
                                            py={3}
                                            fontWeight='600'
                                            color='gray.700'
                                        >
                                            Action
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {paginatedData.map((entry, idx) => (
                                        <Table.Row key={idx}>
                                            <Table.Cell py={3}>
                                                <Flex
                                                    alignItems='center'
                                                    gap={2}
                                                >
                                                    <Box
                                                        w='28px'
                                                        h='28px'
                                                        borderRadius='full'
                                                        bg='gray.300'
                                                        flexShrink={0}
                                                    />
                                                    <Text fontSize='sm'>
                                                        {entry.reviewer}
                                                    </Text>
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell py={3}>
                                                <Text fontSize='sm'>
                                                    {entry.previousDetails}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell py={3}>
                                                <Text fontSize='sm'>
                                                    {entry.detailChange}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell py={3}>
                                                <Text fontSize='sm'>
                                                    {entry.requestDate}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell py={3}>
                                                <Text fontSize='sm'>
                                                    {entry.reviewDate}
                                                </Text>
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
                                                    borderColor={
                                                        entry.action ===
                                                        'Approved'
                                                            ? 'green.500'
                                                            : 'red.500'
                                                    }
                                                    color={
                                                        entry.action ===
                                                        'Approved'
                                                            ? 'green.600'
                                                            : 'red.600'
                                                    }
                                                >
                                                    {entry.action}
                                                </Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>

                        {/* Pagination */}
                        <Flex
                            justifyContent='flex-end'
                            alignItems='center'
                            mt={3}
                            gap={2}
                        >
                            <Text fontSize='sm' color='gray.600'>
                                Rows per page {rowsPerPage} ▾
                            </Text>
                            <Text fontSize='sm' color='gray.600'>
                                {startIndex + 1}-
                                {Math.min(startIndex + rowsPerPage, totalItems)}{' '}
                                of {totalItems}
                            </Text>
                            <Flex gap={1}>
                                <Button
                                    size='xs'
                                    variant='ghost'
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    {'<'}
                                </Button>
                                <Button
                                    size='xs'
                                    variant='ghost'
                                    disabled={
                                        startIndex + rowsPerPage >= totalItems
                                    }
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    {'>'}
                                </Button>
                            </Flex>
                        </Flex>
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
