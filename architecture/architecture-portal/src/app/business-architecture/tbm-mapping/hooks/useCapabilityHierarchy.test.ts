import { renderHook } from '@testing-library/react'
import { useCapabilityHierarchy } from './useCapabilityHierarchy'
import type { Capability } from '@/app/business-architecture/types'

// ---------------------------------------------------------------------------
// Factory helper
// ---------------------------------------------------------------------------

function makeCap(
    id: string,
    level: number,
    parentId: string | null = null
): Capability {
    return {
        capability_id: id,
        parent_capability_id: parentId,
        capability_key_tx: id,
        capability_nm: id,
        capability_desc_tx: '',
        capability_level: level,
        begins_with_tx: '',
        ends_with_tx: '',
        includes_tx: '',
        customer_journey_id: '[]',
        product_tx: '[]',
        region_tx: '[]',
        customer_type: '[]',
        l1_capability_id: id
    }
}

// ---------------------------------------------------------------------------
// useCapabilityHierarchy
// ---------------------------------------------------------------------------

describe('useCapabilityHierarchy', () => {
    it('returns empty array for empty input', () => {
        const { result } = renderHook(() => useCapabilityHierarchy([]))
        expect(result.current).toEqual([])
    })

    it('returns a nested tree for a non-empty capability list', () => {
        const capabilities: Capability[] = [
            makeCap('l1', 1),
            makeCap('l2', 2, 'l1')
        ]
        const { result } = renderHook(() =>
            useCapabilityHierarchy(capabilities)
        )
        expect(result.current).toHaveLength(1)
        expect(result.current[0].capability_id).toBe('l1')
        expect(result.current[0].children).toHaveLength(1)
        expect(result.current[0].children![0].capability_id).toBe('l2')
    })

    it('returns the same memoized reference when re-rendered with the same input', () => {
        const capabilities: Capability[] = [makeCap('l1', 1)]
        const { result, rerender } = renderHook(() =>
            useCapabilityHierarchy(capabilities)
        )
        const first = result.current
        rerender()
        expect(result.current).toBe(first)
    })
})
