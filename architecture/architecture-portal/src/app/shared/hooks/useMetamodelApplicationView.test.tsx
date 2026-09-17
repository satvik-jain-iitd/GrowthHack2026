import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    fetchStagedMetamodelApplication,
    useMetamodelApplicationView
} from './useMetamodelApplicationView'
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

describe('fetchStagedMetamodelApplication', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('returns the first staged application from the response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce(
            jsonResponse([{ applicationId: 'app-1' }])
        )

        const result = await fetchStagedMetamodelApplication('app-1')

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_GET_STAGED_APPLICATION('app-1'),
            undefined
        )
        expect(result).toEqual({ applicationId: 'app-1' })
    })

    it('returns null on 404', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        await expect(
            fetchStagedMetamodelApplication('missing')
        ).resolves.toBeNull()
    })

    it('throws on other errors', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 503,
            statusText: 'Unavailable'
        })

        await expect(fetchStagedMetamodelApplication('app-1')).rejects.toThrow(
            'Failed to fetch staged metamodel application: 503 Unavailable'
        )
    })
})

describe('useMetamodelApplicationView', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('does not read the staged endpoint when the application has a user update', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce(
            jsonResponse([
                {
                    applicationId: 'app-1',
                    lastUserUpdateTs: '2026-02-02T00:00:00.000Z',
                    marketsSupported: ['US']
                }
            ])
        )

        const { result } = renderHook(
            () => useMetamodelApplicationView('app-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(result.current.isStaged).toBe(false)
        expect(result.current.recommendedValues.markets).toEqual([])
    })

    it('renders staged data and diffs recommendations when there is no user update', async () => {
        ;(global.fetch as jest.Mock)
            .mockResolvedValueOnce(
                jsonResponse([
                    {
                        applicationId: 'app-1',
                        lastUserUpdateTs: null,
                        marketsSupported: [],
                        techCapabilities: []
                    }
                ])
            )
            .mockResolvedValueOnce(
                jsonResponse([
                    {
                        applicationId: 'app-1',
                        lastUserUpdateTs: null,
                        marketsSupported: ['MX'],
                        techCapabilities: ['tc-1']
                    }
                ])
            )

        const { result } = renderHook(
            () => useMetamodelApplicationView('app-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isStaged).toBe(true))

        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            API_ENDPOINTS.METAMODEL_GET_STAGED_APPLICATION('app-1'),
            undefined
        )
        expect(result.current.data?.marketsSupported).toEqual(['MX'])
        expect(result.current.recommendedValues.markets).toEqual(['MX'])
        expect(result.current.recommendedValues.technicalCapabilities).toEqual([
            'tc-1'
        ])
    })

    it('is disabled without an id', () => {
        const { result } = renderHook(() => useMetamodelApplicationView(''), {
            wrapper: createWrapper()
        })

        expect(global.fetch).not.toHaveBeenCalled()
        expect(result.current.isStaged).toBe(false)
    })
})
