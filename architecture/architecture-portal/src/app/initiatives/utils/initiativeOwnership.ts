import { PTBInitiative } from '../types'
import { showAdmin } from '@/app/admin/utils'
import { PTB_TEST_GROUP } from '@/constants'
import { AttestationRole } from '@/app/shared/utils/attestationState'

export function isInitiativeOwnerCheck(
    initiativeData: PTBInitiative | undefined,
    email: string | undefined
): boolean {
    if (!initiativeData || !email) return false
    return (
        [
            ...(initiativeData.headEngineers || []),
            ...(initiativeData.techOwners || []),
            initiativeData.unitCIO,
            ...(initiativeData.eaLead || []),
            ...(initiativeData.engineeringLead || []),
            ...(initiativeData.enterpriseArchitects || []),
            ...(initiativeData.principalArchitects || []),
            ...(initiativeData.additionalArchitects || []),
            ...(initiativeData.delegates || []),
            ...(initiativeData.ucioDelegates || [])
        ].some(
            ownerEmail => ownerEmail?.toLowerCase() === email.toLowerCase()
        ) || false
    )
}

export function canAttestInitiative(
    initiativeData: PTBInitiative | undefined,
    email: string | undefined,
    groups: string[]
): boolean {
    if (showAdmin(groups)) return true
    if (!initiativeData || !email) return false
    const attesters = [
        ...(initiativeData.techOwners || []),
        ...(initiativeData.headEngineers || []),
        initiativeData.unitCIO,
        ...(initiativeData.eaLead || []),
        ...(initiativeData.engineeringLead || []),
        ...(initiativeData.enterpriseArchitects || []),
        ...(initiativeData.principalArchitects || []),
        ...(initiativeData.additionalArchitects || []),
        ...(initiativeData.delegates || []),
        ...(initiativeData.ucioDelegates || [])
    ]
    return attesters.some(
        ownerEmail => ownerEmail?.toLowerCase() === email.toLowerCase()
    )
}

export function isEnterpriseArchitect(
    initiativeData: PTBInitiative | undefined,
    email: string | undefined
): boolean {
    if (!initiativeData || !email) return false
    return (initiativeData.enterpriseArchitects || []).some(
        e => e?.toLowerCase() === email.toLowerCase()
    )
}

export function isPrincipalArchitect(
    initiativeData: PTBInitiative | undefined,
    email: string | undefined
): boolean {
    if (!initiativeData || !email) return false
    return (initiativeData.principalArchitects || []).some(
        e => e?.toLowerCase() === email.toLowerCase()
    )
}

export function getAttestationRole(
    initiativeData: PTBInitiative | undefined,
    email: string | undefined,
    groups: string[] = []
): AttestationRole | null {
    if (canAttestInitiative(initiativeData, email, groups))
        return 'principal_architect'
    if (
        isInitiativeOwnerCheck(initiativeData, email) ||
        groups.includes(PTB_TEST_GROUP)
    )
        return 'enterprise_architect'
    return null
}

export function getLowestInitiativeAttester(
    initiativeData: PTBInitiative | undefined
): { email: string; name?: string; role: string } | null {
    const techVp = (initiativeData?.techOwners || []).find(e => !!e)
    if (techVp) return { email: techVp, role: 'Tech VP' }
    const headEngineer = (initiativeData?.headEngineers || []).find(e => !!e)
    if (headEngineer) return { email: headEngineer, role: 'Head Engineer' }
    return null
}

export function canEditInitiative(
    initiativeData: PTBInitiative | undefined,
    email: string | undefined,
    groups: string[]
): boolean {
    return (
        isInitiativeOwnerCheck(initiativeData, email) ||
        showAdmin(groups) ||
        groups.includes(PTB_TEST_GROUP)
    )
}

export function flattenMetadata(
    metadataArray: object[] | undefined
): Record<string, string[]> {
    const metadata: Record<string, string[]> = {}
    metadataArray?.forEach(obj => {
        Object.entries(obj).forEach(
            ([key, value]: [key: string, value: string[]]) => {
                metadata[key] = value
            }
        )
    })
    return metadata
}
