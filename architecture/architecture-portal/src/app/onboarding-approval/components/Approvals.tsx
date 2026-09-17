/* istanbul ignore file */
'use client'
import React, { useState } from 'react'
import {
    Link,
    Box,
    Breadcrumb,
    Card,
    Code,
    Flex,
    Table,
    Tag,
    Text,
    Pagination,
    IconButton,
    Button,
    ButtonGroup,
    HStack
} from '@chakra-ui/react'
import { LoadingSpinner, NoPrefetchLink as NextLink } from '@/components/ui'
import {
    ErrorDialog,
    RejectDialog,
    SuccessDialog
} from '@/app/onboarding-approval/components'
import { RejectFormValues } from '@/app/onboarding-approval/types'
import { getPage, getBadgeColor } from '@/app/onboarding-approval/utils'
import { usePlaybook, usePlaybooks, useUpdatePlaybook } from '@/hooks'
import {
    IconChevronLeft,
    IconChevronRight,
    IconMoreHorizontal
} from '@americanexpress/dls-icons'
import dayjs from 'dayjs'
import {
    DEFAULT_DOCUMENT_WIDTH,
    SOURCE_HOST_CONFIG,
    GITHUB_ENTERPRISE_URL,
    isSourceHost
} from '@/constants'
import { Playbook } from '@/types/Playbook'

const PAGE_SIZE = 10

export function Approval({ id }: { id: string }) {
    const mutation = useUpdatePlaybook()
    const { data: playbook } = usePlaybook(id)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [rejectOnboarding, setRejectOnboarding] = useState(false)
    const [processingRequest, setProcessingRequest] = useState(false)

    const onApprove = () => {
        mutation.mutateAsync({ playbook_id: id, req_aprv_sta_nm: 'APPROVED' })
        setSuccessMessage(
            'This playbook is being processed for approval and the customer will be notified. You may now close this window.'
        )
    }

    const onReject = (values: RejectFormValues) => {
        setRejectOnboarding(false)
        setProcessingRequest(true)
        mutation
            .mutateAsync({
                playbook_id: id,
                req_aprv_sta_nm: 'REJECTED',
                playbook_comments: values.comments
            })
            .then(() => {
                setProcessingRequest(false)
                setSuccessMessage(
                    'This playbook has been put on hold and the customer has been notified of your comments. You may now close this window.'
                )
            })
            .catch(error => {
                setProcessingRequest(false)
                console.error(error)
                setErrorMessage(
                    'Failed to put onboarding request on hold - see the console for more details.'
                )
            })
    }

    const getPlaybookHost = (playbook: Playbook) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sourceHost = (playbook.add_da as any)?.source_host
        if (isSourceHost(sourceHost)) {
            return SOURCE_HOST_CONFIG[sourceHost].url
        }
        return GITHUB_ENTERPRISE_URL
    }

    return (
        <Box display='flex' justifyContent='center' width='100%' p={4}>
            <Box
                flexBasis={{
                    base: '100%',
                    md: '80%'
                }}
                width={{
                    base: '100%',
                    md: '80%'
                }}
                maxW={DEFAULT_DOCUMENT_WIDTH}
            >
                <Breadcrumb.Root>
                    <Breadcrumb.List flexWrap='wrap' overflow='hidden'>
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Breadcrumb.Link
                            as={NextLink}
                            href='/onboarding-approval'
                            _focus={{
                                outline: 'none',
                                boxShadow: 'none'
                            }}
                        >
                            Onboarding Approval
                        </Breadcrumb.Link>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            {playbook!.playbook_nm}
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
                <HStack>
                    <Text textStyle='2xl' mt={4} mb={4}>
                        {playbook!.playbook_nm}
                    </Text>
                    <Tag.Root
                        colorPalette={getBadgeColor(playbook!.req_aprv_sta_nm)}
                    >
                        <Tag.Label>{playbook!.req_aprv_sta_nm}</Tag.Label>
                    </Tag.Root>
                </HStack>
                {playbook!.req_aprv_sta_nm !== 'APPROVED' && (
                    <Text textStyle='sm' color='fg.muted' mb={4}>
                        Please review the playbook record,{' '}
                        {/* eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link */}
                        <Link
                            href={`${getPlaybookHost(playbook!)}/amex-eng/${playbook!.repst_nm}`}
                            target='_blank'
                            _hover={{ textDecoration: 'underline' }}
                            _focus={{
                                outline: 'none',
                                boxShadow: 'none'
                            }}
                        >
                            repository
                        </Link>
                        , documentation folder, etc. prior to approving.
                    </Text>
                )}
                <Table.Root variant='outline' mb={6}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Property</Table.ColumnHeader>
                            <Table.ColumnHeader>Value</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.entries(playbook!).map(([key, value]) => (
                            <Table.Row key={key}>
                                <Table.Cell color='fg.muted'>{key}</Table.Cell>
                                <Table.Cell
                                    overflowWrap='break-word'
                                    wordWrap='break-word'
                                    wordBreak='break-all'
                                >
                                    {typeof value === 'object' ||
                                    typeof value === 'boolean' ? (
                                        <Code>{JSON.stringify(value)}</Code>
                                    ) : (
                                        value
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
                {playbook!.req_aprv_sta_nm !== 'APPROVED' && (
                    <Box mb={6} display='flex' justifyContent='right'>
                        <Button
                            mr={2}
                            size='lg'
                            variant='solid'
                            colorPalette='blue'
                            onClick={onApprove}
                            disabled={
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (playbook!.add_da as any).workflowData
                                    ?.currentTask.step ===
                                'WaitForBvBCriteriaMet'
                            }
                        >
                            Approve
                        </Button>
                        <Button
                            size='lg'
                            variant='outline'
                            colorPalette='blue'
                            onClick={() => setRejectOnboarding(true)}
                            disabled={
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (playbook!.add_da as any).workflowData
                                    ?.currentTask.step ===
                                'WaitForBvBCriteriaMet'
                            }
                        >
                            Reject
                        </Button>
                    </Box>
                )}
                {successMessage && (
                    <SuccessDialog
                        message={successMessage}
                        onClose={() => setSuccessMessage('')}
                    />
                )}
                {rejectOnboarding && (
                    <RejectDialog
                        onSubmit={onReject}
                        onClose={() => setRejectOnboarding(false)}
                    />
                )}
                {processingRequest && <LoadingSpinner />}
                {errorMessage && (
                    <ErrorDialog
                        error={errorMessage}
                        onClose={() => setErrorMessage('')}
                    />
                )}
            </Box>
        </Box>
    )
}

export function Approvals() {
    const { playbooks } = usePlaybooks()
    const [pageNumber, setPageNumber] = useState(1)
    const filteredPlaybooks = (playbooks ?? [])
        .filter(x => x.req_aprv_sta_nm !== 'APPROVED')
        .sort(
            (a, b) =>
                new Date(b.creat_ts).getTime() - new Date(a.creat_ts).getTime()
        )
    const playbooksPage = getPage(filteredPlaybooks, pageNumber, PAGE_SIZE)

    return (
        <Box display='flex' justifyContent='center' width='100%' p={4}>
            <Box
                flexBasis={{
                    base: '100%',
                    md: '80%'
                }}
                width={{
                    base: '100%',
                    md: '80%'
                }}
                maxW={DEFAULT_DOCUMENT_WIDTH}
            >
                <Text textStyle='2xl' mt={2}>
                    Onboarding Approval
                </Text>
                {playbooksPage.map(x => (
                    <NextLink
                        key={x.playbook_id}
                        href={`/onboarding-approval/${x.playbook_id}`}
                    >
                        <Card.Root
                            mt={4}
                            backgroundColor={{
                                base: 'white',
                                _dark: '#27272a'
                            }}
                            borderRadius='10px'
                            boxShadow='md'
                            cursor='pointer'
                            transition='transform 0.3s, box-shadow 0.3s'
                            _hover={{
                                transform: 'translateY(-4px)',
                                boxShadow: 'xl'
                            }}
                        >
                            <Card.Body p={3}>
                                <Flex justifyContent='space-between'>
                                    <Text textStyle='md' color='fg.muted'>
                                        {x.playbook_type_nm} - {x.playbook_nm}
                                    </Text>
                                    <Flex>
                                        <Text textStyle='sm' color='fg.subtle'>
                                            {dayjs(x.creat_ts).format(
                                                'MM/DD/YYYY'
                                            )}
                                        </Text>
                                        <Tag.Root
                                            ml={6}
                                            colorPalette={getBadgeColor(
                                                x.req_aprv_sta_nm
                                            )}
                                        >
                                            <Tag.Label>
                                                {x.req_aprv_sta_nm}
                                            </Tag.Label>
                                        </Tag.Root>
                                    </Flex>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </NextLink>
                ))}
                <Box
                    my={6}
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Text textStyle='sm'>
                        Showing {playbooksPage.length} of{' '}
                        {filteredPlaybooks.length} Results
                    </Text>
                    {filteredPlaybooks.length > PAGE_SIZE && (
                        <Pagination.Root
                            count={filteredPlaybooks.length}
                            pageSize={PAGE_SIZE}
                            page={pageNumber}
                            onPageChange={e => setPageNumber(e.page)}
                        >
                            <ButtonGroup>
                                <Pagination.PrevTrigger asChild>
                                    <IconButton
                                        colorPalette='blue'
                                        variant='ghost'
                                    >
                                        <IconChevronLeft />
                                    </IconButton>
                                </Pagination.PrevTrigger>
                                <Pagination.Items
                                    ellipsis={
                                        <IconButton
                                            colorPalette='blue'
                                            variant='ghost'
                                        >
                                            <IconMoreHorizontal />
                                        </IconButton>
                                    }
                                    render={page => (
                                        <IconButton
                                            colorPalette='blue'
                                            variant={{
                                                base: 'ghost',
                                                _selected: 'outline'
                                            }}
                                        >
                                            {page.value}
                                        </IconButton>
                                    )}
                                />
                                <Pagination.NextTrigger asChild>
                                    <IconButton
                                        colorPalette='blue'
                                        variant='ghost'
                                    >
                                        <IconChevronRight />
                                    </IconButton>
                                </Pagination.NextTrigger>
                            </ButtonGroup>
                        </Pagination.Root>
                    )}
                </Box>
            </Box>
        </Box>
    )
}
