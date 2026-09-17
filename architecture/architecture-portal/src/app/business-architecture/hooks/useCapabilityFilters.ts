import { useCallback, useMemo, useState } from 'react'
import type {
    Capability,
    CapabilityFilter,
    CapabilityNode,
    CapabilityOwner
} from '@/app/business-architecture/types'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

export function hasContentFilters(filter: CapabilityFilter): boolean {
    return !!(
        filter.name ||
        filter.region ||
        filter.product ||
        filter.customer ||
        filter.persona ||
        filter.customerJourney ||
        filter.application
    )
}

export function createNodeMatcher(
    capabilityOwnerMap: Map<string, Set<string>>,
    journeyStatementToId: Map<string, string>,
    filter: CapabilityFilter
): (node: CapabilityNode) => boolean {
    const {
        name,
        region,
        product,
        customer,
        persona,
        customerJourney,
        application
    } = filter
    const journeyId = customerJourney
        ? journeyStatementToId.get(customerJourney)
        : null

    return (node: CapabilityNode): boolean => {
        const matchesName =
            !name ||
            node.capability_nm.toLowerCase().includes(name.toLowerCase()) ||
            node.capability_desc_tx.toLowerCase().includes(name.toLowerCase())
        const matchesRegion =
            !region || JSON.parse(node.region_tx)?.includes(region)
        const matchesProduct =
            !product || JSON.parse(node.product_tx)?.includes(product)
        const matchesCustomer =
            !customer || node.customer_type?.includes(customer)
        const matchesPersona =
            !persona ||
            node.customer_type?.includes(persona) ||
            (capabilityOwnerMap.get(node.capability_id)?.has(persona) ?? false)
        const matchesJourney =
            !journeyId ||
            JSON.parse(node.customer_journey_id)?.includes(journeyId)
        const matchesApplication =
            !application ||
            (node.applications?.some(
                app =>
                    app.application_nm
                        .toLowerCase()
                        .includes(application.toLowerCase()) ||
                    app.application_id.toString().includes(application)
            ) ??
                false)

        return (
            matchesName &&
            matchesRegion &&
            matchesProduct &&
            matchesPersona &&
            matchesJourney &&
            matchesCustomer &&
            matchesApplication
        )
    }
}

export function useCapabilityFilters({
    capability,
    capabilityHierarchy,
    capabilityOwners = [],
    customerJourneys = [],
    initialSelectedL1 = null
}: {
    capability: Capability[]
    capabilityHierarchy: CapabilityNode[]
    capabilityOwners?: CapabilityOwner[]
    customerJourneys?: CustomerJourney[]
    initialSelectedL1?: string | null
}) {
    const allCustomers = useMemo(
        () =>
            Array.from(new Set(capability.flatMap(c => c.customer_type ?? []))),
        [capability]
    )

    const capabilityLevels = useMemo(
        () =>
            Array.from(
                new Set(
                    capability
                        .map(c => Number(c.capability_level))
                        .filter((l): l is number => l != null)
                )
            ).sort((a, b) => a - b),
        [capability]
    )

    const minLevel = capabilityLevels[0] ?? 1
    const maxLevel = capabilityLevels[capabilityLevels.length - 1] ?? 5

    const capabilityOwnerMap = useMemo(() => {
        const map = new Map<string, Set<string>>()
        for (const owner of capabilityOwners) {
            let set = map.get(owner.capability_id)
            if (!set) {
                set = new Set()
                map.set(owner.capability_id, set)
            }
            set.add(owner.persona_tx)
        }
        return map
    }, [capabilityOwners])

    const [selectedL1, setSelectedL1] = useState<string | null>(
        initialSelectedL1
    )
    const [capabilityLevel, setCapabilityLevel] = useState<string | undefined>(
        initialSelectedL1 ? '1' : '2'
    )
    const [capabilityFilter, setCapabilityFilter] = useState<CapabilityFilter>({
        name: '',
        region: '',
        product: '',
        customerJourney: '',
        persona: '',
        customer: '',
        application: ''
    })
    const [expandedOverrides, setExpandedOverrides] = useState<
        Record<string, boolean | null>
    >({})
    const [expansionMode, setExpansionMode] = useState<'filter' | 'level'>(
        'level'
    )

    const journeyStatementToId = useMemo(
        () =>
            new Map(
                customerJourneys.map((cj: CustomerJourney) => [
                    cj.journey_statement,
                    cj.journey_id
                ])
            ),
        [customerJourneys]
    )

    const hasContentFilter = useMemo(
        () => hasContentFilters(capabilityFilter),
        [capabilityFilter]
    )

    const buildFilteredHierarchy = useCallback(
        (filter: CapabilityFilter) => {
            const localHasContentFilter = hasContentFilters(filter)
            const doesNodeMatchFilter = createNodeMatcher(
                capabilityOwnerMap,
                journeyStatementToId,
                filter
            )

            const filterAutoExpandedIds = new Set<string>()
            const matchedIds = new Set<string>()

            function recurse(node: CapabilityNode): {
                node: CapabilityNode | null
                matchedInSubtree: boolean
            } {
                const isL1 = node.capability_level === 1
                const childResults: CapabilityNode[] = []
                let childMatched = false

                for (const child of node.children ?? []) {
                    const result = recurse(child)
                    if (result.node) childResults.push(result.node)
                    if (result.matchedInSubtree) childMatched = true
                }

                const filterMatch = doesNodeMatchFilter(node)
                const selfMatches =
                    filterMatch || (isL1 && !localHasContentFilter)

                if (localHasContentFilter && filterMatch) {
                    matchedIds.add(node.capability_id)
                }

                if (childMatched) {
                    filterAutoExpandedIds.add(node.capability_id)
                }

                if (selfMatches) {
                    return {
                        node: { ...node, children: node.children ?? [] },
                        matchedInSubtree: true
                    }
                }

                if (childResults.length > 0) {
                    return {
                        node: { ...node, children: childResults },
                        matchedInSubtree: true
                    }
                }

                return { node: null, matchedInSubtree: false }
            }

            const tree = capabilityHierarchy
                .map(recurse)
                .filter(
                    (
                        r
                    ): r is {
                        node: CapabilityNode
                        matchedInSubtree: boolean
                    } => r.node !== null
                )
                .map(r => r.node)

            return { tree, filterAutoExpandedIds, matchedIds }
        },
        [capabilityHierarchy, capabilityOwnerMap, journeyStatementToId]
    )

    const {
        tree: filteredHierarchy,
        filterAutoExpandedIds,
        matchedIds: matchedCapabilityIds
    } = useMemo(
        () => buildFilteredHierarchy(capabilityFilter),
        [buildFilteredHierarchy, capabilityFilter]
    )

    const capabilityHierarchyMap = useMemo(() => {
        const map: Record<string, CapabilityNode> = {}
        for (const node of capabilityHierarchy) {
            map[node.capability_id] = node
        }
        return map
    }, [capabilityHierarchy])

    const updateFilter = useCallback((updates: Partial<CapabilityFilter>) => {
        setCapabilityFilter(prev => ({ ...prev, ...updates }))
        setExpansionMode('filter')
        setSelectedL1(null)
    }, [])

    const clearFilters = useCallback(() => {
        setCapabilityFilter({
            name: '',
            region: '',
            product: '',
            customerJourney: '',
            persona: '',
            customer: '',
            application: ''
        })
        setExpansionMode('level')
        setSelectedL1(null)
        setExpandedOverrides({})
    }, [])

    const handleToggleExpand = useCallback(
        (capabilityId: string, currentlyExpanded: boolean) => {
            setExpandedOverrides(prev => {
                const next = { ...prev, [capabilityId]: !currentlyExpanded }
                if (
                    !currentlyExpanded &&
                    capabilityId !== selectedL1 &&
                    selectedL1
                ) {
                    next[selectedL1] = true
                }
                return next
            })
            if (currentlyExpanded && capabilityId === selectedL1) {
                setSelectedL1(null)
            }
        },
        [selectedL1]
    )

    const levelAutoExpandedIds = useMemo(() => {
        const ids = new Set<string>()
        const level = Number(capabilityLevel)
        if (!Number.isFinite(level)) return ids

        const visit = (node: CapabilityNode) => {
            if ((node.capability_level ?? Number.POSITIVE_INFINITY) < level) {
                ids.add(node.capability_id)
            }
            for (const child of node.children ?? []) {
                visit(child)
            }
        }

        for (const root of capabilityHierarchy) {
            visit(root)
        }

        return ids
    }, [capabilityHierarchy, capabilityLevel])

    const autoExpandedIds = useMemo(() => {
        if (expansionMode === 'filter' && hasContentFilter) {
            return filterAutoExpandedIds
        }
        return levelAutoExpandedIds
    }, [
        expansionMode,
        hasContentFilter,
        filterAutoExpandedIds,
        levelAutoExpandedIds
    ])

    const getIsExpanded = useCallback(
        (capabilityId: string): boolean => {
            const override = expandedOverrides[capabilityId]
            if (override !== undefined && override !== null) return override

            if (
                expansionMode === 'level' &&
                !hasContentFilter &&
                selectedL1 === capabilityId
            ) {
                return true
            }

            if (autoExpandedIds.has(capabilityId)) return true

            return false
        },
        [
            expandedOverrides,
            expansionMode,
            hasContentFilter,
            selectedL1,
            autoExpandedIds
        ]
    )

    return {
        capabilityFilter,
        updateFilter,
        clearFilters,
        hasContentFilter,
        expandedOverrides,
        setExpandedOverrides,
        expansionMode,
        setExpansionMode,
        selectedL1,
        setSelectedL1,
        capabilityLevel,
        setCapabilityLevel,
        filteredHierarchy,
        capabilityHierarchyMap,
        matchedCapabilityIds,
        autoExpandedIds,
        handleToggleExpand,
        getIsExpanded,
        allCustomers,
        minLevel,
        maxLevel
    }
}
