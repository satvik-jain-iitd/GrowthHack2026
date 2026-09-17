import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useMetamodelInitiative,
    fetchMetamodelInitiative
} from './useMetamodelInitiative'
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

describe('fetchMetamodelInitiative', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('returns the first initiative from the response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => [{ initiativeId: 'i-1' }]
        })

        const result = await fetchMetamodelInitiative('i-1')

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_GET_INITIATIVE('i-1'),
            undefined
        )
        expect(result).toEqual({ initiativeId: 'i-1' })
    })

    it('returns null on 404', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        await expect(fetchMetamodelInitiative('missing')).resolves.toBeNull()
    })

    it('returns null when the response array is empty', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => []
        })

        await expect(fetchMetamodelInitiative('i-1')).resolves.toBeNull()
    })

    it('throws on other errors', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        await expect(fetchMetamodelInitiative('i-1')).rejects.toThrow(
            'Failed to fetch metamodel initiative: 500 Server Error'
        )
    })
})

describe('useMetamodelInitiative', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches the initiative when an id is provided', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => [{ initiativeId: 'i-1' }]
        })

        const { result } = renderHook(() => useMetamodelInitiative('i-1'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual({ initiativeId: 'i-1' })
    })

    it('is disabled when no id is provided', () => {
        const { result } = renderHook(() => useMetamodelInitiative(''), {
            wrapper: createWrapper()
        })

        expect(result.current.fetchStatus).toBe('idle')
        expect(global.fetch).not.toHaveBeenCalled()
    })
})
