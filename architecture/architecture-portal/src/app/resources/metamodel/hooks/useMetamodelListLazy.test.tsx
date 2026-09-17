import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

import { createMetamodelList } from './useMetamodelList'

jest.mock('@/utils/client', () => ({ fetchWithToken: jest.fn() }))

const mockFetch = fetchWithToken as jest.Mock

interface ListDto {
    initiativeId: string
    initiativeName: string
}
interface DetailDto {
    initiativeId: string
    lineOfBusiness: string
}
interface Row {
    id: string
    name: string
    lineOfBusiness: string
}

const onePage = (data: unknown[]) => ({
    ok: true,
    json: async () => ({ page: 1, pageSize: 100, total: data.length, data })
})
const detail = (data: unknown[]) => ({ ok: true, json: async () => data })

const makeList = () =>
    createMetamodelList<ListDto, DetailDto, Row>({
        queryKey: ['metamodel', 'lazy-test'],
        listEndpoint: '/initiatives',
        byIdsUrl: ids => `/initiatives/${ids.join(',')}`,
        batchSize: 5,
        listId: dto => dto.initiativeId,
        detailId: dto => dto.initiativeId,
        map: (summary, detailDto) => ({
            id: summary.initiativeId,
            name: summary.initiativeName,
            lineOfBusiness: detailDto?.lineOfBusiness ?? ''
        })
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

describe('useLazyList pendingIds', () => {
    it('marks visible ids pending until their detail record arrives', async () => {
        let resolveDetail: (value: unknown) => void = () => {}
        mockFetch
            .mockResolvedValueOnce(
                onePage([
                    { initiativeId: 'i1', initiativeName: 'Alpha' },
                    { initiativeId: 'i2', initiativeName: 'Beta' }
                ])
            )
            .mockReturnValueOnce(
                new Promise(resolve => {
                    resolveDetail = resolve
                })
            )

        const list = makeList()
        const { result } = renderHook(() => list.useLazyList(['i1', 'i2']), {
            wrapper
        })

        await waitFor(() => expect(result.current.enriching).toBe(true))
        expect([...result.current.pendingIds]).toEqual(['i1', 'i2'])

        resolveDetail(detail([{ initiativeId: 'i1', lineOfBusiness: 'GCS' }]))

        await waitFor(() => expect(result.current.enriching).toBe(false))
        expect(result.current.data).toEqual([
            { id: 'i1', name: 'Alpha', lineOfBusiness: 'GCS' },
            { id: 'i2', name: 'Beta', lineOfBusiness: '' }
        ])
    })

    it('clears pending ids once the detail query settles, even when a row is never returned', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ initiativeId: 'i1', initiativeName: 'Alpha' }])
            )
            .mockResolvedValueOnce(detail([]))

        const list = makeList()
        const { result } = renderHook(() => list.useLazyList(['i1']), {
            wrapper
        })

        await waitFor(() => expect(result.current.enriching).toBe(false))
        expect(result.current.pendingIds.size).toBe(0)
    })

    it('reports nothing pending while no rows are visible', async () => {
        mockFetch.mockResolvedValueOnce(
            onePage([{ initiativeId: 'i1', initiativeName: 'Alpha' }])
        )

        const list = makeList()
        const { result } = renderHook(() => list.useLazyList([]), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.enriching).toBe(false)
        expect(result.current.pendingIds.size).toBe(0)
        expect(mockFetch).toHaveBeenCalledTimes(1)
    })
})
