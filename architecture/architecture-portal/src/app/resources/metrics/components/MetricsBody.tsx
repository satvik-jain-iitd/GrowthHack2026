/* istanbul ignore file */
'use client'
import {
    Box,
    Button,
    HStack,
    Skeleton,
    StackSeparator,
    VStack
} from '@chakra-ui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { API_ENDPOINTS } from '@/constants'
import metricStyles from '../metrics.module.css'
import {
    EtpEcmiCrossDomainApiRow,
    EtpEcmiCrossDomainSummary,
    EtpEcmiUnitCioGroupRow,
    MetricsApiCount
} from '../types'
import MetricsDashboard from './MetricsDashboard'
import MetricsTable from './MetricsTable'
import CrossDomainApiTable from './CrossDomainApiTable'
import CrossDomainFilterBar from './CrossDomainFilterBar'
import { useDomainContext } from '@/context/DomainContext'
import { useUserContext } from '@/context'
import { showAdmin } from '@/app/admin/utils'
import {
    useFeatureFlag,
    FEATURE_FLAGS,
    useNavigation,
    usePilotGroup
} from '@/hooks'
import { getPilotGroupId } from '@/constants/pilotGroups'
import { fetchWithToken } from '@/utils/client'
import { useMetricsUrlState, useUrlSyncedSearch } from '../hooks'
import { DEFAULT_METRIC_VIEW, metricsPathFor } from '../constants/metricRoutes'

function MetricsBody() {
    const { view, state, setParams, setMetricView } = useMetricsUrlState()
    const { selectedGroup, search, initiativeType, crossDomainGroupBy } = state
    const [searchInput, handleSearch] = useUrlSyncedSearch(search, value =>
        setParams({ search: value })
    )
    const [groupedData, setGroupedData] = useState([])
    const [domainGroupedData, setDomainGroupedData] = useState([])
    const [crossDomainRows, setCrossDomainRows] = useState<
        EtpEcmiCrossDomainApiRow[]
    >([])
    const [crossDomainGroups, setCrossDomainGroups] = useState<
        EtpEcmiUnitCioGroupRow[]
    >([])
    const [crossDomainSummary, setCrossDomainSummary] =
        useState<EtpEcmiCrossDomainSummary | null>(null)
    const abortNetworkCalls = useRef<AbortController | null>(null)

    // The URL owns view and grouping, and MetricsBody stays mounted across a
    // [metricId] change, so stale rows have to be dropped in render rather than
    // in the handlers that used to change both at once.
    const dataKey = `${view}|${selectedGroup}`
    const [lastDataKey, setLastDataKey] = useState(dataKey)
    if (lastDataKey !== dataKey) {
        setLastDataKey(dataKey)
        setGroupedData([])
    }

    const { domains } = useDomainContext() || {}

    const { value: crossDomainFlagOn, loading: crossDomainFlagLoading } =
        useFeatureFlag(FEATURE_FLAGS.CROSS_DOMAIN_API_METRICS)
    const user = useUserContext()
    const isAdmin = showAdmin(user?.groups || [])
    const userEmail = (user?.attributes?.email || '').toLowerCase()

    const crossDomainPilotGroupId =
        isAdmin || crossDomainFlagOn
            ? ''
            : getPilotGroupId('CROSS_DOMAIN_API_METRICS_PILOT_GROUP')
    const { pilotGroup, isLoading: pilotGroupLoading } = usePilotGroup(
        crossDomainPilotGroupId
    )
    const showCrossDomainTab =
        crossDomainFlagOn ||
        isAdmin ||
        (pilotGroup?.members || []).some(member => member === userEmail)
    // both gates resolve async and read `false` while in flight, so a naive
    // redirect would eject legitimate pilot users mid-fetch
    const crossDomainAccessResolved =
        !crossDomainFlagLoading && !pilotGroupLoading
    const crossDomainDenied =
        view === 'metric3' && crossDomainAccessResolved && !showCrossDomainTab

    const { replace } = useNavigation()
    const crossDomainRedirected = useRef(false)
    useEffect(() => {
        if (!crossDomainDenied || crossDomainRedirected.current) return
        crossDomainRedirected.current = true
        // replace, not push — otherwise Back bounces the user straight back in
        replace(metricsPathFor(DEFAULT_METRIC_VIEW))
    }, [crossDomainDenied, replace])

    const handleGroupChange = (value: string) =>
        setParams({
            selectedGroup: value,
            displayView: value === 'unitCIO' ? 'listView' : 'cardView',
            search: ''
        })
    const handleTypeChange = (value: string) =>
        setParams({ initiativeType: value as typeof initiativeType })
    const handleCrossDomainGroupChange = (value: string) =>
        setParams({
            crossDomainGroupBy: value as typeof crossDomainGroupBy,
            search: ''
        })

    const dashboardParams = useMemo(
        () => ({
            view,
            selectedGroup,
            search: searchInput,
            initiativeType,
            crossDomainGroupBy
        }),
        [view, selectedGroup, searchInput, initiativeType, crossDomainGroupBy]
    )
    // the table's fetch keys off this object, so it takes the debounced value
    const tableParams = useMemo(
        () => ({ view, selectedGroup, search }),
        [view, selectedGroup, search]
    )

    useEffect(() => {
        const abortController = new AbortController()
        if (abortNetworkCalls && abortNetworkCalls.current) {
            abortNetworkCalls.current = abortController
        }

        const fetchGroupedMetricsData = async () => {
            try {
                const fetchGroupedData = async (url: string) => {
                    const res = await fetchWithToken(new URL(url), {
                        signal: abortController.signal
                    })
                    if (!res.ok) throw new Error('Network response was not ok')
                    const data = await res.json()
                    let groupedData = data.data

                    if (view === 'metric2') {
                        groupedData = groupedData
                            .map((item: MetricsApiCount) => {
                                item.proposedTypeACumSum =
                                    +item.proposed_apis +
                                    +item.darb_approved_apis +
                                    +item.onboarded_catalog_apis +
                                    +item.earb_approved_apis +
                                    +item.design_certified_apis +
                                    +item.prod_certified_apis
                                item.darbTypeACumSum =
                                    +item.darb_approved_apis +
                                    +item.onboarded_catalog_apis +
                                    +item.earb_approved_apis +
                                    +item.design_certified_apis +
                                    +item.prod_certified_apis
                                item.earbTypeACumSum =
                                    +item.earb_approved_apis +
                                    +item.onboarded_catalog_apis +
                                    +item.design_certified_apis +
                                    +item.prod_certified_apis
                                item.designTypeACumSum =
                                    +item.design_certified_apis +
                                    +item.prod_certified_apis
                                // ToDo: Confirm and remove the Type B related fields if not needed
                                item.darbTypeBCumSum = 0
                                item.earbTypeBCumSum = 0
                                item.designTypeBCumSum = 0
                                item.opsProposed =
                                    +item.proposed +
                                    +item.darb +
                                    +item.earb +
                                    +item.onboarded +
                                    +item.design +
                                    +item.prod
                                item.opsDarb =
                                    +item.darb +
                                    +item.earb +
                                    +item.onboarded +
                                    +item.design +
                                    +item.prod
                                item.opsEarb =
                                    +item.earb +
                                    +item.onboarded +
                                    +item.design +
                                    +item.prod
                                item.opsDesign = +item.design + +item.prod
                                item.opsProd = +item.prod
                                item.opsProposedTypeA =
                                    +item.typea_proposed +
                                    +item.typea_draft +
                                    +item.typea_earb +
                                    +item.typea_darb +
                                    +item.typea_onboarded +
                                    +item.typea_design +
                                    +item.typea_prod
                                item.opsDarbTypeA =
                                    +item.typea_darb +
                                    +item.typea_earb +
                                    +item.typea_onboarded +
                                    +item.typea_design +
                                    +item.typea_prod
                                item.opsEarbTypeA =
                                    +item.typea_earb +
                                    +item.typea_onboarded +
                                    +item.typea_design +
                                    +item.typea_prod
                                item.opsDesignTypeA =
                                    +item.typea_design + +item.typea_prod
                                item.opsProdTypeA = +item.typea_prod
                                item.opsProposedTypeB =
                                    +item.typeb_proposed +
                                    +item.typeb_draft +
                                    +item.typeb_earb +
                                    +item.typeb_darb +
                                    +item.typeb_onboarded +
                                    +item.typeb_design +
                                    +item.typeb_prod
                                item.opsDarbTypeB =
                                    +item.typeb_darb +
                                    +item.typeb_earb +
                                    +item.typeb_onboarded +
                                    +item.typeb_design +
                                    +item.typeb_prod
                                item.opsEarbTypeB =
                                    +item.typeb_earb +
                                    +item.typeb_onboarded +
                                    +item.typeb_design +
                                    +item.typeb_prod
                                item.opsDesignTypeB =
                                    +item.typeb_design + +item.typeb_prod
                                item.opsProdTypeB = +item.typeb_prod
                                return item
                            })
                            .filter(
                                (item: MetricsApiCount) =>
                                    (item.earbTypeACumSum || 0) > 0 ||
                                    +item.darb_approved_apis > 0 ||
                                    +item.proposed_apis > 0
                            )
                    }

                    return groupedData.sort(
                        (a: MetricsApiCount, b: MetricsApiCount) => {
                            if (view === 'metric1') {
                                return (
                                    b.percentage - a.percentage ||
                                    a.ecmi?.localeCompare(b.ecmi || '') ||
                                    a.ownersvp?.localeCompare(
                                        b.ownersvp || ''
                                    ) ||
                                    a.unitcio?.localeCompare(b.unitcio || '')
                                )
                            }
                            if (view === 'metric2') {
                                return (
                                    b.earbTypeACumSum - a.earbTypeACumSum ||
                                    a.domain?.localeCompare(b.domain) ||
                                    a.techowner?.localeCompare(
                                        b.techowner || ''
                                    ) ||
                                    a.unitcio?.localeCompare(b.unitcio || '')
                                )
                            }
                            return 0
                        }
                    )
                }

                if (view === 'metric1') {
                    setGroupedData(
                        await fetchGroupedData(
                            API_ENDPOINTS.GET_ECMI_MAPPED_APPS_BY_GROUP(
                                selectedGroup
                            )
                        )
                    )
                } else if (view === 'metric2') {
                    const groupedData = await fetchGroupedData(
                        API_ENDPOINTS.GET_API_COUNT_BY_GROUP(selectedGroup)
                    )
                    setGroupedData(groupedData)
                    if (selectedGroup === 'domain') {
                        setDomainGroupedData(groupedData)
                    }
                    if (
                        selectedGroup === 'unitCIO' &&
                        domainGroupedData.length === 0
                    ) {
                        setDomainGroupedData(
                            await fetchGroupedData(
                                API_ENDPOINTS.GET_API_COUNT_BY_GROUP('domain')
                            )
                        )
                    }
                }
            } catch (error) {
                if (error != 'COMPONENT_UNMOUNT') {
                    console.error('Failed to fetch domain data:', error)
                }
            }
        }
        if (selectedGroup != '') {
            fetchGroupedMetricsData()
        }

        return () => abortController.abort('COMPONENT_UNMOUNT')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGroup])

    useEffect(() => {
        if (view !== 'metric3') return

        const abortController = new AbortController()

        const fetchCrossDomainApis = async () => {
            try {
                const res = await fetchWithToken(
                    API_ENDPOINTS.GET_ETP_ECMI_CROSS_DOMAIN_APIS(
                        crossDomainGroupBy
                    ),
                    { signal: abortController.signal }
                )
                if (!res.ok) throw new Error('Network response was not ok')
                const { data } = await res.json()
                setCrossDomainRows(data?.initiatives || [])
                setCrossDomainGroups(data?.groups || [])
                setCrossDomainSummary(data?.summary || null)
            } catch (error) {
                if (error != 'COMPONENT_UNMOUNT') {
                    console.error(
                        'Failed to fetch ETP/ECMI cross-domain APIs:',
                        error
                    )
                }
            }
        }
        fetchCrossDomainApis()

        return () => abortController.abort('COMPONENT_UNMOUNT')
    }, [view, crossDomainGroupBy])

    // hold the page blank until access is known, so an unauthorised deep link
    // never flashes the metric3 tab before the redirect lands
    if (
        view === 'metric3' &&
        (!crossDomainAccessResolved || crossDomainDenied)
    ) {
        return <Skeleton height='400px' width='100%' />
    }

    return (
        <VStack
            separator={<StackSeparator borderColor='gray.200' />}
            gap={3}
            align='stretch'
        >
            <HStack gap={4} paddingX='2rem' mt={5}>
                <Box>
                    <Button
                        variant='outline'
                        size={{ base: 'sm', md: 'md' }}
                        onClick={() => setMetricView('metric2')}
                        className={
                            view === 'metric2'
                                ? metricStyles.directoryTabsActive
                                : metricStyles.directoryTabsInactive
                        }
                    >
                        Type-A/B EARB Approved APIs
                    </Button>
                    <Button
                        variant='outline'
                        size={{ base: 'sm', md: 'md' }}
                        onClick={() => setMetricView('metric1')}
                        className={
                            view === 'metric1'
                                ? metricStyles.directoryTabsActive
                                : metricStyles.directoryTabsInactive
                        }
                    >
                        ECMI Apps to Domain Mapping
                    </Button>
                    {showCrossDomainTab && (
                        <Button
                            variant='outline'
                            size={{ base: 'sm', md: 'md' }}
                            onClick={() => setMetricView('metric3')}
                            className={
                                view === 'metric3'
                                    ? metricStyles.directoryTabsActive
                                    : metricStyles.directoryTabsInactive
                            }
                        >
                            ETP/ECMI Cross-Domain APIs
                        </Button>
                    )}
                </Box>
            </HStack>
            <MetricsDashboard
                metricParams={dashboardParams}
                groupedData={groupedData}
                domainGroupedData={domainGroupedData}
                crossDomainRows={
                    crossDomainGroupBy ? crossDomainGroups : crossDomainRows
                }
                crossDomainSummary={crossDomainSummary}
                handleGroupChange={handleGroupChange}
                handleSearch={handleSearch}
                companyDomains={domains}
            />

            <Box
                padding='2rem'
                paddingTop={view === 'metric3' ? '0.75rem' : '2rem'}
            >
                {view === 'metric3' ? (
                    <CrossDomainApiTable
                        rows={crossDomainRows}
                        groupRows={crossDomainGroups}
                        groupBy={crossDomainGroupBy}
                        search={search}
                        typeFilter={initiativeType}
                        toolbar={
                            <CrossDomainFilterBar
                                typeFilter={initiativeType}
                                groupBy={crossDomainGroupBy}
                                search={searchInput}
                                onTypeChange={handleTypeChange}
                                onGroupByChange={handleCrossDomainGroupChange}
                                onSearchChange={handleSearch}
                            />
                        }
                    />
                ) : (
                    <MetricsTable
                        metricParams={tableParams}
                        groupedData={groupedData}
                        domainGroupedData={domainGroupedData}
                        companyDomains={domains}
                    />
                )}
            </Box>
        </VStack>
    )
}

export default MetricsBody
