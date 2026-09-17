import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import '@testing-library/jest-dom'
import { CompanyDomainIndexHeader } from './CompanyDomainIndexHeader'
import { domains } from '@/test/mocks/domains'
import { Domain } from '@/app/company-domains/types'
import { PrevNext } from '@/types/PrevNext'

// Domain ID that exists in DOMAIN_API_MAP
const DOMAIN_API_MAP_DOMAIN_ID = '27124f40-7adf-42c2-8a18-a44b75d8bc2d'

jest.mock('@/app/company-domains/constants', () => ({
    DOMAIN_API_MAP: {
        [DOMAIN_API_MAP_DOMAIN_ID]: {
            e0: '/docs/some-api-doc'
        }
    }
}))

jest.mock('@/constants', () => ({
    ENVIRONMENT: 'e0',
    PLAYBOOK_TYPE_IDS: {
        COMPANY_DOMAIN: 'c1966ed3-19b4-4a96-bf7b-f213f133a11f'
    }
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ alt, className }: { alt: string; className: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} className={className} />
    )
}))

jest.mock('@/components/ui', () => ({
    NoPrefetchLink: ({
        href,
        children
    }: {
        href: string
        children: React.ReactNode
        // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
    }) => <a href={href}>{children}</a>
}))

jest.mock('@/app/docs/components/AddAdrButton', () => ({
    __esModule: true,
    default: ({ playbookId, repo }: { playbookId: string; repo: string }) => (
        <button
            data-testid='add-adr-button'
            data-playbook-id={playbookId}
            data-repo={repo}
        >
            Add ADR
        </button>
    )
}))

jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    return {
        ...actual,
        Flex: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        Link: ({
            children,
            href
        }: {
            children: React.ReactNode
            href: string
            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
        }) => <a href={href}>{children}</a>
    }
})

jest.mock('@/app/company-domains/company-domain-landing.module.css', () => ({
    domainLandingPageTitle: 'domainLandingPageTitle'
}))

const mockDomain = domains[0] as unknown as Domain

const mockPrevNext: PrevNext = {
    previous: { href: '/prev', label: 'Previous' },
    next: { href: '/next-domain', label: 'Next' }
}

describe('CompanyDomainIndexHeader', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders the domain name', () => {
        render(
            <CompanyDomainIndexHeader
                domain={mockDomain}
                prevNext={mockPrevNext}
            />
        )

        expect(screen.getByText(mockDomain.domain_nm)).toBeInTheDocument()
    })

    it('renders domain images (light and dark)', () => {
        render(
            <CompanyDomainIndexHeader
                domain={mockDomain}
                prevNext={mockPrevNext}
            />
        )

        const images = screen.getAllByAltText('Domain')
        expect(images).toHaveLength(2)
        expect(images[0]).toHaveClass('image-dark')
        expect(images[1]).toHaveClass('image-light')
    })

    it('always renders Application Meta Model link', () => {
        render(
            <CompanyDomainIndexHeader
                domain={mockDomain}
                prevNext={mockPrevNext}
            />
        )

        expect(screen.getByText('Application Meta Model')).toBeInTheDocument()
    })

    it('renders Architecture Docs link when contributionStat is true and next href exists', () => {
        const domain = { ...mockDomain, cntrb_in: true } as unknown as Domain

        render(
            <CompanyDomainIndexHeader domain={domain} prevNext={mockPrevNext} />
        )

        expect(screen.getByText('Architecture Docs')).toBeInTheDocument()
    })

    it('does not render Architecture Docs link when contributionStat is false', () => {
        const domain = { ...mockDomain, cntrb_in: false } as unknown as Domain

        render(
            <CompanyDomainIndexHeader domain={domain} prevNext={mockPrevNext} />
        )

        expect(screen.queryByText('Architecture Docs')).not.toBeInTheDocument()
    })

    it('does not render Architecture Docs link when prevNext has no next href', () => {
        const domain = { ...mockDomain, cntrb_in: true } as unknown as Domain

        render(
            <CompanyDomainIndexHeader
                domain={domain}
                prevNext={{ previous: mockPrevNext.previous }}
            />
        )

        expect(screen.queryByText('Architecture Docs')).not.toBeInTheDocument()
    })

    it('renders Company Domain APIs link for domain in DOMAIN_API_MAP', () => {
        const domain = {
            ...mockDomain,
            company_domain_id: DOMAIN_API_MAP_DOMAIN_ID
        } as unknown as Domain

        render(
            <CompanyDomainIndexHeader domain={domain} prevNext={mockPrevNext} />
        )

        expect(screen.getByText('Company Domain APIs')).toBeInTheDocument()
    })

    it('does not render Company Domain APIs link for domain not in DOMAIN_API_MAP', () => {
        render(
            <CompanyDomainIndexHeader
                domain={mockDomain}
                prevNext={mockPrevNext}
            />
        )

        expect(
            screen.queryByText('Company Domain APIs')
        ).not.toBeInTheDocument()
    })

    it('renders AddAdrButton when both playbookId and repo are provided', () => {
        render(
            <CompanyDomainIndexHeader
                domain={mockDomain}
                prevNext={mockPrevNext}
                playbookId='playbook-123'
                repo='my-repo'
            />
        )

        const btn = screen.getByTestId('add-adr-button')
        expect(btn).toBeInTheDocument()
        expect(btn).toHaveAttribute('data-playbook-id', 'playbook-123')
        expect(btn).toHaveAttribute('data-repo', 'my-repo')
    })

    it('does not render AddAdrButton when repo is missing', () => {
        render(
            <CompanyDomainIndexHeader
                domain={mockDomain}
                prevNext={mockPrevNext}
                playbookId='playbook-123'
            />
        )

        expect(screen.queryByTestId('add-adr-button')).not.toBeInTheDocument()
    })

    it('does not render AddAdrButton when playbookId is missing', () => {
        render(
            <CompanyDomainIndexHeader
                domain={mockDomain}
                prevNext={mockPrevNext}
                repo='my-repo'
            />
        )

        expect(screen.queryByTestId('add-adr-button')).not.toBeInTheDocument()
    })
})
