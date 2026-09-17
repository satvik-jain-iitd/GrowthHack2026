import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useSubmitAcceptance,
    useSubmitForReview,
    useSubmitReview,
    useSubmitDecision
} from './useWorkflowActions'

describe('useWorkflowActions hooks', () => {
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

    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    const createWrapper = () => {
        const queryClient = new QueryClient()
        // Spy on invalidateQueries
        queryClient.invalidateQueries = jest.fn()
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        return { wrapper, queryClient }
    }

    describe('useSubmitAcceptance', () => {
        it('submits acceptance and invalidates playbook query on success', async () => {
            const { wrapper, queryClient } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ result: 'ok' })
            })

            const { result } = renderHook(
                () => useSubmitAcceptance('bvb-1', 'playbook-1', 'APPROVED'),
                { wrapper }
            )

            const res = await result.current.mutateAsync()
            expect(res).toEqual({ result: 'ok' })
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/workflow/criteria/bvb-1',
                expect.any(Object)
            )

            // verify body contains the decision
            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            expect(fetchOptions.method).toBe('POST')
            expect(getContentTypeHeader(fetchOptions.headers)).toBe(
                'application/json'
            )
            expect(JSON.parse(fetchOptions.body)).toEqual({
                approvedOrRejected: true
            })

            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['playbook', 'playbook-1']
            })
        })

        it('throws on failed submit', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Server Error'
            })

            const { result } = renderHook(
                () => useSubmitAcceptance('bvb-1', 'playbook-1', 'REJECTED'),
                { wrapper }
            )

            await expect(result.current.mutateAsync()).rejects.toThrow(
                'Failed to submit acceptance'
            )
        })
    })

    describe('useSubmitForReview', () => {
        it('submits for review and invalidates playbook query on success', async () => {
            const { wrapper, queryClient } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ ok: true })
            })

            const { result } = renderHook(
                () => useSubmitForReview('bvb-2', 'playbook-2'),
                { wrapper }
            )

            const res = await result.current.mutateAsync()
            expect(res).toEqual({ ok: true })
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/workflow/review/bvb-2',
                expect.objectContaining({ method: 'POST' })
            )
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['playbook', 'playbook-2']
            })
        })

        it('throws on failed submit for review', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })

            const { result } = renderHook(
                () => useSubmitForReview('bvb-2', 'playbook-2'),
                { wrapper }
            )

            await expect(result.current.mutateAsync()).rejects.toThrow(
                'Failed to submit for review'
            )
        })
    })

    describe('useSubmitReview', () => {
        it('submits review and invalidates playbook query on success', async () => {
            const { wrapper, queryClient } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ ok: true })
            })

            const { result } = renderHook(
                () =>
                    useSubmitReview(
                        'process-1',
                        'playbook-3',
                        'reviewer1@aexp.com',
                        'req-1'
                    ),
                { wrapper }
            )

            const payload = {
                reviewFeedback: 'looks good',
                approvedOrRejected: 'APPROVED'
            } as const
            const res = await result.current.mutateAsync(payload)
            expect(res).toEqual({ ok: true })

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v2/workflow/review',
                expect.objectContaining({ method: 'PUT' })
            )

            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            const body = JSON.parse(fetchOptions.body)
            expect(body).toEqual(
                expect.objectContaining({
                    processId: 'process-1',
                    reviewFeedback: 'looks good',
                    approvedOrRejected: 'APPROVED',
                    reviewer: 'reviewer1@aexp.com',
                    requestId: 'req-1'
                })
            )

            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['playbook', 'playbook-3']
            })
        })

        it('throws on failed review submit', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })

            const { result } = renderHook(
                () =>
                    useSubmitReview(
                        'process-1',
                        'playbook-3',
                        'reviewer1@aexp.com'
                    ),
                { wrapper }
            )

            await expect(
                result.current.mutateAsync({
                    reviewFeedback: 'x',
                    approvedOrRejected: 'ABSTAIN'
                })
            ).rejects.toThrow('Failed to submit review')
        })
    })

    describe('useSubmitDecision', () => {
        it('submits decision and invalidates playbook query on success', async () => {
            const { wrapper, queryClient } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ ok: true })
            })

            const { result } = renderHook(
                () =>
                    useSubmitDecision(
                        'process-2',
                        'playbook-4',
                        'reviewer1@aexp.com',
                        'req-2'
                    ),
                { wrapper }
            )

            const payload = {
                reviewFeedback: 'approved',
                approvedOrRejected: 'APPROVED'
            } as const
            const res = await result.current.mutateAsync(payload)
            expect(res).toEqual({ ok: true })

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/workflow/decider',
                expect.objectContaining({ method: 'PUT' })
            )

            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            const body = JSON.parse(fetchOptions.body)
            expect(body).toEqual(
                expect.objectContaining({
                    processId: 'process-2',
                    reviewFeedback: 'approved',
                    approvedOrRejected: 'APPROVED',
                    reviewer: 'reviewer1@aexp.com',
                    requestId: 'req-2'
                })
            )

            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['playbook', 'playbook-4']
            })
        })

        it('throws on failed decision submit', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })

            const { result } = renderHook(
                () =>
                    useSubmitDecision(
                        'process-2',
                        'playbook-4',
                        'reviewer1@aexp.com'
                    ),
                { wrapper }
            )

            await expect(
                result.current.mutateAsync({
                    reviewFeedback: 'nope',
                    approvedOrRejected: 'REJECTED'
                })
            ).rejects.toThrow('Failed to submit decision')
        })
    })
})
