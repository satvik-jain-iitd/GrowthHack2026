import { act, renderHook } from '@testing-library/react'
import {
    hasContentFilters,
    createNodeMatcher,
    useCapabilityFilters
} from './useCapabilityFilters'
import type {
    CapabilityFilter,
    CapabilityNode,
    CapabilityOwner
} from '@/app/business-architecture/types'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

const emptyFilter: CapabilityFilter = {
    name: '',
    region: '',
    product: '',
    customerJourney: '',
    persona: '',
    customer: '',
    application: ''
}

const makeCapability = (
    id: string,
    nm: string,
    level: number,
    parentId: string | null = null,
    overrides: Partial<CapabilityNode> = {}
): CapabilityNode => ({
    capability_id: id,
    parent_capability_id: parentId,
    capability_key_tx: id,
    capability_nm: nm,
    capability_desc_tx: `${nm} description`,
    capability_level: level,
    begins_with_tx: '',
    ends_with_tx: '',
    includes_tx: '',
    customer_journey_id: '[]',
    product_tx: '[]',
    region_tx: '[]',
    customer_type: '',
    l1_capability_id: parentId ?? id,
    ...overrides
})

// Flat capability list for hook input
const cap_l1_A = makeCapability('l1a', 'Technology', 1, null)
const cap_l1_B = makeCapability('l1b', 'Finance', 1, null)
const cap_l2_A = makeCapability('l2a', 'Cloud Computing', 2, 'l1a')
const cap_l2_B = makeCapability('l2b', 'Security', 2, 'l1a')
const cap_l3_A = makeCapability('l3a', 'Container Orchestration', 3, 'l2a')

const flatCapabilities = [cap_l1_A, cap_l1_B, cap_l2_A, cap_l2_B, cap_l3_A]

// Hierarchy tree for hook input
const hierarchyTree: CapabilityNode[] = [
    {
        ...cap_l1_A,
        children: [
            {
                ...cap_l2_A,
                children: [{ ...cap_l3_A, children: [] }]
            },
            { ...cap_l2_B, children: [] }
        ]
    },
    { ...cap_l1_B, children: [] }
]

describe('hasContentFilters', () => {
    it('returns false for a fully empty filter', () => {
        expect(hasContentFilters(emptyFilter)).toBe(false)
    })

    it('returns true when name is set', () => {
        expect(hasContentFilters({ ...emptyFilter, name: 'foo' })).toBe(true)
    })

    it('returns true when region is set', () => {
        expect(hasContentFilters({ ...emptyFilter, region: 'US' })).toBe(true)
    })

    it('returns true when product is set', () => {
        expect(hasContentFilters({ ...emptyFilter, product: 'Cards' })).toBe(
            true
        )
    })

    it('returns true when customerJourney is set', () => {
        expect(
            hasContentFilters({ ...emptyFilter, customerJourney: 'Buy' })
        ).toBe(true)
    })

    it('returns true when persona is set', () => {
        expect(hasContentFilters({ ...emptyFilter, persona: 'Owner' })).toBe(
            true
        )
    })

    it('returns true when customer is set', () => {
        expect(
            hasContentFilters({ ...emptyFilter, customer: 'Consumer' })
        ).toBe(true)
    })

    it('returns true when application is set', () => {
        expect(
            hasContentFilters({ ...emptyFilter, application: 'MyApp' })
        ).toBe(true)
    })
})

describe('createNodeMatcher', () => {
    const emptyOwnerMap = new Map<string, Set<string>>()
    const emptyJourneyMap = new Map<string, string>()

    const node: CapabilityNode = makeCapability(
        'n1',
        'Cloud Infrastructure',
        2,
        null,
        {
            capability_desc_tx: 'Manages cloud infra',
            region_tx: JSON.stringify(['US', 'EU']),
            product_tx: JSON.stringify(['Cards', 'Loans']),
            customer_type: 'Consumer',
            applications: [
                { application_id: 42, application_nm: 'CloudManager' }
            ]
        }
    )

    it('returns true when no filters are set', () => {
        const matcher = createNodeMatcher(
            emptyOwnerMap,
            emptyJourneyMap,
            emptyFilter
        )
        expect(matcher(node)).toBe(true)
    })

    it('matches by capability_nm (case-insensitive)', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            name: 'cloud infra'
        })
        expect(matcher(node)).toBe(true)
    })

    it('matches by capability_desc_tx (case-insensitive)', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            name: 'manages cloud'
        })
        expect(matcher(node)).toBe(true)
    })

    it('returns false when name does not match', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            name: 'zzznomatch'
        })
        expect(matcher(node)).toBe(false)
    })

    it('matches by region from JSON-parsed region_tx', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            region: 'EU'
        })
        expect(matcher(node)).toBe(true)
    })

    it('returns false when region does not match', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            region: 'APAC'
        })
        expect(matcher(node)).toBe(false)
    })

    it('matches by product from JSON-parsed product_tx', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            product: 'Cards'
        })
        expect(matcher(node)).toBe(true)
    })

    it('matches by customer_type string', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            customer: 'Consumer'
        })
        expect(matcher(node)).toBe(true)
    })

    it('matches by persona via capabilityOwnerMap', () => {
        const ownerMap = new Map<string, Set<string>>([
            ['n1', new Set(['Architect'])]
        ])
        const matcher = createNodeMatcher(ownerMap, emptyJourneyMap, {
            ...emptyFilter,
            persona: 'Architect'
        })
        expect(matcher(node)).toBe(true)
    })

    it('returns false when persona not in ownerMap', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            persona: 'Engineer'
        })
        expect(matcher(node)).toBe(false)
    })

    it('matches by application_nm (case-insensitive)', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            application: 'cloudmanager'
        })
        expect(matcher(node)).toBe(true)
    })

    it('matches by application_id toString', () => {
        const matcher = createNodeMatcher(emptyOwnerMap, emptyJourneyMap, {
            ...emptyFilter,
            application: '42'
        })
        expect(matcher(node)).toBe(true)
    })

    it('matches journey via journeyStatementToId map', () => {
        const journeyMap = new Map<string, string>([['Buy Journey', 'j1']])
        const nodeWithJourney: CapabilityNode = {
            ...node,
            customer_journey_id: JSON.stringify(['j1', 'j2'])
        }
        const matcher = createNodeMatcher(emptyOwnerMap, journeyMap, {
            ...emptyFilter,
            customerJourney: 'Buy Journey'
        })
        expect(matcher(nodeWithJourney)).toBe(true)
    })
})

describe('useCapabilityFilters', () => {
    const defaultArgs = {
        capability: flatCapabilities,
        capabilityHierarchy: hierarchyTree
    }

    it('initialises with capabilityLevel = "2" when no initialSelectedL1', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.capabilityLevel).toBe('2')
    })

    it('initialises with capabilityLevel = "1" when initialSelectedL1 is provided', () => {
        const { result } = renderHook(() =>
            useCapabilityFilters({ ...defaultArgs, initialSelectedL1: 'l1a' })
        )
        expect(result.current.capabilityLevel).toBe('1')
    })

    it('initialises with a fully empty capabilityFilter', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.capabilityFilter).toEqual(emptyFilter)
    })

    it('hasContentFilter is false initially', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.hasContentFilter).toBe(false)
    })

    it('updateFilter sets filter fields and hasContentFilter becomes true', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        act(() => {
            result.current.updateFilter({ name: 'Cloud' })
        })
        expect(result.current.capabilityFilter.name).toBe('Cloud')
        expect(result.current.hasContentFilter).toBe(true)
    })

    it('clearFilters resets filter and hasContentFilter to false', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        act(() => {
            result.current.updateFilter({ name: 'Cloud' })
        })
        act(() => {
            result.current.clearFilters()
        })
        expect(result.current.capabilityFilter).toEqual(emptyFilter)
        expect(result.current.hasContentFilter).toBe(false)
    })

    it('filteredHierarchy returns all roots when no content filter is set', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.filteredHierarchy).toHaveLength(2)
    })

    it('filteredHierarchy prunes non-matching nodes', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        act(() => {
            result.current.updateFilter({ name: 'Finance' })
        })
        // Only l1b "Finance" matches — l1a subtree should be pruned
        const ids = result.current.filteredHierarchy.map(n => n.capability_id)
        expect(ids).toContain('l1b')
        expect(ids).not.toContain('l1a')
    })

    it('filteredHierarchy keeps ancestors of matching descendants', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        // l3a "Container Orchestration" is a descendant of l1a
        act(() => {
            result.current.updateFilter({ name: 'Container' })
        })
        const rootIds = result.current.filteredHierarchy.map(
            n => n.capability_id
        )
        expect(rootIds).toContain('l1a')
    })

    it('matchedCapabilityIds is empty when no content filter', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.matchedCapabilityIds.size).toBe(0)
    })

    it('matchedCapabilityIds contains directly matching node IDs', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        act(() => {
            result.current.updateFilter({ name: 'Finance' })
        })
        expect(result.current.matchedCapabilityIds.has('l1b')).toBe(true)
        expect(result.current.matchedCapabilityIds.has('l1a')).toBe(false)
    })

    it('autoExpandedIds uses levelAutoExpandedIds in level mode (default)', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        // Default capabilityLevel is '2', so nodes with level < 2 (i.e. L1) get expanded
        expect(result.current.autoExpandedIds.has('l1a')).toBe(true)
        expect(result.current.autoExpandedIds.has('l1b')).toBe(true)
        // L2 and deeper should not be expanded at level 2
        expect(result.current.autoExpandedIds.has('l2a')).toBe(false)
    })

    it('levelAutoExpandedIds includes nodes whose level is less than capabilityLevel', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        act(() => {
            result.current.setCapabilityLevel('3')
            result.current.setExpansionMode('level')
        })
        // L1 (level 1) and L2 (level 2) should be in autoExpandedIds
        expect(result.current.autoExpandedIds.has('l1a')).toBe(true)
        expect(result.current.autoExpandedIds.has('l2a')).toBe(true)
        expect(result.current.autoExpandedIds.has('l3a')).toBe(false)
    })

    it('autoExpandedIds uses filterAutoExpandedIds when content filter is active', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        act(() => {
            result.current.updateFilter({ name: 'Container' })
        })
        // l1a and l2a are ancestors of matching l3a, so they should be auto-expanded
        expect(result.current.autoExpandedIds.has('l1a')).toBe(true)
        expect(result.current.autoExpandedIds.has('l2a')).toBe(true)
    })

    it('getIsExpanded returns false for a node not in autoExpandedIds (no override)', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        // l3a should not be expanded at capabilityLevel '2'
        expect(result.current.getIsExpanded('l3a')).toBe(false)
    })

    it('getIsExpanded returns true for a node in autoExpandedIds', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.getIsExpanded('l1a')).toBe(true)
    })

    it('handleToggleExpand sets an override that overrides autoExpandedIds', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        // l1a is auto-expanded; toggle should collapse it
        act(() => {
            result.current.handleToggleExpand('l1a', true)
        })
        expect(result.current.getIsExpanded('l1a')).toBe(false)
    })

    it('handleToggleExpand can manually expand a node not in autoExpandedIds', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        // l3a is not auto-expanded at level 2
        act(() => {
            result.current.handleToggleExpand('l3a', false)
        })
        expect(result.current.getIsExpanded('l3a')).toBe(true)
    })

    it('minLevel is the smallest capability_level in the data', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.minLevel).toBe(1)
    })

    it('maxLevel is the largest capability_level in the data', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.maxLevel).toBe(3)
    })

    it('allCustomers derived from customer_type fields', () => {
        const capsWithCustomers = [
            makeCapability('c1', 'Cap A', 1, null, {
                customer_type: 'Consumer'
            }),
            makeCapability('c2', 'Cap B', 1, null, {
                customer_type: 'Business'
            }),
            makeCapability('c3', 'Cap C', 1, null, {
                customer_type: 'Consumer'
            })
        ]
        const { result } = renderHook(() =>
            useCapabilityFilters({
                capability: capsWithCustomers,
                capabilityHierarchy: []
            })
        )
        expect(result.current.allCustomers).toEqual(
            expect.arrayContaining(['Consumer', 'Business'])
        )
        expect(result.current.allCustomers).toHaveLength(2)
    })

    it('capabilityHierarchyMap is keyed by capability_id for root nodes', () => {
        const { result } = renderHook(() => useCapabilityFilters(defaultArgs))
        expect(result.current.capabilityHierarchyMap['l1a']).toBeDefined()
        expect(result.current.capabilityHierarchyMap['l1b']).toBeDefined()
    })

    it('capabilityOwners build ownerMap correctly affecting persona match', () => {
        const owners: CapabilityOwner[] = [
            {
                capability_owner_id: 'o1',
                capability_id: 'l1a',
                persona_tx: 'CTO',
                creat_user_email_ad_tx: 'a@b.com',
                creat_ts: ''
            }
        ]
        const { result } = renderHook(() =>
            useCapabilityFilters({ ...defaultArgs, capabilityOwners: owners })
        )
        act(() => {
            result.current.updateFilter({ persona: 'CTO' })
        })
        expect(result.current.matchedCapabilityIds.has('l1a')).toBe(true)
    })

    it('customerJourneys build journeyStatementToId affecting journey filter', () => {
        const journeys: CustomerJourney[] = [
            {
                journey_id: 'j1',
                journey_statement: 'Book a Flight',
                journey_desc: '',
                journey_link: '',
                journey_grp_tx: 'Travel'
            }
        ]
        const nodeWithJourney = makeCapability('l1a', 'Technology', 1, null, {
            customer_journey_id: JSON.stringify(['j1'])
        })
        const { result } = renderHook(() =>
            useCapabilityFilters({
                capability: [nodeWithJourney],
                capabilityHierarchy: [{ ...nodeWithJourney, children: [] }],
                customerJourneys: journeys
            })
        )
        act(() => {
            result.current.updateFilter({ customerJourney: 'Book a Flight' })
        })
        expect(result.current.matchedCapabilityIds.has('l1a')).toBe(true)
    })
})
