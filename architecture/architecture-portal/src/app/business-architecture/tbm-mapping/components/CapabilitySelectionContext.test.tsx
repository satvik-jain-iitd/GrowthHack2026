import React from 'react'
import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import {
    CapabilitySelectionStore,
    CapabilitySelectionProvider,
    useIsCapabilitySelected,
    useIsCapabilityAISelected,
    useCapabilityToggle,
    useSelectedCount,
    useActiveJourneyId,
    useGetAllJourneyCapabilities,
    useGetAllJourneyAICapabilities,
    useTotalSelectedCount
} from './CapabilitySelectionContext'

// ---------------------------------------------------------------------------
// Wrapper helpers
// ---------------------------------------------------------------------------

function makeWrapper(store: CapabilitySelectionStore) {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <CapabilitySelectionProvider store={store}>
            {children}
        </CapabilitySelectionProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

// ---------------------------------------------------------------------------
// CapabilitySelectionStore — class tests (no React)
// ---------------------------------------------------------------------------

describe('CapabilitySelectionStore', () => {
    let store: CapabilitySelectionStore

    beforeEach(() => {
        store = new CapabilitySelectionStore()
    })

    it('starts with no active journey', () => {
        expect(store.getActiveJourneyId()).toBeNull()
    })

    it('initJourneys with empty array leaves active journey null', () => {
        store.initJourneys([])
        expect(store.getActiveJourneyId()).toBeNull()
    })

    it('initJourneys sets first journey as active', () => {
        store.initJourneys(['j1', 'j2'])
        expect(store.getActiveJourneyId()).toBe('j1')
    })

    it('calling initJourneys again does not overwrite existing sets', () => {
        store.initJourneys(['j1'])
        act(() => store.toggle('c1'))
        store.initJourneys(['j1', 'j2'])
        // j1's selected set should still contain 'c1'
        expect(store.getSelectedForJourney('j1').has('c1')).toBe(true)
    })

    it('initAiSelectedForJourney seeds both AI and regular selection', () => {
        store.initJourneys(['j1'])
        store.initAiSelectedForJourney('j1', new Set(['c1', 'c2']))
        expect(store.isAISelected('c1')).toBe(true)
        expect(store.isSelected('c1')).toBe(true)
        expect(store.isAISelected('c2')).toBe(true)
    })

    it('setActiveJourney changes the active journey', () => {
        store.initJourneys(['j1', 'j2'])
        store.setActiveJourney('j2')
        expect(store.getActiveJourneyId()).toBe('j2')
    })

    it('toggle adds a capability to the active journey selection', () => {
        store.initJourneys(['j1'])
        act(() => store.toggle('c1'))
        expect(store.isSelected('c1')).toBe(true)
    })

    it('toggle removes a capability when already selected', () => {
        store.initJourneys(['j1'])
        act(() => store.toggle('c1'))
        act(() => store.toggle('c1'))
        expect(store.isSelected('c1')).toBe(false)
    })

    it('toggle with no active journey is a no-op', () => {
        expect(() => act(() => store.toggle('c1'))).not.toThrow()
        expect(store.getCount()).toBe(0)
    })

    it('isSelected returns false when no active journey', () => {
        expect(store.isSelected('c1')).toBe(false)
    })

    it('isAISelected returns false when no active journey', () => {
        expect(store.isAISelected('c1')).toBe(false)
    })

    it('getCount returns 0 when no active journey', () => {
        expect(store.getCount()).toBe(0)
    })

    it('getCount reflects the active journey selection size', () => {
        store.initJourneys(['j1'])
        act(() => store.toggle('c1'))
        act(() => store.toggle('c2'))
        expect(store.getCount()).toBe(2)
    })

    it('getSelectedForJourney returns empty Set for unknown journey', () => {
        expect(store.getSelectedForJourney('unknown').size).toBe(0)
    })

    it('getAllJourneyCapabilities returns entries for each journey', () => {
        store.initJourneys(['j1', 'j2'])
        act(() => store.toggle('c1'))
        store.setActiveJourney('j2')
        act(() => store.toggle('c2'))
        const all = store.getAllJourneyCapabilities()
        const j1Entry = all.find(e => e.journey_id === 'j1')
        const j2Entry = all.find(e => e.journey_id === 'j2')
        expect(j1Entry?.capability_ids).toContain('c1')
        expect(j2Entry?.capability_ids).toContain('c2')
    })

    it('getAllJourneyAICapabilities returns AI-seeded entries', () => {
        store.initJourneys(['j1'])
        store.initAiSelectedForJourney('j1', new Set(['c1']))
        const all = store.getAllJourneyAICapabilities()
        expect(all[0].capability_ids).toContain('c1')
    })

    it('getTotalCount sums selected capabilities across all journeys', () => {
        store.initJourneys(['j1', 'j2'])
        act(() => store.toggle('c1'))
        store.setActiveJourney('j2')
        act(() => store.toggle('c2'))
        act(() => store.toggle('c3'))
        expect(store.getTotalCount()).toBe(3)
    })

    it('subscribe listener is called on initJourneys', () => {
        const listener = jest.fn()
        store.subscribe(listener)
        store.initJourneys(['j1'])
        expect(listener).toHaveBeenCalled()
    })

    it('subscribe listener is called on toggle', () => {
        store.initJourneys(['j1'])
        const listener = jest.fn()
        store.subscribe(listener)
        act(() => store.toggle('c1'))
        expect(listener).toHaveBeenCalled()
    })

    it('unsubscribe stops future notifications', () => {
        const listener = jest.fn()
        const unsub = store.subscribe(listener)
        unsub()
        store.initJourneys(['j1'])
        expect(listener).not.toHaveBeenCalled()
    })
})

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

describe('useIsCapabilitySelected', () => {
    it('returns false initially', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useIsCapabilitySelected('c1'), {
            wrapper: makeWrapper(store)
        })
        expect(result.current).toBe(false)
    })

    it('returns true after toggle', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useIsCapabilitySelected('c1'), {
            wrapper: makeWrapper(store)
        })
        act(() => store.toggle('c1'))
        expect(result.current).toBe(true)
    })
})

describe('useIsCapabilityAISelected', () => {
    it('returns false before seeding', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useIsCapabilityAISelected('c1'), {
            wrapper: makeWrapper(store)
        })
        expect(result.current).toBe(false)
    })

    it('returns true after AI seeding', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useIsCapabilityAISelected('c1'), {
            wrapper: makeWrapper(store)
        })
        act(() => store.initAiSelectedForJourney('j1', new Set(['c1'])))
        expect(result.current).toBe(true)
    })
})

describe('useCapabilityToggle', () => {
    it('returns a stable toggle function that toggles selection', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useCapabilityToggle(), {
            wrapper: makeWrapper(store)
        })
        act(() => result.current('c1'))
        expect(store.isSelected('c1')).toBe(true)
        act(() => result.current('c1'))
        expect(store.isSelected('c1')).toBe(false)
    })
})

describe('useSelectedCount', () => {
    it('returns 0 initially', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useSelectedCount(), {
            wrapper: makeWrapper(store)
        })
        expect(result.current).toBe(0)
    })

    it('increments after toggle', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useSelectedCount(), {
            wrapper: makeWrapper(store)
        })
        act(() => store.toggle('c1'))
        expect(result.current).toBe(1)
    })
})

describe('useActiveJourneyId', () => {
    it('returns null before init', () => {
        const store = new CapabilitySelectionStore()
        const { result } = renderHook(() => useActiveJourneyId(), {
            wrapper: makeWrapper(store)
        })
        expect(result.current).toBeNull()
    })

    it('returns the first journey id after initJourneys', () => {
        const store = new CapabilitySelectionStore()
        const { result } = renderHook(() => useActiveJourneyId(), {
            wrapper: makeWrapper(store)
        })
        act(() => store.initJourneys(['j1', 'j2']))
        expect(result.current).toBe('j1')
    })
})

describe('useGetAllJourneyCapabilities', () => {
    it('returns a callable getter function', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        const { result } = renderHook(() => useGetAllJourneyCapabilities(), {
            wrapper: makeWrapper(store)
        })
        expect(typeof result.current).toBe('function')
        const data = result.current()
        expect(Array.isArray(data)).toBe(true)
    })
})

describe('useGetAllJourneyAICapabilities', () => {
    it('returns a callable getter that reflects AI selections', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1'])
        store.initAiSelectedForJourney('j1', new Set(['c1']))
        const { result } = renderHook(() => useGetAllJourneyAICapabilities(), {
            wrapper: makeWrapper(store)
        })
        const data = result.current()
        expect(data[0].capability_ids).toContain('c1')
    })
})

describe('useTotalSelectedCount', () => {
    it('returns 0 when nothing selected', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1', 'j2'])
        const { result } = renderHook(() => useTotalSelectedCount(), {
            wrapper: makeWrapper(store)
        })
        expect(result.current).toBe(0)
    })

    it('sums across all journeys', () => {
        const store = new CapabilitySelectionStore()
        store.initJourneys(['j1', 'j2'])
        act(() => store.toggle('c1'))
        store.setActiveJourney('j2')
        act(() => store.toggle('c2'))
        const { result } = renderHook(() => useTotalSelectedCount(), {
            wrapper: makeWrapper(store)
        })
        expect(result.current).toBe(2)
    })
})

describe('useStore error boundary', () => {
    it('throws when no CapabilitySelectionProvider is present', () => {
        const consoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        expect(() => renderHook(() => useSelectedCount())).toThrow(
            'CapabilitySelectionProvider is required'
        )
        consoleError.mockRestore()
    })
})
