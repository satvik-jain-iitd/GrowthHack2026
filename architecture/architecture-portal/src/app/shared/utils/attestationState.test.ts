import { getLatestAttestationId, needsAttestation } from './attestationState'
import { AttestationSummary } from '../types/metamodel'

describe('needsAttestation', () => {
    it('returns true when attestations is undefined', () => {
        expect(needsAttestation(undefined, false)).toBe(true)
    })

    it('returns true when attestations is empty', () => {
        expect(needsAttestation([], false)).toBe(true)
    })

    it('returns true when snapshot is stale', () => {
        const attestations: AttestationSummary[] = [
            { attestationId: 'a1', attestationDate: '2024-01-15' }
        ]
        expect(needsAttestation(attestations, true)).toBe(true)
    })

    it('returns false when attestations exist and snapshot is not stale', () => {
        const attestations: AttestationSummary[] = [
            { attestationId: 'a1', attestationDate: '2024-01-15' }
        ]
        expect(needsAttestation(attestations, false)).toBe(false)
    })
})

describe('getLatestAttestationId', () => {
    it('returns null when attestations is undefined', () => {
        expect(getLatestAttestationId(undefined)).toBeNull()
    })

    it('returns null when attestations is empty', () => {
        expect(getLatestAttestationId([])).toBeNull()
    })

    it('returns the attestationId of the last item', () => {
        const attestations: AttestationSummary[] = [
            { attestationId: 'a1', attestationDate: '2024-01-15' },
            { attestationId: 'a2', attestationDate: null }
        ]
        expect(getLatestAttestationId(attestations)).toBe('a2')
    })
})
