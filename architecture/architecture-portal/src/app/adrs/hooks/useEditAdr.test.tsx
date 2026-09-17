import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEditAdr } from './useEditAdr'
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

describe('useEditAdr', () => {
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

    const mockEditData = {
        adrId: 'adr-123',
        fileId: 'file-123',
        adrName: 'Updated ADR Name',
        reviewers: ['reviewer1@example.com', 'reviewer2@example.com'],
        deciders: ['decider1@example.com'],
        eaArchitects: ['architect1@example.com'],
        adr_type: 'TECHNICAL',
        user: 'user@example.com'
    }

    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('successfully edits an ADR', async () => {
        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const { result } = renderHook(() => useEditAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockEditData)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs/adr-123',
            expect.any(Object)
        )

        const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
        expect(fetchOptions.method).toBe('PUT')
        expect(getContentTypeHeader(fetchOptions.headers)).toBe(
            'application/json'
        )
        expect(fetchOptions.body).toBe(
            JSON.stringify({
                adrName: mockEditData.adrName,
                reviewers: mockEditData.reviewers,
                deciders: mockEditData.deciders,
                eaArchitects: mockEditData.eaArchitects,
                adr_type: mockEditData.adr_type,
                user: mockEditData.user
            })
        )

        expect(toast.success).toHaveBeenCalledWith('ADR updated successfully!')
        expect(result.current.data).toEqual({ success: true })
    })

    it('successfully edits an ADR with partial fields (only editable fields)', async () => {
        const partialEditData = {
            adrId: 'adr-123',
            fileId: 'file-123',
            adrName: 'Updated ADR Name',
            eaArchitects: ['architect1@example.com'],
            adr_type: 'BUSINESS'
        }

        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const { result } = renderHook(() => useEditAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(partialEditData)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs/adr-123',
            expect.any(Object)
        )

        const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
        expect(fetchOptions.method).toBe('PUT')
        expect(getContentTypeHeader(fetchOptions.headers)).toBe(
            'application/json'
        )
        expect(fetchOptions.body).toBe(
            JSON.stringify({
                adrName: partialEditData.adrName,
                eaArchitects: partialEditData.eaArchitects,
                adr_type: partialEditData.adr_type
            })
        )

        expect(toast.success).toHaveBeenCalledWith('ADR updated successfully!')
    })

    it('invalidates query cache after successful edit', async () => {
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
        wrapper.displayName = 'TestWrapper'

        const { result } = renderHook(() => useEditAdr(), {
            wrapper
        })

        result.current.mutate(mockEditData)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ['adr', mockEditData.fileId]
        })
    })

    it('handles API error when edit fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500
        })

        const { result } = renderHook(() => useEditAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockEditData)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to update ADR, please try again.'
        )
        expect(result.current.error).toEqual(new Error('Failed to update ADR'))
    })

    it('handles network error', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValueOnce(
            new Error('Network error')
        )

        const { result } = renderHook(() => useEditAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(mockEditData)

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.error).toEqual(new Error('Network error'))
    })

    it('sets isPending to true while mutation is in progress', async () => {
        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockImplementationOnce(
            () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: async () => mockResponse
                            }),
                        100
                    )
                )
        )

        const { result } = renderHook(() => useEditAdr(), {
            wrapper: createWrapper()
        })

        expect(result.current.isPending).toBe(false)

        result.current.mutate(mockEditData)

        await waitFor(() => expect(result.current.isPending).toBe(true))

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.isPending).toBe(false)
    })

    it('handles edit with undefined optional fields', async () => {
        const editDataWithUndefined = {
            adrId: 'adr-123',
            fileId: 'file-123',
            adrName: 'Updated Name'
        }

        const mockResponse = {
            data: { success: true }
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const { result } = renderHook(() => useEditAdr(), {
            wrapper: createWrapper()
        })

        result.current.mutate(editDataWithUndefined)

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs/adr-123',
            expect.any(Object)
        )

        const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
        expect(fetchOptions.method).toBe('PUT')
        expect(getContentTypeHeader(fetchOptions.headers)).toBe(
            'application/json'
        )
        expect(fetchOptions.body).toBe(
            JSON.stringify({
                adrName: editDataWithUndefined.adrName
            })
        )
    })
})
