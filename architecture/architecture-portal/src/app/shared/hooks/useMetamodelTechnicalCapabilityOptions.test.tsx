import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMetamodelTechnicalCapabilityOptions } from './useMetamodelTechnicalCapabilityOptions'
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

describe('useMetamodelTechnicalCapabilityOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches from the technical capabilities endpoint', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ page: 1, pageSize: 500, total: 0, data: [] })
        })

        const { result } = renderHook(
            () => useMetamodelTechnicalCapabilityOptions(),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(global.fetch).toHaveBeenCalledWith(
            `${API_ENDPOINTS.METAMODEL_LIST_TECHNICAL_CAPABILITIES}?pageSize=500`,
            undefined
        )
    })

    it('returns the data array of options', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                page: 1,
                pageSize: 500,
                total: 2,
                data: [
                    { technicalCapabilityId: 'tc-1', name: 'Streaming' },
                    { technicalCapabilityId: 'tc-2', name: 'Caching' }
                ]
            })
        })

        const { result } = renderHook(
            () => useMetamodelTechnicalCapabilityOptions(),
            { wrapper: createWrapper() }
        )

        await waitFor(() =>
            expect(result.current.technicalCapabilityOptions).toBeDefined()
        )

        expect(result.current.technicalCapabilityOptions).toEqual([
            { technicalCapabilityId: 'tc-1', name: 'Streaming' },
            { technicalCapabilityId: 'tc-2', name: 'Caching' }
        ])
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(
            () => useMetamodelTechnicalCapabilityOptions(),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.error).toBeTruthy())

        expect((result.current.error as Error)?.message).toBe(
            'Failed to fetch metamodel technical capabilities: 500'
        )
    })
})
