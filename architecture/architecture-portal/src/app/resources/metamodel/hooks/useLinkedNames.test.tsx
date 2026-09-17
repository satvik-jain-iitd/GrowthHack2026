import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

import { useLinkedNames } from './useLinkedNames'

jest.mock('@/utils/client', () => ({ fetchWithToken: jest.fn() }))

const mockFetch = fetchWithToken as jest.Mock

const detail = (data: unknown[]) => ({ ok: true, json: async () => data })
const onePage = (data: unknown[]) => ({
    ok: true,
    json: async () => ({ page: 1, pageSize: 100, total: data.length, data })
})

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

describe('useLinkedNames', () => {
    it('resolves initiative and application ids to names via get-by-ids', async () => {
        mockFetch
            .mockResolvedValueOnce(
                detail([
                    { initiativeId: 'i1', initiativeName: 'Alpha' },
                    { initiativeId: 'i2', initiativeName: 'Beta' }
                ])
            )
            .mockResolvedValueOnce(
                detail([{ applicationId: 'a1', applicationName: 'App One' }])
            )

        const { result } = renderHook(
            () =>
                useLinkedNames({
                    initiativeIds: ['i1', 'i2'],
                    applicationIds: ['a1']
                }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.initiativeName('i1')).toBe('Alpha')
        expect(result.current.initiativeName('i2')).toBe('Beta')
        expect(result.current.applicationName('a1')).toBe('App One')
    })

    it('falls back to the raw id when a name is unresolved', async () => {
        mockFetch.mockResolvedValueOnce(detail([]))

        const { result } = renderHook(
            () => useLinkedNames({ initiativeIds: ['missing'] }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.initiativeName('missing')).toBe('missing')
    })

    it('resolves ADR names from the list endpoint when enabled', async () => {
        mockFetch.mockResolvedValueOnce(
            onePage([
                { id: 'd1', name: 'ADR One' },
                { id: 'd2', name: 'ADR Two' }
            ])
        )

        const { result } = renderHook(
            () => useLinkedNames({ resolveAdrs: true }),
            { wrapper }
        )

        await waitFor(() =>
            expect(result.current.adrName('d1')).toBe('ADR One')
        )
        expect(result.current.adrName('d2')).toBe('ADR Two')
        expect(result.current.adrName('d3')).toBe('d3')
    })

    it('does not fetch when no ids are requested', async () => {
        const { result } = renderHook(() => useLinkedNames({}), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('resolves business, technical and foundational capability ids to names', async () => {
        mockFetch
            .mockResolvedValueOnce(
                detail([{ businessCapabilityId: 'b1', name: 'Payments' }])
            )
            .mockResolvedValueOnce(
                detail([
                    { technicalCapabilityId: 't1', name: 'Event Streaming' }
                ])
            )
            .mockResolvedValueOnce(
                detail([{ foundationalTechnologyId: 'f1', name: 'Kafka' }])
            )

        const { result } = renderHook(
            () =>
                useLinkedNames({
                    businessCapabilityIds: ['b1'],
                    technicalCapabilityIds: ['t1'],
                    foundationalTechnologyIds: ['f1']
                }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.businessCapabilityName('b1')).toBe('Payments')
        expect(result.current.technicalCapabilityName('t1')).toBe(
            'Event Streaming'
        )
        expect(result.current.foundationalTechnologyName('f1')).toBe('Kafka')
    })

    it('falls back to the raw id for unresolved capability lookups', async () => {
        mockFetch.mockResolvedValueOnce(detail([]))

        const { result } = renderHook(
            () => useLinkedNames({ businessCapabilityIds: ['missing'] }),
            { wrapper }
        )

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.businessCapabilityName('missing')).toBe('missing')
    })
})
