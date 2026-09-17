import type {
    Capability,
    CapabilityNode
} from '@/app/business-architecture/types'

/**
 * Converts a flat capability list into a nested tree of CapabilityNodes.
 * L1 nodes (no parent) become roots; all others are attached to their parent.
 */
export function buildCapabilityHierarchy(
    capability: Capability[]
): CapabilityNode[] {
    const nodeMap: Record<string, CapabilityNode> = {}
    for (const item of capability) {
        nodeMap[item.capability_id] = { ...item, children: [] }
    }
    const roots: CapabilityNode[] = []
    for (const item of capability) {
        const node = nodeMap[item.capability_id]
        if (item.parent_capability_id && nodeMap[item.parent_capability_id]) {
            nodeMap[item.parent_capability_id].children!.push(node)
        } else if (!item.parent_capability_id) {
            roots.push(node)
        }
    }
    return roots
}

/**
 * Recursively collects all capability IDs at level 3 or deeper.
 */
function collectL3L4Ids(nodes: CapabilityNode[]): string[] {
    const ids: string[] = []
    function walk(node: CapabilityNode) {
        if (node.capability_level >= 3) ids.push(node.capability_id)
        node.children?.forEach(walk)
    }
    nodes.forEach(walk)
    return ids
}

/**
 * Builds a child-to-parent ID map for the entire tree.
 */
export function buildParentMap(nodes: CapabilityNode[]): Map<string, string> {
    const map = new Map<string, string>()
    function walk(node: CapabilityNode) {
        for (const child of node.children ?? []) {
            map.set(child.capability_id, node.capability_id)
            walk(child)
        }
    }
    nodes.forEach(walk)
    return map
}

/**
 * Given a set of capability IDs and a child-to-parent map, returns every
 * ancestor ID (all levels) for those IDs.
 */
export function collectAncestors(
    ids: Set<string>,
    parentMap: Map<string, string>
): Set<string> {
    const ancestors = new Set<string>()
    for (const id of ids) {
        let current = id
        while (parentMap.has(current)) {
            const parent = parentMap.get(current)!
            ancestors.add(parent)
            current = parent
        }
    }
    return ancestors
}

/**
 * Seeded Fisher–Yates shuffle — returns the first `n` items of the shuffled
 * copy. Using a fixed seed makes the result deterministic per build.
 */
function pickRandomSeeded<T>(arr: T[], n: number, seed = 42): T[] {
    const copy = [...arr]
    let s = seed
    const rand = () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff
        return Math.abs(s) / 0x80000000
    }
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy.slice(0, n)
}

/**
 * Derives a numeric seed from a journeyId string so each journey gets a
 * deterministic but distinct random capability selection.
 */
function seedFromJourneyId(journeyId: string): number {
    let seed = 0
    for (let i = 0; i < journeyId.length; i++) {
        seed = (seed + journeyId.charCodeAt(i) * (i + 1)) & 0xffffffff
    }
    return Math.abs(seed) || 42
}

const AI_PRESELECT_COUNT = 8

export type AICapabilitySelection = {
    aiCapabilityIds: Set<string>
    aiAncestorIds: string[]
}

/**
 * Returns a deterministic seeded-random set of L3/L4 capabilities as
 * "AI-recommended" for the given journey. Each journeyId produces a distinct
 * set. This is a placeholder — swap the internals for an API call when ready.
 */
export function getAICapabilitiesForJourney(
    capabilityHierarchy: CapabilityNode[],
    journeyId: string
): AICapabilitySelection {
    if (capabilityHierarchy.length === 0) {
        return { aiCapabilityIds: new Set(), aiAncestorIds: [] }
    }
    const allL3L4 = collectL3L4Ids(capabilityHierarchy)
    const seed = seedFromJourneyId(journeyId)
    const aiIds = new Set(
        pickRandomSeeded(
            allL3L4,
            Math.min(AI_PRESELECT_COUNT, allL3L4.length),
            seed
        )
    )
    const parentMap = buildParentMap(capabilityHierarchy)
    const ancestors = collectAncestors(aiIds, parentMap)
    return {
        aiCapabilityIds: aiIds,
        aiAncestorIds: Array.from(ancestors)
    }
}

/**
 * For each capability ID in the list, resolves the full path of names from
 * the L1 root down to that capability.
 *
 * Returns [{ id, l1Id, path }] where path[0] is the L1 name and the last
 * element is the selected capability's own name.
 *
 * Used by the submission summary modal to render capability breadcrumbs.
 */
export function getCapabilityPathsForIds(
    capabilityIds: string[],
    capabilityHierarchy: CapabilityNode[]
): { id: string; l1Id: string; path: string[] }[] {
    const nodeMap = new Map<string, CapabilityNode>()
    function buildMap(node: CapabilityNode) {
        nodeMap.set(node.capability_id, node)
        node.children?.forEach(buildMap)
    }
    capabilityHierarchy.forEach(buildMap)

    const parentMap = buildParentMap(capabilityHierarchy)

    return capabilityIds.flatMap(id => {
        const node = nodeMap.get(id)
        if (!node) return []
        const path: string[] = []
        let current: string | undefined = id
        while (current) {
            const n = nodeMap.get(current)
            if (n) path.unshift(n.capability_nm)
            current = parentMap.get(current)
        }
        return [{ id, l1Id: node.l1_capability_id, path }]
    })
}
