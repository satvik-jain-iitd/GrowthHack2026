import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchDomains, useGetDomains } from './useGetDomains'
import { domains as mockDomains } from '@/test/mocks/domains'

describe('fetchDomains', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns domains on success', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: mockDomains })
        })
        const result = await fetchDomains()
        expect(result).toEqual(mockDomains)
    })

    it('throws error on failed fetch', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Server Error'
        })
        await expect(fetchDomains()).rejects.toThrow(
            'Failed to fetch playbooks: 500 Server Error'
        )
    })

    it('returns empty array if data is not array', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: null })
        })
        const result = await fetchDomains()
        expect(result).toEqual([])
    })
})

describe('useGetDomains', () => {
    const queryClient = new QueryClient()

    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ data: mockDomains })
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns domains from hook', async () => {
        const wrapper = ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        const { result } = renderHook(() => useGetDomains(), { wrapper })
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.domains).toEqual(mockDomains)
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
    })
})
