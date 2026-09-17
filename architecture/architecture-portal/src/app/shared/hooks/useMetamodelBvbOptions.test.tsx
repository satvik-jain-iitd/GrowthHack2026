import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMetamodelBvbOptions } from './useMetamodelBvbOptions'
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

describe('useMetamodelBvbOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches from the BvBs endpoint and returns the data array', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                page: 1,
                pageSize: 100,
                total: 2,
                data: [
                    { id: 'bvb-1', title: 'BvB One' },
                    { id: 'bvb-2', title: 'BvB Two' }
                ]
            })
        })

        const { result } = renderHook(() => useMetamodelBvbOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(global.fetch).toHaveBeenCalledWith(
            `${API_ENDPOINTS.METAMODEL_LIST_BVBS}?pageSize=100`,
            undefined
        )
        expect(result.current.bvbOptions).toEqual([
            { id: 'bvb-1', title: 'BvB One' },
            { id: 'bvb-2', title: 'BvB Two' }
        ])
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 503
        })

        const { result } = renderHook(() => useMetamodelBvbOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.error).toBeTruthy())

        expect((result.current.error as Error)?.message).toBe(
            'Failed to fetch metamodel BvBs: 503'
        )
    })
})
