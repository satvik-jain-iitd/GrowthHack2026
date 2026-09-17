import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMetamodelFoundationalTechnologyOptions } from './useMetamodelFoundationalTechnologyOptions'
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

describe('useMetamodelFoundationalTechnologyOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches from the foundational technologies endpoint', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ page: 1, pageSize: 500, total: 0, data: [] })
        })

        const { result } = renderHook(
            () => useMetamodelFoundationalTechnologyOptions(),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(global.fetch).toHaveBeenCalledWith(
            `${API_ENDPOINTS.METAMODEL_LIST_FOUNDATIONAL_TECHNOLOGIES}?pageSize=500`,
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
                    { foundationalTechnologyId: 'ft-1', name: 'Kafka' },
                    { foundationalTechnologyId: 'ft-2', name: 'Redis' }
                ]
            })
        })

        const { result } = renderHook(
            () => useMetamodelFoundationalTechnologyOptions(),
            { wrapper: createWrapper() }
        )

        await waitFor(() =>
            expect(result.current.foundationalTechnologyOptions).toBeDefined()
        )

        expect(result.current.foundationalTechnologyOptions).toEqual([
            { foundationalTechnologyId: 'ft-1', name: 'Kafka' },
            { foundationalTechnologyId: 'ft-2', name: 'Redis' }
        ])
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(
            () => useMetamodelFoundationalTechnologyOptions(),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.error).toBeTruthy())

        expect((result.current.error as Error)?.message).toBe(
            'Failed to fetch metamodel foundational technologies: 500'
        )
    })
})
