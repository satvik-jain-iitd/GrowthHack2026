import { ApplicationMM, InitiativeMM } from '../types/metamodel'
import {
    diffApplicationRecommendations,
    diffInitiativeRecommendations,
    emptyRecommendedValueIds,
    hasRecommendedValues,
    isRecommendedValue
} from './recommendationDiff'

const initiative = (overrides: Partial<InitiativeMM> = {}): InitiativeMM =>
    ({
        initiativeId: 'i-1',
        supportedMarkets: [],
        technologyStacks: [],
        impactedCompanyDomains: [],
        foundationalTechnologies: [],
        techCapabilities: [],
        businessCapabilities: [],
        playbooks: [],
        ...overrides
    }) as InitiativeMM

const application = (overrides: Partial<ApplicationMM> = {}): ApplicationMM =>
    ({
        applicationId: 'app-1',
        marketsSupported: [],
        technologyStacks: [],
        linkedCompanyDomain: null,
        linkedFoundationalTechnologies: [],
        techCapabilities: [],
        businessCapabilities: [],
        linkedPlaybooks: [],
        ...overrides
    }) as ApplicationMM

describe('diffInitiativeRecommendations', () => {
    it('marks staged-only values as recommendations', () => {
        const authoritative = initiative({
            supportedMarkets: ['US'],
            technologyStacks: ['ts-1'],
            techCapabilities: []
        })
        const staged = initiative({
            supportedMarkets: ['US', 'GB'],
            technologyStacks: ['ts-1', 'ts-2'],
            techCapabilities: ['tc-1'],
            businessCapabilities: ['bc-1']
        })

        expect(diffInitiativeRecommendations(authoritative, staged)).toEqual({
            markets: ['GB'],
            techStacks: ['ts-2'],
            companyDomains: [],
            foundationalTechnologies: [],
            technicalCapabilities: ['tc-1'],
            businessCapabilities: ['bc-1'],
            playbooks: []
        })
    })

    it('does not mark business capabilities already confirmed authoritatively', () => {
        expect(
            diffInitiativeRecommendations(
                initiative({ businessCapabilities: ['bc-1'] }),
                initiative({ businessCapabilities: ['bc-1', 'bc-2'] })
            ).businessCapabilities
        ).toEqual(['bc-2'])
    })

    it('diffs playbooks by id', () => {
        const authoritative = initiative({
            playbooks: [{ playbookId: 'pb-1', isCore: true }]
        })
        const staged = initiative({
            playbooks: [
                { playbookId: 'pb-1', isCore: true },
                { playbookId: 'pb-2', isCore: false }
            ]
        })

        expect(
            diffInitiativeRecommendations(authoritative, staged).playbooks
        ).toEqual(['pb-2'])
    })

    it('does not mark values present in the authoritative response', () => {
        const entity = initiative({
            supportedMarkets: ['US'],
            foundationalTechnologies: ['ft-1']
        })

        expect(diffInitiativeRecommendations(entity, entity)).toEqual(
            emptyRecommendedValueIds()
        )
    })

    it('diffs company domains by id', () => {
        const authoritative = initiative({ impactedCompanyDomains: [] })
        const staged = initiative({
            impactedCompanyDomains: [
                {
                    companyDomainId: 'cd-1',
                    companyDomainName: 'Domain One'
                }
            ] as InitiativeMM['impactedCompanyDomains']
        })

        expect(
            diffInitiativeRecommendations(authoritative, staged).companyDomains
        ).toEqual(['cd-1'])
    })

    it('returns nothing when either response is missing', () => {
        expect(diffInitiativeRecommendations(null, initiative())).toEqual(
            emptyRecommendedValueIds()
        )
        expect(diffInitiativeRecommendations(initiative(), null)).toEqual(
            emptyRecommendedValueIds()
        )
    })
})

describe('diffApplicationRecommendations', () => {
    it('marks staged-only values as recommendations', () => {
        const authoritative = application({
            marketsSupported: ['US'],
            linkedFoundationalTechnologies: ['ft-1']
        })
        const staged = application({
            marketsSupported: ['US', 'MX'],
            linkedFoundationalTechnologies: ['ft-1', 'ft-2'],
            businessCapabilities: ['bc-1'],
            linkedCompanyDomain: {
                companyDomainId: 'cd-9',
                companyDomainName: 'Domain Nine'
            } as ApplicationMM['linkedCompanyDomain']
        })

        expect(diffApplicationRecommendations(authoritative, staged)).toEqual({
            markets: ['MX'],
            techStacks: [],
            companyDomains: ['cd-9'],
            foundationalTechnologies: ['ft-2'],
            technicalCapabilities: [],
            businessCapabilities: ['bc-1'],
            playbooks: []
        })
    })

    it('marks staged-only linked playbooks as recommendations', () => {
        expect(
            diffApplicationRecommendations(
                application({ linkedPlaybooks: ['pb-1'] }),
                application({ linkedPlaybooks: ['pb-1', 'pb-domain'] })
            ).playbooks
        ).toEqual(['pb-domain'])
    })

    it('does not mark linked playbooks already confirmed authoritatively', () => {
        expect(
            diffApplicationRecommendations(
                application({ linkedPlaybooks: ['pb-1'] }),
                application({ linkedPlaybooks: ['pb-1'] })
            ).playbooks
        ).toEqual([])
    })

    it('does not mark business capabilities already confirmed authoritatively', () => {
        expect(
            diffApplicationRecommendations(
                application({ businessCapabilities: ['bc-1'] }),
                application({ businessCapabilities: ['bc-1'] })
            ).businessCapabilities
        ).toEqual([])
    })

    it('does not mark a company domain already confirmed authoritatively', () => {
        const domain = {
            companyDomainId: 'cd-9',
            companyDomainName: 'Domain Nine'
        } as ApplicationMM['linkedCompanyDomain']

        expect(
            diffApplicationRecommendations(
                application({ linkedCompanyDomain: domain }),
                application({ linkedCompanyDomain: domain })
            ).companyDomains
        ).toEqual([])
    })
})

describe('isRecommendedValue', () => {
    const recommended = {
        ...emptyRecommendedValueIds(),
        markets: ['GB']
    }

    it('is true for a recommended id in the given category', () => {
        expect(isRecommendedValue(recommended, 'markets', 'GB')).toBe(true)
    })

    it('is false for other ids, categories and missing inputs', () => {
        expect(isRecommendedValue(recommended, 'markets', 'US')).toBe(false)
        expect(isRecommendedValue(recommended, 'techStacks', 'GB')).toBe(false)
        expect(isRecommendedValue(undefined, 'markets', 'GB')).toBe(false)
        expect(isRecommendedValue(recommended, 'markets', null)).toBe(false)
    })
})

describe('hasRecommendedValues', () => {
    it('is true only when at least one category has values', () => {
        expect(hasRecommendedValues(undefined)).toBe(false)
        expect(hasRecommendedValues(emptyRecommendedValueIds())).toBe(false)
        expect(
            hasRecommendedValues({
                ...emptyRecommendedValueIds(),
                technicalCapabilities: ['tc-1']
            })
        ).toBe(true)
    })
})
