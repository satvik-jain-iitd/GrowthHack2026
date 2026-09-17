import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEditBvB } from './useEditBvB'

// ── Wrapper ────────────────────────────────────────────────────────────────

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

// ── Tests ──────────────────────────────────────────────────────────────────

const PLAYBOOK_ID = 'playbook-abc'

beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('useEditBvB', () => {
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

    it('returns a mutation object with a mutate function', () => {
        const { result } = renderHook(() => useEditBvB(PLAYBOOK_ID), {
            wrapper: createWrapper()
        })
        expect(typeof result.current.mutate).toBe('function')
        expect(typeof result.current.mutateAsync).toBe('function')
    })

    it('calls fetch with the correct URL and method on mutate', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: PLAYBOOK_ID, title: 'Updated' })
        })

        const { result } = renderHook(() => useEditBvB(PLAYBOOK_ID), {
            wrapper: createWrapper()
        })

        await act(async () => {
            await result.current.mutateAsync({ description: 'Updated' })
        })

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/playbooks/updateBvB/playbook-abc',
            expect.any(Object)
        )

        const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
        expect(fetchOptions.method).toBe('PUT')
        expect(getContentTypeHeader(fetchOptions.headers)).toBe(
            'application/json'
        )
        expect(fetchOptions.body).toBe(
            JSON.stringify({ description: 'Updated' })
        )
    })

    it('resolves with the parsed JSON response on success', async () => {
        const mockResponse = { id: PLAYBOOK_ID, description: 'Updated Title' }
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        })

        const { result } = renderHook(() => useEditBvB(PLAYBOOK_ID), {
            wrapper: createWrapper()
        })

        let data: unknown
        await act(async () => {
            data = await result.current.mutateAsync({
                description: 'Updated Title'
            })
        })

        expect(data).toEqual(mockResponse)
    })

    it('sets mutation to success state after a successful call', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: PLAYBOOK_ID })
        })

        const { result } = renderHook(() => useEditBvB(PLAYBOOK_ID), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ description: 'Test' })
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })

    it('throws an error when fetch response is not ok', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false
        })

        const { result } = renderHook(() => useEditBvB(PLAYBOOK_ID), {
            wrapper: createWrapper()
        })

        await expect(
            act(async () => {
                await result.current.mutateAsync({ description: 'Bad' })
            })
        ).rejects.toThrow('Failed to edit playbook')
    })

    it('sets mutation to error state when fetch response is not ok', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false
        })

        const { result } = renderHook(() => useEditBvB(PLAYBOOK_ID), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ description: 'Bad' })
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
        expect((result.current.error as Error).message).toBe(
            'Failed to edit playbook'
        )
    })

    it('sends multiple edited fields correctly serialised in the body', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        })

        const { result } = renderHook(() => useEditBvB(PLAYBOOK_ID), {
            wrapper: createWrapper()
        })

        const fields = { description: 'New Desc', overallRisk: 'Low' }
        await act(async () => {
            await result.current.mutateAsync(fields)
        })

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/playbooks/updateBvB/playbook-abc',
            expect.objectContaining({ body: JSON.stringify(fields) })
        )
    })

    it('uses the playbookId supplied to the hook in the request URL', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        })

        const otherId = 'other-playbook-id'
        const { result } = renderHook(() => useEditBvB(otherId), {
            wrapper: createWrapper()
        })

        await act(async () => {
            await result.current.mutateAsync({})
        })

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/playbooks/updateBvB/other-playbook-id',
            expect.anything()
        )
    })
})
