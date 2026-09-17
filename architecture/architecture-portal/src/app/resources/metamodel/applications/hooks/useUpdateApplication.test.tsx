import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'
import { useUpdateApplication } from './useUpdateApplication'

jest.mock('@/utils/client', () => ({ fetchWithToken: jest.fn() }))
jest.mock('@/context', () => ({
    useUserContext: () => ({ attributes: { email: 'user@aexp.com' } })
}))

const mockFetch = fetchWithToken as jest.Mock

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

afterEach(() => jest.resetAllMocks())

describe('useUpdateApplication', () => {
    it('sends a PATCH with applicationName + userEmail in the body', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const { result } = renderHook(() => useUpdateApplication(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            await result.current.mutateAsync({
                id: 'app-1',
                patch: { name: 'Renamed App' }
            })
        })

        const [url, options] = mockFetch.mock.calls[0]
        expect(url).toContain('/api/v1/applications/app-1')
        expect(options.method).toBe('PATCH')
        expect(JSON.parse(options.body)).toEqual({
            userEmail: 'user@aexp.com',
            applicationName: 'Renamed App'
        })
    })

    it('omits applicationName when the patch has no name', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const { result } = renderHook(() => useUpdateApplication(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            await result.current.mutateAsync({ id: 'app-1', patch: {} })
        })

        expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual({
            userEmail: 'user@aexp.com'
        })
    })
})
