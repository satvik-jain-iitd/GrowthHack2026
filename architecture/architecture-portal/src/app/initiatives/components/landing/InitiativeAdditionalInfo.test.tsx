import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import InitiativeAdditionalInfo from './InitiativeAdditionalInfo'
import { PTBInitiative } from '../../types'
import { emptyRecommendedValueIds } from '@/app/shared/utils/recommendationDiff'
import { useLinkedDisplayUrls } from '@/app/resources/metamodel/hooks/useLinkedDisplayUrls'

const mockUseLinkedDisplayUrls = useLinkedDisplayUrls as jest.Mock

jest.mock('../PtbTags', () => ({
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

jest.mock('@/app/shared/hooks', () => ({
    useTechStackOptions: () => ({
        data: {
            options: [],
            byId: { 'ts-1': 'Node.js', 'ts-2': 'Kubernetes' }
        }
    }),
    useMetamodelFoundationalTechnologyOptions: () => ({
        foundationalTechnologyOptions: [],
        loading: false,
        error: null
    }),
    useMetamodelTechnicalCapabilityOptions: () => ({
        technicalCapabilityOptions: [],
        loading: false,
        error: null
    })
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

const mockInitiative: PTBInitiative = {
    actualOnboardingDate: '',
    adrCore: [],
    adrNonCore: [],
    applicationsImpacted: [],
    bvbCore: [],
    bvbNonCore: [],
    eaLead: [],
    engineeringLead: [],
    etp_id: '',
    initiativeCategory: '',
    initiativeId: 'i1',
    metadata: [],
    name: 'Test Initiative',
    startDate: '2024-01-15',
    tentativeEndDate: '2025-06-30',
    unitCIO: '',
    years: ['2024'],
    companyDomainId: [],
    companyDomainName: [],
    clarityId: 'ETP-123',
    initiativeFrameworks: [],
    playbookCore: [],
    playbookNonCore: [],
    techOwners: [],
    principalArchitects: [],
    enterpriseArchitects: [],
    ucioDelegates: [],
    headEngineers: [],
    delegates: [],
    statusReportOwnerPrimary: [],
    statusReportOwnerSecondary: [],
    additionalArchitects: [],
    markets: [],
    companyDomains: [],
    ebc: []
}

describe('InitiativeAdditionalInfo', () => {
    beforeEach(() => {
        mockUseLinkedDisplayUrls.mockReturnValue({
            adrDisplayUrl: () => null,
            bvbDisplayUrl: () => null,
            loading: false
        })
    })

    it('resolves tech stack ids to names for display', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={mockInitiative}
                metadata={{ 'Tech Stacks': ['ts-1', 'ts-2'] }}
            />
        )
        expect(screen.getByText('Tech Stacks')).toBeInTheDocument()
        expect(screen.getByText('Node.js')).toBeInTheDocument()
        expect(screen.getByText('Kubernetes')).toBeInTheDocument()
    })

    it('falls back to the id when no name is found', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={mockInitiative}
                metadata={{ 'Tech Stacks': ['unknown-id'] }}
            />
        )
        expect(screen.getByText('unknown-id')).toBeInTheDocument()
    })

    it('renders "-" when there are no tech stacks', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={mockInitiative}
                metadata={{}}
            />
        )
        expect(screen.getByText('Tech Stacks')).toBeInTheDocument()
    })

    it('resolves business capability ids to names for display', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={{
                    ...mockInitiative,
                    ebc: [
                        { id: 'cap-1', name: 'cap-1' },
                        { id: 'cap-2', name: 'cap-2' }
                    ]
                }}
                metadata={{}}
            />
        )
        expect(screen.getByText('Business Capabilities')).toBeInTheDocument()
        expect(screen.getByText('Payments Processing')).toBeInTheDocument()
        expect(screen.getByText('Fraud Detection')).toBeInTheDocument()
    })

    it('falls back to the ebc id when no capability name is found', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={{
                    ...mockInitiative,
                    ebc: [{ id: 'unknown-cap', name: 'unknown-cap' }]
                }}
                metadata={{}}
            />
        )
        expect(screen.getByText('unknown-cap')).toBeInTheDocument()
    })

    it('renders foundational technologies as tags', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={{
                    ...mockInitiative,
                    initiativeFrameworks: ['Kafka', 'Redis']
                }}
                metadata={{}}
            />
        )
        expect(
            screen.getByText('Foundational Technologies')
        ).toBeInTheDocument()
        expect(screen.getByText('Kafka')).toBeInTheDocument()
        expect(screen.getByText('Redis')).toBeInTheDocument()
    })

    it('renders technical capabilities as tags', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={mockInitiative}
                metadata={{
                    'Technical Capabilities': ['Streaming', 'Caching']
                }}
            />
        )
        expect(screen.getByText('Technical Capabilities')).toBeInTheDocument()
        expect(screen.getByText('Streaming')).toBeInTheDocument()
        expect(screen.getByText('Caching')).toBeInTheDocument()
    })

    it('renders impacted company domains, ADR, BvB and Linked Initiative tags', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={{
                    ...mockInitiative,
                    companyDomains: [
                        {
                            company_domain_id: 'cd-1',
                            domain_nm: 'Domain One'
                        } as PTBInitiative['companyDomains'][number]
                    ],
                    adrCore: [{ id: 'adr-1', name: 'ADR Core' }],
                    adrNonCore: [{ id: 'adr-2', name: 'ADR Non Core' }],
                    bvbCore: [{ id: 'bvb-1', name: 'BvB Core' }],
                    bvbNonCore: [{ id: 'bvb-2', name: 'BvB Non Core' }],
                    playbookCore: [{ id: 'pb-1', name: 'Initiative Core' }],
                    playbookNonCore: [
                        { id: 'pb-2', name: 'Initiative Non Core' }
                    ]
                }}
                metadata={{}}
            />
        )
        expect(screen.getByText('Domain One')).toBeInTheDocument()
        expect(screen.getByText('ADR Core')).toBeInTheDocument()
        expect(screen.getByText('ADR Non Core')).toBeInTheDocument()
        expect(screen.getByText('BvB Core')).toBeInTheDocument()
        expect(screen.getByText('BvB Non Core')).toBeInTheDocument()
        expect(screen.getByText('Initiative Core')).toBeInTheDocument()
        expect(screen.getByText('Initiative Non Core')).toBeInTheDocument()
    })

    it('marks staged-only markets and tech stacks as recommendations', () => {
        const { container } = render(
            <InitiativeAdditionalInfo
                initiativeData={{ ...mockInitiative, markets: ['US', 'GB'] }}
                metadata={{ 'Tech Stacks': ['ts-1', 'ts-2'] }}
                recommendedValues={{
                    ...emptyRecommendedValueIds(),
                    markets: ['GB'],
                    techStacks: ['ts-2']
                }}
            />
        )
        const recommended = Array.from(
            container.querySelectorAll('[data-recommended="true"]')
        ).map(node => node.textContent)
        expect(recommended).toEqual(
            expect.arrayContaining(['Kubernetes', 'GB'])
        )
        expect(recommended).not.toContain('Node.js')
        expect(recommended).not.toContain('US')
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
            <InitiativeAdditionalInfo
                initiativeData={{
                    ...mockInitiative,
                    adrCore: [{ id: 'adr-1', name: 'ADR Core' }],
                    adrNonCore: [{ id: 'adr-2', name: 'ADR Non Core' }],
                    bvbCore: [{ id: 'bvb-1', name: 'BvB Core' }],
                    bvbNonCore: [{ id: 'bvb-2', name: 'BvB Non Core' }]
                }}
                metadata={{}}
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

    it('renders Business Units and Markets as tags when present', () => {
        render(
            <InitiativeAdditionalInfo
                initiativeData={{
                    ...mockInitiative,
                    markets: ['US', 'GB']
                }}
                metadata={{ 'Business Units': ['Consumer', 'Commercial'] }}
            />
        )
        expect(screen.getByText('Business Unit')).toBeInTheDocument()
        expect(screen.getByText('Consumer')).toBeInTheDocument()
        expect(screen.getByText('Commercial')).toBeInTheDocument()
        expect(screen.getByText('US')).toBeInTheDocument()
        expect(screen.getByText('GB')).toBeInTheDocument()
    })
})
