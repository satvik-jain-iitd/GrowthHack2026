import { fetchWithToken } from '@/utils/client'
import {
    fetchAllMetamodelPages,
    fetchMetamodelDetailsByIds,
    createMetamodelList
} from './useMetamodelList'

jest.mock('@/utils/client', () => ({
    fetchWithToken: jest.fn()
}))

const mockFetch = fetchWithToken as jest.Mock

const okResponse = (body: unknown) => ({
    ok: true,
    json: async () => body
})

describe('fetchAllMetamodelPages', () => {
    afterEach(() => jest.resetAllMocks())

    it('returns a single page when total fits in one page', async () => {
        mockFetch.mockResolvedValueOnce(
            okResponse({ page: 1, pageSize: 500, total: 2, data: [1, 2] })
        )

        const result = await fetchAllMetamodelPages<number>('/endpoint')

        expect(result).toEqual([1, 2])
        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockFetch.mock.calls[0][0]).toBe('/endpoint?page=1&pageSize=100')
    })

    it('walks every page until page * pageSize >= total', async () => {
        mockFetch
            .mockResolvedValueOnce(
                okResponse({ page: 1, pageSize: 2, total: 5, data: [1, 2] })
            )
            .mockResolvedValueOnce(
                okResponse({ page: 2, pageSize: 2, total: 5, data: [3, 4] })
            )
            .mockResolvedValueOnce(
                okResponse({ page: 3, pageSize: 2, total: 5, data: [5] })
            )

        const result = await fetchAllMetamodelPages<number>('/endpoint', 2)

        expect(result).toEqual([1, 2, 3, 4, 5])
        expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('stops when a page returns no rows', async () => {
        mockFetch.mockResolvedValueOnce(
            okResponse({ page: 1, pageSize: 2, total: 100, data: [] })
        )

        const result = await fetchAllMetamodelPages<number>('/endpoint', 2)

        expect(result).toEqual([])
        expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('appends query params with & when endpoint already has a query', async () => {
        mockFetch.mockResolvedValueOnce(
            okResponse({ page: 1, pageSize: 500, total: 0, data: [] })
        )

        await fetchAllMetamodelPages('/endpoint?foo=bar')

        expect(mockFetch.mock.calls[0][0]).toBe(
            '/endpoint?foo=bar&page=1&pageSize=100'
        )
    })

    it('falls back to the requested page size when the response omits it', async () => {
        mockFetch
            .mockResolvedValueOnce(
                okResponse({ page: 1, total: 3, data: [1, 2] })
            )
            .mockResolvedValueOnce(okResponse({ page: 2, total: 3, data: [3] }))

        const result = await fetchAllMetamodelPages<number>('/endpoint', 2)

        expect(result).toEqual([1, 2, 3])
        expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('stops after one page when total is not a number', async () => {
        mockFetch.mockResolvedValueOnce(
            okResponse({ page: 1, pageSize: 2, data: [1, 2] })
        )

        const result = await fetchAllMetamodelPages<number>('/endpoint', 2)

        expect(result).toEqual([1, 2])
        expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('throws on a non-ok response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        })

        await expect(fetchAllMetamodelPages('/endpoint')).rejects.toThrow(
            'Failed to fetch /endpoint: 500 Internal Server Error'
        )
    })
})

describe('fetchMetamodelDetailsByIds', () => {
    afterEach(() => jest.resetAllMocks())

    const byIdsUrl = (ids: string[]) => `/things/${ids.join(',')}`

    it('returns an empty array without fetching when there are no ids', async () => {
        const result = await fetchMetamodelDetailsByIds(byIdsUrl, [], 5)

        expect(result).toEqual([])
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('de-duplicates ids, drops empties and chunks by batch size', async () => {
        mockFetch
            .mockResolvedValueOnce(okResponse([{ id: 'a' }, { id: 'b' }]))
            .mockResolvedValueOnce(okResponse([{ id: 'c' }]))

        const result = await fetchMetamodelDetailsByIds<{ id: string }>(
            byIdsUrl,
            ['a', 'b', 'a', '', 'c'],
            2,
            1
        )

        expect(result).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
        expect(mockFetch).toHaveBeenCalledTimes(2)
        expect(mockFetch.mock.calls[0][0]).toBe('/things/a,b')
        expect(mockFetch.mock.calls[1][0]).toBe('/things/c')
    })

    it('ignores non-array responses', async () => {
        mockFetch.mockResolvedValueOnce(okResponse({ not: 'an array' }))

        const result = await fetchMetamodelDetailsByIds(byIdsUrl, ['a'], 5)

        expect(result).toEqual([])
    })

    it('throws on a non-ok response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: 'Bad Request'
        })

        await expect(
            fetchMetamodelDetailsByIds(byIdsUrl, ['a'], 5)
        ).rejects.toThrow('Failed to fetch /things/a: 400 Bad Request')
    })
})

describe('createMetamodelList', () => {
    afterEach(() => jest.resetAllMocks())

    it('joins the list with get-by-ids detail into rows via fetchAll', async () => {
        mockFetch
            .mockResolvedValueOnce(
                okResponse({
                    page: 1,
                    pageSize: 100,
                    total: 1,
                    data: [{ initiativeId: 'a', initiativeName: 'Alpha' }]
                })
            )
            .mockResolvedValueOnce(
                okResponse([{ initiativeId: 'a', lineOfBusiness: 'GCS' }])
            )

        const list = createMetamodelList<
            { initiativeId: string; initiativeName: string },
            { initiativeId: string; lineOfBusiness: string },
            { id: string; name: string; lineOfBusiness: string }
        >({
            queryKey: ['metamodel', 'initiatives'],
            listEndpoint: '/initiatives',
            byIdsUrl: ids => `/initiatives/${ids.join(',')}`,
            batchSize: 5,
            listId: dto => dto.initiativeId,
            detailId: dto => dto.initiativeId,
            map: (summary, detail) => ({
                id: summary.initiativeId,
                name: summary.initiativeName,
                lineOfBusiness: detail?.lineOfBusiness ?? ''
            })
        })

        await expect(list.fetchAll()).resolves.toEqual([
            { id: 'a', name: 'Alpha', lineOfBusiness: 'GCS' }
        ])
        expect(mockFetch.mock.calls[1][0]).toBe('/initiatives/a')
    })

    it('maps a name-only row when the detail lookup misses', async () => {
        mockFetch
            .mockResolvedValueOnce(
                okResponse({
                    page: 1,
                    pageSize: 100,
                    total: 1,
                    data: [{ initiativeId: 'a', initiativeName: 'Alpha' }]
                })
            )
            .mockResolvedValueOnce(okResponse([]))

        const list = createMetamodelList<
            { initiativeId: string; initiativeName: string },
            { initiativeId: string; lineOfBusiness: string },
            { id: string; name: string; lineOfBusiness: string }
        >({
            queryKey: ['metamodel', 'initiatives'],
            listEndpoint: '/initiatives',
            byIdsUrl: ids => `/initiatives/${ids.join(',')}`,
            batchSize: 5,
            listId: dto => dto.initiativeId,
            detailId: dto => dto.initiativeId,
            map: (summary, detail) => ({
                id: summary.initiativeId,
                name: summary.initiativeName,
                lineOfBusiness: detail?.lineOfBusiness ?? ''
            })
        })

        await expect(list.fetchAll()).resolves.toEqual([
            { id: 'a', name: 'Alpha', lineOfBusiness: '' }
        ])
    })
})
