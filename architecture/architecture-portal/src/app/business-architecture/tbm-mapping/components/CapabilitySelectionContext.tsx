'use client'
import React, {
    createContext,
    useContext,
    useMemo,
    useSyncExternalStore
} from 'react'

// ---------------------------------------------------------------------------
// External store — mutations never cause parent re-renders.
// Capabilities are tracked per journey. All reads are scoped to the active
// journey, so existing hooks (useIsCapabilitySelected, etc.) need no changes.
// ---------------------------------------------------------------------------

export class CapabilitySelectionStore {
    private _selected = new Map<string, Set<string>>()
    private _aiSelected = new Map<string, Set<string>>()
    private _activeJourneyId: string | null = null
    private _listeners = new Set<() => void>()

    readonly subscribe = (listener: () => void): (() => void) => {
        this._listeners.add(listener)
        return () => this._listeners.delete(listener)
    }

    private notify() {
        this._listeners.forEach(l => l())
    }

    /** Pre-create empty selection sets for every journey. */
    initJourneys(journeyIds: string[]): void {
        for (const id of journeyIds) {
            if (!this._selected.has(id)) this._selected.set(id, new Set())
            if (!this._aiSelected.has(id)) this._aiSelected.set(id, new Set())
        }
        // Set the first journey as the default active if none is set yet
        if (this._activeJourneyId === null && journeyIds.length > 0) {
            this._activeJourneyId = journeyIds[0]
        }
        this.notify()
    }

    /** Seed AI-recommended capability IDs for a specific journey — also pre-selects them. */
    initAiSelectedForJourney(journeyId: string, ids: Set<string>): void {
        this._aiSelected.set(journeyId, new Set(ids))
        this._selected.set(journeyId, new Set(ids))
        this.notify()
    }

    /** Seed selected and AI-recommended capability IDs separately for a journey. */
    initSelectedForJourney(
        journeyId: string,
        selectedIds: Set<string>,
        aiIds: Set<string>
    ): void {
        this._selected.set(journeyId, new Set(selectedIds))
        this._aiSelected.set(journeyId, new Set(aiIds))
        this.notify()
    }

    setActiveJourney(journeyId: string): void {
        this._activeJourneyId = journeyId
        this.notify()
    }

    getActiveJourneyId(): string | null {
        return this._activeJourneyId
    }

    readonly toggle = (id: string): void => {
        const journeyId = this._activeJourneyId
        if (!journeyId) return
        const current = this._selected.get(journeyId) ?? new Set<string>()
        const next = new Set(current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        this._selected.set(journeyId, next)
        this.notify()
    }

    isSelected(id: string): boolean {
        const journeyId = this._activeJourneyId
        if (!journeyId) return false
        return this._selected.get(journeyId)?.has(id) ?? false
    }

    isAISelected(id: string): boolean {
        const journeyId = this._activeJourneyId
        if (!journeyId) return false
        return this._aiSelected.get(journeyId)?.has(id) ?? false
    }

    /** Count for the active journey. */
    getCount(): number {
        const journeyId = this._activeJourneyId
        if (!journeyId) return 0
        return this._selected.get(journeyId)?.size ?? 0
    }

    getSelectedForJourney(journeyId: string): Set<string> {
        return this._selected.get(journeyId) ?? new Set()
    }

    getAllJourneyCapabilities(): {
        journey_id: string
        capability_ids: string[]
    }[] {
        const result: { journey_id: string; capability_ids: string[] }[] = []
        for (const [journeyId, ids] of this._selected.entries()) {
            result.push({
                journey_id: journeyId,
                capability_ids: Array.from(ids)
            })
        }
        return result
    }

    getAllJourneyAICapabilities(): {
        journey_id: string
        capability_ids: string[]
    }[] {
        const result: { journey_id: string; capability_ids: string[] }[] = []
        for (const [journeyId, ids] of this._aiSelected.entries()) {
            result.push({
                journey_id: journeyId,
                capability_ids: Array.from(ids)
            })
        }
        return result
    }

    getTotalCount(): number {
        let total = 0
        for (const ids of this._selected.values()) {
            total += ids.size
        }
        return total
    }

    /** Returns true if every journey has at least one capability selected. */
    allJourneysComplete(): boolean {
        if (this._selected.size === 0) return false
        for (const ids of this._selected.values()) {
            if (ids.size === 0) return false
        }
        return true
    }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CapabilityStoreContext = createContext<CapabilitySelectionStore | null>(
    null
)

export function CapabilitySelectionProvider({
    store,
    children
}: {
    store: CapabilitySelectionStore
    children: React.ReactNode
}) {
    return (
        <CapabilityStoreContext.Provider value={store}>
            {children}
        </CapabilityStoreContext.Provider>
    )
}

function useStore(): CapabilitySelectionStore {
    const store = useContext(CapabilityStoreContext)
    if (!store) throw new Error('CapabilitySelectionProvider is required')
    return store
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Re-renders ONLY when this specific capability's checked state changes. */
export function useIsCapabilitySelected(id: string): boolean {
    const store = useStore()
    return useSyncExternalStore(
        store.subscribe,
        () => store.isSelected(id),
        () => store.isSelected(id)
    )
}

/** Re-renders ONLY when this specific capability's AI-selected state changes. */
export function useIsCapabilityAISelected(id: string): boolean {
    const store = useStore()
    return useSyncExternalStore(
        store.subscribe,
        () => store.isAISelected(id),
        () => store.isAISelected(id)
    )
}

/** Stable reference — never causes a re-render on its own. */
export function useCapabilityToggle(): (id: string) => void {
    return useStore().toggle
}

/** Re-renders only when the active journey's selected count changes. */
export function useSelectedCount(): number {
    const store = useStore()
    return useSyncExternalStore(
        store.subscribe,
        () => store.getCount(),
        () => store.getCount()
    )
}

/** Re-renders when the specified journey's selected count changes. */
export function useJourneySelectedCount(journeyId: string): number {
    const store = useStore()
    return useSyncExternalStore(
        store.subscribe,
        () => store.getSelectedForJourney(journeyId).size,
        () => store.getSelectedForJourney(journeyId).size
    )
}

/** Re-renders when the active journey ID changes. */
export function useActiveJourneyId(): string | null {
    const store = useStore()
    return useSyncExternalStore(
        store.subscribe,
        () => store.getActiveJourneyId(),
        () => store.getActiveJourneyId()
    )
}

/** Returns a getter (not reactive) — safe to call at submit time. */
export function useGetAllJourneyCapabilities(): () => {
    journey_id: string
    capability_ids: string[]
}[] {
    const store = useStore()
    return useMemo(() => store.getAllJourneyCapabilities.bind(store), [store])
}

/** Returns a getter (not reactive) — safe to call at submit time. */
export function useGetAllJourneyAICapabilities(): () => {
    journey_id: string
    capability_ids: string[]
}[] {
    const store = useStore()
    return useMemo(() => store.getAllJourneyAICapabilities.bind(store), [store])
}

/** Re-renders when the total selected count across all journeys changes. */
export function useTotalSelectedCount(): number {
    const store = useStore()
    return useSyncExternalStore(
        store.subscribe,
        () => store.getTotalCount(),
        () => store.getTotalCount()
    )
}

/** Re-renders when the all-journeys-complete state changes. */
export function useAllJourneysComplete(): boolean {
    const store = useStore()
    return useSyncExternalStore(
        store.subscribe,
        () => store.allJourneysComplete(),
        () => store.allJourneysComplete()
    )
}
