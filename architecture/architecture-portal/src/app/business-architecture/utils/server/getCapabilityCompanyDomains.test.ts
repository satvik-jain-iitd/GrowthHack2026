import { API_ENDPOINTS } from '@/constants'
import { fetchArchitecture } from '@/utils/server'
import { getCapabilityCompanyDomains } from './getCapabilityCompanyDomains'

jest.mock('@/utils/server', () => ({ fetchArchitecture: jest.fn() }))

const mockFetchArchitecture = fetchArchitecture as jest.Mock

describe('getCapabilityCompanyDomains', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('calls the capability company domains endpoint for the given capability', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => []
        })

        await getCapabilityCompanyDomains('CAP-1')

        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            API_ENDPOINTS.GET_CAPABILITY_COMPANY_DOMAINS('CAP-1')
        )
    })

    it('returns the company domain array on success', async () => {
        const domains = [
            {
                company_domain_id: 'CD-1',
                domain_nm: 'Payments',
                playbook_id: 'PB-1'
            }
        ]
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => domains
        })

        await expect(getCapabilityCompanyDomains('CAP-1')).resolves.toEqual(
            domains
        )
    })

    it('returns an empty array when the payload is not an array', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: true,
            json: async () => null
        })

        await expect(getCapabilityCompanyDomains('CAP-1')).resolves.toEqual([])
    })

    it('throws on a non-ok response rather than resolving empty', async () => {
        mockFetchArchitecture.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(getCapabilityCompanyDomains('CAP-1')).rejects.toThrow(
            'Failed to fetch company domains for capability: 401 Unauthorized'
        )
    })
})
