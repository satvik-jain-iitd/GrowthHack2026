/* istanbul ignore file */
import React, { useEffect, useMemo, useState, useRef } from 'react'
import {
    Box,
    Table,
    Text,
    HStack,
    Skeleton,
    Flex,
    Input,
    Pagination,
    ButtonGroup,
    IconButton,
    Button,
    Switch,
    Separator
} from '@chakra-ui/react'
import { NoPrefetchLink, Tooltip } from '@/components/ui'
import metricStyles from '../metrics.module.css'
import { ApiType } from '@/app/company-domains/components/LandingPage/Status'
import { Domain, DomainCategory } from '@/app/company-domains/types'
import {
    useGetUnitCioData,
    useGetApiDomainTargets,
    useMetricsUrlState,
    useUpdateApiDomainTarget
} from '../hooks'
import { API_ENDPOINTS } from '@/constants'
import { UserAvatar } from '@/app/company-domains/components/UserAvatar'
import { METRIC1_COLUMNS, METRIC2_COLUMNS, getScoreColor } from '../constants'
import { MetricsApiCount } from '../types'
import {
    IconChevronLeft,
    IconChevronRight,
    IconEdit,
    IconCheck,
    IconDeclined
} from '@americanexpress/dls-icons'
import TableFilterIcon from './TableFilterIcon'
import TableSortIcon from './TableSortIcon'
import TableViewOptions from './TableViewOptions'
import MetricsDomainCardView from './MetricsDomainCardView'
import Image from 'next/image'
import { getApiDocsUrlForDomain } from '@/app/company-domains/constants'
import { useFeatureFlag, FEATURE_FLAGS } from '@/hooks'
import { fetchWithToken } from '@/utils/client'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'

interface ColumnHeader {
    isFilterable: boolean
    key: string
    colSpan: number
    rowSpan: number
    label: string
    filterTitle: string
    filterType: string
    emailKey: string
    filterableValues: string[]
    type: string
    getColor?: (score: number) => string
}

const SCREEN_WIDTH_BREAKPOINT = 1950

const HEATMAP_COLOR_STOPS = [
    { threshold: 0, color: '#FF6A1A' },
    { threshold: 5, color: '#FF7A2A' },
    { threshold: 15, color: '#F69B40' },
    { threshold: 25, color: '#F3B258' },
    { threshold: 35, color: '#EDC66E' },
    { threshold: 45, color: '#E7D57D' },
    { threshold: 55, color: '#D8DF7B' },
    { threshold: 65, color: '#C9DB70' },
    { threshold: 75, color: '#B8D764' },
    { threshold: 85, color: '#A8D457' },
    { threshold: 95, color: '#96CE48' },
    { threshold: 100, color: '#86C440' }
]

const unitCioNameMatch = (name1: string, name2: string) => {
    const normalize = (name: string) => {
        return name?.toLowerCase().replace(/\./g, '').split(/\s+/)
    }

    const [n1First, n1Middle, n1Last] = normalize(name1)
    const [n2First, n2Middle, n2Last] = normalize(name2)

    if (!n2First?.includes(n1First)) return false

    const last1 = n1Last || n1Middle
    const last2 = n2Last || n2Middle

    if (!last1 || !last2) return true

    return last1 == last2 || last1[0] == last2[0]
}

export default function MetricsTable({
    metricParams,
    groupedData,
    domainGroupedData = [],
    companyDomains
}: {
    metricParams: { view: string; selectedGroup: string; search: string }
    groupedData: Domain[]
    domainGroupedData?: Domain[]
    companyDomains: Domain[] | undefined
}) {
    const { state: urlState, setParams } = useMetricsUrlState()
    const showBurrReport = urlState.burrReport
    const getHeatMapColor = (percentage: number) => {
        const boundedPercentage = Math.max(0, Math.min(100, percentage))
        let resolvedColor = HEATMAP_COLOR_STOPS[0].color

        for (const stop of HEATMAP_COLOR_STOPS) {
            if (boundedPercentage >= stop.threshold) {
                resolvedColor = stop.color
            }
        }

        return resolvedColor
    }

    const getReadableTargetTextColor = (percentage: number) => {
        const boundedPercentage = Math.max(0, Math.min(100, percentage))
        if (boundedPercentage >= 65) return '#2F5E1A'
        return getHeatMapColor(boundedPercentage)
    }

    const domainCategories = [
        ...new Set(
            companyDomains
                ?.filter(x => x.domain_category_nm !== 'Others')
                .sort((a, b) => a.domain_category_sort - b.domain_category_sort)
                .map(x => x.domain_category_nm)
        )
    ]
    const categoryDomainMap: Record<string, string[] | undefined> = {}
    domainCategories.forEach(category => {
        categoryDomainMap[category] = companyDomains
            ?.filter(domain => domain.domain_category_nm === category)
            .map(domain => domain.company_domain_id)
    })
    const { view, selectedGroup, search } = metricParams
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const { data: apiTargetByDomainId = {} } = useGetApiDomainTargets()
    const [tableData, setTableData] = useState<Domain[]>([])
    const [showDomainOwners, setShowDomainOwners] = useState(false)
    const [editingTargetDomainId, setEditingTargetDomainId] = useState('')
    const [editingTargetValue, setEditingTargetValue] = useState('')
    const [savingTargetByDomain, setSavingTargetByDomain] = useState<
        Record<string, boolean>
    >({})
    // Expand-all is deliberately not URL-persisted; everything else is derived
    // from the URL so refresh, deep-link and Back all restore the same view.
    const [showAll, setShowAll] = useState(true)
    const tableViewOptions = useMemo(
        () => ({
            filter: urlState.categoryFilter,
            // render-time coercion: a Unit CIO grouping has no card layout
            view:
                urlState.selectedGroup === 'unitCIO'
                    ? 'listView'
                    : urlState.displayView,
            showAll,
            showApiOperation: urlState.apiOperation,
            isHeatMapSelected: urlState.heatmap
        }),
        [
            urlState.categoryFilter,
            urlState.selectedGroup,
            urlState.displayView,
            urlState.apiOperation,
            urlState.heatmap,
            showAll
        ]
    )
    const [totalItems, setTotalItems] = useState(0)
    const handlePageChange = (e: { page: number }) => {
        setTableParams(prevParams => ({
            ...prevParams,
            page: e.page
        }))
    }
    const [isLoading, setIsLoading] = useState(false)
    const showApiScore = useFeatureFlag(FEATURE_FLAGS.SHOW_API_SCORE_IN_METRICS)
    const aggregateApiScore = useFeatureFlag(
        FEATURE_FLAGS.API_SCORE_AGGREGATE_METRICS
    )
    const aggregateColumnKey = aggregateApiScore.value
        ? 'median_design_quality_score'
        : 'avg_design_quality_score'

    const [tableParams, setTableParams] = useState({
        page: 1,
        limit: 10,
        sortOrder: 'asc',
        sortBy: view === 'metric1' ? 'ecmi_name' : 'domain',
        filterType: 'type',
        search: search || ''
    })
    const abortNetworkCalls = useRef<AbortController | null>(null)

    const { data: unitCioData } = useGetUnitCioData()

    const showHeatMapToggle =
        metricParams.view === 'metric2' &&
        tableViewOptions.view === 'listView' &&
        (selectedGroup === 'domain' || selectedGroup === 'unitCIO') &&
        tableViewOptions.showApiOperation?.length === 1 &&
        tableViewOptions.showApiOperation?.includes('apis')
    const showHeatMap = tableViewOptions.isHeatMapSelected && showHeatMapToggle
    const isBurrReportView = showHeatMap && showBurrReport
    const isUnitCioHeatMap = selectedGroup === 'unitCIO' && showHeatMap
    const isDomainHeatMap = selectedGroup === 'domain' && showHeatMap
    const shouldGroupUnitCioRows =
        view === 'metric2' &&
        selectedGroup === 'unitCIO' &&
        tableViewOptions.view === 'listView'

    useEffect(() => {
        abortNetworkCalls.current = new AbortController()
        const signal = abortNetworkCalls.current.signal
        const fetchDefaultMetricsData = async () => {
            setIsLoading(true)
            try {
                const fetchData = async (url: string, dataKey: string) => {
                    const fetchURL = new URL(url)
                    fetchURL.searchParams.set(
                        'offset',
                        ((tableParams.page - 1) * tableParams.limit).toString()
                    )
                    fetchURL.searchParams.set(
                        'limit',
                        tableParams.limit.toString()
                    )
                    if (tableParams.sortOrder) {
                        fetchURL.searchParams.set(
                            'sortOrder',
                            tableParams.sortOrder
                        )
                    }
                    if (tableParams.sortBy) {
                        fetchURL.searchParams.set('sortBy', tableParams.sortBy)
                    }
                    if (search) {
                        fetchURL.searchParams.set('search', tableParams.search)
                    }
                    if (view === 'metric2' && tableParams.filterType) {
                        fetchURL.searchParams.set(
                            tableParams.filterType,
                            urlState.apiTypeFilter
                        )
                    }
                    const res = await fetchWithToken(fetchURL, {
                        signal
                    })
                    if (!res.ok) {
                        throw new Error('Network response was not ok')
                    }
                    const data = await res.json()
                    if (data.data.data.totalCount)
                        setTotalItems(data.data.data.totalCount)
                    setTableData(data?.data?.data?.[dataKey])
                }

                if (view === 'metric1') {
                    await fetchData(
                        API_ENDPOINTS.GET_ECMI_MAPPED_APPS_DATA,
                        'applications'
                    )
                } else if (view === 'metric2') {
                    await fetchData(API_ENDPOINTS.GET_API_LIST, 'apis')
                }
            } catch (error) {
                if (error != 'COMPONENT_UNMOUNT') {
                    console.error('Failed to fetch domain data:', error)
                }
            } finally {
                setIsLoading(false)
            }
        }
        if (selectedGroup === '') {
            fetchDefaultMetricsData()
        }

        return () => {
            if (abortNetworkCalls.current) {
                abortNetworkCalls.current.abort('COMPONENT_UNMOUNT')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metricParams, tableParams, urlState.apiTypeFilter])

    useEffect(() => {
        if (selectedGroup && selectedGroup !== '' && groupedData.length > 0) {
            if (
                view === 'metric2' &&
                selectedGroup === 'domain' &&
                tableViewOptions.filter !== 'withContributions'
            ) {
                let filteredData = companyDomains?.map(domain => {
                    const foundItem = groupedData.find(
                        item =>
                            item.prim_company_domain_id ===
                            domain.company_domain_id
                    )
                    return foundItem
                        ? {
                              ...foundItem,
                              company_domain_sort: domain.company_domain_sort
                          }
                        : ({
                              prim_company_domain_id: domain.company_domain_id,
                              domain: domain.domain_nm,
                              company_domain_sort: domain.company_domain_sort
                          } as unknown as Domain)
                })
                const domainIdsToInclude =
                    tableViewOptions.filter !== 'viewAll'
                        ? categoryDomainMap[tableViewOptions.filter]
                        : [...Object.values(categoryDomainMap).flat()]
                filteredData = filteredData
                    ?.filter(item =>
                        domainIdsToInclude?.includes(
                            item.prim_company_domain_id
                        )
                    )
                    .sort((a, b) => {
                        if (
                            tableViewOptions.showApiOperation?.includes('apis')
                        ) {
                            if (
                                +(b.prod_certified_apis || 0) !==
                                +(a.prod_certified_apis || 0)
                            ) {
                                return (
                                    +(b.prod_certified_apis || 0) -
                                    +(a.prod_certified_apis || 0)
                                )
                            }
                            if (
                                +(b.design_certified_apis || 0) !==
                                +(a.design_certified_apis || 0)
                            ) {
                                return (
                                    +(b.design_certified_apis || 0) -
                                    +(a.design_certified_apis || 0)
                                )
                            }
                            if (
                                +(b.earb_approved_apis || 0) !==
                                +(a.earb_approved_apis || 0)
                            ) {
                                return (
                                    +(b.earb_approved_apis || 0) -
                                    +(a.earb_approved_apis || 0)
                                )
                            }
                            if (
                                +(b.darb_approved_apis || 0) !==
                                +(a.darb_approved_apis || 0)
                            ) {
                                return (
                                    +(b.darb_approved_apis || 0) -
                                    +(a.darb_approved_apis || 0)
                                )
                            }
                            if (
                                +(b.proposed_apis || 0) !==
                                +(a.proposed_apis || 0)
                            ) {
                                return (
                                    +(b.proposed_apis || 0) -
                                    +(a.proposed_apis || 0)
                                )
                            }
                        } else if (
                            tableViewOptions.showApiOperation?.includes(
                                'operations'
                            )
                        ) {
                            if (+(b.opsProd || 0) !== +(a.opsProd || 0)) {
                                return +(b.opsProd || 0) - +(a.opsProd || 0)
                            }
                            if (+(b.opsDesign || 0) !== +(a.opsDesign || 0)) {
                                return +(b.opsDesign || 0) - +(a.opsDesign || 0)
                            }
                            if (+(b.opsEarb || 0) !== +(a.opsEarb || 0)) {
                                return +(b.opsEarb || 0) - +(a.opsEarb || 0)
                            }
                            if (+(b.opsDarb || 0) !== +(a.opsDarb || 0)) {
                                return +(b.opsDarb || 0) - +(a.opsDarb || 0)
                            }
                            if (
                                +(b.opsProposed || 0) !== +(a.opsProposed || 0)
                            ) {
                                return (
                                    +(b.opsProposed || 0) -
                                    +(a.opsProposed || 0)
                                )
                            }
                        }

                        return a.company_domain_sort - b.company_domain_sort
                    })
                setTableData(filteredData as Domain[])
                setTotalItems(0)
                setIsLoading(false)
            } else {
                let sortedData = [...groupedData]
                if (
                    selectedGroup === 'domain' &&
                    tableViewOptions.showApiOperation?.length === 1 &&
                    tableViewOptions.showApiOperation?.includes('apis')
                ) {
                    sortedData = sortedData.sort((a, b) => {
                        if (
                            +(b.prod_certified_apis || 0) !==
                            +(a.prod_certified_apis || 0)
                        ) {
                            return (
                                +(b.prod_certified_apis || 0) -
                                +(a.prod_certified_apis || 0)
                            )
                        }
                        if (
                            +(b.design_certified_apis || 0) !==
                            +(a.design_certified_apis || 0)
                        ) {
                            return (
                                +(b.design_certified_apis || 0) -
                                +(a.design_certified_apis || 0)
                            )
                        }
                        if (
                            +(b.earb_approved_apis || 0) !==
                            +(a.earb_approved_apis || 0)
                        ) {
                            return (
                                +(b.earb_approved_apis || 0) -
                                +(a.earb_approved_apis || 0)
                            )
                        }
                        if (
                            +(b.darb_approved_apis || 0) !==
                            +(a.darb_approved_apis || 0)
                        ) {
                            return (
                                +(b.darb_approved_apis || 0) -
                                +(a.darb_approved_apis || 0)
                            )
                        }
                        if (
                            +(b.proposed_apis || 0) !== +(a.proposed_apis || 0)
                        ) {
                            return (
                                +(b.proposed_apis || 0) -
                                +(a.proposed_apis || 0)
                            )
                        }
                        return a.company_domain_sort - b.company_domain_sort
                    })
                }
                setTableData(sortedData as Domain[])
                setTotalItems(0)
                setIsLoading(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedGroup,
        groupedData,
        tableViewOptions.filter,
        tableViewOptions.showApiOperation
    ])

    useEffect(() => {
        if (search) {
            setTableParams(prevParams => ({
                ...prevParams,
                search: search,
                page: 1
            }))
        } else {
            setTableParams(prevParams => ({
                ...prevParams,
                search: '',
                page: 1
            }))
        }
    }, [search, view])

    // Deep links that land in the heatmap should reveal its controls. Fires at
    // most once, so later filter clicks don't yank the page back up.
    const hasScrolledToHeatMap = useRef(false)
    useEffect(() => {
        if (hasScrolledToHeatMap.current || !showHeatMap) return
        hasScrolledToHeatMap.current = true
        // scroll after the render completes, so the element is in the DOM
        const timer = setTimeout(
            () =>
                document.getElementById('view-metrics-for')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                }),
            selectedGroup === 'unitCIO' ? 1500 : 500
        )
        return () => clearTimeout(timer)
    }, [showHeatMap, selectedGroup])

    const DomainCell = ({
        domainKey,
        row
    }: {
        domainKey: string
        row: { [key: string]: string }
    }) => {
        const [isFilled, setFilled] = useState(false)
        if (!row[domainKey]) return <Text>--</Text>
        const filterDomain = companyDomains?.filter(
            (domain: Domain) =>
                domain.domain_nm.toLowerCase() === row[domainKey].toLowerCase()
        )
        if (!filterDomain?.length) return <Text>{row[domainKey]}</Text>
        const {
            company_domain_id,
            im_dark_tx,
            im_fill_dark_tx,
            im_fill_light_tx,
            im_light_tx
        } = filterDomain[0]
        const hasApiDocsLink =
            Number(row['onboarded_catalog_apis']) > 0 ||
            Number(row['design_certified_apis']) > 0 ||
            Number(row['prod_certified_apis']) > 0
        const apiDocsLink = hasApiDocsLink
            ? getApiDocsUrlForDomain(company_domain_id || '')
            : ''
        return (
            <Flex
                alignItems={'center'}
                onMouseEnter={() => setFilled(true)}
                onMouseLeave={() => setFilled(false)}
                pl='5px'
                pr='2px'
            >
                <Image
                    width={20}
                    height={20}
                    className={`image-light cardImg margin-1-b`}
                    alt='Domain Icon'
                    src={`data:image/png;base64, ${
                        isFilled ? im_fill_light_tx : im_light_tx
                    }`}
                />
                <Image
                    width={20}
                    height={20}
                    className={`image-dark cardImg margin-1-b`}
                    alt='Domain Icon'
                    src={`data:image/png;base64, ${
                        isFilled ? im_fill_dark_tx : im_dark_tx
                    }`}
                />
                {apiDocsLink && (
                    <NoPrefetchLink
                        href={apiDocsLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{
                            marginLeft: '10px',
                            textAlign: 'start',
                            textDecoration: 'underline'
                        }}
                    >
                        {row[domainKey]}
                    </NoPrefetchLink>
                )}
                {!apiDocsLink && (
                    <Text style={{ marginLeft: '10px' }} textAlign='start'>
                        {row[domainKey]}
                    </Text>
                )}
            </Flex>
        )
    }

    const columnRender = (
        column: ColumnHeader,
        row: { [key: string]: string },
        target?: number,
        showBurrReportView = false
    ) => {
        const { type, key, emailKey } = column || {}
        if (type === 'scoreWithColor') {
            const score = parseFloat(row[key])
            const color = column.getColor?.(score)
            const scoreLabel =
                score >= 85
                    ? 'Excellent'
                    : score >= 75
                      ? 'Good'
                      : score >= 50
                        ? 'Fair'
                        : 'Poor'
            return (
                <Flex direction='column' alignItems='center' gap='4px'>
                    <Text
                        style={{
                            backgroundColor: color,
                            color: '#fff',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        {!isNaN(score) ? Math.round(score) : '--'}
                    </Text>
                    {!isNaN(score) &&
                        !(isUnitCioHeatMap || isDomainHeatMap) && (
                            <Text
                                style={{
                                    color: '#000',
                                    fontSize: '12px',
                                    fontWeight: 400
                                }}
                            >
                                {scoreLabel}
                            </Text>
                        )}
                </Flex>
            )
        }
        if (type === 'trend') {
            const trendValue = (row[key] || '').toLowerCase()
            if (trendValue === 'up') {
                return (
                    <Flex justifyContent='center' alignItems='center'>
                        <Box
                            width='30px'
                            height='30px'
                            borderRadius='full'
                            border='3px solid'
                            borderColor='#22c55e'
                            bg='white'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                            >
                                <polyline
                                    points='10,3 10,17'
                                    stroke='#22c55e'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                />
                                <polyline
                                    points='6,6 10,2 14,6'
                                    stroke='#22c55e'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </Box>
                    </Flex>
                )
            }
            if (trendValue === 'down') {
                return (
                    <Flex justifyContent='center' alignItems='center'>
                        <Box
                            width='30px'
                            height='30px'
                            borderRadius='full'
                            border='3px solid'
                            borderColor='#ef4444'
                            bg='white'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                            >
                                <polyline
                                    points='10,3 10,17'
                                    stroke='#ef4444'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                />
                                <polyline
                                    points='6,14 10,18 14,14'
                                    stroke='#ef4444'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </Box>
                    </Flex>
                )
            }
            return (
                <Flex justifyContent='center' alignItems='center'>
                    <Box
                        width='30px'
                        height='30px'
                        borderRadius='full'
                        border='3px solid'
                        borderColor='#eab308'
                        bg='white'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                        >
                            <polyline
                                points='3,10 17,10'
                                stroke='#eab308'
                                strokeWidth='2'
                                strokeLinecap='round'
                            />
                            <polyline
                                points='14,6 18,10 14,14'
                                stroke='#eab308'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </Box>
                </Flex>
            )
        }

        if (type === 'apiType') {
            const apiData = {
                endpoint_type: row['endpoint_type'] || '',
                api_endpoint_type_nm: row['api_endpoint_type_nm'] || ''
            }
            return <ApiType data={apiData} />
        }
        if (type === 'user') {
            let email = Array.isArray(row[emailKey])
                ? row[emailKey][0]
                : row[emailKey]
            if (key === 'unitcio' && Array.isArray(unitCioData)) {
                const unitCioObjectIndex = unitCioData?.findIndex(
                    unitCio =>
                        unitCio.displayName &&
                        row[key] &&
                        unitCioNameMatch(unitCio.displayName, row[key])
                )
                if (unitCioObjectIndex != -1) {
                    const { userPrincipalName } = unitCioData
                        ? unitCioData[unitCioObjectIndex]
                        : {}
                    if (userPrincipalName) {
                        email = userPrincipalName
                    }
                }
            }

            return (
                <Flex
                    alignItems='center'
                    textAlign='left'
                    w='100%'
                    pl='5px'
                    pr='2px'
                >
                    <UserAvatar email={email} name={row[key]} />
                    <Text ml='5px' textAlign='left' whiteSpace='normal'>
                        {row[key]}
                    </Text>
                </Flex>
            )
        }
        if (key === 'arb_target_difference') {
            const arbValue = Number(row['darbTypeACumSum'] || 0)
            if (
                target === undefined ||
                !Number.isFinite(target) ||
                !Number.isFinite(arbValue)
            ) {
                return <Text>--</Text>
            }

            return <Text>{Math.max(0, target - arbValue)}</Text>
        }
        if (
            key === 'darbTypeACumSum' ||
            key === 'darb_approved_apis' ||
            key === 'opsDarb' ||
            key === 'earbTypeACumSum' ||
            key === 'earb_approved_apis' ||
            key === 'opsEarb' ||
            key === 'designTypeACumSum' ||
            key === 'design_certified_apis' ||
            key === 'opsDesign' ||
            key === 'prod_certified_apis' ||
            key === 'opsProd'
        ) {
            const hasValue =
                row[key] !== undefined && row[key] !== null && row[key] !== ''
            const displayValue = hasValue
                ? row[key]
                : target !== undefined
                  ? 0
                  : '--'
            const numericValue = Number(displayValue)
            const targetAchieved =
                target !== undefined &&
                Number.isFinite(target) &&
                target > 0 &&
                Number.isFinite(numericValue) &&
                numericValue >= target
            const formattedDisplayValue = targetAchieved
                ? `✓ ${displayValue}`
                : displayValue

            return (
                <Text>
                    {showBurrReportView ? formattedDisplayValue : displayValue}
                </Text>
            )
        }
        if (
            key === 'domain_nm' ||
            key === 'prim_company_domain_name' ||
            key === 'domain'
        ) {
            return <DomainCell domainKey={key} row={row} />
        }
        if (key === aggregateColumnKey) {
            const rawScore = row[key]
            const numericScore = parseFloat(String(rawScore))

            if (Number.isNaN(numericScore)) {
                return <Text>--</Text>
            }

            if (showBurrReportView) {
                return <Text>{`${Math.round(numericScore)}%`}</Text>
            }

            return (
                <Box
                    as='span'
                    display='inline-flex'
                    alignItems='center'
                    justifyContent='center'
                    minW='35px'
                    minH='35px'
                    px={2}
                    borderRadius='8px'
                    bg={getScoreColor(numericScore)}
                    color='white'
                    fontWeight='600'
                >
                    {rawScore}
                </Box>
            )
        }
        return (
            <Text>
                {column
                    ? key === 'percentage'
                        ? `${parseFloat(row[key])?.toFixed(2)}%`
                        : typeof row[key] === 'boolean'
                          ? String(row[key])
                          : row[key] !== undefined && row[key] !== null
                            ? row[key]
                            : target !== undefined
                              ? 0
                              : '--'
                    : 'N/A'}
            </Text>
        )
    }

    const handleSort = (column: { isFilterable: boolean; key: string }) => {
        if (column.isFilterable || selectedGroup) return
        const key = column.key
        let direction = 'asc'
        if (tableParams.sortBy === key || key === 'prim_company_domain_name') {
            direction = tableParams.sortOrder === 'asc' ? 'desc' : 'asc'
        }
        const sortKey = key === 'prim_company_domain_name' ? 'domain' : key
        setTableParams(prevParams => ({
            ...prevParams,
            sortBy: sortKey,
            sortOrder: direction,
            page: 1
        }))
    }

    const handleStatusFilter = (filterType: string, status: string) => {
        const apiTypeFilter =
            status === 'viewAll' ? 'all' : status === 'typeA' ? 'a' : 'b'
        setParams({ apiTypeFilter })
        setTableParams(prevParams => ({
            ...prevParams,
            filterType: status === 'viewAll' ? 'type' : filterType,
            page: 1
        }))
    }

    const handleTableViewFilterChange = (filter: string) => {
        setParams({ categoryFilter: filter })
    }

    const handleTableViewChange = (view: string) => {
        setParams({ displayView: view as 'cardView' | 'listView' })
    }

    const handleCardExpandAll = () => {
        setShowAll(prev => !prev)
    }

    const handleHeatMapViewChange = (isChecked: boolean) => {
        setParams({ heatmap: isChecked })
    }

    const columns = selectedGroup
        ? view === 'metric1'
            ? METRIC1_COLUMNS.grouped[
                  selectedGroup as keyof typeof METRIC1_COLUMNS.grouped
              ]
            : METRIC2_COLUMNS.grouped(
                  tableViewOptions.showApiOperation,
                  selectedGroup as keyof typeof METRIC2_COLUMNS.grouped
              ) || []
        : view === 'metric1'
          ? METRIC1_COLUMNS.default
          : METRIC2_COLUMNS.default
    const resolvedColumns = [...columns]
    if (
        view === 'metric2' &&
        selectedGroup &&
        tableViewOptions.showApiOperation.length === 1 &&
        tableViewOptions.showApiOperation?.includes('apis')
    ) {
        resolvedColumns.push({
            label: 'Design Quality Score',
            key: aggregateColumnKey
        })
    }
    if (isUnitCioHeatMap) {
        const unitCioHeatMapColumns = [
            {
                key: 'unitcio',
                label: 'Unit CIO',
                type: 'user',
                emailKey: 'unit_cio_email'
            },
            { key: 'domain', label: 'Company Domains' },
            {
                key: 'arb_target_difference',
                label: 'Not Started'
            },
            { key: 'darbTypeACumSum', label: 'ARB Approved' },
            { key: 'earbTypeACumSum', label: 'EARB Certified' },
            {
                key: 'designTypeACumSum',
                label: 'Design Certified'
            },
            {
                key: 'prod_certified_apis',
                label: 'Prod Certified'
            },
            { key: 'target', label: 'Estimated Target' },
            {
                key: 'trend',
                label: 'Trend',
                type: 'trend'
            },
            {
                key: aggregateColumnKey,
                label: 'Design Quality Score'
            }
        ]
        if (showDomainOwners) {
            unitCioHeatMapColumns.push(
                {
                    key: 'tech_owner',
                    label: 'Tech Owner',
                    type: 'user',
                    emailKey: 'tech_owner_email'
                },
                {
                    key: 'head_engineer',
                    label: 'Head Engineer',
                    type: 'user',
                    emailKey: 'head_engineer_email'
                },
                {
                    key: 'principal_architect',
                    label: 'Principal Architect',
                    type: 'user',
                    emailKey: 'principal_architect_email'
                },
                {
                    key: 'enterprise_architect',
                    label: 'Enterprise Architect',
                    type: 'user',
                    emailKey: 'enterprise_architect_email'
                }
            )
        }
        resolvedColumns.length = 0
        unitCioHeatMapColumns.forEach(column =>
            resolvedColumns.push(
                column as unknown as (typeof resolvedColumns)[number]
            )
        )
    } else if (showHeatMap) {
        if (!resolvedColumns.some(column => column.key === 'target')) {
            resolvedColumns.push({
                key: 'target',
                label: 'Estimated Target'
            } as unknown as (typeof resolvedColumns)[number])
        }
        // remove column proposed with key proposedTypeACumSum and the design scorecolumn
        const removeColumns = resolvedColumns.filter(
            column => column.key === 'proposedTypeACumSum'
        )
        // move the target column before the score column
        const targetColumnIndex = resolvedColumns.findIndex(
            column => column.key === 'target'
        )
        const scoreColumnIndex = resolvedColumns.findIndex(
            column => column.key === aggregateColumnKey
        )
        if (targetColumnIndex !== -1 && scoreColumnIndex !== -1) {
            const [targetColumn] = resolvedColumns.splice(targetColumnIndex, 1)
            resolvedColumns.splice(scoreColumnIndex, 0, targetColumn)
        }
        if (!resolvedColumns.some(column => column.key === 'trend')) {
            const newScoreIndex = resolvedColumns.findIndex(
                column => column.key === aggregateColumnKey
            )
            const insertAt =
                newScoreIndex !== -1 ? newScoreIndex : resolvedColumns.length
            resolvedColumns.splice(insertAt, 0, {
                key: 'trend',
                label: 'Trend',
                type: 'trend'
            } as unknown as (typeof resolvedColumns)[number])
        }
        if (
            !resolvedColumns.some(
                column => column.key === 'arb_target_difference'
            )
        ) {
            const domainColumnIndex = resolvedColumns.findIndex(
                column =>
                    column.key === 'domain' ||
                    column.key === 'domain_nm' ||
                    column.key === 'prim_company_domain_name'
            )
            const arbColumnIndex = resolvedColumns.findIndex(
                column => column.key === 'darbTypeACumSum'
            )
            const insertAt =
                domainColumnIndex !== -1
                    ? domainColumnIndex + 1
                    : arbColumnIndex !== -1
                      ? arbColumnIndex
                      : 0
            resolvedColumns.splice(insertAt, 0, {
                key: 'arb_target_difference',
                label: 'Not Started'
            } as unknown as (typeof resolvedColumns)[number])
        }
        if (removeColumns.length !== 0) {
            removeColumns.forEach(column => {
                const index = resolvedColumns.indexOf(column)
                if (index !== -1) {
                    resolvedColumns.splice(index, 1)
                }
            })
        }
    }

    if (!showApiScore.value) {
        const apiScoreColumnIndex = resolvedColumns.findIndex(
            column => column.key === aggregateColumnKey
        )
        if (apiScoreColumnIndex !== -1) {
            resolvedColumns.splice(apiScoreColumnIndex, 1)
        }
        const operationsScoreColumnIndex = resolvedColumns.findIndex(
            column => column.key === 'avg_operation_design_quality_score'
        )
        if (operationsScoreColumnIndex !== -1) {
            resolvedColumns.splice(operationsScoreColumnIndex, 1)
        }
    }

    if (
        shouldGroupUnitCioRows &&
        !isUnitCioHeatMap &&
        !resolvedColumns.some(
            column =>
                column.key === 'domain' ||
                column.key === 'domain_nm' ||
                column.key === 'prim_company_domain_name'
        )
    ) {
        const unitCioColIndex = resolvedColumns.findIndex(
            column => column.key === 'unitcio'
        )
        const insertAt = unitCioColIndex === -1 ? 0 : unitCioColIndex + 1
        resolvedColumns.splice(insertAt, 0, {
            key: 'domain',
            label: 'Company Domain',
            rowSpan: tableViewOptions.showApiOperation?.length > 1 ? 2 : 1
        } as unknown as (typeof resolvedColumns)[number])
    }

    type UnitCioHeatMapRow = Domain & {
        unitcio?: string
        unit_cio_email?: string | string[]
        tech_owner?: string
        tech_owner_email?: string
        head_engineer?: string
        head_engineer_email?: string
        principal_architect?: string
        principal_architect_email?: string
        enterprise_architect?: string
        enterprise_architect_email?: string
        rowSpan: number
        isFirstInGroup: boolean
    }

    const buildUnitCioGroupedData = (): UnitCioHeatMapRow[] => {
        type UnitCioHeatMapBaseRow = Omit<
            UnitCioHeatMapRow,
            'rowSpan' | 'isFirstInGroup'
        >
        const rows: UnitCioHeatMapBaseRow[] = []
        const getPrimaryEmail = (email?: string | string[]) =>
            Array.isArray(email) ? (email[0] ?? '') : (email ?? '')
        const missingDomainEntries = companyDomains
            ?.filter(domain => {
                const isDomainInGroupedData = (
                    groupedData as unknown as MetricsApiCount[]
                ).some(entry =>
                    entry.company_domain_ids?.includes(domain.company_domain_id)
                )
                return !isDomainInGroupedData
            })
            .filter(
                (domain): domain is Domain =>
                    domain.domain_category_nm !==
                        DomainCategory.ToolsAndUtilities &&
                    domain.domain_category_nm !== DomainCategory.Others &&
                    domain.company_domain_id !=
                        '8b600406-0142-45b3-b812-2d810d578c05' &&
                    domain.company_domain_id !=
                        'e1f179c3-1fca-4be9-97c3-4b98302b5c1c'
            )
            .map(domain => ({
                ...domain,
                domain: domain.domain_nm,
                prim_company_domain_id: domain.company_domain_id,
                tech_owner: domain.tech_owner_nm,
                tech_owner_email: domain.tech_own_email_ad_da?.[0],
                head_engineer: domain.head_engineer_nm,
                head_engineer_email: domain.head_engnr_email_ad_da?.[0],
                principal_architect: domain.principal_ea_architect_nm,
                principal_architect_email:
                    domain.princ_ea_archt_email_ad_da?.[0],
                enterprise_architect: domain.ea_architect_nm,
                enterprise_architect_email: domain.ea_archt_email_ad_da?.[0],
                unitcio: domain.unit_cio_nm || 'Unassigned',
                unit_cio_email: domain.unit_cio_email_ad_da?.[0] || ''
            }))
        missingDomainEntries?.forEach(entry => rows.push(entry))
        ;(groupedData as unknown as MetricsApiCount[]).forEach(unitCioEntry => {
            const domainRows = (unitCioEntry.company_domain_ids || [])
                .map(domainId =>
                    domainGroupedData.find(
                        domain => domain.prim_company_domain_id === domainId
                    )
                )
                .filter((domain): domain is Domain => Boolean(domain))
            const domainOwnershipRows = domainRows.map(domain => {
                const domainData = companyDomains?.find(
                    d => d.company_domain_id === domain.prim_company_domain_id
                )
                return {
                    ...domain,
                    tech_owner: domainData?.tech_owner_nm,
                    tech_owner_email: domainData?.tech_own_email_ad_da?.[0],
                    head_engineer: domainData?.head_engineer_nm,
                    head_engineer_email:
                        domainData?.head_engnr_email_ad_da?.[0],
                    principal_architect: domainData?.principal_ea_architect_nm,
                    principal_architect_email:
                        domainData?.princ_ea_archt_email_ad_da?.[0],
                    enterprise_architect: domainData?.ea_architect_nm,
                    enterprise_architect_email:
                        domainData?.ea_archt_email_ad_da?.[0]
                }
            })
            domainOwnershipRows.forEach(domainData => {
                rows.push({
                    ...domainData,
                    unitcio: unitCioEntry.unitcio,
                    unit_cio_email: (
                        unitCioEntry as unknown as {
                            unit_cio_email?: string | string[]
                        }
                    ).unit_cio_email
                })
            })
        })
        const sortedRows = rows.sort((a, b) => {
            const unitCioOrder: Record<string, number> = {
                'jason.p.sharples@aexp.com': 1,
                'miles.farrel@aexp.com': 2,
                'hilary.packer@aexp.com': 3,
                'nigel.f.greenwood@aexp.com': 4,
                'david.mcgowan@aexp.com': 5,
                'sachin.devand@aexp.com': 6,
                'gary.kensey@aexp.com': 7,
                'matthew.liste@aexp.com': 8
            }
            const aUnitCioEmail = getPrimaryEmail(
                a.unit_cio_email
            ).toLowerCase()
            const bUnitCioEmail = getPrimaryEmail(
                b.unit_cio_email
            ).toLowerCase()
            const aOrder = unitCioOrder[aUnitCioEmail] || 999
            const bOrder = unitCioOrder[bUnitCioEmail] || 999
            if (aOrder !== bOrder) return aOrder - bOrder

            const unitCioSort = (a.unitcio || '').localeCompare(b.unitcio || '')
            if (unitCioSort !== 0) return unitCioSort

            const aDomainSort = a.company_domain_sort ?? Number.MAX_SAFE_INTEGER
            const bDomainSort = b.company_domain_sort ?? Number.MAX_SAFE_INTEGER
            if (aDomainSort !== bDomainSort) return aDomainSort - bDomainSort

            const aDomainName = a.domain_nm || ''
            const bDomainName = b.domain_nm || ''
            return aDomainName.localeCompare(bDomainName)
        })
        const groupedRows: UnitCioHeatMapRow[] = []
        let index = 0

        while (index < sortedRows.length) {
            const currentRow = sortedRows[index]
            const currentGroupKey = `${(currentRow.unitcio || '').toLowerCase()}::${getPrimaryEmail(currentRow.unit_cio_email).toLowerCase()}`
            let groupEnd = index + 1

            while (groupEnd < sortedRows.length) {
                const nextRow = sortedRows[groupEnd]
                const nextGroupKey = `${(nextRow.unitcio || '').toLowerCase()}::${getPrimaryEmail(nextRow.unit_cio_email).toLowerCase()}`
                if (nextGroupKey !== currentGroupKey) break
                groupEnd += 1
            }

            const groupSize = groupEnd - index
            for (let rowIndex = index; rowIndex < groupEnd; rowIndex += 1) {
                groupedRows.push({
                    ...sortedRows[rowIndex],
                    rowSpan: rowIndex === index ? groupSize : 0,
                    isFirstInGroup: rowIndex === index
                })
            }

            index = groupEnd
        }

        return groupedRows
    }

    const unitCioGroupedRows = shouldGroupUnitCioRows
        ? buildUnitCioGroupedData()
        : []

    const isNestedTable = resolvedColumns.some(
        col =>
            'child' in col && Array.isArray(col.child) && col.child.length > 0
    )
    const level2Columns = isNestedTable
        ? resolvedColumns.flatMap(col =>
              'child' in col && Array.isArray(col.child) ? col.child : []
          )
        : []
    const colLength = resolvedColumns.reduce(
        (total, col) =>
            total +
            ('child' in col && col.child && Array.isArray(col.child)
                ? col.child.length
                : 1),
        0
    )
    const TableHeaderRow = ({
        column,
        index
    }: {
        column: ColumnHeader
        index: number
    }) => {
        const stickyColumnClassName =
            isUnitCioHeatMap && column.key === 'unitcio'
                ? metricStyles.stickyUnitCioCol
                : isUnitCioHeatMap && column.key === 'domain'
                  ? metricStyles.stickyDomainCol
                  : ''
        return (
            <Table.ColumnHeader
                key={index}
                color={'#ffffff'}
                whiteSpace='wrap'
                maxW={showHeatMap ? '150px' : 'auto'}
                className={stickyColumnClassName}
                onClick={() => handleSort(column)}
                w={
                    typeof window != 'undefined' &&
                    !showHeatMap &&
                    window?.innerWidth > SCREEN_WIDTH_BREAKPOINT
                        ? `${100 / colLength}%`
                        : 'auto'
                }
                textAlign={selectedGroup !== '' ? 'center' : 'left'}
                verticalAlign={selectedGroup !== '' ? 'middle' : 'top'}
                colSpan={column.colSpan ? column.colSpan : 1}
                rowSpan={column.rowSpan ? column.rowSpan : 1}
            >
                <HStack
                    align={'center'}
                    justifyContent={selectedGroup !== '' ? 'center' : 'left'}
                >
                    <Text>
                        {view === 'metric2' &&
                            selectedGroup != '' &&
                            column.isFilterable &&
                            (urlState.apiTypeFilter === 'b'
                                ? 'TYPE-B'
                                : 'TYPE-A')}{' '}
                        {column.label}
                    </Text>
                    {column.isFilterable ? (
                        <TableFilterIcon
                            column={column}
                            handleStatusFilter={handleStatusFilter}
                        />
                    ) : (
                        <TableSortIcon
                            selectedGroup={selectedGroup}
                            tableParams={tableParams}
                            columnKey={column.key}
                            color='white'
                        />
                    )}
                </HStack>
            </Table.ColumnHeader>
        )
    }

    const TableBodyRow = ({
        column,
        row
    }: {
        column: { type: string; key: string; emailKey: string }
        row: Domain
    }) => {
        const { key } = column
        const { mutateAsync: updateTarget } = useUpdateApiDomainTarget()
        const stickyColumnClassName =
            isUnitCioHeatMap && key === 'unitcio'
                ? metricStyles.stickyUnitCioCol
                : isUnitCioHeatMap && key === 'domain'
                  ? metricStyles.stickyDomainCol
                  : ''
        const domainId = row.prim_company_domain_id
        const domainIdKey = domainId || ''
        const targetValue = Number(apiTargetByDomainId[domainIdKey])
        const isBurrViewForRow = showHeatMap && showBurrReport
        const isHeatMapSelected =
            showHeatMapToggle && !!tableViewOptions.isHeatMapSelected
        const isTargetMissingForRow =
            isHeatMapSelected &&
            (!Number.isFinite(targetValue) || targetValue <= 0)
        const isTextOnlyColumn =
            key === 'domain' ||
            key === 'domain_nm' ||
            key === 'prim_company_domain_name' ||
            key === 'unitcio' ||
            column.type === 'user' ||
            column.type === 'apiType' ||
            column.type === 'trend'
        const shouldGrayOutNumericCell =
            isTargetMissingForRow && !isTextOnlyColumn
        const rawValue = row[key as keyof Domain] || 0

        const displayedTargetValue = targetValue
        const numeratorValue =
            typeof rawValue === 'number' ? rawValue : Number(rawValue)
        const shouldApplyHeatMap =
            showHeatMapToggle &&
            !!tableViewOptions.isHeatMapSelected &&
            !isBurrViewForRow &&
            key !== 'target' &&
            key !== 'trend' &&
            key !== 'arb_target_difference' &&
            key !== aggregateColumnKey &&
            Number.isFinite(numeratorValue) &&
            Number.isFinite(targetValue) &&
            targetValue > 0

        const heatMapPercentage = shouldApplyHeatMap
            ? (numeratorValue / targetValue) * 100
            : null
        const heatMapBgColor =
            heatMapPercentage !== null
                ? getHeatMapColor(heatMapPercentage)
                : 'transparent'
        const shouldApplyBurrColor =
            isBurrViewForRow &&
            key !== 'target' &&
            key !== 'arb_target_difference' &&
            key !== aggregateColumnKey &&
            key !== 'trend' &&
            !isTextOnlyColumn &&
            Number.isFinite(numeratorValue) &&
            Number.isFinite(targetValue) &&
            targetValue > 0
        const burrColor = shouldApplyBurrColor
            ? getBurrReportColor(numeratorValue, targetValue)
            : null
        const rawScoreValue = row[aggregateColumnKey as keyof Domain]
        const hasScoreValue =
            rawScoreValue !== undefined &&
            rawScoreValue !== null &&
            rawScoreValue !== ''
        const scoreValue = Number(rawScoreValue)
        const burrScoreColor =
            isBurrViewForRow &&
            key === aggregateColumnKey &&
            hasScoreValue &&
            Number.isFinite(scoreValue)
                ? scoreValue >= 50
                    ? { bg: '#22c55e', font: '#FFFFFF' }
                    : scoreValue > 0
                      ? { bg: '#eab308', font: '#000000' }
                      : { bg: '#ef4444', font: '#FFFFFF' }
                : null

        if (key === 'target') {
            // This logic is not in use currently, but having it here just in case
            const prodCertificationRaw =
                row['prod_certified_apis' as keyof Domain]
            const prodCertificationValue =
                typeof prodCertificationRaw === 'number'
                    ? prodCertificationRaw
                    : Number(prodCertificationRaw)
            const targetTextColor =
                showHeatMapToggle &&
                !!tableViewOptions.isHeatMapSelected &&
                Number.isFinite(prodCertificationValue) &&
                Number.isFinite(targetValue) &&
                targetValue > 1000
                    ? getReadableTargetTextColor(
                          (prodCertificationValue / targetValue) * 100
                      )
                    : 'inherit'

            const isEditingTarget = editingTargetDomainId === domainIdKey
            const isSavingTarget = !!savingTargetByDomain[domainIdKey]

            const handleTargetEditSave = async () => {
                const parsedValue = Number(editingTargetValue)
                if (
                    !Number.isFinite(parsedValue) ||
                    parsedValue < 0 ||
                    parsedValue > 100
                ) {
                    setEditingTargetDomainId('')
                    setEditingTargetValue('')
                    return
                }
                if (!domainIdKey) return
                setSavingTargetByDomain(prev => ({
                    ...prev,
                    [domainIdKey]: true
                }))
                try {
                    await updateTarget({
                        company_domain_id: domainIdKey,
                        domainApiTarget: parsedValue
                    })
                    setEditingTargetDomainId('')
                    setEditingTargetValue('')
                } catch (error) {
                    console.error('Failed to update target:', error)
                } finally {
                    setSavingTargetByDomain(prev => ({
                        ...prev,
                        [domainIdKey]: false
                    }))
                }
            }

            const handleTargetEditCancel = () => {
                setEditingTargetDomainId('')
                setEditingTargetValue('')
            }

            return (
                <Table.Cell
                    textAlign={'center'}
                    verticalAlign={'middle'}
                    className={`${metricStyles.metricsListView__itemTd} ${stickyColumnClassName}`}
                    bg={shouldGrayOutNumericCell ? '#EDF2F7' : 'white'}
                    _dark={{
                        bg: shouldGrayOutNumericCell ? '#2D3748' : 'inherit'
                    }}
                    color={
                        shouldGrayOutNumericCell ? '#718096' : targetTextColor
                    }
                    fontWeight={targetTextColor !== 'inherit' ? '700' : '400'}
                    style={
                        shouldGrayOutNumericCell
                            ? { filter: 'grayscale(100%)', opacity: 0.8 }
                            : undefined
                    }
                >
                    {isEditingTarget ? (
                        <Flex align='center' justify='center' gap={1}>
                            <Input
                                size='xs'
                                width='40px'
                                type='text'
                                inputMode='numeric'
                                value={editingTargetValue}
                                autoFocus
                                disabled={isSavingTarget}
                                onChange={e => {
                                    const nextValue = e.target.value
                                    if (nextValue === '') {
                                        setEditingTargetValue('')
                                        return
                                    }
                                    if (!/^\d{0,3}$/.test(nextValue)) return
                                    const nextNumber = Number(nextValue)
                                    if (nextNumber > 100) return
                                    setEditingTargetValue(nextValue)
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleTargetEditSave()
                                    }
                                    if (e.key === 'Escape') {
                                        handleTargetEditCancel()
                                    }
                                }}
                                min={0}
                                max={100}
                            />
                            <Flex
                                align='center'
                                cursor='pointer'
                                onClick={() => {
                                    if (!isSavingTarget) {
                                        handleTargetEditSave()
                                    }
                                }}
                                title='Save target'
                                opacity={isSavingTarget ? 0.5 : 1}
                            >
                                <IconCheck
                                    color='success'
                                    style={{ width: '14px', height: '14px' }}
                                />
                            </Flex>
                            <Flex
                                align='center'
                                cursor='pointer'
                                onClick={() => {
                                    if (!isSavingTarget) {
                                        handleTargetEditCancel()
                                    }
                                }}
                                title='Cancel target edit'
                                opacity={isSavingTarget ? 0.5 : 1}
                            >
                                <IconDeclined
                                    color='error'
                                    style={{ width: '14px', height: '14px' }}
                                />
                            </Flex>
                        </Flex>
                    ) : (
                        <Flex
                            align='center'
                            justify='center'
                            gap={1}
                            role='group'
                            className='group'
                        >
                            <Text as='span'>
                                {Number.isFinite(displayedTargetValue)
                                    ? displayedTargetValue
                                    : '--'}
                            </Text>
                            {isAdmin && (
                                <Flex
                                    opacity={0}
                                    _groupHover={{ opacity: 1 }}
                                    transition='opacity 0.1s'
                                    align='center'
                                    cursor='pointer'
                                    onClick={() => {
                                        setEditingTargetDomainId(domainIdKey)
                                        setEditingTargetValue(
                                            Number.isFinite(
                                                displayedTargetValue
                                            )
                                                ? String(displayedTargetValue)
                                                : ''
                                        )
                                    }}
                                    title='Edit target'
                                >
                                    <IconEdit
                                        color='neutral'
                                        style={{
                                            width: '14px',
                                            height: '14px'
                                        }}
                                    />
                                </Flex>
                            )}
                        </Flex>
                    )}
                </Table.Cell>
            )
        }
        return (
            <Table.Cell
                textAlign={selectedGroup !== '' ? 'center' : 'left'}
                verticalAlign={selectedGroup !== '' ? 'middle' : 'top'}
                className={`${metricStyles.metricsListView__itemTd} ${stickyColumnClassName}`}
                bg={
                    shouldGrayOutNumericCell
                        ? '#EDF2F7'
                        : burrScoreColor
                          ? burrScoreColor.bg
                          : burrColor
                            ? burrColor.bg
                            : stickyColumnClassName !== ''
                              ? 'white'
                              : heatMapBgColor
                }
                _dark={{
                    bg: stickyColumnClassName !== '' ? '#333333' : 'inherit'
                }}
                color={
                    shouldGrayOutNumericCell
                        ? '#718096'
                        : burrScoreColor
                          ? burrScoreColor.font
                          : burrColor
                            ? burrColor.font
                            : undefined
                }
                style={
                    shouldGrayOutNumericCell
                        ? { filter: 'grayscale(100%)', opacity: 0.8 }
                        : undefined
                }
                title={
                    heatMapPercentage !== null
                        ? `${numeratorValue}/${targetValue} (${heatMapPercentage.toFixed(2)}% of target)`
                        : undefined
                }
            >
                <Skeleton loading={selectedGroup ? false : isLoading}>
                    {columnRender(
                        column as ColumnHeader,
                        row as unknown as { [key: string]: string },
                        targetValue,
                        isBurrViewForRow
                    )}
                </Skeleton>
            </Table.Cell>
        )
    }

    const handleApiOperationFilter = (filter: string) => {
        const current = tableViewOptions.showApiOperation || []
        // never allow an empty selection
        if (current.includes(filter) && current.length === 1) return
        setParams({
            apiOperation: current.includes(filter)
                ? current.filter(item => item !== filter)
                : [...current, filter]
        })
    }

    const getExportRowsAndColumns = () => {
        const exportRows = shouldGroupUnitCioRows
            ? unitCioGroupedRows
            : tableData
        const exportColumns = resolvedColumns.flatMap(column => {
            const childColumns = (
                column as ColumnHeader & { child?: ColumnHeader[] }
            ).child
            return Array.isArray(childColumns) && childColumns.length > 0
                ? childColumns
                : [column as ColumnHeader]
        })

        return { exportRows, exportColumns }
    }

    const getExportValue = (row: Domain, column: ColumnHeader) => {
        if (column.key === 'target') {
            const domainId = row.prim_company_domain_id
            const target = Number(apiTargetByDomainId[domainId || ''])
            return Number.isFinite(target) ? target : 0
        }

        if (column.key === 'arb_target_difference') {
            const domainId = row.prim_company_domain_id
            const target = Number(apiTargetByDomainId[domainId || ''])
            const arbValue = Number(row['darbTypeACumSum' as keyof Domain] || 0)
            if (!Number.isFinite(target) || !Number.isFinite(arbValue)) {
                return '--'
            }
            return Math.max(0, target - arbValue)
        }

        if (column.type === 'trend' || column.key === 'trend') {
            const trendValue = String(row[column.key as keyof Domain] || '')
                .toLowerCase()
                .trim()
            if (trendValue === 'up') return '↑'
            if (trendValue === 'down') return '↓'
            return '→'
        }

        const value = row[column.key as keyof Domain]
        if (Array.isArray(value)) return value.join(', ')
        if (typeof value === 'boolean') return String(value)
        if (value === undefined || value === null || value === '') {
            if (column.key === 'percentage') return '0.00%'
            if (column.key === aggregateColumnKey) return '--'

            const isTextColumn =
                column.key === 'domain' ||
                column.key === 'domain_nm' ||
                column.key === 'prim_company_domain_name' ||
                column.key === 'unitcio' ||
                column.type === 'user' ||
                column.type === 'apiType' ||
                column.type === 'trend' ||
                column.key === 'trend'

            return isTextColumn ? '--' : 0
        }
        if (column.key === 'percentage') {
            return `${parseFloat(String(value)).toFixed(2)}%`
        }

        return value
    }

    const hexToRgb = (hexColor: string) =>
        hexColor.replace('#', '').toUpperCase()

    const isTextOnlyColumn = (column: ColumnHeader) => {
        return (
            column.key === 'domain' ||
            column.key === 'domain_nm' ||
            column.key === 'prim_company_domain_name' ||
            column.key === 'unitcio' ||
            column.type === 'user' ||
            column.type === 'apiType'
        )
    }

    const buildStyledWorkbook = async () => {
        const { exportRows, exportColumns } = getExportRowsAndColumns()
        const xlsxModuleName = 'xlsx-js-style'
        const XLSX = await import(xlsxModuleName)
        const workbook = XLSX.utils.book_new()

        const headerRow = exportColumns.map(column => column.label)
        const dataRows = exportRows.map(row =>
            exportColumns.map(column => getExportValue(row as Domain, column))
        )
        const overallRow = exportColumns.map(column => {
            const val = getOverallCellValue(column)
            if (column.key === 'target') return `${val}`
            return val
        })
        const worksheet = XLSX.utils.aoa_to_sheet([
            headerRow,
            ...dataRows,
            overallRow
        ])

        const headerStyle = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { patternType: 'solid', fgColor: { rgb: '006FCF' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        }
        headerRow.forEach((_, columnIndex) => {
            const headerCellRef = XLSX.utils.encode_cell({
                r: 0,
                c: columnIndex
            })
            const headerCell = worksheet[headerCellRef]
            if (headerCell) {
                headerCell.s = headerStyle
            }
        })

        exportRows.forEach((row, rowIndex) => {
            exportColumns.forEach((column, columnIndex) => {
                const cellRef = XLSX.utils.encode_cell({
                    r: rowIndex + 1,
                    c: columnIndex
                })
                const cell = worksheet[cellRef]
                if (!cell) return

                // Handle trend cells first - always apply colored arrow, skip other styling
                if (column.type === 'trend' || column.key === 'trend') {
                    const trendValue = String(
                        row[column.key as keyof Domain] || ''
                    )
                        .toLowerCase()
                        .trim()
                    const trendColor = getTrendColor(trendValue)
                    cell.s = {
                        font: {
                            bold: true,
                            color: { rgb: hexToRgb(trendColor) }
                        },
                        alignment: { horizontal: 'center', vertical: 'center' }
                    }
                    return
                }

                const domainId = row.prim_company_domain_id
                const targetValue = Number(apiTargetByDomainId[domainId || ''])
                const rawValue = row[column.key as keyof Domain] || 0
                const numeratorValue =
                    typeof rawValue === 'number' ? rawValue : Number(rawValue)

                const shouldApplyHeatMap =
                    showHeatMapToggle &&
                    !!tableViewOptions.isHeatMapSelected &&
                    column.key !== 'target' &&
                    column.key !== 'arb_target_difference' &&
                    column.key !== aggregateColumnKey &&
                    column.key !== 'trend' &&
                    column.type !== 'trend' &&
                    Number.isFinite(numeratorValue) &&
                    Number.isFinite(targetValue) &&
                    targetValue > 0

                // Add tick mark when target is achieved
                const isAchievableColumn =
                    column.key === 'darbTypeACumSum' ||
                    column.key === 'darb_approved_apis' ||
                    column.key === 'opsDarb' ||
                    column.key === 'earbTypeACumSum' ||
                    column.key === 'earb_approved_apis' ||
                    column.key === 'opsEarb' ||
                    column.key === 'designTypeACumSum' ||
                    column.key === 'design_certified_apis' ||
                    column.key === 'opsDesign' ||
                    column.key === 'prod_certified_apis' ||
                    column.key === 'opsProd'
                if (
                    isBurrReportView &&
                    isAchievableColumn &&
                    Number.isFinite(targetValue) &&
                    targetValue > 0 &&
                    Number.isFinite(numeratorValue) &&
                    numeratorValue >= targetValue
                ) {
                    cell.v = `✓ ${cell.v}`
                    cell.t = 's'
                }

                const isHeatMapSelected =
                    showHeatMapToggle && !!tableViewOptions.isHeatMapSelected
                const isTargetMissingForRow =
                    isHeatMapSelected &&
                    (!Number.isFinite(targetValue) || targetValue <= 0)
                const shouldGrayOutNumericCell =
                    isTargetMissingForRow && !isTextOnlyColumn(column)
                const isPlaceholderValue = cell.v === '--'

                let cellBgColor: string | null = null
                let cellFontColor: string | null = null

                if (isPlaceholderValue) {
                    if (column.key === aggregateColumnKey) {
                        // No grey background for design quality score
                    } else if (shouldGrayOutNumericCell) {
                        cellBgColor = 'EDF2F7'
                        cellFontColor = '718096'
                    } else {
                        cellBgColor = 'A0AEC0'
                        cellFontColor = 'FFFFFF'
                    }
                } else if (column.key === aggregateColumnKey) {
                    const actualRaw = row[column.key as keyof Domain]
                    const score = parseFloat(String(actualRaw))
                    if (!isNaN(score)) {
                        cellBgColor = getScoreColor(score)
                        cellFontColor = 'FFFFFF'
                    }
                } else if (shouldGrayOutNumericCell) {
                    cellBgColor = 'EDF2F7'
                    cellFontColor = '718096'
                } else if (shouldApplyHeatMap) {
                    const heatMapPercentage =
                        (numeratorValue / targetValue) * 100
                    cellBgColor = getHeatMapColor(heatMapPercentage)
                }

                if (cellBgColor || cellFontColor) {
                    cell.s = {
                        ...(cell.s || {}),
                        ...(cellBgColor
                            ? {
                                  fill: {
                                      patternType: 'solid',
                                      fgColor: { rgb: hexToRgb(cellBgColor) }
                                  }
                              }
                            : {}),
                        ...(cellFontColor
                            ? {
                                  font: {
                                      color: { rgb: hexToRgb(cellFontColor) }
                                  }
                              }
                            : {})
                    }
                }
            })
        })

        // Style the Overall row
        const overallRowIndex = exportRows.length + 1
        const overallRowStyle = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center' }
        }
        exportColumns.forEach((column, columnIndex) => {
            const cellRef = XLSX.utils.encode_cell({
                r: overallRowIndex,
                c: columnIndex
            })
            const cell = worksheet[cellRef]
            if (!cell) return

            cell.s = { ...overallRowStyle }

            const isHeatMapColumn =
                showHeatMapToggle &&
                !!tableViewOptions.isHeatMapSelected &&
                column.key !== 'target' &&
                column.key !== 'arb_target_difference' &&
                column.key !== aggregateColumnKey &&
                column.key !== 'trend' &&
                column.type !== 'trend' &&
                column.type !== 'user' &&
                column.type !== 'apiType' &&
                column.key !== 'domain' &&
                column.key !== 'domain_nm' &&
                column.key !== 'prim_company_domain_name'

            if (isHeatMapColumn) {
                const numericValue = Number(cell.v)
                if (Number.isFinite(numericValue)) {
                    const overallTarget = (
                        shouldGroupUnitCioRows ? unitCioGroupedRows : tableData
                    ).reduce((sum, row) => {
                        const domainId = row.prim_company_domain_id
                        const target = Number(
                            apiTargetByDomainId[domainId || '']
                        )
                        return Number.isFinite(target) ? sum + target : sum
                    }, 0)
                    if (overallTarget > 0) {
                        const percentage = (numericValue / overallTarget) * 100
                        const bgColor = getHeatMapColor(percentage)
                        cell.s = {
                            ...overallRowStyle,
                            fill: {
                                patternType: 'solid',
                                fgColor: { rgb: hexToRgb(bgColor) }
                            }
                        }
                    }
                }
            }
        })

        // Apply black borders to all cells
        const thinBorder = { style: 'thin', color: { rgb: '000000' } }
        const cellBorder = {
            top: thinBorder,
            bottom: thinBorder,
            left: thinBorder,
            right: thinBorder
        }
        const wsRef = worksheet['!ref']
        if (wsRef) {
            const range = XLSX.utils.decode_range(wsRef)
            for (let r = range.s.r; r <= range.e.r; r++) {
                for (let c = range.s.c; c <= range.e.c; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r, c })
                    const cell = worksheet[cellRef]
                    if (cell) {
                        const existingFont = cell.s?.font || {}
                        cell.s = {
                            ...(cell.s || {}),
                            border: cellBorder,
                            font: { ...existingFont, name: 'Arial' }
                        }
                    }
                }
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Metrics')

        return { XLSX, workbook, worksheet, exportColumns }
    }

    const normalizeStyleHex = (hexColor?: string) => {
        if (!hexColor) return null
        const value = hexColor.replace('#', '').toUpperCase()
        if (value.length === 8) return value.slice(2)
        if (value.length === 6) return value
        return null
    }

    const getTrendColor = (trendValue: string) => {
        const normalized = trendValue.toLowerCase().trim()
        if (normalized === 'up') return '#22c55e'
        if (normalized === 'down') return '#ef4444'
        return '#eab308'
    }

    const buildTrendCircleHtml = (cellValue: string, color: string) => {
        return `<span style="font-size:20px;font-weight:bold;color:${color};">${cellValue}</span>`
    }

    const escapeHtml = (value: unknown) =>
        String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;')

    type XlsxRangeLike = {
        s: { r: number; c: number }
        e: { r: number; c: number }
    }

    type XlsxLike = {
        utils: {
            encode_cell: (address: { r: number; c: number }) => string
            decode_range: (rangeRef: string) => XlsxRangeLike
        }
    }

    type WorksheetCellLike = {
        v?: unknown
        s?: {
            fill?: { fgColor?: { rgb?: string } }
            font?: { color?: { rgb?: string } }
        }
    }

    type WorksheetLike = Record<string, WorksheetCellLike | string | undefined>

    const getWorksheetCell = (
        worksheet: WorksheetLike,
        cellRef: string
    ): WorksheetCellLike | undefined => {
        const cellValue = worksheet[cellRef]
        if (typeof cellValue === 'object' && cellValue !== null) {
            return cellValue as WorksheetCellLike
        }
        return undefined
    }

    const worksheetToHtml = (
        XLSX: XlsxLike,
        worksheet: WorksheetLike,
        columnCount: number,
        exportRows: Domain[],
        exportColumns: ColumnHeader[]
    ) => {
        const wsRef = worksheet['!ref']
        const ref =
            typeof wsRef === 'string'
                ? wsRef
                : `A1:${XLSX.utils.encode_cell({ r: 0, c: columnCount - 1 })}`
        const range = XLSX.utils.decode_range(ref)
        const headerStyle =
            'background-color:#006FCF;color:#ffffff;font-weight:bold;text-align:center;padding:6px 10px;border:1px solid #ccc;'
        const dataBaseStyle =
            'padding:6px 10px;border:1px solid #ccc;text-align:center;vertical-align:middle;'

        let html =
            '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:11px;">'

        html += '<thead><tr>'
        for (let c = 0; c <= range.e.c; c++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c })
            const cell = getWorksheetCell(worksheet, cellRef)
            html += `<th style="${headerStyle}">${escapeHtml(cell?.v ?? '')}</th>`
        }
        html += '</tr></thead><tbody>'

        for (let r = 1; r <= range.e.r; r++) {
            html += '<tr>'
            for (let c = 0; c <= range.e.c; c++) {
                const cellRef = XLSX.utils.encode_cell({ r, c })
                const cell = getWorksheetCell(worksheet, cellRef)
                const style = cell?.s || {}
                const bgHex = normalizeStyleHex(style?.fill?.fgColor?.rgb)
                const fgHex = normalizeStyleHex(style?.font?.color?.rgb)
                const row = exportRows[r - 1]
                const column = exportColumns[c]

                if (column?.key === aggregateColumnKey) {
                    const actualRaw = row?.[
                        column.key as keyof Domain
                    ] as unknown
                    const score = parseFloat(String(actualRaw))
                    const badgeLabel = escapeHtml(cell?.v ?? '--')
                    if (isNaN(score)) {
                        html += `<td style="${dataBaseStyle}">${badgeLabel}</td>`
                        continue
                    }

                    const badgeColor = getScoreColor(score)
                    const badgeHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:auto;border-collapse:separate;"><tr><td bgcolor="${badgeColor}" style="background-color:${badgeColor};color:#ffffff;font-weight:600;text-align:center;vertical-align:middle;width:35px;height:35px;border-radius:8px;mso-padding-alt:0;">${badgeLabel}</td></tr></table>`
                    html += `<td style="${dataBaseStyle}">${badgeHtml}</td>`
                    continue
                }

                if (column?.type === 'trend' || column?.key === 'trend') {
                    const cellVal = String(cell?.v ?? '→')
                    const trendRaw = row
                        ? String(row[column.key as keyof Domain] || '')
                        : ''
                    const color = getTrendColor(trendRaw || cellVal)
                    const circleHtml = buildTrendCircleHtml(cellVal, color)
                    html += `<td style="${dataBaseStyle}">${circleHtml}</td>`
                    continue
                }

                const extraStyle = `${bgHex ? `background-color:#${bgHex};` : ''}${fgHex ? `color:#${fgHex};` : ''}`
                html += `<td style="${dataBaseStyle}${extraStyle}">${escapeHtml(cell?.v ?? '')}</td>`
            }
            html += '</tr>'
        }

        html += '</tbody></table>'
        return html
    }

    const buildClipboardHtmlDocument = (fragmentHtml: string) => {
        const startFragment = '<!--StartFragment-->'
        const endFragment = '<!--EndFragment-->'
        return `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>${startFragment}${fragmentHtml}${endFragment}</body></html>`
    }

    const copyHtmlToClipboard = async (
        html: string,
        plainText: string,
        fallbackHtml: string
    ) => {
        const copyWithSelection = () => {
            const container = document.createElement('div')
            container.innerHTML = fallbackHtml
            container.style.position = 'fixed'
            container.style.left = '-9999px'
            container.style.top = '0'
            container.contentEditable = 'true'
            document.body.appendChild(container)

            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(container)
            selection?.removeAllRanges()
            selection?.addRange(range)
            const copied = document.execCommand('copy')
            selection?.removeAllRanges()
            document.body.removeChild(container)
            return copied
        }

        if (
            navigator.clipboard &&
            'write' in navigator.clipboard &&
            typeof ClipboardItem !== 'undefined'
        ) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([html], { type: 'text/html' }),
                        'text/plain': new Blob([plainText], {
                            type: 'text/plain'
                        })
                    })
                ])
                return
            } catch {
                // Fallback to selection-based copy if the Clipboard API fails (e.g., due to permissions)
            }
        }

        copyWithSelection()
    }

    const handleDownload = async () => {
        const { exportRows } = getExportRowsAndColumns()
        if (!exportRows?.length) return

        const { XLSX, workbook } = await buildStyledWorkbook()

        const now = new Date()
        const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        const fileName = `metrics-${selectedGroup || 'all'}-${dateStamp}.xlsx`
        XLSX.writeFile(workbook, fileName)
    }

    const handleCopyScript = async () => {
        const { exportRows } = getExportRowsAndColumns()
        if (!exportRows?.length) return

        const { XLSX, worksheet, exportColumns } = await buildStyledWorkbook()
        const copiedText = XLSX.utils.sheet_to_csv(worksheet, {
            FS: '\t',
            RS: '\n'
        })
        const fragmentHtml = worksheetToHtml(
            XLSX,
            worksheet,
            exportColumns.length,
            exportRows,
            exportColumns
        )
        const clipboardHtml = buildClipboardHtmlDocument(fragmentHtml)

        await copyHtmlToClipboard(clipboardHtml, copiedText, fragmentHtml)
    }

    const getBurrReportColor = (value: number, target: number) => {
        if (!Number.isFinite(target) || target <= 0) return null
        const percentage = (value / target) * 100
        if (percentage >= 100)
            return { bg: '#22c55e', font: '#FFFFFF', achieved: true }
        if (percentage > 50)
            return { bg: '#22c55e', font: '#FFFFFF', achieved: false }
        if (percentage > 0)
            return { bg: '#eab308', font: '#000000', achieved: false }
        return { bg: '#ef4444', font: '#FFFFFF', achieved: false }
    }

    const buildBurrReportWorkbook = async () => {
        const { exportRows, exportColumns } = getExportRowsAndColumns()
        const xlsxModuleName = 'xlsx-js-style'
        const XLSX = await import(xlsxModuleName)
        const workbook = XLSX.utils.book_new()

        const headerRow = exportColumns.map(column => column.label)
        const dataRows = exportRows.map(row =>
            exportColumns.map(column => getExportValue(row as Domain, column))
        )
        const overallRow = exportColumns.map(column => {
            const val = getOverallCellValue(column)
            if (column.key === 'target') return `~${val}`
            return val
        })
        const worksheet = XLSX.utils.aoa_to_sheet([
            headerRow,
            ...dataRows,
            overallRow
        ])

        const headerStyle = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { patternType: 'solid', fgColor: { rgb: '006FCF' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        }
        headerRow.forEach((_, columnIndex) => {
            const headerCellRef = XLSX.utils.encode_cell({
                r: 0,
                c: columnIndex
            })
            const headerCell = worksheet[headerCellRef]
            if (headerCell) {
                headerCell.s = headerStyle
            }
        })

        exportRows.forEach((row, rowIndex) => {
            exportColumns.forEach((column, columnIndex) => {
                const cellRef = XLSX.utils.encode_cell({
                    r: rowIndex + 1,
                    c: columnIndex
                })
                const cell = worksheet[cellRef]
                if (!cell) return

                const domainId = row.prim_company_domain_id
                const targetValue = Number(apiTargetByDomainId[domainId || ''])
                const rawValue = row[column.key as keyof Domain] || 0
                const numeratorValue =
                    typeof rawValue === 'number' ? rawValue : Number(rawValue)

                const shouldApplyColor =
                    column.key !== 'target' &&
                    column.key !== 'arb_target_difference' &&
                    column.key !== aggregateColumnKey &&
                    column.key !== 'trend' &&
                    column.type !== 'trend' &&
                    !isTextOnlyColumn(column) &&
                    Number.isFinite(numeratorValue) &&
                    Number.isFinite(targetValue) &&
                    targetValue > 0

                if (column.key === aggregateColumnKey) {
                    const actualRaw = row[column.key as keyof Domain]
                    const score = parseFloat(String(actualRaw))
                    if (!isNaN(score)) {
                        cell.v = `${Math.round(score)}%`
                        cell.t = 's'
                        let scoreBg = '#ef4444'
                        let scoreFg = 'FFFFFF'
                        if (score >= 50) {
                            scoreBg = '#22c55e'
                            scoreFg = 'FFFFFF'
                        } else if (score > 0) {
                            scoreBg = '#eab308'
                            scoreFg = '000000'
                        }
                        cell.s = {
                            fill: {
                                patternType: 'solid',
                                fgColor: { rgb: hexToRgb(scoreBg) }
                            },
                            font: { name: 'Arial', color: { rgb: scoreFg } }
                        }
                    }
                } else if (column.type === 'trend' || column.key === 'trend') {
                    const trendValue = String(
                        row[column.key as keyof Domain] || ''
                    )
                        .toLowerCase()
                        .trim()
                    let trendColor = 'DAA520'
                    if (trendValue === 'up') trendColor = '22C55E'
                    else if (trendValue === 'down') trendColor = 'EF4444'
                    cell.s = {
                        font: { bold: true, color: { rgb: trendColor } },
                        alignment: { horizontal: 'center', vertical: 'center' }
                    }
                } else if (shouldApplyColor) {
                    const colorInfo = getBurrReportColor(
                        numeratorValue,
                        targetValue
                    )
                    if (colorInfo) {
                        if (colorInfo.achieved) {
                            cell.v = `✓ ${cell.v}`
                            cell.t = 's'
                        }
                        cell.s = {
                            fill: {
                                patternType: 'solid',
                                fgColor: { rgb: hexToRgb(colorInfo.bg) }
                            },
                            font: { color: { rgb: hexToRgb(colorInfo.font) } }
                        }
                    }
                }
            })
        })

        // Style the Overall row for BURR report
        const overallRowIndex = exportRows.length + 1
        const overallRowStyle = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center' }
        }
        exportColumns.forEach((column, columnIndex) => {
            const cellRef = XLSX.utils.encode_cell({
                r: overallRowIndex,
                c: columnIndex
            })
            const cell = worksheet[cellRef]
            if (!cell) return

            cell.s = { ...overallRowStyle }

            const isColorableColumn =
                column.key !== 'target' &&
                column.key !== 'arb_target_difference' &&
                column.key !== aggregateColumnKey &&
                column.key !== 'trend' &&
                column.type !== 'trend' &&
                column.type !== 'user' &&
                column.type !== 'apiType' &&
                column.key !== 'domain' &&
                column.key !== 'domain_nm' &&
                column.key !== 'prim_company_domain_name'

            if (isColorableColumn) {
                const numericValue = Number(cell.v)
                if (Number.isFinite(numericValue)) {
                    const overallTarget = (
                        shouldGroupUnitCioRows ? unitCioGroupedRows : tableData
                    ).reduce((sum, row) => {
                        const domainId = row.prim_company_domain_id
                        const target = Number(
                            apiTargetByDomainId[domainId || '']
                        )
                        return Number.isFinite(target) ? sum + target : sum
                    }, 0)
                    if (overallTarget > 0) {
                        const colorInfo = getBurrReportColor(
                            numericValue,
                            overallTarget
                        )
                        if (colorInfo) {
                            cell.s = {
                                ...overallRowStyle,
                                fill: {
                                    patternType: 'solid',
                                    fgColor: { rgb: hexToRgb(colorInfo.bg) }
                                },
                                font: {
                                    bold: true,
                                    color: { rgb: hexToRgb(colorInfo.font) }
                                }
                            }
                        }
                    }
                }
            }
        })

        // Apply black borders to all cells
        const thinBorder = { style: 'thin', color: { rgb: '000000' } }
        const cellBorder = {
            top: thinBorder,
            bottom: thinBorder,
            left: thinBorder,
            right: thinBorder
        }
        const wsRef = worksheet['!ref']
        if (wsRef) {
            const range = XLSX.utils.decode_range(wsRef)
            for (let r = range.s.r; r <= range.e.r; r++) {
                for (let c = range.s.c; c <= range.e.c; c++) {
                    const cellRef = XLSX.utils.encode_cell({ r, c })
                    const cell = worksheet[cellRef]
                    if (cell) {
                        const existingFont = cell.s?.font || {}
                        cell.s = {
                            ...(cell.s || {}),
                            border: cellBorder,
                            font: { ...existingFont, name: 'Arial' }
                        }
                    }
                }
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'BURR Report')
        return { XLSX, workbook, worksheet, exportColumns, exportRows }
    }

    const burrReportWorksheetToHtml = (
        XLSX: XlsxLike,
        worksheet: WorksheetLike,
        columnCount: number,
        exportRows: Domain[],
        exportColumns: ColumnHeader[]
    ) => {
        const wsRef = worksheet['!ref']
        const ref =
            typeof wsRef === 'string'
                ? wsRef
                : `A1:${XLSX.utils.encode_cell({ r: 0, c: columnCount - 1 })}`
        const range = XLSX.utils.decode_range(ref)
        const headerStyle =
            'background-color:#006FCF;color:#ffffff;font-weight:bold;text-align:center;padding:6px 10px;border:1px solid #ccc;'
        const dataBaseStyle =
            'padding:6px 10px;border:1px solid #ccc;text-align:center;vertical-align:middle;'

        let html =
            '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:11px;">'

        html += '<thead><tr>'
        for (let c = 0; c <= range.e.c; c++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c })
            const cell = getWorksheetCell(worksheet, cellRef)
            html += `<th style="${headerStyle}">${escapeHtml(cell?.v ?? '')}</th>`
        }
        html += '</tr></thead><tbody>'

        for (let r = 1; r <= range.e.r; r++) {
            html += '<tr>'
            for (let c = 0; c <= range.e.c; c++) {
                const cellRef = XLSX.utils.encode_cell({ r, c })
                const cell = getWorksheetCell(worksheet, cellRef)
                const style = cell?.s || {}
                const bgHex = normalizeStyleHex(style?.fill?.fgColor?.rgb)
                const fgHex = normalizeStyleHex(style?.font?.color?.rgb)
                const row = exportRows[r - 1]
                const column = exportColumns[c]

                if (column?.key === aggregateColumnKey) {
                    const actualRaw = row?.[
                        column.key as keyof Domain
                    ] as unknown
                    const score = parseFloat(String(actualRaw))
                    const cellVal = escapeHtml(cell?.v ?? '--')
                    if (isNaN(score)) {
                        html += `<td style="${dataBaseStyle}">${cellVal}</td>`
                        continue
                    }
                    let scoreBg = '#ef4444'
                    let scoreFg = '#ffffff'
                    if (score >= 50) {
                        scoreBg = '#22c55e'
                        scoreFg = '#ffffff'
                    } else if (score > 0) {
                        scoreBg = '#eab308'
                        scoreFg = '#000000'
                    }
                    html += `<td style="${dataBaseStyle}background-color:${scoreBg};color:${scoreFg};font-weight:600;">${cellVal}</td>`
                    continue
                }

                if (column?.type === 'trend' || column?.key === 'trend') {
                    const cellVal = String(cell?.v ?? '→')
                    const trendRaw = row
                        ? String(row[column.key as keyof Domain] || '')
                        : ''
                    const color = getTrendColor(trendRaw || cellVal)
                    const circleHtml = buildTrendCircleHtml(cellVal, color)
                    html += `<td style="${dataBaseStyle}">${circleHtml}</td>`
                    continue
                }

                const extraStyle = `${bgHex ? `background-color:#${bgHex};` : ''}${fgHex ? `color:#${fgHex};` : ''}`
                html += `<td style="${dataBaseStyle}${extraStyle}">${escapeHtml(cell?.v ?? '')}</td>`
            }
            html += '</tr>'
        }

        html += '</tbody></table>'
        return html
    }

    const handleDownloadBurrReport = async () => {
        const { exportRows } = getExportRowsAndColumns()
        if (!exportRows?.length) return

        const { XLSX, workbook } = await buildBurrReportWorkbook()

        const now = new Date()
        const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        const fileName = `burr-report-${selectedGroup || 'all'}-${dateStamp}.xlsx`
        XLSX.writeFile(workbook, fileName)
    }

    const handleCopyBurrReport = async () => {
        const { exportRows } = getExportRowsAndColumns()
        if (!exportRows?.length) return

        const { XLSX, worksheet, exportColumns } =
            await buildBurrReportWorkbook()
        const copiedText = XLSX.utils.sheet_to_csv(worksheet, {
            FS: '\t',
            RS: '\n'
        })
        const fragmentHtml = burrReportWorksheetToHtml(
            XLSX,
            worksheet,
            exportColumns.length,
            exportRows,
            exportColumns
        )
        const clipboardHtml = buildClipboardHtmlDocument(fragmentHtml)

        await copyHtmlToClipboard(clipboardHtml, copiedText, fragmentHtml)
    }

    const getOverallCellValue = (column: ColumnHeader) => {
        const { key, type } = column

        if (
            key === 'domain' ||
            key === 'domain_nm' ||
            key === 'prim_company_domain_name'
        ) {
            return 'Total'
        }

        if (
            type === 'user' ||
            type === 'apiType' ||
            type === 'trend' ||
            key === aggregateColumnKey
        ) {
            return ''
        }

        const dataRows = shouldGroupUnitCioRows ? unitCioGroupedRows : tableData

        if (key === 'target') {
            return dataRows.reduce((sum, row) => {
                const domainId = row.prim_company_domain_id
                const targetValue = Number(apiTargetByDomainId[domainId || ''])
                return Number.isFinite(targetValue) ? sum + targetValue : sum
            }, 0)
        }

        if (key === 'arb_target_difference') {
            return dataRows.reduce((sum, row) => {
                const domainId = row.prim_company_domain_id
                const targetValue = Number(apiTargetByDomainId[domainId || ''])
                const arbValue = Number(
                    row['darbTypeACumSum' as keyof Domain] || 0
                )
                if (
                    !Number.isFinite(targetValue) ||
                    !Number.isFinite(arbValue)
                ) {
                    return sum
                }
                return sum + Math.max(0, targetValue - arbValue)
            }, 0)
        }

        return dataRows.reduce((sum, row) => {
            const value = Number(row[key as keyof Domain])
            return Number.isFinite(value) ? sum + value : sum
        }, 0)
    }

    return (
        <Box
            className={'platform-card-width'}
            position='flex'
            bottom={{ base: '50px', sm: '0' }}
            justifyContent='center'
            alignItems='center'
        >
            {view === 'metric2' &&
                selectedGroup &&
                tableViewOptions.view === 'listView' && (
                    <HStack gap={2} mb='3rem' id='view-metrics-for'>
                        <Text as='span' fontSize='sm'>
                            View metrics for:{' '}
                        </Text>
                        <Button
                            size={{ base: 'sm', md: 'md' }}
                            variant='outline'
                            onClick={() => handleApiOperationFilter('apis')}
                            className={
                                tableViewOptions.showApiOperation?.includes(
                                    'apis'
                                )
                                    ? metricStyles.directoryTabsActive
                                    : metricStyles.directoryTabsInactive
                            }
                        >
                            APIs
                        </Button>
                        <Button
                            size={{ base: 'sm', md: 'md' }}
                            variant='outline'
                            onClick={() =>
                                handleApiOperationFilter('operations')
                            }
                            className={
                                tableViewOptions.showApiOperation?.includes(
                                    'operations'
                                )
                                    ? metricStyles.directoryTabsActive
                                    : metricStyles.directoryTabsInactive
                            }
                        >
                            Operations
                        </Button>
                        {showHeatMapToggle && (
                            // Show a checkbox to select heatmap view when in list view
                            <>
                                <Separator
                                    orientation='vertical'
                                    height='2rem'
                                    color='black'
                                    bg='black'
                                    border='1px solid gray'
                                />
                                <Tooltip showArrow content='Heatmap View'>
                                    <Switch.Root
                                        pl={2}
                                        checked={
                                            tableViewOptions.isHeatMapSelected
                                        }
                                        onCheckedChange={e =>
                                            handleHeatMapViewChange(e.checked)
                                        }
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control
                                            bg='#8E9092'
                                            _checked={{
                                                bg: '#2B6CB0',
                                                borderColor: '#2B6CB0'
                                            }}
                                        >
                                            <Switch.Thumb color='#2B6CB0' />
                                            <Switch.Indicator color='#2B6CB0' />
                                        </Switch.Control>
                                        <Switch.Label>
                                            Show Heatmap
                                        </Switch.Label>
                                    </Switch.Root>
                                </Tooltip>
                            </>
                        )}
                        {isUnitCioHeatMap && (
                            <Tooltip
                                showArrow
                                content='Toggle view to show company domain owners in the heatmap'
                            >
                                <Switch.Root
                                    pl={2}
                                    checked={showDomainOwners}
                                    onCheckedChange={e =>
                                        setShowDomainOwners(e.checked)
                                    }
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control
                                        bg='#8E9092'
                                        _checked={{
                                            bg: '#2B6CB0',
                                            borderColor: '#2B6CB0'
                                        }}
                                    >
                                        <Switch.Thumb color='#2B6CB0' />
                                        <Switch.Indicator color='#2B6CB0' />
                                    </Switch.Control>
                                    <Switch.Label>
                                        Show Company Domain Leaders
                                    </Switch.Label>
                                </Switch.Root>
                            </Tooltip>
                        )}
                        {showHeatMap && (
                            <Tooltip
                                showArrow
                                content='Toggle between current heatmap and BUR report table'
                            >
                                <Switch.Root
                                    pl={2}
                                    checked={showBurrReport}
                                    onCheckedChange={e =>
                                        setParams({ burrReport: e.checked })
                                    }
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control
                                        bg='#8E9092'
                                        _checked={{
                                            bg: '#2B6CB0',
                                            borderColor: '#2B6CB0'
                                        }}
                                    >
                                        <Switch.Thumb color='#2B6CB0' />
                                        <Switch.Indicator color='#2B6CB0' />
                                    </Switch.Control>
                                    <Switch.Label>Show BUR Report</Switch.Label>
                                </Switch.Root>
                            </Tooltip>
                        )}
                        {showHeatMap && (
                            <Button
                                size={{ base: 'sm', md: 'md' }}
                                variant='outline'
                                className={metricStyles.directoryTabsInactive}
                                disabled={
                                    (shouldGroupUnitCioRows
                                        ? unitCioGroupedRows.length
                                        : tableData.length) === 0
                                }
                                onClick={() => {
                                    if (showBurrReport) {
                                        handleDownloadBurrReport()
                                        return
                                    }
                                    handleDownload()
                                }}
                            >
                                Download Heatmap
                            </Button>
                        )}
                        {showHeatMap && (
                            <Button
                                size={{ base: 'sm', md: 'md' }}
                                variant='outline'
                                className={metricStyles.directoryTabsInactive}
                                disabled={
                                    (shouldGroupUnitCioRows
                                        ? unitCioGroupedRows.length
                                        : tableData.length) === 0
                                }
                                onClick={() => {
                                    if (showBurrReport) {
                                        handleCopyBurrReport()
                                        return
                                    }
                                    handleCopyScript()
                                }}
                            >
                                Copy Heatmap
                            </Button>
                        )}
                    </HStack>
                )}
            {view === 'metric2' &&
                (selectedGroup === 'domain' || selectedGroup === 'unitCIO') && (
                    <TableViewOptions
                        domainCategories={
                            selectedGroup === 'domain' ? domainCategories : []
                        }
                        showFilters={selectedGroup === 'domain'}
                        showViewToggle={selectedGroup === 'domain'}
                        tableViewOptions={tableViewOptions}
                        handleTableViewChange={handleTableViewChange}
                        handleCardExpandAll={handleCardExpandAll}
                        handleFilterChange={handleTableViewFilterChange}
                        companyDomains={companyDomains}
                        handleHeatMapViewChange={handleHeatMapViewChange}
                        isHeatMapView={showHeatMapToggle}
                    />
                )}
            <Box
                width={'100%'}
                overflowX={shouldGroupUnitCioRows ? 'auto' : 'visible'}
                position={shouldGroupUnitCioRows ? 'relative' : undefined}
            >
                {view === 'metric2' &&
                selectedGroup === 'domain' &&
                tableViewOptions.view === 'cardView' ? (
                    <MetricsDomainCardView
                        groupedData={groupedData}
                        tableViewOptions={tableViewOptions}
                        domainCategories={domainCategories}
                        companyDomains={companyDomains}
                    />
                ) : (
                    <>
                        <Table.Root
                            className={`excludeExpand ${metricStyles.metricsListView} ${metricStyles.metricsTable} ${isUnitCioHeatMap ? metricStyles.unitCioHeatMapScrollable : ''} ${view === 'metric2' && selectedGroup ? (showHeatMapToggle && tableViewOptions.isHeatMapSelected ? metricStyles.heatMapView : metricStyles.noBorderSpacing) : ''}`}
                            backgroundColor='transparent'
                            padding={0}
                            border={0}
                            variant='outline'
                            display={'block'}
                            boxShadow='none'
                            id='metrics-table'
                        >
                            <Table.Header
                                backgroundColor={
                                    'var(--domains-subheading-color)'
                                }
                            >
                                <Table.Row>
                                    {resolvedColumns.map((column, index) => {
                                        return (
                                            <TableHeaderRow
                                                column={column as ColumnHeader}
                                                index={index}
                                                key={index}
                                            />
                                        )
                                    })}
                                </Table.Row>
                                {isNestedTable && (
                                    <Table.Row>
                                        {level2Columns.map((column, index) => {
                                            return (
                                                <TableHeaderRow
                                                    column={
                                                        column as ColumnHeader
                                                    }
                                                    index={index}
                                                    key={index}
                                                />
                                            )
                                        })}
                                    </Table.Row>
                                )}
                            </Table.Header>
                            <Table.Body backgroundColor='transparent'>
                                {shouldGroupUnitCioRows
                                    ? unitCioGroupedRows.map((row, index) => (
                                          <Table.Row
                                              className={
                                                  metricStyles.metricsListView__item
                                              }
                                              height={
                                                  !showHeatMap ? '64px' : 'auto'
                                              }
                                              key={index}
                                          >
                                              {resolvedColumns?.map(
                                                  (column, colIndex) => {
                                                      const currentColumn =
                                                          column as ColumnHeader & {
                                                              child?: ColumnHeader[]
                                                          }
                                                      if (
                                                          currentColumn.key ===
                                                          'unitcio'
                                                      ) {
                                                          if (
                                                              !row.isFirstInGroup
                                                          )
                                                              return null
                                                          return (
                                                              <Table.Cell
                                                                  key={colIndex}
                                                                  rowSpan={
                                                                      row.rowSpan
                                                                  }
                                                                  textAlign='center'
                                                                  verticalAlign='middle'
                                                                  bg='white'
                                                                  _dark={{
                                                                      bg: '#333333'
                                                                  }}
                                                                  className={`${metricStyles.metricsListView__itemTd} ${metricStyles.stickyUnitCioCol}`}
                                                              >
                                                                  <Flex
                                                                      justifyContent='center'
                                                                      alignItems='center'
                                                                  >
                                                                      {columnRender(
                                                                          currentColumn as ColumnHeader,
                                                                          row as unknown as {
                                                                              [
                                                                                  key: string
                                                                              ]: string
                                                                          }
                                                                      )}
                                                                  </Flex>
                                                              </Table.Cell>
                                                          )
                                                      }
                                                      if (
                                                          Array.isArray(
                                                              currentColumn.child
                                                          ) &&
                                                          currentColumn.child
                                                              .length > 0
                                                      ) {
                                                          return currentColumn.child.map(
                                                              (
                                                                  childCol,
                                                                  childIdx
                                                              ) => (
                                                                  <TableBodyRow
                                                                      column={
                                                                          childCol as ColumnHeader
                                                                      }
                                                                      row={
                                                                          row as unknown as Domain
                                                                      }
                                                                      key={`grouped-row-${index}-${colIndex}-${childIdx}`}
                                                                  />
                                                              )
                                                          )
                                                      }
                                                      return (
                                                          <TableBodyRow
                                                              column={
                                                                  currentColumn as ColumnHeader
                                                              }
                                                              row={
                                                                  row as unknown as Domain
                                                              }
                                                              key={colIndex}
                                                          />
                                                      )
                                                  }
                                              )}
                                          </Table.Row>
                                      ))
                                    : tableData?.map((row, index) => {
                                          return (
                                              <Table.Row
                                                  className={
                                                      metricStyles.metricsListView__item
                                                  }
                                                  height={
                                                      !showHeatMap
                                                          ? '64px'
                                                          : 'auto'
                                                  }
                                                  key={index}
                                              >
                                                  {resolvedColumns?.map(
                                                      (column, colIndex) => (
                                                          <React.Fragment
                                                              key={colIndex}
                                                          >
                                                              {'child' in
                                                                  column &&
                                                              column.child &&
                                                              Array.isArray(
                                                                  column.child
                                                              ) &&
                                                              column.child
                                                                  .length >
                                                                  0 ? (
                                                                  column.child.map(
                                                                      (
                                                                          childCol,
                                                                          childIdx
                                                                      ) => (
                                                                          <TableBodyRow
                                                                              column={
                                                                                  childCol as ColumnHeader
                                                                              }
                                                                              row={
                                                                                  row
                                                                              }
                                                                              key={`row-${colIndex}-${childIdx}`}
                                                                          />
                                                                      )
                                                                  )
                                                              ) : (
                                                                  <TableBodyRow
                                                                      column={
                                                                          column as ColumnHeader
                                                                      }
                                                                      row={row}
                                                                      key={
                                                                          index
                                                                      }
                                                                  />
                                                              )}
                                                          </React.Fragment>
                                                      )
                                                  )}
                                              </Table.Row>
                                          )
                                      })}
                                {/* the roll-up only means anything for the grouped
                                    Type-A/B view — every other tab is a flat list */}
                                {view === 'metric2' &&
                                    selectedGroup !== '' &&
                                    (shouldGroupUnitCioRows
                                        ? unitCioGroupedRows.length > 0
                                        : tableData.length > 0) && (
                                        <Table.Row
                                            bg='#F7FAFC'
                                            borderTop='2px solid #A0AEC0'
                                            borderBottom='2px solid #A0AEC0'
                                        >
                                            {resolvedColumns
                                                .flatMap(column => {
                                                    const childColumns = (
                                                        column as ColumnHeader & {
                                                            child?: ColumnHeader[]
                                                        }
                                                    ).child
                                                    return Array.isArray(
                                                        childColumns
                                                    ) && childColumns.length > 0
                                                        ? childColumns
                                                        : [
                                                              column as ColumnHeader
                                                          ]
                                                })
                                                .map((column, colIndex) => {
                                                    const col =
                                                        column as ColumnHeader
                                                    const cellValue =
                                                        getOverallCellValue(col)

                                                    const shouldApplyHeatmapToOverall =
                                                        showHeatMap &&
                                                        !isBurrReportView &&
                                                        col.key !==
                                                            'unit_cio_users' &&
                                                        col.key !== 'target' &&
                                                        col.key !==
                                                            'arb_target_difference' &&
                                                        col.key !==
                                                            aggregateColumnKey &&
                                                        col.key !== 'trend' &&
                                                        col.type !== 'trend' &&
                                                        col.type !== 'user' &&
                                                        col.type !==
                                                            'apiType' &&
                                                        col.key !== 'domain' &&
                                                        col.key !==
                                                            'domain_nm' &&
                                                        col.key !==
                                                            'prim_company_domain_name'

                                                    const shouldApplyBurrColorToOverall =
                                                        showHeatMap &&
                                                        isBurrReportView &&
                                                        col.key !==
                                                            'unit_cio_users' &&
                                                        col.key !== 'target' &&
                                                        col.key !==
                                                            'arb_target_difference' &&
                                                        col.key !==
                                                            aggregateColumnKey &&
                                                        col.key !== 'trend' &&
                                                        col.type !== 'trend' &&
                                                        col.type !== 'user' &&
                                                        col.type !==
                                                            'apiType' &&
                                                        col.key !== 'domain' &&
                                                        col.key !==
                                                            'domain_nm' &&
                                                        col.key !==
                                                            'prim_company_domain_name'

                                                    let cellBg = '#F7FAFC'
                                                    let cellFontColor:
                                                        | string
                                                        | undefined

                                                    if (
                                                        shouldApplyHeatmapToOverall &&
                                                        cellValue !== '' &&
                                                        cellValue !== 'Total'
                                                    ) {
                                                        const numericValue =
                                                            Number(cellValue)
                                                        if (
                                                            Number.isFinite(
                                                                numericValue
                                                            )
                                                        ) {
                                                            const overallTarget =
                                                                (
                                                                    shouldGroupUnitCioRows
                                                                        ? unitCioGroupedRows
                                                                        : tableData
                                                                ).reduce(
                                                                    (
                                                                        sum,
                                                                        row
                                                                    ) => {
                                                                        const domainId =
                                                                            row.prim_company_domain_id
                                                                        const target =
                                                                            Number(
                                                                                apiTargetByDomainId[
                                                                                    domainId ||
                                                                                        ''
                                                                                ]
                                                                            )
                                                                        return Number.isFinite(
                                                                            target
                                                                        )
                                                                            ? sum +
                                                                                  target
                                                                            : sum
                                                                    },
                                                                    0
                                                                )

                                                            if (
                                                                overallTarget >
                                                                0
                                                            ) {
                                                                const percentage =
                                                                    (numericValue /
                                                                        overallTarget) *
                                                                    100
                                                                cellBg =
                                                                    getHeatMapColor(
                                                                        percentage
                                                                    ) ||
                                                                    '#F7FAFC'
                                                            }
                                                        }
                                                    }
                                                    if (
                                                        shouldApplyBurrColorToOverall &&
                                                        cellValue !== '' &&
                                                        cellValue !== 'Total'
                                                    ) {
                                                        const numericValue =
                                                            Number(cellValue)
                                                        if (
                                                            Number.isFinite(
                                                                numericValue
                                                            )
                                                        ) {
                                                            const overallTarget =
                                                                (
                                                                    shouldGroupUnitCioRows
                                                                        ? unitCioGroupedRows
                                                                        : tableData
                                                                ).reduce(
                                                                    (
                                                                        sum,
                                                                        row
                                                                    ) => {
                                                                        const domainId =
                                                                            row.prim_company_domain_id
                                                                        const target =
                                                                            Number(
                                                                                apiTargetByDomainId[
                                                                                    domainId ||
                                                                                        ''
                                                                                ]
                                                                            )
                                                                        return Number.isFinite(
                                                                            target
                                                                        )
                                                                            ? sum +
                                                                                  target
                                                                            : sum
                                                                    },
                                                                    0
                                                                )

                                                            if (
                                                                overallTarget >
                                                                0
                                                            ) {
                                                                const burrInfo =
                                                                    getBurrReportColor(
                                                                        numericValue,
                                                                        overallTarget
                                                                    )
                                                                if (burrInfo) {
                                                                    cellBg =
                                                                        burrInfo.bg
                                                                    cellFontColor =
                                                                        burrInfo.font
                                                                }
                                                            }
                                                        }
                                                    }

                                                    return (
                                                        <Table.Cell
                                                            key={colIndex}
                                                            textAlign={
                                                                selectedGroup !==
                                                                ''
                                                                    ? 'center'
                                                                    : 'left'
                                                            }
                                                            verticalAlign={
                                                                selectedGroup !==
                                                                ''
                                                                    ? 'middle'
                                                                    : 'top'
                                                            }
                                                            bg={cellBg}
                                                            color={
                                                                cellFontColor
                                                            }
                                                            fontWeight='700'
                                                            borderTop='2px solid #A0AEC0'
                                                            borderBottom='2px solid #A0AEC0'
                                                            className={`${metricStyles.metricsListView__itemTd}`}
                                                        >
                                                            <Text>
                                                                {col.key ===
                                                                'target'
                                                                    ? `${cellValue}`
                                                                    : cellValue}
                                                            </Text>
                                                        </Table.Cell>
                                                    )
                                                })}
                                        </Table.Row>
                                    )}
                            </Table.Body>
                        </Table.Root>
                        {totalItems > 10 && (
                            <Pagination.Root
                                count={totalItems}
                                pageSize={10}
                                defaultPage={1}
                                page={tableParams.page}
                                onPageChange={handlePageChange}
                                aria-label='Pagination Navigation'
                                marginTop='1rem'
                                justifyContent='center'
                                display='flex'
                            >
                                <ButtonGroup variant='outline' size='sm'>
                                    <Pagination.PrevTrigger asChild>
                                        <IconButton>
                                            <IconChevronLeft />
                                        </IconButton>
                                    </Pagination.PrevTrigger>

                                    <Pagination.Items
                                        render={page => (
                                            <IconButton
                                                variant={{
                                                    base: 'outline',
                                                    _selected: 'solid'
                                                }}
                                            >
                                                {page.value}
                                            </IconButton>
                                        )}
                                    />

                                    <Pagination.NextTrigger asChild>
                                        <IconButton>
                                            <IconChevronRight />
                                        </IconButton>
                                    </Pagination.NextTrigger>
                                </ButtonGroup>
                            </Pagination.Root>
                        )}
                    </>
                )}
            </Box>
        </Box>
    )
}
