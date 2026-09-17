import {
    isInitiativeOwnerCheck,
    canEditInitiative,
    canAttestInitiative,
    flattenMetadata,
    isEnterpriseArchitect,
    isPrincipalArchitect,
    getAttestationRole,
    getLowestInitiativeAttester
} from './initiativeOwnership'
import { PTBInitiative } from '../types'

const baseMockInitiative: PTBInitiative = {
    actualOnboardingDate: '',
    adrCore: [],
    adrNonCore: [],
    applicationsImpacted: [],
    bvbCore: [],
    bvbNonCore: [],
    eaLead: ['ealead@test.com'],
    engineeringLead: [],
    etp_id: '',
    initiativeCategory: '',
    initiativeId: 'i1',
    metadata: [],
    name: 'Test',
    startDate: '',
    tentativeEndDate: '',
    unitCIO: 'ucio@test.com',
    years: [],
    companyDomainId: [],
    companyDomainName: [],
    clarityId: '',
    initiativeFrameworks: [],
    playbookCore: [],
    playbookNonCore: [],
    techOwners: ['tech@test.com'],
    principalArchitects: ['pa@test.com'],
    enterpriseArchitects: ['ea@test.com'],
    ucioDelegates: [],
    headEngineers: ['head@test.com'],
    delegates: [],
    statusReportOwnerPrimary: [],
    statusReportOwnerSecondary: [],
    additionalArchitects: [],
    markets: [],
    companyDomains: [],
    ebc: []
}

describe('isInitiativeOwnerCheck', () => {
    it('returns false when initiativeData is undefined', () => {
        expect(isInitiativeOwnerCheck(undefined, 'user@test.com')).toBe(false)
    })

    it('returns false when email is undefined', () => {
        expect(isInitiativeOwnerCheck(baseMockInitiative, undefined)).toBe(
            false
        )
    })

    it('returns true when email matches headEngineers', () => {
        expect(
            isInitiativeOwnerCheck(baseMockInitiative, 'head@test.com')
        ).toBe(true)
    })

    it('returns true when email matches techOwners', () => {
        expect(
            isInitiativeOwnerCheck(baseMockInitiative, 'tech@test.com')
        ).toBe(true)
    })

    it('returns true when email matches unitCIO', () => {
        expect(
            isInitiativeOwnerCheck(baseMockInitiative, 'ucio@test.com')
        ).toBe(true)
    })

    it('returns true when email matches eaLead', () => {
        expect(
            isInitiativeOwnerCheck(baseMockInitiative, 'ealead@test.com')
        ).toBe(true)
    })

    it('returns false for non-owner email', () => {
        expect(
            isInitiativeOwnerCheck(baseMockInitiative, 'random@test.com')
        ).toBe(false)
    })

    it('performs case-insensitive matching', () => {
        expect(
            isInitiativeOwnerCheck(baseMockInitiative, 'HEAD@TEST.COM')
        ).toBe(true)
    })
})

describe('isEnterpriseArchitect', () => {
    it('returns true when email matches enterpriseArchitects', () => {
        expect(isEnterpriseArchitect(baseMockInitiative, 'ea@test.com')).toBe(
            true
        )
    })

    it('returns false for non-EA email', () => {
        expect(
            isEnterpriseArchitect(baseMockInitiative, 'random@test.com')
        ).toBe(false)
    })

    it('returns false when initiativeData is undefined', () => {
        expect(isEnterpriseArchitect(undefined, 'ea@test.com')).toBe(false)
    })
})

describe('isPrincipalArchitect', () => {
    it('returns true when email matches principalArchitects', () => {
        expect(isPrincipalArchitect(baseMockInitiative, 'pa@test.com')).toBe(
            true
        )
    })

    it('returns false for non-PA email', () => {
        expect(
            isPrincipalArchitect(baseMockInitiative, 'random@test.com')
        ).toBe(false)
    })

    it('returns false when initiativeData is undefined', () => {
        expect(isPrincipalArchitect(undefined, 'pa@test.com')).toBe(false)
    })
})

describe('canAttestInitiative', () => {
    it('returns true for Tech VP (techOwners)', () => {
        expect(
            canAttestInitiative(baseMockInitiative, 'tech@test.com', [])
        ).toBe(true)
    })

    it('returns true for Head Engineer (headEngineers)', () => {
        expect(
            canAttestInitiative(baseMockInitiative, 'head@test.com', [])
        ).toBe(true)
    })

    it('returns true for Unit CIO', () => {
        expect(
            canAttestInitiative(baseMockInitiative, 'ucio@test.com', [])
        ).toBe(true)
    })

    it('returns true for EA lead (now an attester)', () => {
        expect(
            canAttestInitiative(baseMockInitiative, 'ealead@test.com', [])
        ).toBe(true)
    })

    it('returns true for admins', () => {
        expect(
            canAttestInitiative(baseMockInitiative, 'random@test.com', [
                'GG-AXP-ARCH-PORTAL-ADMIN'
            ])
        ).toBe(true)
    })
})

describe('getAttestationRole', () => {
    it('returns principal_architect when user can attest (Tech VP)', () => {
        expect(getAttestationRole(baseMockInitiative, 'tech@test.com')).toBe(
            'principal_architect'
        )
    })

    it('returns principal_architect when user is EA lead (now an attester)', () => {
        expect(getAttestationRole(baseMockInitiative, 'ealead@test.com')).toBe(
            'principal_architect'
        )
    })

    it('returns null when user is not an owner', () => {
        expect(
            getAttestationRole(baseMockInitiative, 'random@test.com')
        ).toBeNull()
    })

    it('returns null when initiativeData is undefined', () => {
        expect(getAttestationRole(undefined, 'tech@test.com')).toBeNull()
    })

    it('prioritizes principal_architect when user is both an attester and owner', () => {
        expect(getAttestationRole(baseMockInitiative, 'head@test.com')).toBe(
            'principal_architect'
        )
    })

    it('returns enterprise_architect for PTB test group without ownership', () => {
        expect(
            getAttestationRole(baseMockInitiative, 'nobody@test.com', [
                'E1_PTB_TEST_GROUP'
            ])
        ).toBe('enterprise_architect')
    })
})

describe('getLowestInitiativeAttester', () => {
    it('returns Tech VP as the lowest-level attester', () => {
        expect(getLowestInitiativeAttester(baseMockInitiative)).toEqual({
            email: 'tech@test.com',
            role: 'Tech VP'
        })
    })

    it('falls back to Head Engineer when no Tech VP exists', () => {
        const initiative = { ...baseMockInitiative, techOwners: [] }
        expect(getLowestInitiativeAttester(initiative)).toEqual({
            email: 'head@test.com',
            role: 'Head Engineer'
        })
    })

    it('returns null when no Tech VP or Head Engineer exists', () => {
        const initiative = {
            ...baseMockInitiative,
            techOwners: [],
            headEngineers: []
        }
        expect(getLowestInitiativeAttester(initiative)).toBeNull()
    })
})

describe('canEditInitiative', () => {
    it('returns true when user is owner', () => {
        expect(canEditInitiative(baseMockInitiative, 'head@test.com', [])).toBe(
            true
        )
    })

    it('returns true when user is admin', () => {
        expect(
            canEditInitiative(baseMockInitiative, 'random@test.com', [
                'GG-AXP-ARCH-PORTAL-ADMIN'
            ])
        ).toBe(true)
    })

    it('returns false when user is neither owner nor admin', () => {
        expect(
            canEditInitiative(baseMockInitiative, 'random@test.com', [])
        ).toBe(false)
    })

    it('returns true when user is in E1_PTB_TEST_GROUP', () => {
        expect(
            canEditInitiative(baseMockInitiative, 'random@test.com', [
                'E1_PTB_TEST_GROUP'
            ])
        ).toBe(true)
    })

    it('returns true when user is in E1_PTB_TEST_GROUP even without ownership', () => {
        expect(
            canEditInitiative(baseMockInitiative, 'nobody@test.com', [
                'E1_PTB_TEST_GROUP'
            ])
        ).toBe(true)
    })

    it('returns true when user is both owner and in E1_PTB_TEST_GROUP', () => {
        expect(
            canEditInitiative(baseMockInitiative, 'head@test.com', [
                'E1_PTB_TEST_GROUP'
            ])
        ).toBe(true)
    })
})

const sparseInitiative = {
    initiativeId: 'i2',
    name: 'Sparse'
} as unknown as PTBInitiative

describe('ownership checks with missing owner arrays', () => {
    it('isInitiativeOwnerCheck returns false when owner arrays are undefined', () => {
        expect(
            isInitiativeOwnerCheck(sparseInitiative, 'anyone@test.com')
        ).toBe(false)
    })

    it('canAttestInitiative returns false for a non-admin when arrays are undefined', () => {
        expect(
            canAttestInitiative(sparseInitiative, 'anyone@test.com', [])
        ).toBe(false)
    })

    it('isEnterpriseArchitect returns false when enterpriseArchitects is undefined', () => {
        expect(isEnterpriseArchitect(sparseInitiative, 'ea@test.com')).toBe(
            false
        )
    })

    it('isPrincipalArchitect returns false when principalArchitects is undefined', () => {
        expect(isPrincipalArchitect(sparseInitiative, 'pa@test.com')).toBe(
            false
        )
    })

    it('getLowestInitiativeAttester returns null when arrays are undefined', () => {
        expect(getLowestInitiativeAttester(sparseInitiative)).toBeNull()
    })

    it('getLowestInitiativeAttester returns null when initiativeData is undefined', () => {
        expect(getLowestInitiativeAttester(undefined)).toBeNull()
    })
})

describe('flattenMetadata', () => {
    it('returns empty object for undefined', () => {
        expect(flattenMetadata(undefined)).toEqual({})
    })

    it('returns empty object for empty array', () => {
        expect(flattenMetadata([])).toEqual({})
    })

    it('flattens metadata array into key-value record', () => {
        const metadata = [
            { 'Business Units': ['unit1', 'unit2'] },
            { 'Tech Stacks': ['stack1'] }
        ]
        const result = flattenMetadata(metadata)
        expect(result).toEqual({
            'Business Units': ['unit1', 'unit2'],
            'Tech Stacks': ['stack1']
        })
    })
})
