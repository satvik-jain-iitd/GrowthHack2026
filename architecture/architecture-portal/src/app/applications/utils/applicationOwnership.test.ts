import {
    isApplicationOwnerCheck,
    canEditApplication,
    canAttestApplication,
    getApplicationAttestationRole,
    getLowestApplicationAttester,
    flattenMetadata
} from './applicationOwnership'
import { Application } from '@/app/company-domains/types/applications'

const baseMockApplication: Application = {
    application_nm: 'Test App',
    application_id: 'app-1',
    life_cycle_status_nm: '',
    domain_nm: '',
    count: 0,
    company_domain_id: '',
    ebc_level_4_nm: '',
    ebc_level_3_nm: '',
    last_update_ts: '',
    last_update_user_id: '',
    unlink: false,
    sub_domain_id: '',
    central_application_da: {
        ownershipInfo: {
            applicationOwnerLeader1: {
                fullName: 'Owner One',
                email: 'owner1@test.com'
            },
            applicationOwnerLeader2: {
                fullName: 'Owner Two',
                email: 'owner2@test.com'
            },
            ownerSVP: { fullName: 'The SVP', email: 'svp@test.com' },
            applicationOwner: {
                fullName: 'Plain Owner',
                email: 'plain@test.com'
            },
            businessOwner: {
                fullName: 'Business Owner',
                email: 'business@test.com'
            },
            businessOwnerLeader1: {
                fullName: 'Business VP',
                email: 'businessvp@test.com'
            },
            productionSupportOwnerLeader1: {
                fullName: 'Production Support VP',
                email: 'prodsupportvp@test.com'
            }
        }
    }
}

describe('canAttestApplication', () => {
    it('returns true for Application Owner 1', () => {
        expect(
            canAttestApplication(baseMockApplication, 'owner1@test.com', [])
        ).toBe(true)
    })

    it('returns true for Application Owner 2', () => {
        expect(
            canAttestApplication(baseMockApplication, 'owner2@test.com', [])
        ).toBe(true)
    })

    it('returns true for the SVP', () => {
        expect(
            canAttestApplication(baseMockApplication, 'svp@test.com', [])
        ).toBe(true)
    })

    it('returns true for a business owner (now an attester)', () => {
        expect(
            canAttestApplication(baseMockApplication, 'business@test.com', [])
        ).toBe(true)
    })

    it('returns true for the business VP', () => {
        expect(
            canAttestApplication(baseMockApplication, 'businessvp@test.com', [])
        ).toBe(true)
    })

    it('returns true for the production support VP', () => {
        expect(
            canAttestApplication(
                baseMockApplication,
                'prodsupportvp@test.com',
                []
            )
        ).toBe(true)
    })

    it('returns false for a non-owner', () => {
        expect(
            canAttestApplication(
                baseMockApplication,
                '[REDACTED_EMAIL_ADDRESS_6]',
                []
            )
        ).toBe(false)
    })

    it('returns true for admins', () => {
        expect(
            canAttestApplication(baseMockApplication, 'random@test.com', [
                'GG-AXP-ARCH-PORTAL-ADMIN'
            ])
        ).toBe(true)
    })
})

describe('getApplicationAttestationRole', () => {
    it('returns principal_architect for an attester', () => {
        expect(
            getApplicationAttestationRole(
                baseMockApplication,
                'owner1@test.com',
                []
            )
        ).toBe('principal_architect')
    })

    it('returns principal_architect for a business owner (now an attester)', () => {
        expect(
            getApplicationAttestationRole(
                baseMockApplication,
                'business@test.com',
                []
            )
        ).toBe('principal_architect')
    })

    it('returns null for a non-owner', () => {
        expect(
            getApplicationAttestationRole(
                baseMockApplication,
                'random@test.com',
                []
            )
        ).toBeNull()
    })
})

describe('getLowestApplicationAttester', () => {
    it('returns Application Owner 1 as the lowest-level attester', () => {
        expect(getLowestApplicationAttester(baseMockApplication)).toEqual({
            email: 'owner1@test.com',
            name: 'Owner One',
            role: 'Application Owner 1'
        })
    })

    it('falls back to Application Owner 2 when Owner 1 is absent', () => {
        const app: Application = {
            ...baseMockApplication,
            central_application_da: {
                ownershipInfo: {
                    applicationOwnerLeader2: {
                        fullName: 'Owner Two',
                        email: 'owner2@test.com'
                    },
                    ownerSVP: { fullName: 'The SVP', email: 'svp@test.com' }
                }
            }
        }
        expect(getLowestApplicationAttester(app)).toEqual({
            email: 'owner2@test.com',
            name: 'Owner Two',
            role: 'Application Owner 2'
        })
    })

    it('returns null when no attester has an email', () => {
        const app: Application = {
            ...baseMockApplication,
            central_application_da: { ownershipInfo: {} }
        }
        expect(getLowestApplicationAttester(app)).toBeNull()
    })
})

describe('canEditApplication', () => {
    it('allows any owner to edit', () => {
        expect(
            canEditApplication(baseMockApplication, 'business@test.com', [])
        ).toBe(true)
    })

    it('denies a non-owner without privileged groups', () => {
        expect(
            canEditApplication(baseMockApplication, 'random@test.com', [])
        ).toBe(false)
    })

    it('confirms isApplicationOwnerCheck matches a plain owner', () => {
        expect(
            isApplicationOwnerCheck(baseMockApplication, 'plain@test.com')
        ).toBe(true)
    })

    it('confirms isApplicationOwnerCheck matches the Leader1 owners', () => {
        expect(
            isApplicationOwnerCheck(baseMockApplication, 'businessvp@test.com')
        ).toBe(true)
        expect(
            isApplicationOwnerCheck(
                baseMockApplication,
                'prodsupportvp@test.com'
            )
        ).toBe(true)
    })

    it('grants edit access to a member of the PtB test group', () => {
        expect(
            canEditApplication(baseMockApplication, 'random@test.com', [
                'E1_PTB_TEST_GROUP'
            ])
        ).toBe(true)
    })
})

describe('flattenMetadata', () => {
    it('returns an empty object when metadata is undefined', () => {
        expect(flattenMetadata(undefined)).toEqual({})
    })

    it('merges entries from each metadata object', () => {
        expect(
            flattenMetadata([
                { markets: ['US', 'UK'] },
                { technologies: ['Node'] }
            ])
        ).toEqual({
            markets: ['US', 'UK'],
            technologies: ['Node']
        })
    })

    it('lets later objects overwrite earlier keys', () => {
        expect(
            flattenMetadata([{ markets: ['US'] }, { markets: ['CA'] }])
        ).toEqual({ markets: ['CA'] })
    })
})
