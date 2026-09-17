import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ApplicationInfoGrid from './ApplicationInfoGrid'
import { Application } from '@/app/company-domains/types'
import { emptyRecommendedValueIds } from '@/app/shared/utils/recommendationDiff'
import { useLinkedDisplayUrls } from '@/app/resources/metamodel/hooks/useLinkedDisplayUrls'

const mockUseLinkedDisplayUrls = useLinkedDisplayUrls as jest.Mock

jest.mock('@/app/initiatives/components/PtbTags', () => ({
    __esModule: true,
    default: ({
        item,
        href
    }: {
        item: { name: string }
        href?: string | null
    }) =>
        href ? (
            // eslint-disable-next-line enforce-no-prefetch-link/enforce-no-prefetch-link
            <a href={href}>{item.name}</a>
        ) : (
            <span>{item.name}</span>
        )
}))

jest.mock('@/app/resources/metamodel/hooks/useLinkedDisplayUrls', () => ({
    useLinkedDisplayUrls: jest.fn(() => ({
        adrDisplayUrl: () => null,
        bvbDisplayUrl: () => null,
        loading: false
    }))
}))

jest.mock('@/app/business-architecture/hooks/useGetCapabilities', () => ({
    useCapabilities: () => ({
        capability: [
            { capability_id: 'cap-1', capability_nm: 'Payments Processing' },
            { capability_id: 'cap-2', capability_nm: 'Fraud Detection' }
        ],
        loading: false
    })
}))

const mockApplication: Application = {
    application_nm: 'Test App',
    application_id: 'app-123',
    life_cycle_status_nm: 'Active',
    domain_nm: 'Test Domain',
    count: 0,
    company_domain_id: 'cd-1',
    ebc_level_4_nm: '',
    ebc_level_3_nm: '',
    last_update_ts: '',
    last_update_user_id: '',
    unlink: false,
    sub_domain_id: '',
    central_application_da: {
        lineOfBusiness: { lineOfBusiness2: 'LOB2' },
        lifeCycleStatus: 'Active',
        appType: 'Service',
        description: 'desc'
    }
}

describe('ApplicationInfoGrid', () => {
    beforeEach(() => {
        mockUseLinkedDisplayUrls.mockReturnValue({
            adrDisplayUrl: () => null,
            bvbDisplayUrl: () => null,
            loading: false
        })
    })

    it('renders resolved tech stack names', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{}}
                isEdit={false}
                techStackNames={['Node.js', 'Kubernetes']}
            />
        )
        expect(screen.getByText('Tech Stacks')).toBeInTheDocument()
        expect(screen.getByText('Node.js')).toBeInTheDocument()
        expect(screen.getByText('Kubernetes')).toBeInTheDocument()
    })

    it('renders "-" for Tech Stacks when none are provided', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{}}
                isEdit={false}
                techStackNames={[]}
            />
        )
        expect(screen.getByText('Tech Stacks')).toBeInTheDocument()
        expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(1)
    })

    it('resolves business capability ids to names for display', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{ 'Business Capabilities': ['cap-1', 'cap-2'] }}
                isEdit={false}
            />
        )
        expect(screen.getByText('Business capabilities')).toBeInTheDocument()
        expect(screen.getByText('Payments Processing')).toBeInTheDocument()
        expect(screen.getByText('Fraud Detection')).toBeInTheDocument()
    })

    it('falls back to the capability id when no name is found', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{ 'Business Capabilities': ['unknown-cap'] }}
                isEdit={false}
            />
        )
        expect(screen.getByText('unknown-cap')).toBeInTheDocument()
    })

    it('renders foundational technologies as tags', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{ 'Foundational Technologies': ['Kafka', 'Redis'] }}
                isEdit={false}
            />
        )
        expect(
            screen.getByText('Foundational Technologies')
        ).toBeInTheDocument()
        expect(screen.getByText('Kafka')).toBeInTheDocument()
        expect(screen.getByText('Redis')).toBeInTheDocument()
    })

    it('renders tech capabilities as tags', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{
                    'Technical Capabilities': ['Streaming', 'Caching']
                }}
                isEdit={false}
            />
        )
        expect(screen.getByText('Tech Capabilities')).toBeInTheDocument()
        expect(screen.getByText('Streaming')).toBeInTheDocument()
        expect(screen.getByText('Caching')).toBeInTheDocument()
    })

    it('renders markets as tags', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{ Markets: ['US', 'GB'] }}
                isEdit={false}
            />
        )
        expect(screen.getByText('Markets')).toBeInTheDocument()
        expect(screen.getByText('US')).toBeInTheDocument()
        expect(screen.getByText('GB')).toBeInTheDocument()
    })

    it('marks staged-only markets and tech stacks as recommendations', () => {
        const { container } = render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{ Markets: ['US', 'GB'] }}
                isEdit={false}
                techStackNames={['Node.js']}
                techStackIds={['ts-1']}
                recommendedValues={{
                    ...emptyRecommendedValueIds(),
                    markets: ['GB'],
                    techStacks: ['ts-1']
                }}
            />
        )
        const recommended = Array.from(
            container.querySelectorAll('[data-recommended="true"]')
        ).map(node => node.textContent)
        expect(recommended).toEqual(expect.arrayContaining(['Node.js', 'GB']))
        expect(recommended).not.toContain('US')
    })

    it('marks staged-only playbooks as recommendations', () => {
        const { container } = render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{}}
                isEdit={false}
                linkedPlaybookNames={['Playbook A', 'Domain Playbook']}
                linkedPlaybookIds={['pb-1', 'pb-domain']}
                recommendedValues={{
                    ...emptyRecommendedValueIds(),
                    playbooks: ['pb-domain']
                }}
            />
        )
        const recommended = Array.from(
            container.querySelectorAll('[data-recommended="true"]')
        ).map(node => node.textContent)
        expect(recommended).toContain('Domain Playbook')
        expect(recommended).not.toContain('Playbook A')
    })

    it('renders playbooks in the default style when none are recommended', () => {
        const { container } = render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{}}
                isEdit={false}
                linkedPlaybookNames={['Playbook A']}
                linkedPlaybookIds={['pb-1']}
                recommendedValues={emptyRecommendedValueIds()}
            />
        )
        expect(screen.getByText('Playbook A')).toBeInTheDocument()
        expect(
            container.querySelectorAll('[data-recommended="true"]')
        ).toHaveLength(0)
    })

    it('renders Central ID value', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{}}
                isEdit={false}
            />
        )
        expect(screen.getByText('Central ID')).toBeInTheDocument()
        expect(screen.getByText('app-123')).toBeInTheDocument()
        expect(
            screen.queryByText('Investment Strategy')
        ).not.toBeInTheDocument()
    })

    it('renders Business Units tags from metadata', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{ 'Business Units': ['Consumer', 'Commercial'] }}
                isEdit={false}
            />
        )
        expect(screen.getByText('Business units')).toBeInTheDocument()
        expect(screen.getByText('Consumer')).toBeInTheDocument()
        expect(screen.getByText('Commercial')).toBeInTheDocument()
    })

    it('renders ADR, BvB, Playbook and Linked Initiative tags when present', () => {
        const populated: Application = {
            ...mockApplication,
            proposed_domain_nm: 'Proposed Domain',
            sub_domain_nm: 'Sub Domain',
            adr_core: [{ id: 'adr-1', name: 'ADR Core' }],
            adr_non_core: [{ id: 'adr-2', name: 'ADR Non Core' }],
            bvb_core: [{ id: 'bvb-1', name: 'BvB Core' }],
            bvb_non_core: [{ id: 'bvb-2', name: 'BvB Non Core' }],
            playbook_core: [{ id: 'pb-1', name: 'Initiative Core' }],
            playbook_non_core: [{ id: 'pb-2', name: 'Initiative Non Core' }]
        }
        render(
            <ApplicationInfoGrid
                applicationData={populated}
                metadata={{}}
                isEdit={false}
                linkedPlaybookNames={['Playbook A']}
            />
        )
        expect(screen.getByText('ADR Core')).toBeInTheDocument()
        expect(screen.getByText('ADR Non Core')).toBeInTheDocument()
        expect(screen.getByText('BvB Core')).toBeInTheDocument()
        expect(screen.getByText('BvB Non Core')).toBeInTheDocument()
        expect(screen.getByText('Initiative Core')).toBeInTheDocument()
        expect(screen.getByText('Initiative Non Core')).toBeInTheDocument()
        expect(screen.getByText('Playbook A')).toBeInTheDocument()
        expect(screen.getByText('Proposed Company Domain')).toBeInTheDocument()
    })

    it('links ADR and BvB tags to their resolved metamodel displayUrl', () => {
        mockUseLinkedDisplayUrls.mockReturnValue({
            adrDisplayUrl: (id: string) =>
                id === 'adr-1' ? 'https://portal.test/adrs/file-1' : null,
            bvbDisplayUrl: (id: string) =>
                id === 'bvb-1' ? 'https://portal.test/docs/file-2' : null,
            loading: false
        })
        render(
            <ApplicationInfoGrid
                applicationData={{
                    ...mockApplication,
                    adr_core: [{ id: 'adr-1', name: 'ADR Core' }],
                    adr_non_core: [{ id: 'adr-2', name: 'ADR Non Core' }],
                    bvb_core: [{ id: 'bvb-1', name: 'BvB Core' }],
                    bvb_non_core: [{ id: 'bvb-2', name: 'BvB Non Core' }]
                }}
                metadata={{}}
                isEdit={false}
            />
        )
        expect(screen.getByText('ADR Core')).toHaveAttribute(
            'href',
            'https://portal.test/adrs/file-1'
        )
        expect(screen.getByText('BvB Core')).toHaveAttribute(
            'href',
            'https://portal.test/docs/file-2'
        )
        // Unresolved ids render as plain tags rather than broken links.
        expect(screen.getByText('ADR Non Core')).not.toHaveAttribute('href')
        expect(screen.getByText('BvB Non Core')).not.toHaveAttribute('href')
    })

    it('hides non-editable fields when isEdit is true', () => {
        render(
            <ApplicationInfoGrid
                applicationData={mockApplication}
                metadata={{}}
                isEdit={true}
            />
        )
        expect(screen.queryByText('Company Domain')).not.toBeInTheDocument()
        expect(screen.queryByText('ADR')).not.toBeInTheDocument()
        expect(screen.queryByText('Playbooks')).not.toBeInTheDocument()
    })

    it('falls back to "-" when central application details are missing', () => {
        const sparse: Application = {
            ...mockApplication,
            central_application_da: undefined
        }
        render(
            <ApplicationInfoGrid
                applicationData={sparse}
                metadata={{}}
                isEdit={false}
            />
        )
        expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(4)
    })
})
