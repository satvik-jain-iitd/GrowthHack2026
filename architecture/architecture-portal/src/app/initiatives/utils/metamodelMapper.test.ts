import { mapMetamodelToInitiative } from './metamodelMapper'
import { InitiativeMM } from '@/app/shared/types/metamodel'

const baseMM: InitiativeMM = {
    initiativeId: 'init-1',
    initiativeName: 'Test Initiative',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    yearsActive: ['2024', '2025'],
    initiativeOwners: [
        { title: 'Unit CIO', name: 'CIO User', email: 'cio@test.com' },
        {
            title: 'Head Engineer',
            name: 'HE User',
            email: 'he@test.com'
        },
        {
            title: 'Principal Architect',
            name: 'PA User',
            email: 'pa@test.com'
        },
        {
            title: 'Enterprise Architect',
            name: 'EA User',
            email: 'ea@test.com'
        },
        { title: 'Tech VP', name: 'VP User', email: 'vp@test.com' },
        {
            title: 'Additional Architect',
            name: 'AA User',
            email: 'aa@test.com'
        }
    ],
    lineOfBusiness: 'Tech',
    strategicEpics: [],
    etp_ecmi_id: 'ETP-100',
    legacy_etp_ecmi_id: null,
    impactedCompanyDomains: [
        { companyDomainId: 'cd-1', companyDomainName: 'Domain One' }
    ],
    impactedSubdomains: [],
    linkedInitiatives: [
        {
            initiativeId: 'init-2',
            initiativeName: 'Linked Initiative',
            isCore: true
        },
        {
            initiativeId: 'init-3',
            initiativeName: 'Non-Core Initiative',
            isCore: false
        }
    ],
    supportedBusinessUnits: ['BU-1'],
    businessCapabilities: ['Cap-A'],
    foundationalTechnologies: ['React'],
    supportedMarkets: ['US'],
    technologyStacks: ['Node.js'],
    techCapabilities: ['gRPC'],
    impactedApplications: [
        { applicationId: 'app-1', applicationName: 'App One' }
    ],
    architectureDecisionRecords: [
        { adrId: 'adr-1', title: 'ADR Core', isCore: true },
        { adrId: 'adr-2', title: 'ADR NonCore', isCore: false }
    ],
    buildVsBuyAssessments: [
        { bvbId: 'bvb-1', title: 'BVB Core', isCore: true }
    ],
    playbooks: [
        { playbookId: 'pb-1', isCore: true },
        { playbookId: 'pb-2', isCore: false }
    ],
    attestations: [],
    lastUserUpdateTs: null,
    lastSystemUpdateTs: null
}

describe('mapMetamodelToInitiative', () => {
    it('maps basic scalar fields', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.initiativeId).toBe('init-1')
        expect(result.name).toBe('Test Initiative')
        expect(result.clarityId).toBe('ETP-100')
        expect(result.startDate).toBe('2024-01-01')
        expect(result.tentativeEndDate).toBe('2025-12-31')
        expect(result.years).toEqual(['2024', '2025'])
        expect(result.markets).toEqual(['US'])
    })

    it('maps owners from initiativeOwners array', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.unitCIO).toBe('cio@test.com')
        expect(result.headEngineers).toEqual(['he@test.com'])
        expect(result.principalArchitects).toEqual(['pa@test.com'])
        expect(result.enterpriseArchitects).toEqual(['ea@test.com'])
        expect(result.techOwners).toEqual(['vp@test.com'])
        expect(result.additionalArchitects).toEqual(['aa@test.com'])
    })

    it('maps owner names aligned with owner emails', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.ownerNames).toEqual({
            unitCIO: ['CIO User'],
            techOwners: ['VP User'],
            headEngineers: ['HE User'],
            principalArchitects: ['PA User'],
            enterpriseArchitects: ['EA User'],
            additionalArchitects: ['AA User']
        })
    })

    it('emits empty owner name entries when the metamodel has no name', () => {
        const mm: InitiativeMM = {
            ...baseMM,
            initiativeOwners: [
                { title: 'Unit CIO', name: null, email: 'cio@test.com' }
            ]
        }
        const result = mapMetamodelToInitiative(mm)
        expect(result.ownerNames?.unitCIO).toEqual([''])
    })

    it('maps company domains with field name translation', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.companyDomains).toEqual([
            { company_domain_id: 'cd-1', domain_nm: 'Domain One' }
        ])
        expect(result.companyDomainId).toEqual(['cd-1'])
    })

    it('splits ADRs by isCore', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.adrCore).toEqual([{ id: 'adr-1', name: 'ADR Core' }])
        expect(result.adrNonCore).toEqual([
            { id: 'adr-2', name: 'ADR NonCore' }
        ])
    })

    it('splits BvBs by isCore', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.bvbCore).toEqual([{ id: 'bvb-1', name: 'BVB Core' }])
        expect(result.bvbNonCore).toEqual([])
    })

    it('maps linked initiatives to playbookCore and playbookNonCore by isCore', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.playbookCore).toEqual([
            { id: 'init-2', name: 'Linked Initiative' }
        ])
        expect(result.playbookNonCore).toEqual([
            { id: 'init-3', name: 'Non-Core Initiative' }
        ])
    })

    it('maps impacted applications to string array', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.applicationsImpacted).toEqual(['app-1'])
    })

    it('maps foundational technologies to initiativeFrameworks', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.initiativeFrameworks).toEqual(['React'])
    })

    it('maps businessCapabilities to ebc shape', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.ebc).toEqual([{ id: 'Cap-A', name: 'Cap-A' }])
    })

    it('puts supportedBusinessUnits / technologyStacks / techCapabilities into metadata', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.metadata).toEqual([
            { 'Business Units': ['BU-1'] },
            { 'Tech Stacks': ['Node.js'] },
            { 'Technical Capabilities': ['gRPC'] }
        ])
    })

    it('sets non-readable fields to empty defaults', () => {
        const result = mapMetamodelToInitiative(baseMM)
        expect(result.ucioDelegates).toEqual([])
        expect(result.statusReportOwnerPrimary).toEqual([])
        expect(result.statusReportOwnerSecondary).toEqual([])
        expect(result.initiativeCategory).toBe('')
    })

    it('handles missing/null owner email gracefully', () => {
        const mm: InitiativeMM = {
            ...baseMM,
            initiativeOwners: [{ title: 'Unit CIO', name: null, email: null }]
        }
        const result = mapMetamodelToInitiative(mm)
        expect(result.unitCIO).toBe('')
        expect(result.headEngineers).toEqual([])
    })

    it('handles null dates', () => {
        const mm: InitiativeMM = {
            ...baseMM,
            startDate: null,
            endDate: null,
            yearsActive: null
        }
        const result = mapMetamodelToInitiative(mm)
        expect(result.startDate).toBe('')
        expect(result.tentativeEndDate).toBe('')
        expect(result.years).toEqual([])
    })
})
