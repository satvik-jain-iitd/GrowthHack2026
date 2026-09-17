import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    useGetCapabilityCompanyDomains,
    fetchCapabilityCompanyDomains,
    CAPABILITY_COMPANY_DOMAINS_QUERY_KEY
} from './useGetCapabilityCompanyDomains'

describe('useGetCapabilityCompanyDomains', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        })
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
        return wrapper
    }

    describe('fetchCapabilityCompanyDomains', () => {
        it('returns company domain array on success', async () => {
            const mockData = [
                {
                    company_domain_id: 'CD-1',
                    domain_nm: 'Payments',
                    playbook_id: 'PB-1'
                }
            ]
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const result = await fetchCapabilityCompanyDomains('CAP-1')
            expect(result).toEqual(mockData)
        })

        it('returns empty array when response is not an array', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => null
            })

            const result = await fetchCapabilityCompanyDomains('CAP-1')
            expect(result).toEqual([])
        })

        it('throws on non-ok response', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            })

            await expect(
                fetchCapabilityCompanyDomains('CAP-1')
            ).rejects.toThrow('Failed to fetch company domains for capability')
        })
    })

    describe('useGetCapabilityCompanyDomains hook', () => {
        it('returns company domains on successful fetch', async () => {
            const mockData = [
                {
                    company_domain_id: 'CD-1',
                    domain_nm: 'Payments',
                    playbook_id: 'PB-1'
                }
            ]
            ;(global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetCapabilityCompanyDomains('CAP-1'),
                { wrapper }
            )

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
            })

            expect(result.current.companyDomains).toEqual(mockData)
        })

        it('is disabled when capabilityId is empty', async () => {
            const wrapper = createWrapper()
            const { result } = renderHook(
                () => useGetCapabilityCompanyDomains(''),
                { wrapper }
            )

            expect(result.current.loading).toBe(false)
            expect(result.current.companyDomains).toEqual([])
        })
    })

    describe('CAPABILITY_COMPANY_DOMAINS_QUERY_KEY', () => {
        it('returns correct key shape', () => {
            expect(CAPABILITY_COMPANY_DOMAINS_QUERY_KEY('CAP-1')).toEqual([
                'capability_company_domains',
                'CAP-1'
            ])
        })
    })
})
