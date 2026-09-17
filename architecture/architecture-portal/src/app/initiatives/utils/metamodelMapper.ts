import { InitiativeMM } from '@/app/shared/types/metamodel'
import { PTBInitiative } from '../types/PTBInitiative'

function ownerEmailsByTitle(entity: InitiativeMM, title: string): string[] {
    return entity.initiativeOwners
        .filter(o => o.title === title && o.email)
        .map(o => o.email as string)
}

function firstOwnerEmail(entity: InitiativeMM, title: string): string {
    return ownerEmailsByTitle(entity, title)[0] ?? ''
}

/** Owner display names aligned by index with {@link ownerEmailsByTitle}. */
function ownerNamesByTitle(entity: InitiativeMM, title: string): string[] {
    return entity.initiativeOwners
        .filter(o => o.title === title && o.email)
        .map(o => o.name ?? '')
}

export function mapMetamodelToInitiative(entity: InitiativeMM): PTBInitiative {
    return {
        initiativeId: entity.initiativeId,
        name: entity.initiativeName,
        clarityId: entity.etp_ecmi_id ?? '',
        startDate: entity.startDate ?? '',
        tentativeEndDate: entity.endDate ?? '',
        years: entity.yearsActive ?? [],
        actualOnboardingDate: '',
        initiativeCategory: '',
        etp_id: entity.etp_ecmi_id ?? '',
        unitCIO: firstOwnerEmail(entity, 'Unit CIO'),
        headEngineers: ownerEmailsByTitle(entity, 'Head Engineer'),
        principalArchitects: ownerEmailsByTitle(entity, 'Principal Architect'),
        enterpriseArchitects: ownerEmailsByTitle(
            entity,
            'Enterprise Architect'
        ),
        techOwners: ownerEmailsByTitle(entity, 'Tech VP'),
        additionalArchitects: ownerEmailsByTitle(
            entity,
            'Additional Architect'
        ),
        eaLead: ownerEmailsByTitle(entity, 'Enterprise Architect'),
        engineeringLead: ownerEmailsByTitle(entity, 'Head Engineer'),
        delegates: ownerEmailsByTitle(entity, 'Additional Architect'),
        ucioDelegates: [],
        statusReportOwnerPrimary: [],
        statusReportOwnerSecondary: [],
        companyDomains: entity.impactedCompanyDomains.map(d => ({
            company_domain_id: d.companyDomainId,
            domain_nm: d.companyDomainName
        })),
        companyDomainId: entity.impactedCompanyDomains.map(
            d => d.companyDomainId
        ),
        companyDomainName: entity.impactedCompanyDomains.map(
            d => d.companyDomainName
        ),
        adrCore: entity.architectureDecisionRecords
            .filter(r => r.isCore)
            .map(r => ({ id: r.adrId, name: r.title })),
        adrNonCore: entity.architectureDecisionRecords
            .filter(r => !r.isCore)
            .map(r => ({ id: r.adrId, name: r.title })),
        bvbCore: entity.buildVsBuyAssessments
            .filter(r => r.isCore)
            .map(r => ({ id: r.bvbId, name: r.title })),
        bvbNonCore: entity.buildVsBuyAssessments
            .filter(r => !r.isCore)
            .map(r => ({ id: r.bvbId, name: r.title })),
        playbookCore: entity.linkedInitiatives
            .filter(ref => ref.isCore)
            .map(ref => ({
                id: ref.initiativeId,
                name: ref.initiativeName || ref.initiativeId
            })),
        playbookNonCore: entity.linkedInitiatives
            .filter(ref => !ref.isCore)
            .map(ref => ({
                id: ref.initiativeId,
                name: ref.initiativeName || ref.initiativeId
            })),
        applicationsImpacted: entity.impactedApplications.map(
            a => a.applicationId
        ),
        initiativeFrameworks: entity.foundationalTechnologies,
        ebc: entity.businessCapabilities.map(bc => ({ id: bc, name: bc })),
        markets: entity.supportedMarkets,
        ownerNames: {
            unitCIO: ownerNamesByTitle(entity, 'Unit CIO'),
            techOwners: ownerNamesByTitle(entity, 'Tech VP'),
            headEngineers: ownerNamesByTitle(entity, 'Head Engineer'),
            principalArchitects: ownerNamesByTitle(
                entity,
                'Principal Architect'
            ),
            enterpriseArchitects: ownerNamesByTitle(
                entity,
                'Enterprise Architect'
            ),
            additionalArchitects: ownerNamesByTitle(
                entity,
                'Additional Architect'
            )
        },
        metadata: [
            { 'Business Units': entity.supportedBusinessUnits },
            { 'Tech Stacks': entity.technologyStacks },
            { 'Technical Capabilities': entity.techCapabilities }
        ]
    }
}
