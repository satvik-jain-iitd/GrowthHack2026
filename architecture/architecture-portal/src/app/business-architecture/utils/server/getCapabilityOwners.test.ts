import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getCapabilityOwners } from './getCapabilityOwners'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getCapabilityOwners', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the capability owners endpoint through fetchArchitecture so the request is tokenised', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ capability_owner: [] })
        })

        await getCapabilityOwners()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_CAPABILITY_OWNERS
        )
    })

    it('unwraps the capability_owner array from the payload', async () => {
        const capability_owner = [{ capability_id: 'CAP-1', owner: 'a@b.com' }]
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ capability_owner })
        })

        await expect(getCapabilityOwners()).resolves.toEqual(capability_owner)
    })

    it('returns an empty array when the payload has no capability_owner array', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({})
        })

        await expect(getCapabilityOwners()).resolves.toEqual([])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getCapabilityOwners()).rejects.toThrow(
            'Failed to fetch capability owners list: 401 Unauthorized'
        )
    })
})
