import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchWithToken } from '@/utils/client'

import {
    fetchAllInitiatives,
    useGetAllInitiatives
} from '../initiatives/hooks/useGetAllInitiatives'
import {
    fetchAllApplications,
    useGetAllApplicationsLazy
} from '../applications/hooks/useGetAllApplications'
import { fetchAllAdrs } from '../adrs/hooks/useGetAllAdrs'
import { fetchAllBvbs } from '../bvbs/hooks/useGetAllBvbs'
import { fetchAllCompanyDomains } from '../company-domains/hooks/useGetAllCompanyDomains'
import { fetchAllTechnicalCapabilities } from '../technical-capabilities/hooks/useGetAllTechnicalCapabilities'

jest.mock('@/utils/client', () => ({ fetchWithToken: jest.fn() }))

const mockFetch = fetchWithToken as jest.Mock

const onePage = (data: unknown[]) => ({
    ok: true,
    json: async () => ({ page: 1, pageSize: 100, total: data.length, data })
})

/** get-by-ids endpoints return a bare array of detail DTOs. */
const detail = (data: unknown[]) => ({
    ok: true,
    json: async () => data
})

afterEach(() => jest.resetAllMocks())

describe('metamodel dataset fetchers join list + get-by-ids detail into rows', () => {
    it('initiatives — scalars, owners and linkages', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ initiativeId: 'i1', initiativeName: 'Init' }])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        initiativeId: 'i1',
                        initiativeName: 'Init',
                        startDate: '2026-01-01',
                        endDate: '2026-12-31',
                        yearsActive: ['2026'],
                        lineOfBusiness: 'GCS',
                        strategicEpics: ['Epic A', 'Epic B'],
                        etp_ecmi_id: 'ETP-1',
                        legacy_etp_ecmi_id: 'L-1',
                        isEtp: true,
                        isEcmi: false,
                        supportedBusinessUnits: ['BU1'],
                        supportedMarkets: ['US'],
                        technologyStacks: ['Java'],
                        techCapabilities: ['TC1'],
                        businessCapabilities: ['BC1'],
                        foundationalTechnologies: ['FT1'],
                        initiativeOwners: [
                            {
                                title: 'Unit CIO',
                                name: 'Jane Doe',
                                email: 'jane@aexp.com'
                            },
                            { title: 'Tech VP', name: null, email: null },
                            {
                                title: 'Additional Architect',
                                name: 'Bob Roe',
                                email: 'bob@aexp.com'
                            },
                            {
                                title: 'Additional Architect',
                                name: 'Sue Poe',
                                email: 'sue@aexp.com'
                            }
                        ],
                        impactedCompanyDomains: [
                            {
                                companyDomainId: 'c1',
                                companyDomainName: 'Domain X'
                            }
                        ],
                        linkedInitiatives: [
                            {
                                initiativeId: 'i2',
                                initiativeName: 'Init 2',
                                isCore: true
                            }
                        ],
                        impactedApplications: [
                            { applicationId: 'a1', applicationName: 'App 1' }
                        ],
                        architectureDecisionRecords: [
                            { adrId: 'd1', title: 'ADR 1', isCore: false }
                        ],
                        buildVsBuyAssessments: [
                            { bvbId: 'b1', title: 'BvB 1', isCore: false }
                        ],
                        playbooks: [{ playbookId: 'pb1', isCore: true }]
                    }
                ])
            )
        await expect(fetchAllInitiatives()).resolves.toEqual([
            {
                id: 'i1',
                name: 'Init',
                startDate: '01/01/2026',
                endDate: '12/31/2026',
                yearsActive: '2026',
                lineOfBusiness: 'GCS',
                strategicEpics: ['Epic A', 'Epic B'],
                etpEcmiId: 'ETP-1',
                legacyEtpEcmiId: 'L-1',
                isEtp: true,
                isEcmi: false,
                supportedBusinessUnits: ['BU1'],
                supportedMarkets: ['US'],
                technologyStacks: ['Java'],
                techCapabilities: ['TC1'],
                businessCapabilities: ['BC1'],
                foundationalTechnologies: ['FT1'],
                ownerUnitCio: { name: 'Jane Doe', email: 'jane@aexp.com' },
                ownerTechVp: { name: '', email: '' },
                ownerHeadEngineer: { name: '', email: '' },
                ownerPrincipalArchitect: { name: '', email: '' },
                ownerEnterpriseArchitect: { name: '', email: '' },
                additionalArchitects: [
                    { name: 'Bob Roe', email: 'bob@aexp.com' },
                    { name: 'Sue Poe', email: 'sue@aexp.com' }
                ],
                linkedInitiatives: ['Init 2'],
                impactedApplications: ['App 1'],
                linkedAdrs: ['ADR 1'],
                linkedBvbs: ['BvB 1'],
                impactedCompanyDomains: ['Domain X'],
                playbooks: [{ playbookId: 'pb1', isCore: true }]
            }
        ])
        expect(mockFetch.mock.calls[1][0]).toContain('/api/v1/initiatives/i1')
    })

    it('applications — scalars and linkages', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ applicationId: 'a1', applicationName: 'App' }])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        applicationId: 'a1',
                        applicationName: 'App',
                        lifecycleState: 'ACTIVE',
                        applicationType: ['SERVICE'],
                        lineOfBusiness: 'GCS',
                        supportedBusinessUnits: ['BU1'],
                        marketsSupported: ['US'],
                        technologyStacks: ['Java'],
                        linkedInitiatives: [
                            {
                                initiativeId: 'i1',
                                initiativeName: 'Init 1',
                                isCore: true
                            }
                        ],
                        linkedArchitectureDecisionRecords: [
                            { adrId: 'd1', title: 'ADR 1', isCore: false }
                        ],
                        linkedBuildVsBuyAssessments: [
                            { bvbId: 'b1', title: 'BvB 1', isCore: false }
                        ],
                        linkedCompanyDomain: {
                            companyDomainId: 'c1',
                            companyDomainName: 'Domain X'
                        }
                    }
                ])
            )
        await expect(fetchAllApplications()).resolves.toEqual([
            {
                id: 'a1',
                name: 'App',
                lifecycleState: 'ACTIVE',
                applicationType: 'SERVICE',
                lineOfBusiness: 'GCS',
                linkedCompanyDomain: 'Domain X',
                supportedBusinessUnits: ['BU1'],
                marketsSupported: ['US'],
                technologyStacks: ['Java'],
                linkedInitiatives: ['Init 1'],
                linkedAdrs: ['ADR 1'],
                linkedBvbs: ['BvB 1']
            }
        ])
    })

    it('adrs — name from list, rich fields from detail', async () => {
        mockFetch
            .mockResolvedValueOnce(onePage([{ id: 'd1', name: 'ADR' }]))
            .mockResolvedValueOnce(
                detail([
                    {
                        id: 'd1',
                        status: 'APPROVED',
                        approvalCheckpoint: 'CP1',
                        displayUrl: 'https://example.com/adr',
                        linkedInitiatives: ['i1'],
                        linkedApplications: ['a1']
                    }
                ])
            )
        await expect(fetchAllAdrs()).resolves.toEqual([
            {
                id: 'd1',
                name: 'ADR',
                status: 'APPROVED',
                displayUrl: 'https://example.com/adr',
                linkedInitiatives: ['i1'],
                linkedApplications: ['a1']
            }
        ])
    })

    it('bvbs — title from list, rich fields from detail', async () => {
        mockFetch
            .mockResolvedValueOnce(onePage([{ id: 'b1', title: 'BvB' }]))
            .mockResolvedValueOnce(
                detail([
                    {
                        id: 'b1',
                        title: 'BvB',
                        status: 'IN PROGRESS',
                        overallRisk: 'LOW',
                        estimatedCost: '100',
                        etpImpacting: 'No',
                        creationDate: '2026-01-01',
                        completionDate: null,
                        linkedInitiatives: ['i1'],
                        linkedApplications: ['a1'],
                        linkedAdrs: ['d1']
                    }
                ])
            )
        await expect(fetchAllBvbs()).resolves.toEqual([
            {
                id: 'b1',
                title: 'BvB',
                status: 'IN PROGRESS',
                overallRisk: 'Low',
                estimatedCost: '100',
                etpImpacting: 'No',
                creationDate: '2026-01-01',
                completionDate: '',
                linkedInitiatives: ['i1'],
                linkedApplications: ['a1'],
                linkedAdrs: ['d1']
            }
        ])
    })

    it('company domains — rich scalars, owners and linkages', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([
                    { companyDomainId: 'c1', companyDomainName: 'Domain' }
                ])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        companyDomainId: 'c1',
                        companyDomainName: 'Domain',
                        description: 'Long desc',
                        shortDescription: 'Short desc',
                        domainCategoryId: 'cat-1',
                        displaySortOrder: 11900,
                        apiSequenceNumber: 19,
                        lastUpdateUserId: 'SAUMAV DUTTA',
                        lastUpdateTimestamp: '2026-05-11 20:57:00',
                        owners: [
                            {
                                title: 'Unit CIO',
                                name: 'Nigel F Greenwood',
                                emails: ['nigel@aexp.com']
                            },
                            {
                                title: 'Technology Owner',
                                name: 'Al Bravo',
                                emails: ['al@aexp.com']
                            },
                            {
                                title: 'EA Architect',
                                name: null,
                                emails: []
                            }
                        ],
                        linkedApplications: [
                            { applicationId: 'a1', applicationName: 'App 1' }
                        ]
                    }
                ])
            )
        await expect(fetchAllCompanyDomains()).resolves.toEqual([
            {
                id: 'c1',
                name: 'Domain',
                description: 'Long desc',
                shortDescription: 'Short desc',
                ownerUnitCio: {
                    name: 'Nigel F Greenwood',
                    email: 'nigel@aexp.com'
                },
                ownerTechnologyOwner: {
                    name: 'Al Bravo',
                    email: 'al@aexp.com'
                },
                ownerPrincipalEaArchitect: { name: '', email: '' },
                ownerEaArchitect: { name: '', email: '' },
                ownerHeadEngineer: { name: '', email: '' },
                ownerEaArchitectDelegate: { name: '', email: '' },
                linkedApplications: ['App 1']
            }
        ])
    })

    it('technical capabilities — parent id from detail', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ technicalCapabilityId: 't1', name: 'TC' }])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        technicalCapabilityId: 't1',
                        name: 'TC',
                        parentTechnicalCapabilityId: 't0'
                    }
                ])
            )
        await expect(fetchAllTechnicalCapabilities()).resolves.toEqual([
            { id: 't1', name: 'TC', parentTechnicalCapabilityId: 't0' }
        ])
    })
})

describe('mappers coalesce null/undefined detail fields to empty defaults', () => {
    it('initiatives — nullable scalars and absent arrays', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ initiativeId: 'i1', initiativeName: 'Init' }])
            )
            .mockResolvedValueOnce(
                detail([{ initiativeId: 'i1', initiativeName: 'Init' }])
            )
        await expect(fetchAllInitiatives()).resolves.toEqual([
            {
                id: 'i1',
                name: 'Init',
                startDate: '',
                endDate: '',
                yearsActive: '',
                lineOfBusiness: '',
                strategicEpics: [],
                etpEcmiId: '',
                legacyEtpEcmiId: '',
                isEtp: null,
                isEcmi: null,
                supportedBusinessUnits: [],
                supportedMarkets: [],
                technologyStacks: [],
                techCapabilities: [],
                businessCapabilities: [],
                foundationalTechnologies: [],
                ownerUnitCio: { name: '', email: '' },
                ownerTechVp: { name: '', email: '' },
                ownerHeadEngineer: { name: '', email: '' },
                ownerPrincipalArchitect: { name: '', email: '' },
                ownerEnterpriseArchitect: { name: '', email: '' },
                additionalArchitects: [],
                linkedInitiatives: [],
                impactedApplications: [],
                linkedAdrs: [],
                linkedBvbs: [],
                impactedCompanyDomains: [],
                playbooks: []
            }
        ])
    })

    it('applications — null company domain and absent arrays', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ applicationId: 'a1', applicationName: 'App' }])
            )
            .mockResolvedValueOnce(
                detail([{ applicationId: 'a1', applicationName: 'App' }])
            )
        await expect(fetchAllApplications()).resolves.toEqual([
            {
                id: 'a1',
                name: 'App',
                lifecycleState: '',
                applicationType: '',
                lineOfBusiness: '',
                linkedCompanyDomain: '',
                supportedBusinessUnits: [],
                marketsSupported: [],
                technologyStacks: [],
                linkedInitiatives: [],
                linkedAdrs: [],
                linkedBvbs: []
            }
        ])
    })

    it('adrs — falls back to name-only row when the detail lookup is empty', async () => {
        mockFetch
            .mockResolvedValueOnce(onePage([{ id: 'd1', name: 'ADR' }]))
            .mockResolvedValueOnce(detail([]))
        await expect(fetchAllAdrs()).resolves.toEqual([
            {
                id: 'd1',
                name: 'ADR',
                status: '',
                displayUrl: '',
                linkedInitiatives: [],
                linkedApplications: []
            }
        ])
    })

    it('bvbs — nullable scalars and absent linkages', async () => {
        mockFetch
            .mockResolvedValueOnce(onePage([{ id: 'b1', title: 'BvB' }]))
            .mockResolvedValueOnce(detail([{ id: 'b1', title: 'BvB' }]))
        await expect(fetchAllBvbs()).resolves.toEqual([
            {
                id: 'b1',
                title: 'BvB',
                status: '',
                overallRisk: '',
                estimatedCost: '',
                etpImpacting: '',
                creationDate: '',
                completionDate: '',
                linkedInitiatives: [],
                linkedApplications: [],
                linkedAdrs: []
            }
        ])
    })

    it('company domains — nullable scalars, owners without name, absent arrays', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([
                    { companyDomainId: 'c1', companyDomainName: 'Domain' }
                ])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        companyDomainId: 'c1',
                        companyDomainName: 'Domain',
                        owners: [{ title: 'Unit CIO', name: null, emails: [] }]
                    }
                ])
            )
        await expect(fetchAllCompanyDomains()).resolves.toEqual([
            {
                id: 'c1',
                name: 'Domain',
                description: '',
                shortDescription: '',
                ownerUnitCio: { name: '', email: '' },
                ownerTechnologyOwner: { name: '', email: '' },
                ownerPrincipalEaArchitect: { name: '', email: '' },
                ownerEaArchitect: { name: '', email: '' },
                ownerHeadEngineer: { name: '', email: '' },
                ownerEaArchitectDelegate: { name: '', email: '' },
                linkedApplications: []
            }
        ])
    })

    it('technical capabilities — null parent id becomes empty string', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ technicalCapabilityId: 't1', name: 'TC' }])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        technicalCapabilityId: 't1',
                        name: 'TC',
                        parentTechnicalCapabilityId: null
                    }
                ])
            )
        await expect(fetchAllTechnicalCapabilities()).resolves.toEqual([
            { id: 't1', name: 'TC', parentTechnicalCapabilityId: '' }
        ])
    })
})

describe('useGetAll* list hook', () => {
    it('exposes mapped rows via the query hook', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([{ initiativeId: 'i1', initiativeName: 'Init' }])
            )
            .mockResolvedValueOnce(
                detail([{ initiativeId: 'i1', initiativeName: 'Init' }])
            )
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        })
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )

        const { result } = renderHook(() => useGetAllInitiatives(), { wrapper })

        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.initiatives).toEqual([
            expect.objectContaining({ id: 'i1', name: 'Init' })
        ])
    })
})

describe('useGetAllApplicationsLazy — lazy per-page enrichment', () => {
    it('renders list-only rows first, then enriches only the visible ids', async () => {
        mockFetch
            .mockResolvedValueOnce(
                onePage([
                    { applicationId: 'a1', applicationName: 'App 1' },
                    { applicationId: 'a2', applicationName: 'App 2' }
                ])
            )
            .mockResolvedValueOnce(
                detail([
                    {
                        applicationId: 'a1',
                        applicationName: 'App 1',
                        lifecycleState: 'ACTIVE'
                    }
                ])
            )
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        })
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )

        const { result, rerender } = renderHook(
            ({ ids }: { ids: string[] }) => useGetAllApplicationsLazy(ids),
            { wrapper, initialProps: { ids: [] as string[] } }
        )

        // List paints immediately with detail fields defaulted.
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.applications).toHaveLength(2)
        expect(result.current.applications[0]).toMatchObject({
            id: 'a1',
            name: 'App 1',
            lifecycleState: ''
        })

        // The visible page requests details only for its ids.
        rerender({ ids: ['a1'] })
        await waitFor(() =>
            expect(result.current.applications[0].lifecycleState).toBe('ACTIVE')
        )
        // a2 stays list-only because it was not on the visible page.
        expect(result.current.applications[1].lifecycleState).toBe('')
        expect(mockFetch.mock.calls[1][0]).toContain('/api/v1/applications/a1')
    })
})
