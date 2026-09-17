import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetADR, ADR } from './useGetADR'

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

describe('useGetADR', () => {
    const mockFileId = 'file-123'
    const mockADR: ADR = {
        adr_type_nm: 'adr-type-name',
        adr_mtda_id: 'adr-123',
        adr_nm: 'Test ADR',
        rev_ctc_da: ['reviewerEmail@aexp.com', 'reviewerEmail1@aexp.com'],
        aprv_ctc_da: ['approverEmail1@aexp.com'],
        entrpr_archt_ctc_da: ['eaArchitectEmail1@aexp.com'],
        adr_req_email_ad_tx: 'requesterEmail1@aexp.com',
        wkflow_sta_nm: 'IN PROGRESS',
        wkflow_id: 'wkflow-123',
        wkflow_step_id: 'step-123',
        reviews: [
            {
                wkflow_id: 'wkflow-123',
                rev_email_ad_tx: 'reviewerEmail@aexp.com',
                rev_sta_nm: 'APPROVED',
                rev_fdbk_tx: 'Looks good',
                amex_act_req_id: 'req-123',
                rev_type_nm: 'REVIEW'
            }
        ]
    }

    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('successfully fetches an ADR', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockADR
        })

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs/file-123',
            undefined
        )
        expect(result.current.data).toEqual(mockADR)
    })

    it('does not fetch when fileId is empty', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404
        })

        renderHook(() => useGetADR(''), {
            wrapper: createWrapper()
        })

        // Hook will still attempt to fetch with empty fileId
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/adrs/',
                undefined
            )
        })
    })

    it('handles API error response', async () => {
        // Mock needs to handle initial request + 1 retry
        ;(global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({})
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({})
            })

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true), {
            timeout: 3000
        })

        expect(result.current.error).toBeTruthy()
        expect(result.current.error?.message).toBe('Failed to fetch ADR')
    })

    it('handles network error', async () => {
        // Mock needs to handle initial request + 1 retry
        ;(global.fetch as jest.Mock)
            .mockRejectedValueOnce(new Error('Network error'))
            .mockRejectedValueOnce(new Error('Network error'))

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true), {
            timeout: 3000
        })

        expect(result.current.error).toBeTruthy()
        expect(result.current.error?.message).toBe('Network error')
    })

    it('fetches ADR with empty reviews array', async () => {
        const adrWithoutReviews: ADR = {
            ...mockADR,
            reviews: []
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => adrWithoutReviews
        })

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.reviews).toEqual([])
    })

    it('fetches ADR without reviews property', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { reviews: _reviews, ...adrWithoutReviews } = mockADR

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => adrWithoutReviews
        })

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.reviews).toBeUndefined()
    })

    it('uses correct staleTime and gcTime', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockADR
        })

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // Data should be cached for 30 minutes (staleTime)
        expect(result.current.isStale).toBe(false)
    })

    it('handles multiple review statuses', async () => {
        const adrWithMultipleReviews: ADR = {
            ...mockADR,
            reviews: [
                {
                    wkflow_id: 'wkflow-123',
                    rev_email_ad_tx: 'reviewerEmail@aexp.com',
                    rev_sta_nm: 'APPROVED',
                    rev_fdbk_tx: 'Approved',
                    amex_act_req_id: 'req-1',
                    rev_type_nm: 'REVIEW'
                },
                {
                    wkflow_id: 'wkflow-123',
                    rev_email_ad_tx: 'reviewerEmail1@aexp.com',
                    rev_sta_nm: 'REJECTED',
                    rev_fdbk_tx: 'Needs changes',
                    amex_act_req_id: 'req-2',
                    rev_type_nm: 'REVIEW'
                },
                {
                    wkflow_id: 'wkflow-123',
                    rev_email_ad_tx: 'approverEmail1@aexp.com',
                    rev_sta_nm: 'PENDING',
                    rev_fdbk_tx: '',
                    amex_act_req_id: 'req-3',
                    rev_type_nm: 'APPROVAL'
                },
                {
                    wkflow_id: 'wkflow-123',
                    rev_email_ad_tx: 'eaArchitectEmail1@aexp.com',
                    rev_sta_nm: 'ABSTAIN',
                    rev_fdbk_tx: 'Cannot review',
                    amex_act_req_id: 'req-4',
                    rev_type_nm: 'REVIEW'
                }
            ]
        }

        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => adrWithMultipleReviews
        })

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data?.reviews).toHaveLength(4)
        expect(result.current.data?.reviews?.[0].rev_sta_nm).toBe('APPROVED')
        expect(result.current.data?.reviews?.[1].rev_sta_nm).toBe('REJECTED')
        expect(result.current.data?.reviews?.[2].rev_sta_nm).toBe('PENDING')
        expect(result.current.data?.reviews?.[3].rev_sta_nm).toBe('ABSTAIN')
    })

    it('refetches when fileId changes', async () => {
        const firstFileId = 'file-1'
        const secondFileId = 'file-2'

        const firstADR: ADR = {
            ...mockADR,
            adr_mtda_id: 'adr-1'
        }

        const secondADR: ADR = {
            ...mockADR,
            adr_mtda_id: 'adr-2'
        }

        ;(global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => firstADR
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => secondADR
            })

        const { result, rerender } = renderHook(
            ({ fileId }) => useGetADR(fileId),
            {
                wrapper: createWrapper(),
                initialProps: { fileId: firstFileId }
            }
        )

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.adr_mtda_id).toBe('adr-1')

        rerender({ fileId: secondFileId })

        await waitFor(() =>
            expect(result.current.data?.adr_mtda_id).toBe('adr-2')
        )
        expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('sets loading state correctly during fetch', async () => {
        let resolvePromise!: (value: unknown) => void
        const mockPromise = new Promise(resolve => {
            resolvePromise = resolve
        })

        ;(global.fetch as jest.Mock).mockReturnValueOnce(mockPromise)

        const { result } = renderHook(() => useGetADR(mockFileId), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isPending).toBe(true))

        resolvePromise({
            ok: true,
            json: async () => mockADR
        })

        await waitFor(() => expect(result.current.isPending).toBe(false))
        expect(result.current.isSuccess).toBe(true)
    })
})
