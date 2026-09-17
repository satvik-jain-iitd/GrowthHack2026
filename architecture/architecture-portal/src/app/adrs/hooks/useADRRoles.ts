import { useUserContext } from '@/context'
import { ADR } from '@/app/docs/hooks/useGetADR'

export interface PlaybookRoles {
    isRequester: boolean
    isReviewer: boolean
    isDecider: boolean
    isArchitect: boolean
    isAdmin: boolean
}

const ADMIN_EMAILS = [
    'jack.j.blackwell@aexp.com',
    'trevor.m.moore@aexp.com',
    'shanthan.reddy.muddasani@aexp.com',
    'maxmillian.r.woods@aexp.com'
]

export function useADRRoles(
    adr?: ADR,
    adminEmails: string[] = ADMIN_EMAILS
): PlaybookRoles {
    const user = useUserContext()
    const email = (user?.attributes?.email || '').toLowerCase()

    const isRequester = adr?.adr_req_email_ad_tx.toLowerCase() === email
    const isReviewer = (adr?.rev_ctc_da ?? [])
        .map(e => e.toLowerCase())
        .includes(email)
    const isDecider = (adr?.aprv_ctc_da ?? [])
        .map(e => e.toLowerCase())
        .includes(email)
    const isArchitect = (adr?.entrpr_archt_ctc_da ?? [])
        .map(e => e.toLowerCase())
        .includes(email)
    const isAdmin = adminEmails.map(e => e.toLowerCase()).includes(email)
    return {
        isRequester,
        isReviewer,
        isDecider,
        isArchitect,
        isAdmin
    }
}
