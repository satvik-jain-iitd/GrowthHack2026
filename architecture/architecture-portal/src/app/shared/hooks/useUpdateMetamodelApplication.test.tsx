import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUpdateMetamodelApplication } from './useUpdateMetamodelApplication'
import { METAMODEL_APPLICATION_QUERY_KEY } from './useMetamodelApplication'
import { API_ENDPOINTS } from '@/constants'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
    }
})

const createWrapper = () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

describe('useUpdateMetamodelApplication', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('PATCHes the application and invalidates the query on success', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ applicationId: 'app-1' })
        })
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(
            () => useUpdateMetamodelApplication('app-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({ applicationName: 'Renamed' })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_UPDATE_APPLICATION('app-1'),
            expect.objectContaining({
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationName: 'Renamed' })
            })
        )
        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: METAMODEL_APPLICATION_QUERY_KEY('app-1')
        })
    })

    it('throws when the update fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 400
        })

        const { result } = renderHook(
            () => useUpdateMetamodelApplication('app-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({ applicationName: 'Renamed' })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to update metamodel application'
        )
    })
})
