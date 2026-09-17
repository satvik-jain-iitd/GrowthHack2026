import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    fetchStagedMetamodelInitiative,
    useMetamodelInitiativeView
} from './useMetamodelInitiativeView'
import { API_ENDPOINTS } from '@/constants'

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

const jsonResponse = (body: unknown) => ({
    ok: true,
    status: 200,
    json: async () => body
})

describe('fetchStagedMetamodelInitiative', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('returns the first staged initiative from the response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce(
            jsonResponse([{ initiativeId: 'i-1' }])
        )

        const result = await fetchStagedMetamodelInitiative('i-1')

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_GET_STAGED_INITIATIVE('i-1'),
            undefined
        )
        expect(result).toEqual({ initiativeId: 'i-1' })
    })

    it('returns null on 404', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        await expect(
            fetchStagedMetamodelInitiative('missing')
        ).resolves.toBeNull()
    })

    it('throws on other errors', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        await expect(fetchStagedMetamodelInitiative('i-1')).rejects.toThrow(
            'Failed to fetch staged metamodel initiative: 500 Server Error'
        )
    })
})

describe('useMetamodelInitiativeView', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('does not read the staged endpoint when the initiative has a user update', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce(
            jsonResponse([
                {
                    initiativeId: 'i-1',
                    lastUserUpdateTs: '2026-01-01T00:00:00.000Z',
                    supportedMarkets: ['US']
                }
            ])
        )

        const { result } = renderHook(() => useMetamodelInitiativeView('i-1'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_GET_INITIATIVE('i-1'),
            undefined
        )
        expect(result.current.isStaged).toBe(false)
        expect(result.current.data?.supportedMarkets).toEqual(['US'])
        expect(result.current.recommendedValues.markets).toEqual([])
    })

    it('renders staged data and diffs recommendations when there is no user update', async () => {
        ;(global.fetch as jest.Mock)
            .mockResolvedValueOnce(
                jsonResponse([
                    {
                        initiativeId: 'i-1',
                        lastUserUpdateTs: null,
                        supportedMarkets: ['US'],
                        technologyStacks: []
                    }
                ])
            )
            .mockResolvedValueOnce(
                jsonResponse([
                    {
                        initiativeId: 'i-1',
                        lastUserUpdateTs: null,
                        supportedMarkets: ['US', 'GB'],
                        technologyStacks: ['ts-1']
                    }
                ])
            )

        const { result } = renderHook(() => useMetamodelInitiativeView('i-1'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isStaged).toBe(true))

        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            API_ENDPOINTS.METAMODEL_GET_STAGED_INITIATIVE('i-1'),
            undefined
        )
        expect(result.current.data?.supportedMarkets).toEqual(['US', 'GB'])
        expect(result.current.recommendedValues.markets).toEqual(['GB'])
        expect(result.current.recommendedValues.techStacks).toEqual(['ts-1'])
    })

    it('refetches both reads', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            jsonResponse([{ initiativeId: 'i-1', lastUserUpdateTs: null }])
        )

        const { result } = renderHook(() => useMetamodelInitiativeView('i-1'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isStaged).toBe(true))
        result.current.refetch()

        await waitFor(() =>
            expect((global.fetch as jest.Mock).mock.calls.length).toBe(4)
        )
    })

    it('is disabled without an id', () => {
        const { result } = renderHook(() => useMetamodelInitiativeView(''), {
            wrapper: createWrapper()
        })

        expect(global.fetch).not.toHaveBeenCalled()
        expect(result.current.isStaged).toBe(false)
    })
})
