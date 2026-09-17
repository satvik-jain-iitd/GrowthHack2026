import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useGetApptioEpicMappings,
    fetchApptioEpicMappings,
    APPTIO_EPIC_MAPPINGS_QUERY_KEY
} from './useGetApptioEpicMappings'

describe('useGetApptioEpicMappings', () => {
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

    describe('fetchApptioEpicMappings', () => {
        it('returns mappings array on success', async () => {
            const mockData = [
                {
                    journeyId: 'j1',
                    isAIRecommended: 'true',
                    capabilities: [
                        { capability_id: 'c1', isAIRecommended: 'true' }
                    ]
                }
            ]
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const result = await fetchApptioEpicMappings('epic-1')
            expect(result).toEqual(mockData)
        })

        it('returns empty array when response is not an array', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ unexpected: 'data' })
            })

            const result = await fetchApptioEpicMappings('epic-1')
            expect(result).toEqual([])
        })

        it('throws on non-ok response', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            })

            await expect(fetchApptioEpicMappings('epic-1')).rejects.toThrow(
                'Failed to fetch epic mappings: 404 Not Found'
            )
        })
    })

    describe('useGetApptioEpicMappings hook', () => {
        it('returns mappings on successful fetch', async () => {
            const mockData = [
                {
                    journeyId: 'j1',
                    isAIRecommended: 'false',
                    capabilities: []
                }
            ]
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetApptioEpicMappings('epic-1'),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false)
            })

            expect(result.current.mappings).toEqual(mockData)
            expect(result.current.error).toBeNull()
        })

        it('returns empty mappings when epicId is empty', () => {
            const wrapper = createWrapper()
            const { result } = renderHook(() => useGetApptioEpicMappings(''), {
                wrapper
            })

            expect(result.current.mappings).toEqual([])
        })
    })

    describe('APPTIO_EPIC_MAPPINGS_QUERY_KEY', () => {
        it('returns correct key shape', () => {
            expect(APPTIO_EPIC_MAPPINGS_QUERY_KEY('epic-1')).toEqual([
                'apptio_epic_mappings',
                'epic-1'
            ])
        })
    })
})
