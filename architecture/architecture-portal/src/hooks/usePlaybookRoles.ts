/* istanbul ignore file */
import { useUserContext } from '@/context'
import { Playbook } from '@/types/Playbook'

export interface PlaybookRoles {
    isOwner: boolean
    isRequester: boolean
    isReviewer: boolean
    isStakeholder: boolean
    isDecider: boolean
    isArchitect: boolean
    isAdmin: boolean
    canEdit: boolean
}

const ADMIN_EMAILS = [
    'jack.j.blackwell@aexp.com',
    'srinidhi.kanakapura.v.prasad@aexp.com',
    'frank.odonnell@aexp.com'
]

const ROLE_KEYS = [
    'owner',
    'requester',
    'reviewers',
    'stakeHolders',
    'deciders',
    'eaArchitect'
] as const

export function usePlaybookRoles(
    playbook?: Playbook,
    adminEmails: string[] = ADMIN_EMAILS
): PlaybookRoles {
    const user = useUserContext()
    const email = (user?.attributes?.email || '').toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (playbook?.add_da as any) || {}
    const roleFlags = ROLE_KEYS.map(key =>
        (data[key]?.map((e: string) => e.toLowerCase()) ?? []).includes(email)
    )
    const [
        isOwner,
        isRequester,
        isReviewer,
        isStakeholder,
        isDecider,
        isArchitect
    ] = roleFlags
    const isAdmin = adminEmails.map(e => e.toLowerCase()).includes(email)
    const canEdit = isAdmin || isOwner || isRequester || isArchitect
    return {
        isOwner,
        isRequester,
        isReviewer,
        isStakeholder,
        isDecider,
        isArchitect,
        isAdmin,
        canEdit
    }
}
