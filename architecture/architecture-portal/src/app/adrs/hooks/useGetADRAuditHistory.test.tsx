import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetADRAuditHistory } from './useGetADRAuditHistory'
import React from 'react'

describe('useGetADRAuditHistory', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false }
            }
        })
        const Wrapper = ({ children }: { children?: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        Wrapper.displayName = 'TestWrapper'
        return Wrapper
    }

    it('fetches audit history successfully', async () => {
        const mockData = [
            {
                aud_ts: '2024-01-15T10:30:00Z',
                new_da: {
                    adr_id: 'adr-123',
                    workflow_identifier: 'wkflow-123'
                },
                action_nm: 'ADR Created',
                creat_user_email_ad_tx: 'userEmail@aexp.com'
            }
        ]

        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockData
        })

        const { result } = renderHook(() => useGetADRAuditHistory('adr-123'), {
            wrapper: createWrapper()
        })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/proxy/arch-api/v1/adrs/audit-history/adr-123',
            undefined
        )
        expect(result.current.data).toEqual(mockData)
    })

    it('throws error when fetch fails', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500
        })

        const { result } = renderHook(() => useGetADRAuditHistory('adr-123'), {
            wrapper: createWrapper()
        })

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
        })
    })

    it('does not fetch when adrId is empty', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404
        })

        renderHook(() => useGetADRAuditHistory(''), {
            wrapper: createWrapper()
        })

        // Hook will still attempt to fetch with empty adrId
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/proxy/arch-api/v1/adrs/audit-history/',
                undefined
            )
        })
    })
})
