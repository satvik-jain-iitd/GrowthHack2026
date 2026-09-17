export interface AttestationItemConfig {
    id: string
    controlSubject: 'APPLICATION' | 'INITIATIVE'
    name: string
    description: string
}

export type AttestationType =
    | 'APPLICATION_PRE_BUILD'
    | 'APPLICATION_PRE_DEPLOY'
    | 'INITIATIVE_PRE_BUILD'
    | 'INITIATIVE_PRE_DEPLOY'

export const ATTESTATION_ITEMS: AttestationItemConfig[] = [
    {
        id: 'APPLICATION_EA_PLAYBOOK_ARCH_DESIGN',
        controlSubject: 'APPLICATION',
        name: 'EA Design Playbook - Architecture Design',
        description:
            'Attests that architecture design playbook artifact updates have been completed and meet the required quality for the initial development scope.'
    },
    {
        id: 'APPLICATION_EA_PLAYBOOK_OVERALL_DESIGN',
        controlSubject: 'APPLICATION',
        name: 'EA Design Playbook - Overall Design',
        description:
            'Attests that architecture and implementation design playbook artifact updates have been completed and meet the required quality for the intended production scope.'
    },
    {
        id: 'APPLICATION_CORE_ADR_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Core ADR Inventory and Approvals',
        description:
            'Attests that the core ADR inventory is complete, all core architecture decisions have been formally documented as ADRs and submitted for review and approved by the appropriate architecture review stakeholders.'
    },
    {
        id: 'APPLICATION_CORE_ADR_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Core ADR Inventory and Approvals',
        description:
            'Attests that the core ADR inventory is complete, all core architecture decisions have been formally documented as ADRs and submitted for review and approved by the appropriate architecture review stakeholders.'
    },
    {
        id: 'APPLICATION_CORE_BUILD_VS_BUY_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Core Build vs. Buy applicability and approval',
        description:
            'Attests that all required core Build vs. Buy assessments are associated and submitted for review and approved by the appropriate architecture review stakeholders.'
    },
    {
        id: 'APPLICATION_EA_METAMODEL_REGISTRATION_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'EA Metamodel Registration completeness',
        description:
            'Attests that all required EA metamodel metadata fields have been completed for this control subject.'
    },
    {
        id: 'APPLICATION_EA_METAMODEL_REGISTRATION_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'EA Metamodel Registration completeness',
        description:
            'Attests that all required EA metamodel metadata fields have been completed for this control subject.'
    },
    {
        id: 'APPLICATION_TECH_STANDARDS_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Technology Standards / AEMP Policies',
        description:
            'Attests that all applicable Technology Standards and AEMP policies (including but not limited to TECH10.04 and TECH05.07) have been assessed and will be adhered to.'
    },
    {
        id: 'APPLICATION_TECH_STANDARDS_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Technology Standards / AEMP Policies',
        description:
            'Attests that all applicable Technology Standards and AEMP policies (including but not limited to TECH10.04 and TECH05.07) have been assessed and will be adhered to.'
    },
    {
        id: 'APPLICATION_SECURITY_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Security, identity and vulnerability controls',
        description:
            'Attests that AuthN / AuthZ, data protection, secrets scanning, static-code and API vulnerability expectations, MFA and least-privilege requirements are captured.'
    },
    {
        id: 'APPLICATION_SECURITY_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Security, identity and vulnerability controls',
        description:
            'Attests that AuthN / AuthZ, data protection, secrets scanning, static-code and API vulnerability expectations, MFA and least-privilege requirements are captured.'
    },
    {
        id: 'APPLICATION_RELIABILITY_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Reliability, resiliency and disaster recovery',
        description:
            'Attests that availability goals, GDHA / Multi-AZ approach, RTO / RPO, failover, backup / restore, self-healing, rollback and DR evidence are documented.'
    },
    {
        id: 'APPLICATION_RELIABILITY_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Reliability, resiliency and disaster recovery',
        description:
            'Attests that availability goals, GDHA / Multi-AZ approach, RTO / RPO, failover, backup / restore, self-healing, rollback and DR evidence are documented.'
    },
    {
        id: 'APPLICATION_PERFORMANCE_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Performance, scalability and traffic management',
        description:
            'Attests that expected volume, concurrency, response-time / throughput thresholds, capacity assumptions, scaling and global traffic management approach are documented.'
    },
    {
        id: 'APPLICATION_PERFORMANCE_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Performance, scalability and traffic management',
        description:
            'Attests that expected volume, concurrency, response-time / throughput thresholds, capacity assumptions, scaling and global traffic management approach are documented.'
    },
    {
        id: 'APPLICATION_OBSERVABILITY_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Observability and operational readiness',
        description:
            'Attests that logging, monitoring, alerting, operational-readiness review, support model, runbooks and stakeholder-notification requirements are captured.'
    },
    {
        id: 'APPLICATION_OBSERVABILITY_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Observability and operational readiness',
        description:
            'Attests that logging, monitoring, alerting, operational-readiness review, support model, runbooks and stakeholder-notification requirements are captured.'
    },
    {
        id: 'APPLICATION_ENGINEERING_QUALITY_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Engineering quality and SDLC evidence',
        description:
            'Attests that unit testing, code coverage, implementation strategy, change-validation tooling and SDLC evidence expectations are reflected in linked design artifacts.'
    },
    {
        id: 'APPLICATION_ENGINEERING_QUALITY_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Engineering quality and SDLC evidence',
        description:
            'Attests that unit testing, code coverage, implementation strategy, change-validation tooling and SDLC evidence expectations are reflected in linked design artifacts.'
    },
    {
        id: 'APPLICATION_SUPPLY_CHAIN_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Software supply chain and release evidence',
        description:
            'Attests that version control, pipeline / platform controls, artifact versioning, immutable artifacts and release-evidence requirements are met.'
    },
    {
        id: 'APPLICATION_SUPPLY_CHAIN_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Software supply chain and release evidence',
        description:
            'Attests that version control, pipeline / platform controls, artifact versioning, immutable artifacts and release-evidence requirements are met.'
    },
    {
        id: 'APPLICATION_API_STRATEGY_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'API Strategy',
        description:
            'Attests that API strategy alignment, interface specification, security pattern, versioning and ownership are confirmed.'
    },
    {
        id: 'APPLICATION_API_STRATEGY_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'API Strategy',
        description:
            'Attests that API strategy alignment, interface specification, security pattern, versioning and ownership are confirmed.'
    },
    {
        id: 'APPLICATION_RESILIENCY_ARCHITECTURE_AWARENESS_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Resiliency architecture',
        description:
            'Acknowledges that the applicable TECH05.07 High Resiliency Standard and HRS Procedure architecture and resiliency requirements have been identified, and that the application architecture and delivery backlog address those requirements, including GDHA, multi-zone/multi-region deployment where applicable, failover objectives, hosting and database capacity, database resiliency, HADR planning and records, and documented exception handling.'
    },
    {
        id: 'APPLICATION_RESILIENCY_ARCHITECTURE_VALIDATION_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Resiliency architecture',
        description:
            'Attests that implementation evidence demonstrates compliance with, or approved exceptions to, the applicable TECH05.07 High Resiliency Standard and HRS Procedure architecture and resiliency requirements, including GDHA, multi-zone/multi-region deployment where applicable, failover objectives, hosting and database capacity, database resiliency, HADR records, and documented exception handling.'
    },
    {
        id: 'APPLICATION_RUNTIME_RESILIENCE_AWARENESS_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Application runtime resilience',
        description:
            'Acknowledges that the applicable TECH05.07 High Resiliency Standard and HRS Procedure reliability requirements have been identified, and that the application architecture and delivery backlog address those requirements, including timeout handling, retries and idempotency, error handling and transaction recovery, cascading failure prevention, graceful shutdown, automatic restart, resource protection, and reliable transaction patterns where applicable.'
    },
    {
        id: 'APPLICATION_RUNTIME_RESILIENCE_VALIDATION_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Application runtime resilience',
        description:
            'Attests that application code, configuration, and test or review evidence demonstrate compliance with, or approved exceptions to, the applicable TECH05.07 High Resiliency Standard and HRS Procedure reliability requirements, including timeout handling, retries and idempotency, error handling and transaction recovery, cascading failure prevention, graceful shutdown, automatic restart, resource protection, and reliable transaction patterns where applicable.'
    },
    {
        id: 'APPLICATION_OBSERVABILITY_HEALTH_AWARENESS_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Observability and health',
        description:
            'Acknowledges that the applicable TECH05.07 High Resiliency Standard and HRS Procedure observability requirements have been identified, and that the application architecture and delivery backlog address those requirements, including approved observability tooling, health checks, metrics, logging and tracing, availability and performance monitoring, readiness, liveness, and GTM health checks where applicable, alerts, thresholds, dashboards, and database observability.'
    },
    {
        id: 'APPLICATION_OBSERVABILITY_HEALTH_VALIDATION_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Observability and health',
        description:
            'Attests that implementation evidence demonstrates compliance with, or approved exceptions to, the applicable TECH05.07 High Resiliency Standard and HRS Procedure observability requirements, including approved observability tooling, metrics, logs, traces, application, API, and infrastructure monitoring, alerts, thresholds, dashboards, readiness, liveness, and GTM health checks where applicable, and database observability.'
    },
    {
        id: 'APPLICATION_SDLC_CODE_CONFIG_AWARENESS_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'SDLC code and configuration',
        description:
            "Acknowledges that the applicable TECH05.07 High Resiliency Standard and HRS Procedure SDLC requirements have been identified, and that the team's delivery approach and backlog address those requirements, including source-controlled, versioned, archived and restorable application code and configuration, reviewed pull requests, linting, code quality analysis, unit testing, and code coverage expectations."
    },
    {
        id: 'APPLICATION_SDLC_CODE_CONFIG_VALIDATION_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'SDLC code and configuration',
        description:
            'Attests that SDLC evidence demonstrates compliance with, or approved exceptions to, the applicable TECH05.07 High Resiliency Standard and HRS Procedure SDLC requirements, including source-controlled, versioned, archived and restorable application code and configuration, pull request reviews, linting, code quality analysis, unit testing, and required code coverage.'
    },
    {
        id: 'APPLICATION_RELEASE_OPERATIONAL_READINESS_AWARENESS_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Release and operational readiness',
        description:
            "Acknowledges that the applicable TECH05.07 High Resiliency Standard and HRS Procedure release readiness requirements have been identified, and that the team's delivery approach and backlog address those requirements, including non-impactful deployment, documented and tested rollback procedures, change validation, certificate management and automation, operational readiness activities (e.g., Permit to Operate), disruptive testing where applicable, and documented exception handling prior to production deployment."
    },
    {
        id: 'APPLICATION_RELEASE_OPERATIONAL_READINESS_VALIDATION_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Release and operational readiness',
        description:
            'Attests that release and operational readiness evidence demonstrates compliance with, or approved exceptions to, the applicable TECH05.07 High Resiliency Standard and HRS Procedure release readiness requirements, including non-impactful deployment, documented and tested rollback procedures, change validation onboarding, certificate management and automation, operational readiness (e.g., Permit to Operate), disruptive testing where applicable, and documented exception handling prior to production deployment.'
    },
    {
        id: 'APPLICATION_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_BUILD',
        controlSubject: 'APPLICATION',
        name: 'Foundational Technologies and Prescriptive ADR Alignment',
        description:
            'Acknowledges that the application design uses approved, relevant Foundational Technologies and that any planned departures from applicable prescriptive ADRs have been documented and approved within the associated ADRs, as applicable, in accordance with risk-management requirements.'
    },
    {
        id: 'APPLICATION_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_DEPLOY',
        controlSubject: 'APPLICATION',
        name: 'Foundational Technologies and Prescriptive ADR Alignment',
        description:
            'Attests that the application implementation uses approved, relevant Foundational Technologies and that any departures from applicable prescriptive ADRs have been documented and approved within the associated ADRs, as applicable, in accordance with risk-management requirements.'
    },
    {
        id: 'INITIATIVE_EA_PLAYBOOK_ARCH_DESIGN',
        controlSubject: 'INITIATIVE',
        name: 'EA Design Playbook - Architecture Design',
        description:
            'Attests that architecture design playbook artifact updates have been completed and meet the required quality for the initial development scope.'
    },
    {
        id: 'INITIATIVE_EA_PLAYBOOK_OVERALL_DESIGN',
        controlSubject: 'INITIATIVE',
        name: 'EA Design Playbook - Overall Design',
        description:
            'Attests that architecture and implementation design playbook artifact updates have been completed and meet the required quality for the intended production scope.'
    },
    {
        id: 'INITIATIVE_CORE_ADR_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Core ADR Inventory and Approvals',
        description:
            'Attests that the core ADR inventory is complete, all core architecture decisions have been formally documented as ADRs and submitted for review and approved by the appropriate architecture review stakeholders.'
    },
    {
        id: 'INITIATIVE_CORE_ADR_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Core ADR Inventory and Approvals',
        description:
            'Attests that the core ADR inventory is complete, all core architecture decisions have been formally documented as ADRs and submitted for review and approved by the appropriate architecture review stakeholders.'
    },
    {
        id: 'INITIATIVE_CORE_BUILD_VS_BUY_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Core Build vs. Buy applicability and approval',
        description:
            'Attests that all required core Build vs. Buy assessments are associated and submitted for review and approved by the appropriate architecture review stakeholders.'
    },
    {
        id: 'INITIATIVE_EA_METAMODEL_REGISTRATION_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'EA Metamodel Registration completeness',
        description:
            'Attests that all required EA metamodel metadata fields have been completed for this control subject.'
    },
    {
        id: 'INITIATIVE_EA_METAMODEL_REGISTRATION_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'EA Metamodel Registration completeness',
        description:
            'Attests that all required EA metamodel metadata fields have been completed for this control subject.'
    },
    {
        id: 'INITIATIVE_TECH_STANDARDS_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Technology Standards / AEMP Policies',
        description:
            'Attests that all applicable Technology Standards and AEMP policies (including but not limited to TECH10.04 and TECH05.07) have been assessed and will be adhered to.'
    },
    {
        id: 'INITIATIVE_TECH_STANDARDS_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Technology Standards / AEMP Policies',
        description:
            'Attests that all applicable Technology Standards and AEMP policies (including but not limited to TECH10.04 and TECH05.07) have been assessed and will be adhered to.'
    },
    {
        id: 'INITIATIVE_SECURITY_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Security, identity and vulnerability controls',
        description:
            'Attests that AuthN / AuthZ, data protection, secrets scanning, static-code and API vulnerability expectations, MFA and least-privilege requirements are captured.'
    },
    {
        id: 'INITIATIVE_SECURITY_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Security, identity and vulnerability controls',
        description:
            'Attests that AuthN / AuthZ, data protection, secrets scanning, static-code and API vulnerability expectations, MFA and least-privilege requirements are captured.'
    },
    {
        id: 'INITIATIVE_RELIABILITY_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Reliability, resiliency and disaster recovery',
        description:
            'Attests that availability goals, GDHA / Multi-AZ approach, RTO / RPO, failover, backup / restore, self-healing, rollback and DR evidence are documented.'
    },
    {
        id: 'INITIATIVE_RELIABILITY_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Reliability, resiliency and disaster recovery',
        description:
            'Attests that availability goals, GDHA / Multi-AZ approach, RTO / RPO, failover, backup / restore, self-healing, rollback and DR evidence are documented.'
    },
    {
        id: 'INITIATIVE_PERFORMANCE_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Performance, scalability and traffic management',
        description:
            'Attests that expected volume, concurrency, response-time / throughput thresholds, capacity assumptions, scaling and global traffic management approach are documented.'
    },
    {
        id: 'INITIATIVE_PERFORMANCE_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Performance, scalability and traffic management',
        description:
            'Attests that expected volume, concurrency, response-time / throughput thresholds, capacity assumptions, scaling and global traffic management approach are documented.'
    },
    {
        id: 'INITIATIVE_OBSERVABILITY_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Observability and operational readiness',
        description:
            'Attests that logging, monitoring, alerting, operational-readiness review, support model, runbooks and stakeholder-notification requirements are captured.'
    },
    {
        id: 'INITIATIVE_OBSERVABILITY_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Observability and operational readiness',
        description:
            'Attests that logging, monitoring, alerting, operational-readiness review, support model, runbooks and stakeholder-notification requirements are captured.'
    },
    {
        id: 'INITIATIVE_ENGINEERING_QUALITY_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Engineering quality and SDLC evidence',
        description:
            'Attests that unit testing, code coverage, implementation strategy, change-validation tooling and SDLC evidence expectations are reflected in linked design artifacts.'
    },
    {
        id: 'INITIATIVE_ENGINEERING_QUALITY_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Engineering quality and SDLC evidence',
        description:
            'Attests that unit testing, code coverage, implementation strategy, change-validation tooling and SDLC evidence expectations are reflected in linked design artifacts.'
    },
    {
        id: 'INITIATIVE_SUPPLY_CHAIN_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Software supply chain and release evidence',
        description:
            'Attests that version control, pipeline / platform controls, artifact versioning, immutable artifacts and release-evidence requirements are met.'
    },
    {
        id: 'INITIATIVE_SUPPLY_CHAIN_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Software supply chain and release evidence',
        description:
            'Attests that version control, pipeline / platform controls, artifact versioning, immutable artifacts and release-evidence requirements are met.'
    },
    {
        id: 'INITIATIVE_API_STRATEGY_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'API Strategy',
        description:
            'Attests that API strategy alignment, interface specification, security pattern, versioning and ownership are confirmed.'
    },
    {
        id: 'INITIATIVE_API_STRATEGY_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'API Strategy',
        description:
            'Attests that API strategy alignment, interface specification, security pattern, versioning and ownership are confirmed.'
    },
    {
        id: 'INITIATIVE_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_BUILD',
        controlSubject: 'INITIATIVE',
        name: 'Foundational Technologies and Prescriptive ADR Alignment',
        description:
            'Acknowledges that the initiative architecture uses approved, relevant Foundational Technologies and that any planned departures from applicable prescriptive ADRs have been documented and approved within the associated ADRs, as applicable, in accordance with risk-management requirements.'
    },
    {
        id: 'INITIATIVE_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_DEPLOY',
        controlSubject: 'INITIATIVE',
        name: 'Foundational Technologies and Prescriptive ADR Alignment',
        description:
            "Attests that the initiative's implemented scope uses approved, relevant Foundational Technologies and that any departures from applicable prescriptive ADRs have been documented and approved within the associated ADRs, as applicable, in accordance with risk-management requirements."
    }
]

const ATTESTATIONS_TO_CAPTURE: Record<AttestationType, string[]> = {
    APPLICATION_PRE_BUILD: [
        'APPLICATION_EA_PLAYBOOK_ARCH_DESIGN',
        'APPLICATION_CORE_ADR_PRE_BUILD',
        'APPLICATION_CORE_BUILD_VS_BUY_PRE_BUILD',
        'APPLICATION_EA_METAMODEL_REGISTRATION_PRE_BUILD',
        'APPLICATION_TECH_STANDARDS_PRE_BUILD',
        'APPLICATION_SECURITY_PRE_BUILD',
        'APPLICATION_RELIABILITY_PRE_BUILD',
        'APPLICATION_PERFORMANCE_PRE_BUILD',
        'APPLICATION_OBSERVABILITY_PRE_BUILD',
        'APPLICATION_ENGINEERING_QUALITY_PRE_BUILD',
        'APPLICATION_SUPPLY_CHAIN_PRE_BUILD',
        'APPLICATION_API_STRATEGY_PRE_BUILD',
        'APPLICATION_RESILIENCY_ARCHITECTURE_AWARENESS_PRE_BUILD',
        'APPLICATION_RUNTIME_RESILIENCE_AWARENESS_PRE_BUILD',
        'APPLICATION_OBSERVABILITY_HEALTH_AWARENESS_PRE_BUILD',
        'APPLICATION_SDLC_CODE_CONFIG_AWARENESS_PRE_BUILD',
        'APPLICATION_RELEASE_OPERATIONAL_READINESS_AWARENESS_PRE_BUILD',
        'APPLICATION_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_BUILD'
    ],
    APPLICATION_PRE_DEPLOY: [
        'APPLICATION_EA_PLAYBOOK_OVERALL_DESIGN',
        'APPLICATION_CORE_ADR_PRE_DEPLOY',
        'APPLICATION_EA_METAMODEL_REGISTRATION_PRE_DEPLOY',
        'APPLICATION_TECH_STANDARDS_PRE_DEPLOY',
        'APPLICATION_SECURITY_PRE_DEPLOY',
        'APPLICATION_RELIABILITY_PRE_DEPLOY',
        'APPLICATION_PERFORMANCE_PRE_DEPLOY',
        'APPLICATION_OBSERVABILITY_PRE_DEPLOY',
        'APPLICATION_ENGINEERING_QUALITY_PRE_DEPLOY',
        'APPLICATION_SUPPLY_CHAIN_PRE_DEPLOY',
        'APPLICATION_API_STRATEGY_PRE_DEPLOY',
        'APPLICATION_RESILIENCY_ARCHITECTURE_VALIDATION_PRE_DEPLOY',
        'APPLICATION_RUNTIME_RESILIENCE_VALIDATION_PRE_DEPLOY',
        'APPLICATION_OBSERVABILITY_HEALTH_VALIDATION_PRE_DEPLOY',
        'APPLICATION_SDLC_CODE_CONFIG_VALIDATION_PRE_DEPLOY',
        'APPLICATION_RELEASE_OPERATIONAL_READINESS_VALIDATION_PRE_DEPLOY',
        'APPLICATION_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_DEPLOY'
    ],
    INITIATIVE_PRE_BUILD: [
        'INITIATIVE_EA_PLAYBOOK_ARCH_DESIGN',
        'INITIATIVE_CORE_ADR_PRE_BUILD',
        'INITIATIVE_CORE_BUILD_VS_BUY_PRE_BUILD',
        'INITIATIVE_EA_METAMODEL_REGISTRATION_PRE_BUILD',
        'INITIATIVE_TECH_STANDARDS_PRE_BUILD',
        'INITIATIVE_SECURITY_PRE_BUILD',
        'INITIATIVE_RELIABILITY_PRE_BUILD',
        'INITIATIVE_PERFORMANCE_PRE_BUILD',
        'INITIATIVE_OBSERVABILITY_PRE_BUILD',
        'INITIATIVE_ENGINEERING_QUALITY_PRE_BUILD',
        'INITIATIVE_SUPPLY_CHAIN_PRE_BUILD',
        'INITIATIVE_API_STRATEGY_PRE_BUILD',
        'INITIATIVE_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_BUILD'
    ],
    INITIATIVE_PRE_DEPLOY: [
        'INITIATIVE_EA_PLAYBOOK_OVERALL_DESIGN',
        'INITIATIVE_CORE_ADR_PRE_DEPLOY',
        'INITIATIVE_EA_METAMODEL_REGISTRATION_PRE_DEPLOY',
        'INITIATIVE_TECH_STANDARDS_PRE_DEPLOY',
        'INITIATIVE_SECURITY_PRE_DEPLOY',
        'INITIATIVE_RELIABILITY_PRE_DEPLOY',
        'INITIATIVE_PERFORMANCE_PRE_DEPLOY',
        'INITIATIVE_OBSERVABILITY_PRE_DEPLOY',
        'INITIATIVE_ENGINEERING_QUALITY_PRE_DEPLOY',
        'INITIATIVE_SUPPLY_CHAIN_PRE_DEPLOY',
        'INITIATIVE_API_STRATEGY_PRE_DEPLOY',
        'INITIATIVE_FOUNDATIONAL_TECH_PADR_ALIGNMENT_PRE_DEPLOY'
    ]
}

const itemMap = new Map(ATTESTATION_ITEMS.map(item => [item.id, item]))

export interface CapturedAttestationItem {
    id: string
    name: string
    description: string
}

export function getAttestationsForType(
    type: AttestationType
): CapturedAttestationItem[] {
    const ids = ATTESTATIONS_TO_CAPTURE[type] ?? []
    return ids
        .map(id => {
            const item = itemMap.get(id)
            if (!item) return null
            return {
                id: item.id,
                name: item.name,
                description: item.description
            }
        })
        .filter((item): item is CapturedAttestationItem => item !== null)
}

export function resolveAttestationType(
    entityType: 'initiative' | 'application',
    _ptbStage: 'PRE_BUILD' | 'PRE_DEPLOY' = 'PRE_BUILD'
): AttestationType {
    const subject = entityType === 'initiative' ? 'INITIATIVE' : 'APPLICATION'
    return `${subject}_${_ptbStage}` as AttestationType
}
