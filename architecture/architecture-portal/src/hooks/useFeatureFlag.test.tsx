import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMaintenanceModeVisible } from './useFeatureFlag'

describe('useMaintenanceModeVisible', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        })
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        return wrapper
    }

    it('is false while the flag request is loading', () => {
        ;(global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}))

        const { result } = renderHook(() => useMaintenanceModeVisible(), {
            wrapper: createWrapper()
        })

        expect(result.current).toBe(false)
    })

    it('is true once the flag resolves to true', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, data: { value: true } })
        })

        const { result } = renderHook(() => useMaintenanceModeVisible(), {
            wrapper: createWrapper()
        })

        await waitFor(() => {
            expect(result.current).toBe(true)
        })
    })

    it('is false once the flag resolves to false', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, data: { value: false } })
        })

        const { result } = renderHook(() => useMaintenanceModeVisible(), {
            wrapper: createWrapper()
        })

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled()
        })

        expect(result.current).toBe(false)
    })

    it('fails closed (false) when the flag request errors', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: async () => ({ success: false })
        })

        const { result } = renderHook(() => useMaintenanceModeVisible(), {
            wrapper: createWrapper()
        })

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled()
        })

        expect(result.current).toBe(false)
    })
})
