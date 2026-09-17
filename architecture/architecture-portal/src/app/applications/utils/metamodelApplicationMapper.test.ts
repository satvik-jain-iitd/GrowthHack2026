import { mapMetamodelToApplication } from './metamodelApplicationMapper'
import { ApplicationMM } from '@/app/shared/types/metamodel'

const baseMM: ApplicationMM = {
    applicationId: 'app-1',
    applicationName: 'Test Application',
    description: 'Test application description',
    lifecycleState: 'Active',
    applicationOwners: [
        {
            title: 'Application Owner',
            name: 'AO User',
            email: 'ao@test.com'
        },
        {
            title: 'Application Owner Leader 1',
            name: 'AOL1 User',
            email: 'aol1@test.com'
        },
        { title: 'Business Owner', name: 'BO User', email: 'bo@test.com' },
        {
            title: 'Business Owner Leader 1',
            name: 'BOL1 User',
            email: 'bol1@test.com'
        },
        {
            title: 'Production Support Owner',
            name: 'PSO User',
            email: 'pso@test.com'
        },
        {
            title: 'Production Support Owner Leader 1',
            name: 'PSOL1 User',
            email: 'psol1@test.com'
        },
        { title: 'Unit CIO', name: 'CIO User', email: 'cio@test.com' }
    ],
    lineOfBusiness: 'Technology',
    countriesSupported: ['US', 'UK'],
    applicationType: ['Web'],
    linkedCompanyDomain: {
        companyDomainId: 'cd-1',
        companyDomainName: 'Domain One'
    },
    linkedSubdomain: { subdomainId: 'sd-1', subdomainName: 'Subdomain One' },
    linkedInitiatives: [
        {
            initiativeId: 'init-1',
            initiativeName: 'Initiative One',
            isCore: true
        },
        {
            initiativeId: 'init-2',
            initiativeName: 'Initiative Two',
            isCore: false
        }
    ],
    supportedBusinessUnits: ['BU-1'],
    businessCapabilities: ['Cap-A'],
    linkedFoundationalTechnologies: ['React'],
    marketsSupported: ['US'],
    technologyStacks: ['Node.js'],
    techCapabilities: ['gRPC'],
    deploymentArchitecture: null,
    testingStrategy: null,
    nonFunctionalRequirements: null,
    dataInterfaces: null,
    linkedArchitectureDecisionRecords: [
        { adrId: 'adr-1', title: 'ADR Core', isCore: true },
        { adrId: 'adr-2', title: 'ADR NonCore', isCore: false }
    ],
    linkedBuildVsBuyAssessments: [
        { bvbId: 'bvb-1', title: 'BVB Core', isCore: true }
    ],
    linkedPlaybooks: ['pb-1', 'pb-2'],
    attestations: [],
    lastUserUpdateTs: null,
    lastSystemUpdateTs: null
}

describe('mapMetamodelToApplication', () => {
    it('maps basic scalar fields', () => {
        const result = mapMetamodelToApplication(baseMM)
        expect(result.application_id).toBe('app-1')
        expect(result.application_nm).toBe('Test Application')
        expect(result.life_cycle_status_nm).toBe('Active')
        expect(result.company_domain_id).toBe('cd-1')
        expect(result.domain_nm).toBe('Domain One')
        expect(result.sub_domain_nm).toBe('Subdomain One')
        expect(result.sub_domain_id).toBe('sd-1')
    })

    it('maps owners from applicationOwners array', () => {
        const result = mapMetamodelToApplication(baseMM)
        const owners = result.central_application_da?.ownershipInfo
        expect(owners?.applicationOwner).toEqual({
            fullName: 'AO User',
            email: 'ao@test.com'
        })
        expect(owners?.applicationOwnerLeader1).toEqual({
            fullName: 'AOL1 User',
            email: 'aol1@test.com'
        })
        expect(owners?.businessOwner).toEqual({
            fullName: 'BO User',
            email: 'bo@test.com'
        })
        expect(owners?.unitCIO).toEqual({
            fullName: 'CIO User',
            email: 'cio@test.com'
        })
        expect(owners?.productionSupportOwner).toEqual({
            fullName: 'PSO User',
            email: 'pso@test.com'
        })
        expect(owners?.businessOwnerLeader1).toEqual({
            fullName: 'BOL1 User',
            email: 'bol1@test.com'
        })
        expect(owners?.productionSupportOwnerLeader1).toEqual({
            fullName: 'PSOL1 User',
            email: 'psol1@test.com'
        })
    })

    it('maps company domain fields', () => {
        const result = mapMetamodelToApplication(baseMM)
        expect(result.company_domain_id).toBe('cd-1')
        expect(result.domain_nm).toBe('Domain One')
    })

    it('splits ADRs by isCore', () => {
        const result = mapMetamodelToApplication(baseMM)
        expect(result.adr_core).toEqual([{ id: 'adr-1', name: 'ADR Core' }])
        expect(result.adr_non_core).toEqual([
            { id: 'adr-2', name: 'ADR NonCore' }
        ])
    })

    it('splits BvBs by isCore', () => {
        const result = mapMetamodelToApplication(baseMM)
        expect(result.bvb_core).toEqual([{ id: 'bvb-1', name: 'BVB Core' }])
        expect(result.bvb_non_core).toEqual([])
    })

    it('maps linked initiatives to playbook_core and playbook_non_core by isCore', () => {
        const result = mapMetamodelToApplication(baseMM)
        expect(result.playbook_core).toEqual([
            { id: 'init-1', name: 'Initiative One' }
        ])
        expect(result.playbook_non_core).toEqual([
            { id: 'init-2', name: 'Initiative Two' }
        ])
    })

    it('maps metadata arrays into metadata objects', () => {
        const result = mapMetamodelToApplication(baseMM)
        expect(result.metadata).toEqual([
            { 'Business Units': ['BU-1'] },
            { 'Business Capabilities': ['Cap-A'] },
            { 'Foundational Technologies': ['React'] },
            { Markets: ['US'] },
            { 'Tech Stacks': ['Node.js'] },
            { 'Technical Capabilities': ['gRPC'] }
        ])
    })

    it('maps central_application_da fields', () => {
        const result = mapMetamodelToApplication(baseMM)
        expect(result.central_application_da?.lineOfBusiness).toEqual({
            lineOfBusiness2: 'Technology'
        })
        expect(result.central_application_da?.lifeCycleStatus).toBe('Active')
        expect(result.central_application_da?.appType).toBe('Web')
        expect(result.central_application_da?.description).toBe(
            'Test application description'
        )
    })

    it('falls back to an empty description when description is null', () => {
        const mm: ApplicationMM = {
            ...baseMM,
            description: null
        }
        const result = mapMetamodelToApplication(mm)
        expect(result.central_application_da?.description).toBe('')
    })

    it('handles null company domain', () => {
        const mm: ApplicationMM = {
            ...baseMM,
            linkedCompanyDomain: null
        }
        const result = mapMetamodelToApplication(mm)
        expect(result.company_domain_id).toBe('')
        expect(result.domain_nm).toBe('')
    })

    it('handles null subdomain', () => {
        const mm: ApplicationMM = {
            ...baseMM,
            linkedSubdomain: null
        }
        const result = mapMetamodelToApplication(mm)
        expect(result.sub_domain_nm).toBe('')
        expect(result.sub_domain_id).toBe('')
    })

    it('handles empty applicationOwners', () => {
        const mm: ApplicationMM = {
            ...baseMM,
            applicationOwners: []
        }
        const result = mapMetamodelToApplication(mm)
        expect(
            result.central_application_da?.ownershipInfo?.applicationOwner
        ).toBeUndefined()
        expect(
            result.central_application_da?.ownershipInfo?.unitCIO
        ).toBeUndefined()
    })

    it('handles null lifecycleState and lineOfBusiness', () => {
        const mm: ApplicationMM = {
            ...baseMM,
            lifecycleState: null,
            lineOfBusiness: null
        }
        const result = mapMetamodelToApplication(mm)
        expect(result.life_cycle_status_nm).toBe('')
        expect(result.central_application_da?.lineOfBusiness).toBeUndefined()
    })
})
