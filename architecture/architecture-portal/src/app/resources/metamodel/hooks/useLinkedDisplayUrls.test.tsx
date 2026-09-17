import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

import { useLinkedDisplayUrls } from './useLinkedDisplayUrls'

jest.mock('@/utils/client', () => ({ fetchWithToken: jest.fn() }))

const mockFetch = fetchWithToken as jest.Mock

const detail = (data: unknown[]) => ({ ok: true, json: async () => data })

const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    })
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

afterEach(() => jest.resetAllMocks())

describe('useLinkedDisplayUrls', () => {
    it('resolves ADR and BvB ids to their displayUrl via get-by-ids', async () => {
        mockFetch
            .mockResolvedValueOnce(
                detail([
                    {
                        id: 'adr-1',
                        displayUrl: 'https://portal.test/adrs/file-1'
                    },
                    {
                        id: 'adr-2',
                        displayUrl: 'https://portal.test/adrs/file-2'
                    }
                ])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        id: 'bvb-1',
                        displayUrl: 'https://portal.test/docs/file-3'
                    }
                ])
            )

        const { result } = renderHook(
            () =>
                useLinkedDisplayUrls({
                    adrIds: ['adr-1', 'adr-2'],
                    bvbIds: ['bvb-1']
                }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.adrDisplayUrl('adr-1')).toBe(
            'https://portal.test/adrs/file-1'
        )
        expect(result.current.adrDisplayUrl('adr-2')).toBe(
            'https://portal.test/adrs/file-2'
        )
        expect(result.current.bvbDisplayUrl('bvb-1')).toBe(
            'https://portal.test/docs/file-3'
        )
    })

    it('requests the ADR and BvB get-by-ids endpoints with de-duplicated ids', async () => {
        mockFetch.mockResolvedValue(detail([]))

        const { result } = renderHook(
            () =>
                useLinkedDisplayUrls({
                    adrIds: ['adr-1', 'adr-1', ''],
                    bvbIds: ['bvb-1']
                }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        const urls = mockFetch.mock.calls.map(call => call[0] as string)
        expect(urls.some(url => url.endsWith('adrs/adr-1'))).toBe(true)
        expect(urls.some(url => url.endsWith('bvbs/bvb-1'))).toBe(true)
    })

    it('returns null when an id or its displayUrl is unresolved', async () => {
        mockFetch.mockResolvedValueOnce(
            detail([{ id: 'adr-1', displayUrl: null }])
        )

        const { result } = renderHook(
            () => useLinkedDisplayUrls({ adrIds: ['adr-1', 'adr-missing'] }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.adrDisplayUrl('adr-1')).toBeNull()
        expect(result.current.adrDisplayUrl('adr-missing')).toBeNull()
    })

    it('does not fetch when no ids are requested', async () => {
        const { result } = renderHook(() => useLinkedDisplayUrls({}), {
            wrapper
        })

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(mockFetch).not.toHaveBeenCalled()
        expect(result.current.adrDisplayUrl('adr-1')).toBeNull()
        expect(result.current.bvbDisplayUrl('bvb-1')).toBeNull()
    })
})
