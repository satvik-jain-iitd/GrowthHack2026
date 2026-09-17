import { API_ENDPOINTS, PLAYBOOK_TYPE_IDS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getBvBPlaybooks } from './getBvBPlaybooks'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getBvBPlaybooks', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('requests playbooks filtered to the build-vs-buy type', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] })
        })

        await getBvBPlaybooks()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_PLAYBOOKS_BY_TYPE(PLAYBOOK_TYPE_IDS.BUILD_VS_BUY)
        )
    })

    it('unwraps the data array', async () => {
        const data = [{ playbook_id: 'PB-1' }]
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data })
        })

        await expect(getBvBPlaybooks()).resolves.toEqual(data)
    })

    it('returns an empty array when the payload has no data array', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({})
        })

        await expect(getBvBPlaybooks()).resolves.toEqual([])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getBvBPlaybooks()).rejects.toThrow(
            'Failed to fetch playbooks: 401 Unauthorized'
        )
    })
})
