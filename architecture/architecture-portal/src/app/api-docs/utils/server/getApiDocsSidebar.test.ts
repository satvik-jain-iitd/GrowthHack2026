import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getApiDocsSidebar } from './getApiDocsSidebar'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

const sidebarData = {
    payments: {
        name: 'Payments',
        apis: {
            'api-1': {
                operations: {
                    'op-1': {
                        id: 'op-1',
                        name: 'Get Payment',
                        path: ['Payments', 'API 1', 'Get Payment']
                    }
                }
            }
        }
    }
}

describe('getApiDocsSidebar', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the sidebar endpoint through fetchArchitecture so the request is tokenised', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data: {} })
        })

        await getApiDocsSidebar()

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_APIDOCS_SIDEBAR
        )
    })

    it('returns the raw sidebar data alongside the flattened domain and operation lists', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => ({ data: sidebarData })
        })

        const result = await getApiDocsSidebar()

        expect(result.sidebarData).toEqual(sidebarData)
        expect(result.domainsList).toEqual([sidebarData.payments])
        expect(result.operationsList).toEqual([
            {
                label: 'Get Payment',
                value: 'op-1',
                path: 'Payments > API 1 > Get Payment'
            }
        ])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getApiDocsSidebar()).rejects.toThrow(
            'Failed to fetch API docs sidebar: 401 Unauthorized'
        )
    })
})
