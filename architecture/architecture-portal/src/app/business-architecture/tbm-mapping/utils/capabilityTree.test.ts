import {
    buildCapabilityHierarchy,
    getAICapabilitiesForJourney,
    getCapabilityPathsForIds
} from './capabilityTree'
import type { Capability } from '@/app/business-architecture/types'

// ---------------------------------------------------------------------------
// Factory helper
// ---------------------------------------------------------------------------

function makeCap(
    id: string,
    level: number,
    parentId: string | null = null,
    overrides: { nm?: string; l1Id?: string } = {}
): Capability {
    return {
        capability_id: id,
        parent_capability_id: parentId,
        capability_key_tx: id,
        capability_nm: overrides.nm ?? id,
        capability_desc_tx: '',
        capability_level: level,
        begins_with_tx: '',
        ends_with_tx: '',
        includes_tx: '',
        customer_journey_id: '[]',
        product_tx: '[]',
        region_tx: '[]',
        customer_type: '[]',
        l1_capability_id: overrides.l1Id ?? id
    }
}

// ---------------------------------------------------------------------------
// buildCapabilityHierarchy
// ---------------------------------------------------------------------------

describe('buildCapabilityHierarchy', () => {
    it('returns empty array for empty input', () => {
        expect(buildCapabilityHierarchy([])).toEqual([])
    })

    it('returns a single root node for a single L1 capability', () => {
        const result = buildCapabilityHierarchy([makeCap('l1', 1)])
        expect(result).toHaveLength(1)
        expect(result[0].capability_id).toBe('l1')
        expect(result[0].children).toEqual([])
    })

    it('nests a child under its parent', () => {
        const result = buildCapabilityHierarchy([
            makeCap('l1', 1),
            makeCap('l2', 2, 'l1')
        ])
        expect(result).toHaveLength(1)
        expect(result[0].children).toHaveLength(1)
        expect(result[0].children![0].capability_id).toBe('l2')
    })

    it('builds a three-level deep tree', () => {
        const result = buildCapabilityHierarchy([
            makeCap('l1', 1),
            makeCap('l2', 2, 'l1'),
            makeCap('l3', 3, 'l2')
        ])
        const l3 = result[0].children![0].children![0]
        expect(l3.capability_id).toBe('l3')
    })

    it('drops a node whose parent is not present in the list', () => {
        const result = buildCapabilityHierarchy([
            makeCap('l1', 1),
            makeCap('orphan', 2, 'nonexistent')
        ])
        expect(result).toHaveLength(1)
        expect(result[0].capability_id).toBe('l1')
    })
})

// ---------------------------------------------------------------------------
// getAICapabilitiesForJourney
// ---------------------------------------------------------------------------

describe('getAICapabilitiesForJourney', () => {
    it('returns empty sets for an empty hierarchy', () => {
        const result = getAICapabilitiesForJourney([], 'journey-1')
        expect(result.aiCapabilityIds.size).toBe(0)
        expect(result.aiAncestorIds).toEqual([])
    })

    it('caps selection at 8 when more than 8 L3/L4 nodes exist', () => {
        const caps: Capability[] = [makeCap('l1', 1)]
        for (let i = 1; i <= 10; i++) {
            caps.push(makeCap(`l2-${i}`, 2, 'l1'))
            caps.push(makeCap(`l3-${i}`, 3, `l2-${i}`))
        }
        const hierarchy = buildCapabilityHierarchy(caps)
        const result = getAICapabilitiesForJourney(hierarchy, 'journey-1')
        expect(result.aiCapabilityIds.size).toBe(8)
    })

    it('produces different selections for different journey IDs', () => {
        const caps: Capability[] = [makeCap('l1', 1)]
        for (let i = 1; i <= 15; i++) {
            caps.push(makeCap(`l2-${i}`, 2, 'l1'))
            caps.push(makeCap(`l3-${i}`, 3, `l2-${i}`))
        }
        const hierarchy = buildCapabilityHierarchy(caps)
        const r1 = getAICapabilitiesForJourney(hierarchy, 'journey-alpha')
        const r2 = getAICapabilitiesForJourney(hierarchy, 'journey-beta')
        expect([...r1.aiCapabilityIds].sort()).not.toEqual(
            [...r2.aiCapabilityIds].sort()
        )
    })

    it('populates aiAncestorIds with parent IDs of the selected capabilities', () => {
        const caps: Capability[] = [
            makeCap('l1', 1),
            makeCap('l2', 2, 'l1'),
            makeCap('l3', 3, 'l2')
        ]
        const hierarchy = buildCapabilityHierarchy(caps)
        const result = getAICapabilitiesForJourney(hierarchy, 'journey-1')
        expect(result.aiCapabilityIds.has('l3')).toBe(true)
        expect(result.aiAncestorIds).toContain('l2')
    })
})

// ---------------------------------------------------------------------------
// getCapabilityPathsForIds
// ---------------------------------------------------------------------------

describe('getCapabilityPathsForIds', () => {
    it('returns empty array for empty ids', () => {
        const hierarchy = buildCapabilityHierarchy([makeCap('l1', 1)])
        expect(getCapabilityPathsForIds([], hierarchy)).toEqual([])
    })

    it('skips ids not present in the hierarchy', () => {
        const hierarchy = buildCapabilityHierarchy([makeCap('l1', 1)])
        expect(getCapabilityPathsForIds(['nonexistent'], hierarchy)).toEqual([])
    })

    it('returns a single-element path for an L1 node', () => {
        const hierarchy = buildCapabilityHierarchy([
            makeCap('l1', 1, null, { nm: 'Root' })
        ])
        const [entry] = getCapabilityPathsForIds(['l1'], hierarchy)
        expect(entry.path).toEqual(['Root'])
        expect(entry.l1Id).toBe('l1')
    })

    it('returns a three-element path and correct l1Id for an L3 node', () => {
        const hierarchy = buildCapabilityHierarchy([
            makeCap('l1', 1, null, { nm: 'L1', l1Id: 'l1' }),
            makeCap('l2', 2, 'l1', { nm: 'L2', l1Id: 'l1' }),
            makeCap('l3', 3, 'l2', { nm: 'L3', l1Id: 'l1' })
        ])
        const [entry] = getCapabilityPathsForIds(['l3'], hierarchy)
        expect(entry.path).toEqual(['L1', 'L2', 'L3'])
        expect(entry.l1Id).toBe('l1')
    })
})
