import { useMemo } from 'react'
import type {
    Capability,
    CapabilityNode
} from '@/app/business-architecture/types'
import { buildCapabilityHierarchy } from '../utils/capabilityTree'

/**
 * Converts a flat capability list into a memoized nested CapabilityNode tree.
 */
export function useCapabilityHierarchy(
    capability: Capability[]
): CapabilityNode[] {
    return useMemo(() => buildCapabilityHierarchy(capability), [capability])
}
