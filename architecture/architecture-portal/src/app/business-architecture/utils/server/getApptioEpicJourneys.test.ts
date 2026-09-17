import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getApptioEpicJourneys } from './getApptioEpicJourneys'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getApptioEpicJourneys', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('requests journeys for the given epic and returns the payload', async () => {
        const payload = { journeys: [], isRecommended: [] }
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => payload
        })

        await expect(getApptioEpicJourneys('EPIC-1')).resolves.toEqual(payload)
        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_APPTIO_EPIC_JOURNEYS('EPIC-1')
        )
    })

    it('surfaces the upstream message on a non-ok response', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'epic not found' })
        })

        await expect(getApptioEpicJourneys('EPIC-1')).rejects.toThrow(
            'Failed to fetch apptio epic journeys: epic not found'
        )
    })
})
