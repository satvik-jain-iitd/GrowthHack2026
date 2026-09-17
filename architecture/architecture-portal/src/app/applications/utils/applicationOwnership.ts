import { Application } from '@/app/company-domains/types'
import { showAdmin } from '@/app/admin/utils'
import { PTB_TEST_GROUP } from '@/constants'
import { AttestationRole } from '@/app/shared/utils/attestationState'

export function isApplicationOwnerCheck(
    applicationData: Application | undefined,
    email: string | undefined
): boolean {
    if (!applicationData || !email) return false
    const ownershipInfo = applicationData.central_application_da?.ownershipInfo
    if (!ownershipInfo) return false

    const owners = [
        ownershipInfo.applicationOwnerLeader1,
        ownershipInfo.applicationOwner,
        ownershipInfo.unitCIO,
        ownershipInfo.businessOwner,
        ownershipInfo.businessOwnerLeader1,
        ownershipInfo.productionSupportOwner,
        ownershipInfo.productionSupportOwnerLeader1,
        ownershipInfo.pmo,
        ownershipInfo.applicationOwnerLeader2,
        ownershipInfo.ownerSVP
    ]

    return owners.some(
        owner => owner?.email?.toLowerCase() === email.toLowerCase()
    )
}

export function canEditApplication(
    applicationData: Application | undefined,
    email: string | undefined,
    groups: string[]
): boolean {
    return (
        isApplicationOwnerCheck(applicationData, email) ||
        showAdmin(groups) ||
        groups.includes(PTB_TEST_GROUP)
    )
}

export function canAttestApplication(
    applicationData: Application | undefined,
    email: string | undefined,
    groups: string[]
): boolean {
    if (showAdmin(groups)) return true
    if (!applicationData || !email) return false
    const ownershipInfo = applicationData.central_application_da?.ownershipInfo
    if (!ownershipInfo) return false

    const attesters = [
        ownershipInfo.applicationOwnerLeader1,
        ownershipInfo.applicationOwnerLeader2,
        ownershipInfo.ownerSVP,
        ownershipInfo.applicationOwner,
        ownershipInfo.unitCIO,
        ownershipInfo.businessOwner,
        ownershipInfo.businessOwnerLeader1,
        ownershipInfo.productionSupportOwner,
        ownershipInfo.productionSupportOwnerLeader1,
        ownershipInfo.pmo
    ]

    return attesters.some(
        owner => owner?.email?.toLowerCase() === email.toLowerCase()
    )
}

export function getApplicationAttestationRole(
    applicationData: Application | undefined,
    email: string | undefined,
    groups: string[]
): AttestationRole | null {
    if (canAttestApplication(applicationData, email, groups)) {
        return 'principal_architect'
    }
    if (
        isApplicationOwnerCheck(applicationData, email) ||
        groups.includes(PTB_TEST_GROUP)
    ) {
        return 'enterprise_architect'
    }
    return null
}

export function getLowestApplicationAttester(
    applicationData: Application | undefined
): { email: string; name?: string; role: string } | null {
    const ownershipInfo = applicationData?.central_application_da?.ownershipInfo
    if (!ownershipInfo) return null

    const candidates: {
        owner?: { fullName?: string; email?: string | null }
        role: string
    }[] = [
        {
            owner: ownershipInfo.applicationOwnerLeader1,
            role: 'Application Owner 1'
        },
        {
            owner: ownershipInfo.applicationOwnerLeader2,
            role: 'Application Owner 2'
        },
        { owner: ownershipInfo.ownerSVP, role: 'SVP' }
    ]

    for (const candidate of candidates) {
        if (candidate.owner?.email) {
            return {
                email: candidate.owner.email,
                name: candidate.owner.fullName,
                role: candidate.role
            }
        }
    }
    return null
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
