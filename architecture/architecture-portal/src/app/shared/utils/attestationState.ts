import { AttestationSummary } from '../types/metamodel'

export type AttestationRole = 'enterprise_architect' | 'principal_architect'

export function getLatestAttestationId(
    attestations: AttestationSummary[] | undefined
): string | null {
    if (!attestations || attestations.length === 0) return null
    return attestations[attestations.length - 1].attestationId
}

export function needsAttestation(
    attestations: AttestationSummary[] | undefined,
    snapshotStale: boolean
): boolean {
    if (!attestations || attestations.length === 0) return true
    return snapshotStale
}
