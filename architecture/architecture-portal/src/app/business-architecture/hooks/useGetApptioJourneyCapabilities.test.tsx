import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useGetApptioJourneyCapabilities,
    fetchApptioJourneyCapabilities,
    APPTIO_JOURNEY_CAPABILITIES_QUERY_KEY
} from './useGetApptioJourneyCapabilities'

describe('useGetApptioJourneyCapabilities', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        })
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        return wrapper
    }

    describe('fetchApptioJourneyCapabilities', () => {
        it('returns capabilities array on success', async () => {
            const mockData = [
                {
                    capability_id: 'c1',
                    name: 'Cap 1',
                    level: 3,
                    isAIRecommended: true
                }
            ]
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const result = await fetchApptioJourneyCapabilities('epic-1', 'j1')
            expect(result).toEqual(mockData)
        })

        it('throws on non-ok response', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            })

            await expect(
                fetchApptioJourneyCapabilities('epic-1', 'j1')
            ).rejects.toThrow(
                'Failed to fetch journey capabilities: 500 Internal Server Error'
            )
        })
    })

    describe('useGetApptioJourneyCapabilities hook', () => {
        it('fetches capabilities for each journey and returns a map', async () => {
            const mockCaps1 = {
                capabilities: [
                    {
                        capability_id: 'c1',
                        name: 'Cap 1',
                        level: 3,
                        isAIRecommended: true
                    }
                ],
                isRecommended: ['c1']
            }
            const mockCaps2 = {
                capabilities: [
                    {
                        capability_id: 'c2',
                        name: 'Cap 2',
                        level: 2,
                        isAIRecommended: false
                    }
                ],
                isRecommended: []
            }
            ;(global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockCaps1
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockCaps2
                })

            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetApptioJourneyCapabilities('epic-1', ['j1', 'j2']),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            expect(result.current.journeyCapabilitiesMap.get('j1')).toEqual(
                mockCaps1.capabilities
            )
            expect(result.current.journeyCapabilitiesMap.get('j2')).toEqual(
                mockCaps2.capabilities
            )
        })

        it('returns empty map when no journey IDs provided', () => {
            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetApptioJourneyCapabilities('epic-1', []),
                { wrapper }
            )

            expect(result.current.journeyCapabilitiesMap.size).toBe(0)
            expect(result.current.isLoading).toBe(false)
        })
    })

    describe('APPTIO_JOURNEY_CAPABILITIES_QUERY_KEY', () => {
        it('returns correct key shape', () => {
            expect(
                APPTIO_JOURNEY_CAPABILITIES_QUERY_KEY('epic-1', 'j1')
            ).toEqual(['apptio_journey_capabilities', 'epic-1', 'j1'])
        })
    })
})
