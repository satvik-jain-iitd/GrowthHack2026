import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useSubmitADRForReview,
    useSubmitADRReview,
    useSubmitADRApproval
} from './useADRWorkflowActions'

describe('useADRWorkflowActions hooks', () => {
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
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
            }
        })
        queryClient.invalidateQueries = jest.fn()
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        return { wrapper, queryClient }
    }

    describe('useSubmitADRForReview', () => {
        it('submits ADR for review and invalidates queries on success', async () => {
            const { wrapper, queryClient } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRForReview(
                        'adr-123',
                        'file-123',
                        'userEmail@aexp.com'
                    ),
                { wrapper }
            )

            const res = await result.current.mutateAsync()
            expect(res).toEqual({ success: true })
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/adrs/review/adr-123',
                expect.any(Object)
            )

            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            expect(fetchOptions.method).toBe('PUT')
            expect(getContentTypeHeader(fetchOptions.headers)).toBe(
                'application/json'
            )
            expect(JSON.parse(fetchOptions.body)).toEqual({
                user: 'userEmail@aexp.com'
            })

            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['adr', 'file-123']
            })
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['adr-audit-history', 'adr-123']
            })
        })

        it('throws error when submission fails', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRForReview(
                        'adr-123',
                        'file-123',
                        'userEmail@aexp.com'
                    ),
                { wrapper }
            )

            await expect(result.current.mutateAsync()).rejects.toThrow(
                'Failed to submit ADR for review'
            )
        })
    })

    describe('useSubmitADRReview', () => {
        it('submits ADR review and invalidates queries on success', async () => {
            const { wrapper, queryClient } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRReview(
                        'adr-123',
                        'reviewerEmail@aexp.com',
                        'file-123'
                    ),
                { wrapper }
            )

            const payload = {
                approvedOrRejected: 'APPROVED' as const,
                reviewFeedback: 'Looks good'
            }
            const res = await result.current.mutateAsync(payload)
            expect(res).toEqual({ success: true })

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/adrs/review',
                expect.any(Object)
            )

            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            expect(fetchOptions.method).toBe('PUT')
            expect(getContentTypeHeader(fetchOptions.headers)).toBe(
                'application/json'
            )
            const body = JSON.parse(fetchOptions.body)
            expect(body).toEqual({
                adrId: 'adr-123',
                review: {
                    reviewer: 'reviewerEmail@aexp.com',
                    approvedOrRejected: 'APPROVED',
                    reviewFeedback: 'Looks good'
                }
            })

            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['adr', 'file-123']
            })
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['adr-audit-history', 'adr-123']
            })
        })

        it('throws error when review submission fails', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRReview(
                        'adr-123',
                        'reviewerEmail@aexp.com',
                        'file-123'
                    ),
                { wrapper }
            )

            await expect(
                result.current.mutateAsync({
                    approvedOrRejected: 'REJECTED',
                    reviewFeedback: 'Not good'
                })
            ).rejects.toThrow('Failed to submit ADR review')
        })

        it('handles ABSTAIN status', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRReview(
                        'adr-123',
                        'reviewerEmail@aexp.com',
                        'file-123'
                    ),
                { wrapper }
            )

            await result.current.mutateAsync({
                approvedOrRejected: 'ABSTAIN',
                reviewFeedback: 'No comment'
            })

            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            expect(fetchOptions.method).toBe('PUT')
            expect(getContentTypeHeader(fetchOptions.headers)).toBe(
                'application/json'
            )
            const body = JSON.parse(fetchOptions.body)
            expect(body.review.approvedOrRejected).toBe('ABSTAIN')
        })
    })

    describe('useSubmitADRApproval', () => {
        it('submits ADR approval and invalidates queries on success', async () => {
            const { wrapper, queryClient } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRApproval(
                        'adr-123',
                        'approverEmail@aexp.com',
                        'file-123'
                    ),
                { wrapper }
            )

            const payload = {
                approvedOrRejected: 'APPROVED' as const,
                reviewFeedback: 'Approved'
            }
            const res = await result.current.mutateAsync(payload)
            expect(res).toEqual({ success: true })

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/adrs/approval',
                expect.any(Object)
            )

            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            expect(fetchOptions.method).toBe('PUT')
            expect(getContentTypeHeader(fetchOptions.headers)).toBe(
                'application/json'
            )
            const body = JSON.parse(fetchOptions.body)
            expect(body).toEqual({
                adrId: 'adr-123',
                review: {
                    reviewer: 'approverEmail@aexp.com',
                    approvedOrRejected: 'APPROVED',
                    reviewFeedback: 'Approved'
                }
            })

            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['adr', 'file-123']
            })
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['adr-audit-history', 'adr-123']
            })
        })

        it('throws error when approval submission fails', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRApproval(
                        'adr-123',
                        'approverEmail@aexp.com',
                        'file-123'
                    ),
                { wrapper }
            )

            await expect(
                result.current.mutateAsync({
                    approvedOrRejected: 'REJECTED',
                    reviewFeedback: 'Rejected'
                })
            ).rejects.toThrow('Failed to submit ADR review')
        })

        it('handles REJECTED status for approval', async () => {
            const { wrapper } = createWrapper()
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            })

            const { result } = renderHook(
                () =>
                    useSubmitADRApproval(
                        'adr-123',
                        'approverEmail@aexp.com',
                        'file-123'
                    ),
                { wrapper }
            )

            await result.current.mutateAsync({
                approvedOrRejected: 'REJECTED',
                reviewFeedback: 'Needs changes'
            })

            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1]
            const body = JSON.parse(fetchOptions.body)
            expect(body.review.approvedOrRejected).toBe('REJECTED')
            expect(body.review.reviewFeedback).toBe('Needs changes')
        })
    })
})
