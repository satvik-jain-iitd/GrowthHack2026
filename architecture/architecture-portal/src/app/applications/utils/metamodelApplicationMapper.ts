import { ApplicationMM } from '@/app/shared/types/metamodel'
import { Application } from '@/app/company-domains/types'

function ownerByTitle(
    entity: ApplicationMM,
    title: string
): { fullName?: string; email?: string } | undefined {
    const owner = entity.applicationOwners.find(o => o.title === title)
    if (!owner) return undefined
    return {
        fullName: owner.name ?? undefined,
        email: owner.email ?? undefined
    }
}

export function mapMetamodelToApplication(entity: ApplicationMM): Application {
    return {
        application_nm: entity.applicationName,
        application_id: entity.applicationId,
        life_cycle_status_nm: entity.lifecycleState || '',
        domain_nm: entity.linkedCompanyDomain?.companyDomainName || '',
        sub_domain_nm: entity.linkedSubdomain?.subdomainName || '',
        count: 0,
        company_domain_id: entity.linkedCompanyDomain?.companyDomainId || '',
        ebc_level_4_nm: '',
        ebc_level_3_nm: '',
        last_update_ts: '',
        last_update_user_id: '',
        unlink: false,
        sub_domain_id: entity.linkedSubdomain?.subdomainId || '',
        adr_core: entity.linkedArchitectureDecisionRecords
            .filter(r => r.isCore)
            .map(r => ({ id: r.adrId, name: r.title })),
        adr_non_core: entity.linkedArchitectureDecisionRecords
            .filter(r => !r.isCore)
            .map(r => ({ id: r.adrId, name: r.title })),
        bvb_core: entity.linkedBuildVsBuyAssessments
            .filter(r => r.isCore)
            .map(r => ({ id: r.bvbId, name: r.title })),
        bvb_non_core: entity.linkedBuildVsBuyAssessments
            .filter(r => !r.isCore)
            .map(r => ({ id: r.bvbId, name: r.title })),
        playbook_core: entity.linkedInitiatives
            .filter(ref => ref.isCore)
            .map(ref => ({
                id: ref.initiativeId,
                name: ref.initiativeName || ref.initiativeId
            })),
        playbook_non_core: entity.linkedInitiatives
            .filter(ref => !ref.isCore)
            .map(ref => ({
                id: ref.initiativeId,
                name: ref.initiativeName || ref.initiativeId
            })),
        metadata: [
            { 'Business Units': entity.supportedBusinessUnits },
            { 'Business Capabilities': entity.businessCapabilities },
            {
                'Foundational Technologies':
                    entity.linkedFoundationalTechnologies
            },
            { Markets: entity.marketsSupported },
            { 'Tech Stacks': entity.technologyStacks },
            { 'Technical Capabilities': entity.techCapabilities }
        ],
        central_application_da: {
            name: entity.applicationName,
            ownershipInfo: {
                applicationOwner: ownerByTitle(entity, 'Application Owner'),
                applicationOwnerLeader1: ownerByTitle(
                    entity,
                    'Application Owner Leader 1'
                ),
                applicationOwnerLeader2: ownerByTitle(
                    entity,
                    'Application Owner Leader 2'
                ),
                businessOwner: ownerByTitle(entity, 'Business Owner'),
                businessOwnerLeader1: ownerByTitle(
                    entity,
                    'Business Owner Leader 1'
                ),
                productionSupportOwner: ownerByTitle(
                    entity,
                    'Production Support Owner'
                ),
                productionSupportOwnerLeader1: ownerByTitle(
                    entity,
                    'Production Support Owner Leader 1'
                ),
                unitCIO: ownerByTitle(entity, 'Unit CIO'),
                ownerSVP: ownerByTitle(entity, 'Owner SVP'),
                pmo: ownerByTitle(entity, 'PMO')
            },
            lineOfBusiness: entity.lineOfBusiness
                ? { lineOfBusiness2: entity.lineOfBusiness }
                : undefined,
            lifeCycleStatus: entity.lifecycleState ?? undefined,
            appType: entity.applicationType?.[0] ?? undefined,
            description: entity.description ?? ''
        }
    }
}
