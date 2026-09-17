import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from './fetchArchitecture'
import { getPlaybook, getPlaybooks } from './getPlaybooks'

jest.mock('./fetchArchitecture', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getPlaybooks', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the playbooks endpoint through fetchArchitecture so the request is tokenised', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] })
        })

        await getPlaybooks()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_PLAYBOOKS
        )
    })

    it('unwraps the data array', async () => {
        const data = [{ playbook_id: 'PB-1' }]
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data })
        })

        await expect(getPlaybooks()).resolves.toEqual(data)
    })

    it('returns an empty array when the payload has no data array', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({})
        })

        await expect(getPlaybooks()).resolves.toEqual([])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getPlaybooks()).rejects.toThrow(
            'Failed to fetch playbooks: 401 Unauthorized'
        )
    })
})

describe('getPlaybook', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('requests the playbook by id and unwraps the data payload', async () => {
        const data = { playbook_id: 'PB-1', playbook_nm: 'Onboarding' }
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data })
        })

        await expect(getPlaybook('PB-1')).resolves.toEqual(data)
        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_PLAYBOOK_BY_ID('PB-1')
        )
    })

    it('throws on a non-ok response', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found'
        })

        await expect(getPlaybook('PB-1')).rejects.toThrow(
            'Failed to fetch playbook: 404 Not Found'
        )
    })
})
