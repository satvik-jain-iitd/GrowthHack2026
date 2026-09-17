import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMetamodelInitiativeOptions } from './useMetamodelInitiativeOptions'
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

describe('useMetamodelInitiativeOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('maps initiatives into label/value options', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                page: 1,
                pageSize: 100,
                total: 2,
                data: [
                    { initiativeId: 'i-1', initiativeName: 'Initiative One' },
                    { initiativeId: 'i-2', initiativeName: 'Initiative Two' }
                ]
            })
        })

        const { result } = renderHook(() => useMetamodelInitiativeOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            `${API_ENDPOINTS.METAMODEL_LIST_INITIATIVES}?pageSize=100`,
            undefined
        )
        expect(result.current.data).toEqual([
            { label: 'Initiative One', value: 'i-1' },
            { label: 'Initiative Two', value: 'i-2' }
        ])
    })

    it('throws when the request fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(() => useMetamodelInitiativeOptions(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to fetch initiative options'
        )
    })
})
