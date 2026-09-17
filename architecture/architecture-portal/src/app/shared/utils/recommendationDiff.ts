import { ApplicationMM, InitiativeMM } from '../types/metamodel'

/**
 * The categories the metamodel staged endpoints can fill in from
 * recommendations. Anything present in a staged read but absent from the
 * authoritative read for the same record is a recommendation, not a confirmed
 * value.
 */
export const RECOMMENDATION_CATEGORIES = [
    'markets',
    'techStacks',
    'companyDomains',
    'foundationalTechnologies',
    'technicalCapabilities',
    'businessCapabilities',
    'playbooks'
] as const

export type RecommendationCategory = (typeof RECOMMENDATION_CATEGORIES)[number]

export type RecommendedValueIds = Record<RecommendationCategory, string[]>

export function emptyRecommendedValueIds(): RecommendedValueIds {
    return {
        markets: [],
        techStacks: [],
        companyDomains: [],
        foundationalTechnologies: [],
        technicalCapabilities: [],
        businessCapabilities: [],
        playbooks: []
    }
}

type CategoryValues = Record<RecommendationCategory, string[]>

function initiativeCategoryValues(entity: InitiativeMM): CategoryValues {
    return {
        markets: entity.supportedMarkets ?? [],
        techStacks: entity.technologyStacks ?? [],
        companyDomains: (entity.impactedCompanyDomains ?? []).map(
            domain => domain.companyDomainId
        ),
        foundationalTechnologies: entity.foundationalTechnologies ?? [],
        technicalCapabilities: entity.techCapabilities ?? [],
        businessCapabilities: entity.businessCapabilities ?? [],
        playbooks: (entity.playbooks ?? []).map(playbook => playbook.playbookId)
    }
}

function applicationCategoryValues(entity: ApplicationMM): CategoryValues {
    return {
        markets: entity.marketsSupported ?? [],
        techStacks: entity.technologyStacks ?? [],
        companyDomains: entity.linkedCompanyDomain
            ? [entity.linkedCompanyDomain.companyDomainId]
            : [],
        foundationalTechnologies: entity.linkedFoundationalTechnologies ?? [],
        technicalCapabilities: entity.techCapabilities ?? [],
        businessCapabilities: entity.businessCapabilities ?? [],
        playbooks: entity.linkedPlaybooks ?? []
    }
}

function diffCategoryValues(
    authoritative: CategoryValues,
    staged: CategoryValues
): RecommendedValueIds {
    const recommended = emptyRecommendedValueIds()

    for (const category of RECOMMENDATION_CATEGORIES) {
        const confirmed = new Set(authoritative[category])
        recommended[category] = staged[category].filter(
            id => !confirmed.has(id)
        )
    }

    return recommended
}

export function diffInitiativeRecommendations(
    authoritative: InitiativeMM | null | undefined,
    staged: InitiativeMM | null | undefined
): RecommendedValueIds {
    if (!authoritative || !staged) return emptyRecommendedValueIds()

    return diffCategoryValues(
        initiativeCategoryValues(authoritative),
        initiativeCategoryValues(staged)
    )
}

export function diffApplicationRecommendations(
    authoritative: ApplicationMM | null | undefined,
    staged: ApplicationMM | null | undefined
): RecommendedValueIds {
    if (!authoritative || !staged) return emptyRecommendedValueIds()

    return diffCategoryValues(
        applicationCategoryValues(authoritative),
        applicationCategoryValues(staged)
    )
}

export function isRecommendedValue(
    recommended: RecommendedValueIds | undefined,
    category: RecommendationCategory,
    id: string | null | undefined
): boolean {
    if (!recommended || !id) return false
    return recommended[category].includes(id)
}

export function hasRecommendedValues(
    recommended: RecommendedValueIds | undefined
): boolean {
    if (!recommended) return false
    return RECOMMENDATION_CATEGORIES.some(
        category => recommended[category].length > 0
    )
}
