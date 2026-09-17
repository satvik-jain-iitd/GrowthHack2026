import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import '@testing-library/jest-dom'
import CompanyDomainLanding from './CompanyDomainLanding'
import { domains } from '@/test/mocks/domains'
import { Domain } from '@/app/company-domains/types'
import { PrevNext } from '@/types/PrevNext'

jest.mock('@/utils/server', () => ({
    fetchArchitecture: jest.fn()
}))

jest.mock('@/constants', () => ({
    API_ENDPOINTS: {
        GET_STATUS_COUNT: jest.fn((id: string) => `/api/status-count/${id}`),
        GET_DOMAIN_DETAILS_APPLICATIONS: jest.fn(
            (id: string) => `/api/applications/${id}`
        )
    },
    CDAAS_URL: 'https://mock-cdaas-url.com'
}))

jest.mock('./CompanyDomainIndexHeader', () => ({
    CompanyDomainIndexHeader: () => (
        <div data-testid='domain-index-header'>CompanyDomainIndexHeader</div>
    )
}))

jest.mock('./DomainOwner', () => ({
    DomainOwners: () => <div data-testid='domain-owners'>DomainOwners</div>
}))

jest.mock('./DomainDescription', () => ({
    DomainDescription: () => (
        <div data-testid='domain-description'>DomainDescription</div>
    )
}))

jest.mock('./DomainMetrics', () => ({
    DomainMetrics: () => <div data-testid='domain-metrics'>DomainMetrics</div>
}))

jest.mock('./DomainTabs', () => ({
    DomainTabs: (props: {
        TotalApplicationsCount: number
        domainApi: number
    }) => (
        <div data-testid='domain-tabs'>
            <span data-testid='total-apps'>{props.TotalApplicationsCount}</span>
            <span data-testid='domain-api-count'>{props.domainApi}</span>
        </div>
    )
}))

jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    return {
        ...actual,
        Box: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        Flex: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        )
    }
})

jest.mock('@/app/company-domains/company-domain-landing.module.css', () => ({
    domainLandingPage: 'domainLandingPage'
}))

import { fetchArchitecture } from '@/utils/server'

const mockFetchArchitecture = fetchArchitecture as jest.Mock

const mockDomain = domains[0] as unknown as Domain

const mockPrevNext: PrevNext = {
    previous: { href: '/prev', label: 'Previous' },
    next: { href: '/next', label: 'Next' }
}

const mockApplications = [
    { application_nm: 'App B', application_id: '2' },
    { application_nm: 'App A', application_id: '1' }
]

const mockPlatformConfigurations = {
    config1: {
        architecturePortalIdentifier: mockDomain.company_domain_id,
        name: 'Platform Config 1'
    },
    config2: {
        architecturePortalIdentifier: 'other-domain-id',
        name: 'Platform Config 2'
    }
}

const mockApiData = {
    domainStatusCount: {
        eARB_Approved: 5
    }
}

function setupFetchMocks({
    apiData = mockApiData,
    applications = mockApplications,
    platformConfigurations = mockPlatformConfigurations
} = {}) {
    mockFetchArchitecture.mockImplementation((url: string) => {
        if (url.includes('status-count')) {
            return Promise.resolve({
                json: () => Promise.resolve({ data: apiData })
            })
        }
        if (url.includes('applications')) {
            return Promise.resolve({
                json: () => Promise.resolve({ data: applications })
            })
        }
        // platform configurations
        return Promise.resolve({
            json: () => Promise.resolve(platformConfigurations)
        })
    })
}

describe('CompanyDomainLanding', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders all main sections', async () => {
        setupFetchMocks()

        const jsx = await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext
        })
        render(jsx)

        expect(screen.getByTestId('domain-index-header')).toBeInTheDocument()
        expect(screen.getByTestId('domain-owners')).toBeInTheDocument()
        expect(screen.getByTestId('domain-description')).toBeInTheDocument()
        expect(screen.getByTestId('domain-metrics')).toBeInTheDocument()
        expect(screen.getByTestId('domain-tabs')).toBeInTheDocument()
    })

    it('passes sorted applications count to DomainTabs', async () => {
        setupFetchMocks()

        const jsx = await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext
        })
        render(jsx)

        expect(screen.getByTestId('total-apps').textContent).toBe(
            String(mockApplications.length)
        )
    })

    it('passes eARB_Approved count as domainApi to DomainTabs', async () => {
        setupFetchMocks()

        const jsx = await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext
        })
        render(jsx)

        expect(screen.getByTestId('domain-api-count').textContent).toBe(
            String(mockApiData.domainStatusCount.eARB_Approved)
        )
    })

    it('passes repo prop to CompanyDomainIndexHeader', async () => {
        setupFetchMocks()

        const jsx = await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext,
            repo: 'my-repo'
        })
        render(jsx)

        expect(screen.getByTestId('domain-index-header')).toBeInTheDocument()
    })

    it('handles empty applications list gracefully', async () => {
        setupFetchMocks({ applications: [] })

        const jsx = await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext
        })
        render(jsx)

        expect(screen.getByTestId('total-apps').textContent).toBe('0')
    })

    it('handles missing eARB_Approved by defaulting domainApi to 0', async () => {
        setupFetchMocks({
            apiData: { domainStatusCount: {} } as typeof mockApiData
        })

        const jsx = await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext
        })
        render(jsx)

        expect(screen.getByTestId('domain-api-count').textContent).toBe('0')
    })

    it('handles no matching capabilityMap entry', async () => {
        setupFetchMocks({
            platformConfigurations: {
                config1: {
                    architecturePortalIdentifier: 'other-domain-id',
                    name: 'Platform Config'
                }
            }
        })

        const jsx = await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext
        })
        render(jsx)

        expect(screen.getByTestId('domain-tabs')).toBeInTheDocument()
    })

    it('calls fetchArchitecture three times for the correct endpoints', async () => {
        setupFetchMocks()

        await CompanyDomainLanding({
            domain: mockDomain,
            prevNext: mockPrevNext
        })

        expect(mockFetchArchitecture).toHaveBeenCalledTimes(3)
        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            expect.stringContaining('status-count')
        )
        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            expect.stringContaining('applications')
        )
        expect(mockFetchArchitecture).toHaveBeenCalledWith(
            expect.stringContaining('platform-configurations')
        )
    })
})
