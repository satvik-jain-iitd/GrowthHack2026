import { renderHook, waitFor } from '@testing-library/react'
import { useCapabilitySelection } from './useCapabilitySelection'
import { useGetApptioJourneyCapabilities } from '@/app/business-architecture/hooks'
import { CapabilitySelectionStore } from '../components/CapabilitySelectionContext'
import type { CapabilityNode } from '@/app/business-architecture/types'
import type { CustomerJourney } from '@/app/enterprise-customer-journeys/components/CustomerJourneyDetails'

jest.mock('@/app/business-architecture/hooks', () => ({
    useGetApptioJourneyCapabilities: jest.fn()
}))

const mockUseGetApptioJourneyCapabilities =
    useGetApptioJourneyCapabilities as jest.Mock

function makeJourney(id: string): CustomerJourney {
    return {
        journey_id: id,
        journey_nm: `Journey ${id}`,
        journey_group_nm: 'Group A'
    } as CustomerJourney
}

function makeHierarchy(): CapabilityNode[] {
    return [
        {
            capability_id: 'l1',
            parent_capability_id: null,
            capability_key_tx: 'l1',
            capability_nm: 'L1',
            capability_desc_tx: '',
            capability_level: 1,
            begins_with_tx: '',
            ends_with_tx: '',
            includes_tx: '',
            customer_journey_id: '[]',
            product_tx: '[]',
            region_tx: '[]',
            customer_type: '[]',
            l1_capability_id: 'l1',
            children: [
                {
                    capability_id: 'l2',
                    parent_capability_id: 'l1',
                    capability_key_tx: 'l2',
                    capability_nm: 'L2',
                    capability_desc_tx: '',
                    capability_level: 2,
                    begins_with_tx: '',
                    ends_with_tx: '',
                    includes_tx: '',
                    customer_journey_id: [],
                    product_tx: [],
                    region_tx: [],
                    customer_type: [],
                    l1_capability_id: 'l1',
                    children: []
                }
            ]
        }
    ]
}

describe('useCapabilitySelection', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns loading state while capabilities are loading', () => {
        mockUseGetApptioJourneyCapabilities.mockReturnValue({
            journeyCapabilitiesMap: new Map(),
            isLoading: true
        })

        const store = new CapabilitySelectionStore()
        const { result } = renderHook(() =>
            useCapabilitySelection(
                'epic-1',
                [makeJourney('j1')],
                store,
                makeHierarchy()
            )
        )

        expect(result.current.capabilitiesLoading).toBe(true)
    })

    it('seeds store once capabilities finish loading', async () => {
        const capMap = new Map([
            [
                'j1',
                [
                    {
                        capability_id: 'l2',
                        name: 'L2',
                        level: 2,
                        isAIRecommended: true
                    }
                ]
            ]
        ])
        mockUseGetApptioJourneyCapabilities.mockReturnValue({
            journeyCapabilitiesMap: capMap,
            aiRecommendedCapabilities: new Map([['j1', ['l2']]]),
            isLoading: false
        })

        const store = new CapabilitySelectionStore()
        const initJourneysSpy = jest.spyOn(store, 'initJourneys')
        const initSelectedSpy = jest.spyOn(store, 'initSelectedForJourney')

        renderHook(() =>
            useCapabilitySelection(
                'epic-1',
                [makeJourney('j1')],
                store,
                makeHierarchy()
            )
        )

        await waitFor(() => {
            expect(initJourneysSpy).toHaveBeenCalledWith(['j1'])
            expect(initSelectedSpy).toHaveBeenCalledWith(
                'j1',
                new Set(['l2']),
                new Set(['l2'])
            )
        })
    })

    it('does not seed store when hierarchy is empty', () => {
        mockUseGetApptioJourneyCapabilities.mockReturnValue({
            journeyCapabilitiesMap: new Map(),
            isLoading: false
        })

        const store = new CapabilitySelectionStore()
        const initJourneysSpy = jest.spyOn(store, 'initJourneys')

        renderHook(() =>
            useCapabilitySelection('epic-1', [makeJourney('j1')], store, [])
        )

        expect(initJourneysSpy).not.toHaveBeenCalled()
    })

    it('does not seed store when no journeys are selected', () => {
        mockUseGetApptioJourneyCapabilities.mockReturnValue({
            journeyCapabilitiesMap: new Map(),
            isLoading: false
        })

        const store = new CapabilitySelectionStore()
        const initJourneysSpy = jest.spyOn(store, 'initJourneys')

        renderHook(() =>
            useCapabilitySelection('epic-1', [], store, makeHierarchy())
        )

        expect(initJourneysSpy).not.toHaveBeenCalled()
    })

    it('only seeds once even on re-render', () => {
        const capMap = new Map([
            [
                'j1',
                [
                    {
                        capability_id: 'l2',
                        name: 'L2',
                        level: 2,
                        isAIRecommended: false
                    }
                ]
            ]
        ])
        mockUseGetApptioJourneyCapabilities.mockReturnValue({
            journeyCapabilitiesMap: capMap,
            isLoading: false
        })

        const store = new CapabilitySelectionStore()
        const initJourneysSpy = jest.spyOn(store, 'initJourneys')

        const { rerender } = renderHook(() =>
            useCapabilitySelection(
                'epic-1',
                [makeJourney('j1')],
                store,
                makeHierarchy()
            )
        )

        rerender()
        rerender()

        expect(initJourneysSpy).toHaveBeenCalledTimes(1)
    })

    it('populates aiAncestorsByJourney with ancestor IDs', async () => {
        const capMap = new Map([
            [
                'j1',
                [
                    {
                        capability_id: 'l2',
                        name: 'L2',
                        level: 2,
                        isAIRecommended: false
                    }
                ]
            ]
        ])
        mockUseGetApptioJourneyCapabilities.mockReturnValue({
            journeyCapabilitiesMap: capMap,
            isLoading: false
        })

        const store = new CapabilitySelectionStore()

        const { result } = renderHook(() =>
            useCapabilitySelection(
                'epic-1',
                [makeJourney('j1')],
                store,
                makeHierarchy()
            )
        )

        await waitFor(() => {
            // l2's parent is l1, so ancestors should include l1
            expect(result.current.aiAncestorsByJourney.get('j1')).toContain(
                'l1'
            )
        })
    })
})
