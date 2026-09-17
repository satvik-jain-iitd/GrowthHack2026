import { useQuery } from '@tanstack/react-query'

import { fetchPTBInitiative } from '@/app/initiatives/hooks/usePtbInitiative'

/**
 * The metamodel stores initiative technology stacks as raw ids. Human-readable
 * tech-stack names live in architecture-api's PTB initiative metadata (the same
 * source the legacy initiative-management pages render). Rather than eagerly
 * fetching a PTB detail for every initiative in the grid, this resolves names
 * on demand — only when a row's Tech Stacks popover is opened.
 */
export const INITIATIVE_TECH_STACKS_QUERY_KEY = (id: string) => [
    'metamodel',
    'initiative-tech-stacks',
    id
]

/** Flatten PTB metadata (an array of single-key objects) and read a category. */
function readMetadataValues(
    metadata: object[] | undefined,
    key: string
): string[] {
    const flattened: Record<string, string[]> = {}
    metadata?.forEach(obj => {
        Object.entries(obj).forEach(([k, value]) => {
            if (Array.isArray(value)) {
                flattened[k] = value as string[]
            }
        })
    })
    return flattened[key] ?? []
}

export async function fetchInitiativeTechStacks(
    initiativeId: string
): Promise<string[]> {
    const initiative = await fetchPTBInitiative(initiativeId)
    return readMetadataValues(initiative.metadata, 'Tech Stacks')
}

export function useInitiativeTechStacks(
    initiativeId: string,
    enabled: boolean
) {
    const query = useQuery<string[], Error>({
        queryKey: INITIATIVE_TECH_STACKS_QUERY_KEY(initiativeId),
        queryFn: () => fetchInitiativeTechStacks(initiativeId),
        enabled: enabled && !!initiativeId
    })
    return { techStacks: query.data ?? [], loading: query.isLoading }
}
