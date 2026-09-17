import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getDomains } from './getDomains'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getDomains', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the domains endpoint through fetchArchitecture so the request is tokenised', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] })
        })

        await getDomains()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_DOMAINS
        )
    })

    it('unwraps the data array from the payload', async () => {
        const data = [{ company_domain_id: 'CD-1', domain_nm: 'Payments' }]
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data })
        })

        await expect(getDomains()).resolves.toEqual(data)
    })

    it('returns an empty array when the payload has no data array', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({})
        })

        await expect(getDomains()).resolves.toEqual([])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getDomains()).rejects.toThrow(
            'Failed to fetch domains: 401 Unauthorized'
        )
    })
})
