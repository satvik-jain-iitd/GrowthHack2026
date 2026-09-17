import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetContributors } from './useGetContributors'

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

describe('useGetContributors', () => {
    const mockRepo = 'test-repo'
    const mockFilePath = 'docs/test.md'
    const mockContributors = {
        data: ['userEmail@aexp.com', 'userEmail2@aexp.com'],
        success: true
    }

    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('successfully fetches contributors', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockContributors
        })

        const { result } = renderHook(
            () => useGetContributors(mockRepo, mockFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockContributors)
    })

    it('handles API error response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        const { result } = renderHook(
            () => useGetContributors(mockRepo, mockFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error).toEqual(
            new Error('Failed to fetch contributors')
        )
    })

    it('handles network error', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValueOnce(
            new Error('Network error')
        )

        const { result } = renderHook(
            () => useGetContributors(mockRepo, mockFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error).toEqual(new Error('Network error'))
    })

    it('fetches empty contributors list', async () => {
        const emptyContributors = {
            data: [],
            success: true
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => emptyContributors
        })

        const { result } = renderHook(
            () => useGetContributors(mockRepo, mockFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.data).toEqual([])
        expect(result.current.data?.success).toBe(true)
    })

    it('handles unsuccessful response with success: false', async () => {
        const unsuccessfulResponse = {
            data: [],
            success: false
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => unsuccessfulResponse
        })

        const { result } = renderHook(
            () => useGetContributors(mockRepo, mockFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.success).toBe(false)
    })

    it('uses correct staleTime and gcTime', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockContributors
        })

        const { result } = renderHook(
            () => useGetContributors(mockRepo, mockFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // Data should be cached for 10 minutes (staleTime)
        expect(result.current.isStale).toBe(false)
    })

    it('refetches when repo changes', async () => {
        const firstRepo = 'repo-1'
        const secondRepo = 'repo-2'

        const firstContributors = {
            data: ['userEmail@aexp.com'],
            success: true
        }

        const secondContributors = {
            data: ['userEmail2@aexp.com'],
            success: true
        }

        ;(global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => firstContributors
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => secondContributors
            })

        const { result, rerender } = renderHook(
            ({ repo }) => useGetContributors(repo, mockFilePath),
            {
                wrapper: createWrapper(),
                initialProps: { repo: firstRepo }
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.data).toEqual(['userEmail@aexp.com'])

        rerender({ repo: secondRepo })

        await waitFor(() =>
            expect(result.current.data?.data).toEqual(['userEmail2@aexp.com'])
        )
        expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('refetches when filePath changes', async () => {
        const firstFilePath = 'docs/file1.md'
        const secondFilePath = 'docs/file2.md'

        const firstContributors = {
            data: ['userEmail@aexp.com'],
            success: true
        }

        const secondContributors = {
            data: ['userEmail3@aexp.com'],
            success: true
        }

        ;(global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => firstContributors
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => secondContributors
            })

        const { result, rerender } = renderHook(
            ({ filePath }) => useGetContributors(mockRepo, filePath),
            {
                wrapper: createWrapper(),
                initialProps: { filePath: firstFilePath }
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.data).toEqual(['userEmail@aexp.com'])

        rerender({ filePath: secondFilePath })

        await waitFor(() =>
            expect(result.current.data?.data).toEqual(['userEmail3@aexp.com'])
        )
        expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('handles special characters in repo and filePath', async () => {
        const specialRepo = 'repo/with/slashes'
        const specialFilePath = 'path/to/file with spaces.md'

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockContributors
        })

        const { result } = renderHook(
            () => useGetContributors(specialRepo, specialFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/repos/contributors?repo=repo%2Fwith%2Fslashes&file_path_tx=path%2Fto%2Ffile%20with%20spaces.md',
            undefined
        )
    })

    it('sets loading state correctly during fetch', async () => {
        let resolvePromise!: (value: unknown) => void
        const mockPromise = new Promise(resolve => {
            resolvePromise = resolve
        })

        ;(global.fetch as jest.Mock).mockReturnValueOnce(mockPromise)

        const { result } = renderHook(
            () => useGetContributors(mockRepo, mockFilePath),
            {
                wrapper: createWrapper()
            }
        )

        await waitFor(() => expect(result.current.isPending).toBe(true))

        resolvePromise({
            ok: true,
            json: async () => mockContributors
        })

        await waitFor(() => expect(result.current.isPending).toBe(false))
        expect(result.current.isSuccess).toBe(true)
    })
})
