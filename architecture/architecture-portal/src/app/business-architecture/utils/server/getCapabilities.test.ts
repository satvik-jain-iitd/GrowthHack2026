import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getCapabilities } from './getCapabilities'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getCapabilities', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the capabilities endpoint through fetchArchitecture so the request is tokenised', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ capability: [] })
        })

        await getCapabilities()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_CAPABILITIES
        )
    })

    it('unwraps the capability array from the payload', async () => {
        const capability = [{ capability_id: 'CAP-1', capability_nm: 'Pay' }]
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ capability })
        })

        await expect(getCapabilities()).resolves.toEqual(capability)
    })

    it('returns an empty array when the payload has no capability array', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({})
        })

        await expect(getCapabilities()).resolves.toEqual([])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getCapabilities()).rejects.toThrow(
            'Failed to fetch capabilities list: 401 Unauthorized'
        )
    })
})
