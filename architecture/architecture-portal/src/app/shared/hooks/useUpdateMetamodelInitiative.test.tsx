import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUpdateMetamodelInitiative } from './useUpdateMetamodelInitiative'
import { METAMODEL_INITIATIVE_QUERY_KEY } from './useMetamodelInitiative'
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

describe('useUpdateMetamodelInitiative', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('PATCHes the initiative and invalidates the query on success', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ initiativeId: 'i-1' })
        })
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(
            () => useUpdateMetamodelInitiative('i-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({ initiativeName: 'Renamed' })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_UPDATE_INITIATIVE('i-1'),
            expect.objectContaining({
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initiativeName: 'Renamed' })
            })
        )
        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: METAMODEL_INITIATIVE_QUERY_KEY('i-1')
        })
    })

    it('PATCHes nested owner personas with name and email', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ initiativeId: 'i-1' })
        })

        const { result } = renderHook(
            () => useUpdateMetamodelInitiative('i-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({
            owners: {
                unitcio: { name: 'CIO User', email: 'cio@test.com' },
                additional_architects: [
                    { name: 'AA User', email: 'aa@test.com' }
                ]
            }
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_UPDATE_INITIATIVE('i-1'),
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({
                    owners: {
                        unitcio: { name: 'CIO User', email: 'cio@test.com' },
                        additional_architects: [
                            { name: 'AA User', email: 'aa@test.com' }
                        ]
                    }
                })
            })
        )
    })

    it('throws when the update fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 400
        })

        const { result } = renderHook(
            () => useUpdateMetamodelInitiative('i-1'),
            { wrapper: createWrapper() }
        )

        result.current.mutate({ initiativeName: 'Renamed' })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to update metamodel initiative'
        )
    })
})
