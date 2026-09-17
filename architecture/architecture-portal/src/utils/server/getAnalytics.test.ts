import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from './fetchArchitecture'
import { getAnalytics } from './getAnalytics'

jest.mock('./fetchArchitecture', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getAnalytics', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the analytics endpoint through fetchArchitecture so the request is tokenised', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data: {} })
        })

        await getAnalytics()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_ANALYTICS
        )
    })

    it('unwraps the data payload', async () => {
        const data = { totalDomains: 12 }
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data })
        })

        await expect(getAnalytics()).resolves.toEqual(data)
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getAnalytics()).rejects.toThrow(
            'Failed to fetch analytics: 401 Unauthorized'
        )
    })
})
