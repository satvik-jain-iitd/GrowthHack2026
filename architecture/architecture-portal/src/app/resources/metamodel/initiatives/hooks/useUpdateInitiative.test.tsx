import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'
import { useUpdateInitiative } from './useUpdateInitiative'
import { ALL_INITIATIVES_QUERY_KEY } from './useGetAllInitiatives'

jest.mock('@/utils/client', () => ({ fetchWithToken: jest.fn() }))
jest.mock('@/context', () => ({
    useUserContext: () => ({ attributes: { email: 'user@aexp.com' } })
}))

const mockFetch = fetchWithToken as jest.Mock

const createWrapper = (queryClient: QueryClient) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

const newClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })

afterEach(() => jest.resetAllMocks())

describe('useUpdateInitiative', () => {
    it('sends a PATCH with initiativeName + userEmail in the body', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const { result } = renderHook(() => useUpdateInitiative(), {
            wrapper: createWrapper(newClient())
        })

        await act(async () => {
            await result.current.mutateAsync({
                id: 'init-1',
                patch: { name: 'Renamed' }
            })
        })

        const [url, options] = mockFetch.mock.calls[0]
        expect(url).toContain('/api/v1/initiatives/init-1')
        expect(options.method).toBe('PATCH')
        expect(JSON.parse(options.body)).toEqual({
            userEmail: 'user@aexp.com',
            initiativeName: 'Renamed'
        })
    })

    it('omits initiativeName when the patch has no name', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })

        const { result } = renderHook(() => useUpdateInitiative(), {
            wrapper: createWrapper(newClient())
        })

        await act(async () => {
            await result.current.mutateAsync({ id: 'init-1', patch: {} })
        })

        expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual({
            userEmail: 'user@aexp.com'
        })
    })

    it('optimistically updates the cached row', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true })
        const queryClient = newClient()
        queryClient.setQueryData(ALL_INITIATIVES_QUERY_KEY, [
            { id: 'init-1', name: 'Old' },
            { id: 'init-2', name: 'Other' }
        ])

        const { result } = renderHook(() => useUpdateInitiative(), {
            wrapper: createWrapper(queryClient)
        })

        await act(async () => {
            await result.current.mutateAsync({
                id: 'init-1',
                patch: { name: 'New' }
            })
        })

        const cached = queryClient.getQueryData(ALL_INITIATIVES_QUERY_KEY)
        expect(cached).toEqual([
            { id: 'init-1', name: 'New' },
            { id: 'init-2', name: 'Other' }
        ])
    })

    it('rolls back the cache on error', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: 'Bad Request'
        })
        const queryClient = newClient()
        const original = [{ id: 'init-1', name: 'Old' }]
        queryClient.setQueryData(ALL_INITIATIVES_QUERY_KEY, original)

        const { result } = renderHook(() => useUpdateInitiative(), {
            wrapper: createWrapper(queryClient)
        })

        await expect(
            act(async () => {
                await result.current.mutateAsync({
                    id: 'init-1',
                    patch: { name: 'New' }
                })
            })
        ).rejects.toThrow('Failed to update: 400 Bad Request')

        expect(queryClient.getQueryData(ALL_INITIATIVES_QUERY_KEY)).toEqual(
            original
        )
    })
})
