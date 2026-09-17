/* istanbul ignore file */
'use client'
import { useEffect, useMemo, useRef } from 'react'
import {
    Accordion,
    Box,
    Table,
    Text,
    useAccordionItemContext
} from '@chakra-ui/react'
import { useSidebarOpen } from '@/context'
import { Api } from '@/app/business-architecture/types/api'
import { useDomainApiWithEndpointDetails } from '@/app/company-domains/hooks'
import { NoPrefetchLink as Link } from '@/components/ui'

interface Props {
    company_domain_id: string
    playbook_id: string
    title: string
    description: string
    apis: Api[]
    loading: boolean
    apiColumnWidth?: number
    onApiColumnWidthChange?: (width: number) => void
}

const DomainAccordionItemTrigger = ({
    playbook_id,
    dedupedApis,
    title,
    description,
    loading,
    apiColumnWidth,
    onApiColumnWidthChange
}: {
    playbook_id: string
    dedupedApis: Api[]
    title: string
    description: string
    loading: boolean
    apiColumnWidth?: number
    onApiColumnWidthChange?: (width: number) => void
}) => {
    const item = useAccordionItemContext()
    const { sidebarOpen, toggleSidebar } = useSidebarOpen()
    const triggerRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (!onApiColumnWidthChange || !triggerRef.current) return

        const element = triggerRef.current
        const updateWidth = () => {
            onApiColumnWidthChange(element.getBoundingClientRect().width)
        }

        updateWidth()

        const observer = new ResizeObserver(updateWidth)
        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [onApiColumnWidthChange, dedupedApis.length])

    return (
        <Box
            width='100%'
            display='grid'
            gridTemplateColumns={`1fr 3fr 1fr ${apiColumnWidth ? `${apiColumnWidth}px` : 'auto'}`}
            alignItems='center'
            px={3}
            py={3}
            backgroundColor='transparent'
        >
            <Link
                href={
                    playbook_id && playbook_id.length > 0
                        ? `/docs/${playbook_id}`
                        : `/company-domains`
                }
                onClick={e => {
                    e.stopPropagation()
                    if (sidebarOpen) toggleSidebar()
                }}
            >
                <Text
                    color={item.expanded ? 'white' : 'text.link'}
                    whiteSpace='normal'
                    wordWrap='break-word'
                    fontSize='md'
                    pr={3}
                    _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                >
                    {title}
                </Text>
            </Link>
            <Text
                color={item.expanded ? 'white' : '{colors.gray.800}'}
                whiteSpace='normal'
                wordWrap='break-word'
                fontSize='md'
                pr={3}
            >
                {loading ? 'Fetching description...' : description}
            </Text>
            <Text
                color={item.expanded ? 'white' : '{colors.gray.800}'}
                fontSize='md'
                justifySelf={'center'}
            >
                {dedupedApis.length}
            </Text>
            <Accordion.ItemTrigger
                ref={triggerRef}
                _hover={{
                    bg: item.expanded ? 'bg.muted' : '#68a3d6',
                    cursor: 'pointer'
                }}
                backgroundColor={item.expanded ? 'white' : '#EBF8FF'}
                px={0}
                borderRadius={'4xl'}
                width={'31px'}
                height={'31px'}
                justifyContent={'center'}
                disabled={dedupedApis.length === 0}
            >
                <Accordion.ItemIndicator
                    color={item.expanded ? '#00175A' : '#006FCF'}
                    fontSize='25px'
                />
            </Accordion.ItemTrigger>
        </Box>
    )
}

export const CapabilityAccordionItem = ({
    company_domain_id,
    playbook_id,
    title,
    description,
    apis,
    loading,
    apiColumnWidth,
    onApiColumnWidthChange
}: Props) => {
    const dedupedApis = apis.filter(
        (api, index, self) =>
            index === self.findIndex(a => a.api_nm === api.api_nm) && api.type_a
    )
    const { data: apiDetailsData = [], isLoading: isApiDetailsLoading } =
        useDomainApiWithEndpointDetails(company_domain_id)

    const { apiDetailsById, apiDetailsByName } = useMemo(() => {
        const byId = new Map(
            apiDetailsData.map(api => [api.api_metadata_id, api])
        )
        const byName = new Map(apiDetailsData.map(api => [api.api_nm, api]))
        return { apiDetailsById: byId, apiDetailsByName: byName }
    }, [apiDetailsData])

    return (
        <Accordion.Root
            collapsible
            backgroundColor={{ base: 'white', _dark: '#27272a' }}
            boxShadow='none'
            borderWidth='0px'
        >
            <Accordion.Item
                value={`companyDomain-${company_domain_id}`}
                borderWidth='0px'
                _open={{ backgroundColor: '#006FCF' }}
            >
                <DomainAccordionItemTrigger
                    playbook_id={playbook_id}
                    dedupedApis={dedupedApis}
                    title={title}
                    description={description}
                    loading={loading}
                    apiColumnWidth={apiColumnWidth}
                    onApiColumnWidthChange={onApiColumnWidthChange}
                />

                <Accordion.ItemContent
                    borderRadius={0}
                    borderWidth={0}
                    boxShadow={'none'}
                    backgroundColor='#F7F8F9'
                >
                    <Box
                        backgroundColor='#F7F8F9'
                        _dark={{ backgroundColor: '#2D3748' }}
                        paddingY={0.5}
                        borderWidth={0}
                    >
                        <Table.Root
                            variant='line'
                            stickyHeader
                            backgroundColor='transparent'
                            paddingX='1rem'
                            borderTopRadius='8px'
                            overflow='hidden'
                            borderWidth={0}
                        >
                            <Table.Header>
                                <Table.Row
                                    backgroundColor={{
                                        base: '#EDF2F7',
                                        _dark: '#53565a'
                                    }}
                                >
                                    <Table.ColumnHeader
                                        color={'#00175A'}
                                        borderTopLeftRadius='8px'
                                    >
                                        <Text fontWeight={'semibold'}>
                                            API NAME
                                        </Text>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color={'#00175A'}>
                                        <Text fontWeight={'semibold'}>
                                            API RESOURCE
                                        </Text>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color={'#00175A'}>
                                        <Text fontWeight={'semibold'}>
                                            API DESCRIPTION
                                        </Text>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader color={'#00175A'}>
                                        <Text fontWeight={'semibold'}>
                                            API STATUS
                                        </Text>
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body backgroundColor='transparent'>
                                {dedupedApis.length > 0 ? (
                                    dedupedApis.map(api => {
                                        const apiDetail =
                                            apiDetailsById.get(
                                                api.api_metadata_id
                                            ) ||
                                            apiDetailsByName.get(api.api_nm)
                                        const detailsDocId =
                                            api.add_da.architecturePortalUrl
                                                .split('/')
                                                .pop() || ''

                                        return (
                                            <Table.Row
                                                key={`domain-${company_domain_id}-table-${api.api_metadata_id}`}
                                            >
                                                <Table.Cell>
                                                    {detailsDocId ? (
                                                        <Link
                                                            href={
                                                                detailsDocId
                                                                    ? `/docs/${detailsDocId}`
                                                                    : '/company-domains'
                                                            }
                                                        >
                                                            <Text
                                                                fontSize='md'
                                                                color='text.link'
                                                                _hover={{
                                                                    textDecoration:
                                                                        'underline',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {api.api_nm}
                                                            </Text>
                                                        </Link>
                                                    ) : (
                                                        <Text
                                                            fontSize='md'
                                                            color='text.link'
                                                        >
                                                            {api.api_nm}
                                                        </Text>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontSize='md'>
                                                        {apiDetail?.api_resource ||
                                                            '--'}
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontSize='md'>
                                                        {isApiDetailsLoading
                                                            ? 'Fetching API details...'
                                                            : apiDetail?.api_ds ||
                                                              '--'}
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontSize='md'>
                                                        {isApiDetailsLoading
                                                            ? 'Fetching API details...'
                                                            : apiDetail?.status ||
                                                              '--'}
                                                    </Text>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={5}>
                                            <Text py={2}>
                                                No Apis to Display
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    )
}
