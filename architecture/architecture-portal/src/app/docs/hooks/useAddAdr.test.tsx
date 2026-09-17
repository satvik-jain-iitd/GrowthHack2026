import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAddAdr } from './useAddAdr'
import { toast } from 'react-toastify'

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))

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

describe('useAddAdr', () => {
    const getContentTypeHeader = (headers: HeadersInit | undefined) => {
        if (!headers) return undefined
        if (headers instanceof Headers) {
            return headers.get('Content-Type') ?? undefined
        }
        if (Array.isArray(headers)) {
            return headers.find(([key]) => key === 'Content-Type')?.[1]
        }
        return headers['Content-Type']
    }

    const mockUser = {
        email: '[REDACTED_EMAIL_ADDRESS_1]',
        fullName: 'Test User'
    }

    const mockAdrData = {
        playbookId: 'playbook-123',
        repo: 'test-repo',
        adrName: 'Test ADR',
        reviewers: ['[REDACTED_EMAIL_ADDRESS_2]'],
        deciders: ['[REDACTED_EMAIL_ADDRESS_3]'],
        eaArchitects: ['[REDACTED_EMAIL_ADDRESS_4]'],
        requester: '[REDACTED_EMAIL_ADDRESS_1]',
        user: mockUser
    }

    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('successfully adds an ADR', async () => {
        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const { result } = renderHook(() => useAddAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockAdrData)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs',
            expect.any(Object)
        )

        const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
        expect(fetchOptions.method).toBe('POST')
        expect(getContentTypeHeader(fetchOptions.headers)).toBe(
            'application/json'
        )
        expect(fetchOptions.body).toBe(JSON.stringify(mockAdrData))

        expect(toast.success).toHaveBeenCalledWith('ADR added successfully!')
        expect(result.current.data).toEqual({ success: true })
    })

    it('successfully adds an ADR with optional fields', async () => {
        const mockDataWithOptionalFields = {
            ...mockAdrData,
            status: 'DRAFT',
            fileId: 'file-123',
            approvedDate: '2026-02-23',
            adr_type: 'TECHNICAL'
        }

        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const { result } = renderHook(() => useAddAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockDataWithOptionalFields)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs',
            expect.any(Object)
        )

        const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
        expect(fetchOptions.method).toBe('POST')
        expect(getContentTypeHeader(fetchOptions.headers)).toBe(
            'application/json'
        )
        expect(fetchOptions.body).toBe(
            JSON.stringify(mockDataWithOptionalFields)
        )

        expect(toast.success).toHaveBeenCalledWith('ADR added successfully!')
    })

    it('invalidates query cache when fileId is provided', async () => {
        const mockDataWithFileId = {
            ...mockAdrData,
            fileId: 'file-123'
        }

        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
            }
        })

        const invalidateQueriesSpy = jest.spyOn(
            queryClient,
            'invalidateQueries'
        )

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )

        const { result } = renderHook(() => useAddAdr(), { wrapper })

        result.current.mutate(mockDataWithFileId)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ['adr', 'file-123']
        })
    })

    it('does not invalidate query cache when fileId is not provided', async () => {
        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
            }
        })

        const invalidateQueriesSpy = jest.spyOn(
            queryClient,
            'invalidateQueries'
        )

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )

        const { result } = renderHook(() => useAddAdr(), { wrapper })

        result.current.mutate(mockAdrData)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateQueriesSpy).not.toHaveBeenCalled()
    })

    it('handles API error response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(() => useAddAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockAdrData)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to add ADR, please try again.'
        )
        expect(result.current.error).toEqual(new Error('Failed to add ADR'))
    })

    it('handles network error', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValueOnce(
            new Error('Network error')
        )

        const { result } = renderHook(() => useAddAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockAdrData)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error).toEqual(new Error('Network error'))
    })

    it('handles empty response data', async () => {
        const mockResponse = {
            data: null
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const { result } = renderHook(() => useAddAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockAdrData)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toBeNull()
    })

    it('sets loading state correctly during mutation', async () => {
        let resolvePromise!: (value: unknown) => void
        const mockPromise = new Promise(resolve => {
            resolvePromise = resolve
        })

        ;(global.fetch as jest.Mock).mockReturnValueOnce(mockPromise)

        const { result } = renderHook(() => useAddAdr(), {
            wrapper: createWrapper()
        })

        expect(result.current.isPending).toBe(false)

        result.current.mutate(mockAdrData)

        await waitFor(() => expect(result.current.isPending).toBe(true))

        resolvePromise({
            ok: true,
            json: async () => ({ data: { success: true } })
        })

        await waitFor(() => expect(result.current.isPending).toBe(false))
    })
})
