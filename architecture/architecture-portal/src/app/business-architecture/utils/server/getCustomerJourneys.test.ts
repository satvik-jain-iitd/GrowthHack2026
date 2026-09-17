import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getCustomerJourneys } from './getCustomerJourneys'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getCustomerJourneys', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the customer journeys endpoint through fetchArchitecture so the request is tokenised', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => []
        })

        await getCustomerJourneys()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_CUSTOMER_JOURNEYS
        )
    })

    it('returns the journey array on success', async () => {
        const journeys = [{ journey_id: 'CJ-1', journey_grp_tx: 'Acquire' }]
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => journeys
        })

        await expect(getCustomerJourneys()).resolves.toEqual(journeys)
    })

    it('returns an empty array when the payload is not an array', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => null
        })

        await expect(getCustomerJourneys()).resolves.toEqual([])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getCustomerJourneys()).rejects.toThrow(
            'Failed to fetch customer journeys list: 401 Unauthorized'
        )
    })
})
