import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMetamodelAdrOptions } from './useMetamodelAdrOptions'
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

describe('useMetamodelAdrOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches from the ADRs endpoint and returns the data array', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                page: 1,
                pageSize: 100,
                total: 2,
                data: [
                    { id: 'adr-1', name: 'ADR One' },
                    { id: 'adr-2', name: 'ADR Two' }
                ]
            })
        })

        const { result } = renderHook(() => useMetamodelAdrOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(global.fetch).toHaveBeenCalledWith(
            `${API_ENDPOINTS.METAMODEL_LIST_ADRS}?pageSize=100`,
            undefined
        )
        expect(result.current.adrOptions).toEqual([
            { id: 'adr-1', name: 'ADR One' },
            { id: 'adr-2', name: 'ADR Two' }
        ])
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(() => useMetamodelAdrOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.error).toBeTruthy())

        expect((result.current.error as Error)?.message).toBe(
            'Failed to fetch metamodel ADRs: 500'
        )
    })
})
