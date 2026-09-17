import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

import { useInitiativeTechStacks } from './useInitiativeTechStacks'

jest.mock('@/utils/client', () => ({ fetchWithToken: jest.fn() }))

const mockFetch = fetchWithToken as jest.Mock

const ptbResponse = (metadata: object[]) => ({
    ok: true,
    json: async () => ({ data: { metadata } })
})

const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    })
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

afterEach(() => jest.resetAllMocks())

describe('useInitiativeTechStacks', () => {
    it('does not fetch until enabled', async () => {
        const { result } = renderHook(
            () => useInitiativeTechStacks('init-1', false),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(mockFetch).not.toHaveBeenCalled()
        expect(result.current.techStacks).toEqual([])
    })

    it('resolves tech stack names from PTB metadata when enabled', async () => {
        mockFetch.mockResolvedValueOnce(
            ptbResponse([
                { 'Business Units': ['US'] },
                { 'Tech Stacks': ['Java', 'React'] }
            ])
        )

        const { result } = renderHook(
            () => useInitiativeTechStacks('init-1', true),
            { wrapper }
        )

        await waitFor(() =>
            expect(result.current.techStacks).toEqual(['Java', 'React'])
        )
    })

    it('returns an empty list when the metadata has no Tech Stacks', async () => {
        mockFetch.mockResolvedValueOnce(ptbResponse([{ Markets: ['NA'] }]))

        const { result } = renderHook(
            () => useInitiativeTechStacks('init-1', true),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.techStacks).toEqual([])
    })
})
