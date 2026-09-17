/* istanbul ignore file */

import {
    Box,
    HStack,
    Input,
    Button,
    useDisclosure,
    Spinner,
    Text,
    VStack,
    Table,
    Dialog,
    Link
} from '@chakra-ui/react'
import { useState, useMemo, useRef } from 'react'
import { SelectField } from '@/app/initiatives/components/consumer-api/SelectField'
import Status, {
    ApiType
} from '@/app/company-domains/components/LandingPage/Status'
import {
    getUrlByDomainId,
    getAbsoluteApiUrl,
    getAbsoluteOperationUrl,
    getExplorerUrl
} from '@/app/company-domains/constants/domainApiMap'
import {
    usePutInitiativesConsumerApi,
    useDeleteInitiativesConsumerApi
} from '@/app/initiatives/hooks'
import { ConsumerApiInitiative } from '@/app/initiatives/types'
import { toast } from 'react-toastify'
import { Domain } from '@/app/company-domains/types'
import { B2B_GATEWAY_DOMAIN } from '@/app/company-domains/constants'
import { IconLinkOut } from '@americanexpress/dls-icons'
import { useUserContext } from '@/context/UserContext'

interface ConsumerApiTableProps {
    data: ConsumerApiInitiative[] | undefined
    isLoading: boolean
    refetch: () => void
    domains: Domain[] | undefined
    playbookId: string | undefined
    isUserAuthorizedToEdit: boolean
}

const ID_SEPARATOR = '___'

export function ConsumerApiTable({
    data,
    isLoading,
    refetch,
    domains,
    playbookId,
    isUserAuthorizedToEdit
}: ConsumerApiTableProps) {
    const userContext = useUserContext()
    const [searchQuery, setSearchQuery] = useState('')
    const [editingRowId, setEditingRowId] = useState<string | null>(null)
    const [editingConsumerDomain, setEditingConsumerDomain] =
        useState<string>('')
    const [deletingRowId, setDeletingRowId] = useState<string | null>(null)
    const { open: isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const putMutation = usePutInitiativesConsumerApi(playbookId || '')
    const deleteMutation = useDeleteInitiativesConsumerApi(playbookId || '')

    const [editingOpId, editingConsumerDomainId] = useMemo(() => {
        if (!editingRowId) return [null, '']
        const parts = editingRowId.split(ID_SEPARATOR)
        return [parts[0], parts[1] || '']
    }, [editingRowId])

    const [deletingOpId, deletingConsumerDomainId] = useMemo(() => {
        if (!deletingRowId) return [null, '']
        const parts = deletingRowId.split(ID_SEPARATOR)
        return [parts[0], parts[1] || '']
    }, [deletingRowId])

    const domainsOptions = useMemo(
        () =>
            domains
                ?.map(domain => ({
                    label: domain.domain_nm,
                    value: domain.company_domain_id
                }))
                ?.concat({
                    label: B2B_GATEWAY_DOMAIN.NAME,
                    value: B2B_GATEWAY_DOMAIN.ID
                }) || [],
        [domains]
    )

    // Filter data based on search query, then sort:
    // Primary: status order (Production Certified → … → Not Registered), interleaving A before B per status level
    // Last: all Type C rows regardless of status
    const filteredData = useMemo(() => {
        const STATUS_ORDER = [
            'PRODUCTION CERTIFIED',
            'DESIGN CERTIFIED',
            'API CATALOG',
            'EARB APPROVED',
            'ARB APPROVED',
            'PROPOSED',
            'DRAFT',
            'NOT REGISTERED'
        ]

        const getTypeRank = (type: string | undefined) => {
            const t = (type || '').toLowerCase()
            if (t.includes('type c') || t === 'c') return 2
            if (t.includes('type a') || t === 'a') return 0
            if (t.includes('type b') || t === 'b') return 1
            return 3
        }

        const sortRows = (rows: ConsumerApiInitiative[]) =>
            [...rows].sort((a, b) => {
                const aTypeRank = getTypeRank(a.operation_type)
                const bTypeRank = getTypeRank(b.operation_type)

                // Type C always last
                if (aTypeRank === 2 && bTypeRank !== 2) return 1
                if (bTypeRank === 2 && aTypeRank !== 2) return -1

                // Primary: status order
                const aStatusRank = STATUS_ORDER.indexOf(
                    (a.status || '').toUpperCase()
                )
                const bStatusRank = STATUS_ORDER.indexOf(
                    (b.status || '').toUpperCase()
                )
                const aEffective =
                    aStatusRank === -1 ? STATUS_ORDER.length : aStatusRank
                const bEffective =
                    bStatusRank === -1 ? STATUS_ORDER.length : bStatusRank

                if (aEffective !== bEffective) return aEffective - bEffective

                // Secondary: Type A before Type B within the same status
                return aTypeRank - bTypeRank
            })

        if (!data) return []

        const rows = searchQuery.trim()
            ? data.filter(item =>
                  Object.values(item).some(value =>
                      String(value || '')
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                  )
              )
            : data

        return sortRows(rows)
    }, [data, searchQuery])

    const handleEditClick = (row: ConsumerApiInitiative) => {
        const opId = row.operation_id || row.explorer_id || null
        const consumerDomainId = row.init_consumer_domain_id?.[0] || ''
        const editingId = opId + ID_SEPARATOR + consumerDomainId
        setEditingRowId(editingId)
        setEditingConsumerDomain(row.init_consumer_domain_id?.[0] || '')
    }

    const handleSaveEdit = async () => {
        if (!playbookId) return

        const row = data?.find(
            r =>
                (r.operation_id === editingOpId ||
                    r.explorer_id === editingOpId) &&
                editingConsumerDomainId === r.init_consumer_domain_id?.[0]
        )
        if (!row) return

        putMutation.mutate(
            {
                consumerDomainId: [editingConsumerDomain],
                existingConsumerDomainId: row.init_consumer_domain_id || [],
                operationId: row.operation_id ?? undefined,
                explorerApiId: row.explorer_id ?? undefined,
                email: userContext?.attributes?.email ?? ''
            },
            {
                onSuccess: data => {
                    const noChanges = data?.noChangesDetected
                    if (noChanges) {
                        toast.info(
                            'No changes detected. Consumer API is up to date.'
                        )
                        setEditingRowId(null)
                        return
                    }
                    toast.success('Consumer API updated successfully!')
                    setEditingRowId(null)
                    setEditingConsumerDomain('')
                    refetch()
                },
                onError: error => {
                    toast.error(
                        'Failed to update Consumer API.' +
                            (error instanceof Error
                                ? error.message
                                : 'Please try again.')
                    )
                }
            }
        )
    }

    const handleDeleteClick = (row: ConsumerApiInitiative) => {
        const opId = row.operation_id || row.explorer_id || null
        const consumerDomainId = row.init_consumer_domain_id?.[0] || ''
        const deletingId = opId + ID_SEPARATOR + consumerDomainId
        setDeletingRowId(deletingId)
        onOpen()
    }

    const handleConfirmDelete = async () => {
        if (!playbookId || !deletingRowId) return

        const row = data?.find(
            r =>
                (r.operation_id === deletingOpId ||
                    r.explorer_id === deletingOpId) &&
                deletingConsumerDomainId === r.init_consumer_domain_id?.[0]
        )
        if (!row) return

        deleteMutation.mutate(
            {
                consumerDomainId: [row.init_consumer_domain_id?.[0] || ''],
                operationId: row.operation_id ?? undefined,
                explorerApiId: row.explorer_id ?? undefined,
                email: userContext?.attributes?.email ?? ''
            },
            {
                onSuccess: () => {
                    toast.success('Consumer API deleted successfully!')
                    setDeletingRowId(null)
                    setEditingConsumerDomain('')
                    onClose()
                    refetch()
                },
                onError: () => {
                    toast.error(
                        'Failed to delete Consumer API. Please try again.'
                    )
                }
            }
        )
    }

    if (isLoading) {
        return (
            <VStack w='100%' py={10}>
                <Spinner size='lg' />
                <Text>Loading consumer APIs...</Text>
            </VStack>
        )
    }

    return (
        <Box w='100%' mt={8}>
            {/* Search Bar */}

            <HStack mb={6} justify='flex-end' w='100%'>
                <Input
                    placeholder='Search consumer APIs...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    maxW='300px'
                    size='md'
                    borderColor='#CBD5E0'
                />
            </HStack>

            {/* Table */}
            {filteredData.length === 0 ? (
                <VStack w='100%' py={10}>
                    <Text color='#53565A'>No consumer APIs found</Text>
                </VStack>
            ) : (
                <Box overflowX='auto'>
                    <Table.Root size='sm'>
                        <Table.Header>
                            <Table.Row bg={'#EDF2F7'} _dark={{ bg: '#2D3748' }}>
                                <Table.ColumnHeader fontWeight='600' p={4}>
                                    Provider Company Domain
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight='600'>
                                    API Name
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight='600'>
                                    Operation
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight='600'>
                                    Type
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight='600'>
                                    Status
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight='600'>
                                    Consumer Company Domain
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight='600'>
                                    Catalog Link / API
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight='600'>
                                    Actions
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filteredData.map(row => {
                                const isEditing =
                                    ((row.operation_id &&
                                        editingOpId === row.operation_id) ||
                                        (row.explorer_id &&
                                            editingOpId === row.explorer_id)) &&
                                    editingConsumerDomainId ===
                                        row.init_consumer_domain_id?.[0]
                                const consumerDomainName =
                                    row.init_consumer_domain_id?.[0] ===
                                    B2B_GATEWAY_DOMAIN.ID
                                        ? B2B_GATEWAY_DOMAIN.NAME
                                        : domains?.find(
                                              d =>
                                                  d.company_domain_id ===
                                                  row
                                                      .init_consumer_domain_id?.[0]
                                          )?.domain_nm

                                return (
                                    <Table.Row
                                        key={`${row.operation_id || `${row.explorer_id}`}-${row.init_consumer_domain_id?.join('-') || 'no-consumer-domain'}`}
                                        _hover={{ bg: '#F7FAFC' }}
                                        _dark={{ _hover: { bg: '#2D3748' } }}
                                    >
                                        {/* Company Domain - Link */}
                                        <Table.Cell>
                                            {row.company_domain_name ||
                                            row.application_company_domain_name ? (
                                                <>
                                                    {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                                    <Link
                                                        href={getUrlByDomainId(
                                                            row.company_domain_id ||
                                                                row.application_company_domain_id ||
                                                                ''
                                                        )}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        style={{
                                                            color: '#0066BE',
                                                            textDecoration:
                                                                'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onMouseEnter={e =>
                                                            (e.currentTarget.style.textDecoration =
                                                                'underline')
                                                        }
                                                        onMouseLeave={e =>
                                                            (e.currentTarget.style.textDecoration =
                                                                'none')
                                                        }
                                                    >
                                                        {row.company_domain_name ||
                                                            row.application_company_domain_name}
                                                    </Link>
                                                </>
                                            ) : (
                                                '--'
                                            )}
                                        </Table.Cell>

                                        {/* API Name - Link */}
                                        <Table.Cell>
                                            {row.api_name ? (
                                                <>
                                                    {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                                    <Link
                                                        href={getAbsoluteApiUrl(
                                                            row.company_domain_id,
                                                            row.api_id
                                                        )}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        style={{
                                                            color: '#0066BE',
                                                            textDecoration:
                                                                'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onMouseEnter={e =>
                                                            (e.currentTarget.style.textDecoration =
                                                                'underline')
                                                        }
                                                        onMouseLeave={e =>
                                                            (e.currentTarget.style.textDecoration =
                                                                'none')
                                                        }
                                                    >
                                                        {row.api_name}
                                                    </Link>
                                                </>
                                            ) : (
                                                '--'
                                            )}
                                        </Table.Cell>

                                        {/* Operation - Link */}
                                        <Table.Cell>
                                            {row.operation_name ? (
                                                <>
                                                    {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                                                    <Link
                                                        href={getAbsoluteOperationUrl(
                                                            row.company_domain_id,
                                                            row.operation_id
                                                        )}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        style={{
                                                            color: '#0066BE',
                                                            textDecoration:
                                                                'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onMouseEnter={e =>
                                                            (e.currentTarget.style.textDecoration =
                                                                'underline')
                                                        }
                                                        onMouseLeave={e =>
                                                            (e.currentTarget.style.textDecoration =
                                                                'none')
                                                        }
                                                    >
                                                        {row.operation_name}
                                                    </Link>
                                                </>
                                            ) : (
                                                '--'
                                            )}
                                        </Table.Cell>

                                        {/* Type - Badge */}
                                        <Table.Cell>
                                            <ApiType
                                                data={{
                                                    endpoint_type: '',
                                                    api_endpoint_type_nm:
                                                        row.operation_type
                                                }}
                                            />
                                        </Table.Cell>

                                        {/* Status - Badge */}
                                        <Table.Cell>
                                            <Status
                                                data={{
                                                    status: row.status
                                                }}
                                                rowExpanded={false}
                                            />
                                        </Table.Cell>

                                        {/* Consumer Company Domain */}
                                        <Table.Cell>
                                            {isEditing ? (
                                                <SelectField
                                                    id={`consumer-domain-${row.operation_id}`}
                                                    name={`consumer-domain-${row.operation_id}`}
                                                    label=''
                                                    placeholder='Select domain'
                                                    value={
                                                        editingConsumerDomain
                                                    }
                                                    options={
                                                        domainsOptions || []
                                                    }
                                                    onChange={
                                                        setEditingConsumerDomain
                                                    }
                                                />
                                            ) : (
                                                <Text>
                                                    {consumerDomainName ||
                                                        'N/A'}
                                                </Text>
                                            )}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {row.explorer_id ? (
                                                // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                                                <Link
                                                    href={getExplorerUrl(
                                                        row.explorer_id
                                                    )}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    style={{
                                                        color: '#0066BE',
                                                        textDecoration: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={e =>
                                                        (e.currentTarget.style.textDecoration =
                                                            'underline')
                                                    }
                                                    onMouseLeave={e =>
                                                        (e.currentTarget.style.textDecoration =
                                                            'none')
                                                    }
                                                >
                                                    {row.explorer_id}
                                                </Link>
                                            ) : row.catalog_url ? (
                                                // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
                                                <Link
                                                    href={row.catalog_url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    style={{
                                                        color: '#0066BE',
                                                        textDecoration: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={e =>
                                                        (e.currentTarget.style.textDecoration =
                                                            'underline')
                                                    }
                                                    onMouseLeave={e =>
                                                        (e.currentTarget.style.textDecoration =
                                                            'none')
                                                    }
                                                >
                                                    <IconLinkOut /> Catalog
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </Table.Cell>

                                        {/* Actions */}
                                        <Table.Cell>
                                            {isUserAuthorizedToEdit ? (
                                                <HStack gap={2}>
                                                    {isEditing ? (
                                                        <>
                                                            <Button
                                                                size='sm'
                                                                bg='#0066BE'
                                                                color='white'
                                                                onClick={
                                                                    handleSaveEdit
                                                                }
                                                                loading={
                                                                    putMutation.isPending
                                                                }
                                                                _hover={{
                                                                    bg: '#0052A3'
                                                                }}
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                onClick={() =>
                                                                    setEditingRowId(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        row
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                color='red.500'
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        row
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </HStack>
                                            ) : (
                                                '--'
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}

            {/* Delete Confirmation Modal */}
            <Dialog.Root
                open={isOpen}
                onOpenChange={e => {
                    if (!e.open) onClose()
                }}
                placement='center'
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header fontSize='lg' fontWeight='bold'>
                            Delete Consumer API
                        </Dialog.Header>
                        <Dialog.Body>
                            Are you sure you want to delete this consumer API?
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                variant='outline'
                                ref={cancelRef}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                bg='red.500'
                                _hover={{ bg: 'red.600' }}
                                onClick={handleConfirmDelete}
                                ml={3}
                                loading={deleteMutation.isPending}
                            >
                                Delete
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Box>
    )
}
