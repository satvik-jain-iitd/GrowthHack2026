import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuditHistory } from './useAuditHistory'
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

describe('useAuditHistory', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('fetches initiative audit history with pagination params', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ page: 2, pageSize: 10, total: 0, data: [] })
        })

        const { result } = renderHook(
            () => useAuditHistory('initiative', 'i-1', 2, 10),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            `${API_ENDPOINTS.METAMODEL_GET_INITIATIVE_AUDIT_HISTORY('i-1')}?page=2&pageSize=10`,
            undefined
        )
    })

    it('fetches application audit history without pagination params', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ page: 1, pageSize: 50, total: 0, data: [] })
        })

        const { result } = renderHook(
            () => useAuditHistory('application', 'app-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            API_ENDPOINTS.METAMODEL_GET_APPLICATION_AUDIT_HISTORY('app-1'),
            undefined
        )
    })

    it('returns an empty result on 404', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        const { result } = renderHook(
            () => useAuditHistory('initiative', 'i-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual({
            page: 1,
            pageSize: 50,
            total: 0,
            data: []
        })
    })

    it('throws on other errors', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })

        const { result } = renderHook(
            () => useAuditHistory('initiative', 'i-1'),
            { wrapper: createWrapper() }
        )

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error?.message).toBe(
            'Failed to fetch audit history: 500 Server Error'
        )
    })

    it('is disabled when entityId is empty', () => {
        const { result } = renderHook(() => useAuditHistory('initiative', ''), {
            wrapper: createWrapper()
        })

        expect(result.current.fetchStatus).toBe('idle')
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it('is disabled when enabled flag is false', () => {
        const { result } = renderHook(
            () =>
                useAuditHistory(
                    'initiative',
                    'i-1',
                    undefined,
                    undefined,
                    false
                ),
            { wrapper: createWrapper() }
        )

        expect(result.current.fetchStatus).toBe('idle')
        expect(global.fetch).not.toHaveBeenCalled()
    })
})
