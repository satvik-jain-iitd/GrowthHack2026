/* istanbul ignore file */

'use client'

import { Box, Text, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Playbook } from '@/types/Playbook'
import { Domain } from '@/app/company-domains/types'
import {
    useGetAllDomainApis,
    usePostInitiativeConsumerApi,
    useGetExplorerApi,
    useCheckExistingTypeAApi
} from '@/app/initiatives/hooks'
import {
    ApiType,
    ExplorerSearchResult,
    SearchResult
} from './ConsumerApiAdd.types'
import {
    API_TYPE_OPTIONS,
    getPortalResults,
    normalizeExplorerResult,
    PORTAL_PAGE_SIZE
} from './ConsumerApiAdd.utils'
import { ConsumerApiSearch } from './ConsumerApiSearch'
import { ConsumerApiPreview } from './ConsumerApiPreview'
import { useUserContext } from '@/context/UserContext'
import { B2B_GATEWAY_DOMAIN } from '@/app/company-domains/constants/domainApi'

export function ConsumerApiAdd({
    isAdd,
    handleAdd,
    playbook,
    domains,
    refetchConsumerApis
}: {
    isAdd: boolean
    handleAdd: (isAdd: boolean) => void
    playbook: Playbook | undefined
    domains: Domain[] | undefined
    refetchConsumerApis: () => void
}) {
    const userContext = useUserContext()
    const [selectedApiTypes, setSelectedApiTypes] = useState<ApiType[]>([
        'Type A',
        'Type B',
        'Type C'
    ])
    const [typeValidationError, setTypeValidationError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [isDebouncing, setIsDebouncing] = useState(false)
    const [portalVisibleCount, setPortalVisibleCount] =
        useState(PORTAL_PAGE_SIZE)
    const [explorerPage, setExplorerPage] = useState(1)
    const [explorerResults, setExplorerResults] = useState<
        ExplorerSearchResult[]
    >([])
    const [explorerHasMore, setExplorerHasMore] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
        null
    )
    const [consumerCompanyDomain, setConsumerCompanyDomain] = useState('')

    const { data: domainApis } = useGetAllDomainApis(isAdd)
    const postInitiativeConsumerApi = usePostInitiativeConsumerApi(
        playbook?.playbook_id || ''
    )

    const shouldSearchTypeC =
        selectedApiTypes.includes('Type C') && debouncedQuery.trim().length > 0

    const { data: derivedOpId } = useCheckExistingTypeAApi(
        playbook?.playbook_id || '',
        selectedResult?.source === 'explorer' &&
            selectedResult.apiType === 'Type A' &&
            selectedResult.explorerApiId
            ? selectedResult.explorerApiId
            : '',
        selectedResult?.source === 'explorer' &&
            selectedResult.apiType === 'Type A' &&
            selectedResult.method
            ? selectedResult.method
            : ''
    )

    const explorerSearchQuery = shouldSearchTypeC ? debouncedQuery : ''

    const {
        data: explorerApiData,
        isFetching: isExplorerFetching,
        isError: isExplorerError
    } = useGetExplorerApi(explorerSearchQuery, explorerPage)

    const consumerDomainOptions = useMemo(
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

    const selectedConsumerDomainLabel = useMemo(() => {
        return (
            consumerDomainOptions.find(
                option => option.value === consumerCompanyDomain
            )?.label || ''
        )
    }, [consumerCompanyDomain, consumerDomainOptions])

    const portalAllResults = useMemo(
        () => getPortalResults(domainApis),
        [domainApis]
    )

    const filteredPortalResults = useMemo(() => {
        const query = debouncedQuery.trim().toLowerCase()

        return portalAllResults.filter(result => {
            const typeAllowed = selectedApiTypes.includes(result.apiType)
            if (!typeAllowed) {
                return false
            }

            if (!query) {
                return true
            }

            return (
                result.apiName?.toLowerCase().includes(query) ||
                result.operationName?.toLowerCase().includes(query) ||
                result.providerCompanyDomain?.toLowerCase().includes(query)
            )
        })
    }, [debouncedQuery, portalAllResults, selectedApiTypes])

    const portalVisibleResults = useMemo(
        () => filteredPortalResults.slice(0, portalVisibleCount),
        [filteredPortalResults, portalVisibleCount]
    )

    const typeaheadResults = useMemo(() => {
        return [...portalVisibleResults, ...explorerResults]
    }, [portalVisibleResults, explorerResults])

    const hasPortalMore = portalVisibleCount < filteredPortalResults.length

    const derivedSelectedResultOp = useMemo(() => {
        if (
            !derivedOpId ||
            selectedResult?.source !== 'explorer' ||
            selectedResult.apiType !== 'Type A'
        ) {
            return null
        }

        // find the portal operationId for the selected explorer result if it exists
        const portalMatch = portalAllResults.find(result => {
            if (
                result.source === 'portal' &&
                result.operationId === derivedOpId
            ) {
                return true
            }
            return false
        })
        return portalMatch
    }, [selectedResult, derivedOpId, typeaheadResults])

    useEffect(() => {
        const trimmedQuery = searchQuery.trim()
        if (!trimmedQuery) {
            setDebouncedQuery('')
            setIsDebouncing(false)
            return
        }

        setIsDebouncing(true)
        const timer = setTimeout(() => {
            setDebouncedQuery(trimmedQuery)
            setIsDebouncing(false)
        }, 350)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setPortalVisibleCount(PORTAL_PAGE_SIZE)
        setExplorerPage(1)
        setExplorerResults([])
        setExplorerHasMore(false)
    }, [debouncedQuery, selectedApiTypes])

    useEffect(() => {
        if (!shouldSearchTypeC || !explorerApiData) {
            return
        }

        const data = explorerApiData.data || {}
        const totalCount = data.totalCount || 0
        const nextResults: ExplorerSearchResult[] = (data.results || []).map(
            (result: Record<string, unknown>) => normalizeExplorerResult(result)
        )

        setExplorerResults(prev => {
            if (explorerPage === 1) {
                return nextResults
            }

            const seen = new Set(prev.map(item => item.id))
            const uniqueNext = nextResults.filter(item => !seen.has(item.id))
            return [...prev, ...uniqueNext]
        })

        setExplorerHasMore(prev => {
            const currentCount =
                explorerPage === 1
                    ? nextResults.length
                    : explorerResults.length + nextResults.length
            if (totalCount > 0) {
                return currentCount < totalCount
            }
            return prev
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [explorerApiData, explorerPage, shouldSearchTypeC])

    useEffect(() => {
        if (shouldSearchTypeC && isExplorerError) {
            toast.error('Failed to fetch APIs. Please try again.')
        }
    }, [isExplorerError, shouldSearchTypeC])

    const handleFilterChange = useCallback(
        (type: ApiType, checked: boolean) => {
            setSelectedApiTypes(prev => {
                const next = checked
                    ? prev.includes(type)
                        ? prev
                        : [...prev, type]
                    : prev.filter(item => item !== type)

                if (next.length === 0) {
                    setTypeValidationError(
                        'At least one API type must be selected.'
                    )
                    return prev
                } else {
                    setTypeValidationError('')
                }

                return next
            })
        },
        []
    )

    const handleDropdownScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            const dropdown = event.currentTarget
            const reachedBottom =
                dropdown.scrollHeight - dropdown.scrollTop <=
                dropdown.clientHeight + 50

            if (!reachedBottom) {
                return
            }

            if (hasPortalMore) {
                setPortalVisibleCount(prev => prev + PORTAL_PAGE_SIZE)
            }

            if (shouldSearchTypeC && explorerHasMore && !isExplorerFetching) {
                setExplorerPage(prev => prev + 1)
            }
        },
        [explorerHasMore, hasPortalMore, isExplorerFetching, shouldSearchTypeC]
    )

    const canAddApi = Boolean(selectedResult && consumerCompanyDomain)

    const handleAddApi = () => {
        if (!selectedResult || !consumerCompanyDomain) {
            toast.error('Please fill in all the required fields before saving.')
            return
        }

        // If the provider company domain is the same as the consumer company domain, show an error toast and return
        if (
            selectedResult.source === 'portal' &&
            selectedResult.providerCompanyDomainId === consumerCompanyDomain
        ) {
            toast.error(
                'The provider company domain cannot be the same as the consumer company domain.'
            )
            return
        }

        postInitiativeConsumerApi.mutate(
            {
                operationId:
                    selectedResult.source === 'portal'
                        ? selectedResult.operationId
                        : selectedResult.source === 'explorer' &&
                            derivedOpId &&
                            derivedSelectedResultOp
                          ? derivedSelectedResultOp.operationId
                          : undefined,
                explorerApiId:
                    selectedResult.source === 'explorer' && !derivedOpId
                        ? selectedResult.explorerApiId
                        : undefined,
                applicationId:
                    selectedResult.source === 'explorer' && !derivedOpId
                        ? selectedResult.applicationId
                        : undefined,
                method:
                    selectedResult.source === 'explorer' && !derivedOpId
                        ? selectedResult.method
                        : undefined,
                consumerDomainId: [consumerCompanyDomain],
                email: userContext?.attributes?.email ?? ''
            },
            {
                onSuccess: result => {
                    if (result.data.isApiFoundInPortalFromExplorerId) {
                        toast.success(
                            'API was found in the portal based on the Explorer ID. Added the API to the initiative.'
                        )
                    } else {
                        toast.success(
                            'API added successfully to the initiative'
                        )
                    }
                    refetchConsumerApis()
                    handleAdd(false)
                },
                onError: error => {
                    toast.error(
                        `Failed to add API to the initiative. ${error.message}`
                    )
                }
            }
        )
    }

    return (
        <Box w='100%' p={6} border='1px solid #E2E8F0' borderRadius='xl'>
            <Text fontSize='14px' fontWeight={700} lineHeight='22px'>
                Add Consumer API for {playbook?.playbook_nm}
            </Text>
            <Text
                fontSize='14px'
                fontWeight={400}
                lineHeight='22px'
                mb={4}
                color='#53565A'
            >
                Please enter the details of the Consumer API you want to add for{' '}
                {playbook?.playbook_nm}. This will help us keep track of all the
                Consumer APIs associated with this initiative.
            </Text>

            <VStack align='start' gap={4} mb={4}>
                <ConsumerApiSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedResult={selectedResult}
                    setSelectedResult={setSelectedResult}
                    typeaheadResults={typeaheadResults}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    onDropdownScroll={handleDropdownScroll}
                    isDebouncing={isDebouncing}
                    shouldSearchTypeC={shouldSearchTypeC}
                    isExplorerFetching={isExplorerFetching}
                    debouncedQuery={debouncedQuery}
                    apiTypeOptions={API_TYPE_OPTIONS}
                    selectedApiTypes={selectedApiTypes}
                    typeValidationError={typeValidationError}
                    onFilterChange={handleFilterChange}
                    consumerCompanyDomain={consumerCompanyDomain}
                    consumerDomainOptions={consumerDomainOptions}
                    onConsumerDomainChange={setConsumerCompanyDomain}
                />

                {selectedResult && (
                    <ConsumerApiPreview
                        selectedResult={selectedResult}
                        derivedOpDetails={derivedSelectedResultOp ?? undefined}
                        selectedConsumerDomainLabel={
                            selectedConsumerDomainLabel
                        }
                        canAddApi={canAddApi}
                        isSaving={postInitiativeConsumerApi.isPending}
                        onAddApi={handleAddApi}
                        onCancel={() => handleAdd(false)}
                    />
                )}
            </VStack>
        </Box>
    )
}
