import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useGetApptioEpicJourneys,
    fetchApptioEpicJourneys,
    APPTIO_EPIC_JOURNEYS_QUERY_KEY
} from './useGetApptioEpicJourneys'

describe('useGetApptioEpicJourneys', () => {
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

    describe('fetchApptioEpicJourneys', () => {
        it('returns journey array on success', async () => {
            const mockData = [
                {
                    journeyId: 'j1',
                    journeyName: 'Journey 1',
                    journeyGroup: 'Group A',
                    isAIRecommended: false
                }
            ]
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const result = await fetchApptioEpicJourneys('epic-1')
            expect(result).toEqual(mockData)
        })

        it('throws on non-ok response', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                json: async () => ({ message: 'Not Found' })
            })

            await expect(fetchApptioEpicJourneys('epic-1')).rejects.toThrow(
                'Failed to fetch apptio epic journeys'
            )
        })
    })

    describe('useGetApptioEpicJourneys hook', () => {
        it('returns journeys on successful fetch', async () => {
            const mockJourneys = [
                {
                    journeyId: 'j1',
                    journeyName: 'Journey 1',
                    journeyGroup: 'Group A',
                    isAIRecommended: false
                }
            ]

            const mockData = {
                journeys: mockJourneys,
                isRecommended: mockJourneys.map(j => j.journeyId)
            }

            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetApptioEpicJourneys('epic-1'),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.epicJourneys).toEqual(mockData.journeys)
        })

        it('limits to 5 journeys when all are AI recommended', async () => {
            const mockJourneys = Array.from({ length: 10 }, (_, i) => ({
                journeyId: `j${i}`,
                journeyName: `Journey ${i}`,
                journeyGroup: 'Group A',
                isAIRecommended: true
            }))

            const mockData = {
                journeys: mockJourneys,
                isRecommended: mockJourneys.map(j => j.journeyId)
            }
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetApptioEpicJourneys('epic-1'),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.epicJourneys).toHaveLength(5)
        })

        it('does not limit when not all journeys are AI recommended', async () => {
            const mockJourneys = Array.from({ length: 10 }, (_, i) => ({
                journeyId: `j${i}`,
                journeyName: `Journey ${i}`,
                journeyGroup: 'Group A',
                isAIRecommended: i < 5
            }))

            const mockData = {
                journeys: mockJourneys,
                isRecommended: mockJourneys.map(j => j.journeyId)
            }
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetApptioEpicJourneys('epic-1'),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.epicJourneys).toHaveLength(10)
        })

        it('is disabled when epicId is empty', async () => {
            const wrapper = createWrapper()
            const { result } = renderHook(() => useGetApptioEpicJourneys(''), {
                wrapper
            })

            // Should remain loading because query is disabled
            expect(result.current.loading).toBe(false)
            expect(result.current.epicJourneys).toEqual([])
        })
    })

    describe('APPTIO_EPIC_JOURNEYS_QUERY_KEY', () => {
        it('returns correct key shape', () => {
            expect(APPTIO_EPIC_JOURNEYS_QUERY_KEY('epic-1')).toEqual([
                'apptio_epic_journeys',
                'epic-1'
            ])
        })
    })
})
