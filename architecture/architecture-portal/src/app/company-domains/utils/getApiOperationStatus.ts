/* istanbul ignore file */
import { ApiEndpoint, ApiMetadata, Reviewer } from '@/app/company-domains/types'

export const getOperationStatus = (data: ApiEndpoint) => {
    const { darb_arch, darb_eng, earb, proposed, status } = data

    const isApproved = (status: string) => status?.toLowerCase() === 'approved'

    if (
        [darb_arch, darb_eng, earb].every(isApproved) &&
        status?.toLowerCase() === 'production certified'
    ) {
        return 'prodCert'
    }
    if (
        [darb_arch, darb_eng, earb].every(isApproved) &&
        status?.toLowerCase() === 'design_certified'
    ) {
        return 'preCert'
    }
    if (
        [darb_arch, darb_eng, earb].every(isApproved) &&
        status?.toLowerCase() === 'api catalog'
    ) {
        return 'catalog'
    }
    if ([darb_arch, darb_eng, earb].every(isApproved)) {
        return 'earbAppr'
    }
    if ([darb_arch, darb_eng].every(isApproved)) {
        return 'darbAppr'
    }
    if (proposed?.toLowerCase() === 'proposed') {
        return 'proposed'
    }
    if (status?.toLowerCase() === 'deleted') {
        return 'deleted'
    }
    return 'draft'
}

export const statusOrderMap = {
    prodCert: 1,
    preCert: 2,
    catalog: 3,
    earbAppr: 4,
    darbAppr: 5,
    proposed: 6,
    draft: 7,
    deleted: 8
}

export const getApiStatus = (
    data: ApiMetadata
): keyof typeof statusOrderMap => {
    const { status, add_da: { status: updatedStatus = '' } = {} } = data
    if (updatedStatus?.toLowerCase() === 'deleted') {
        return 'deleted'
    }
    if (status?.toLowerCase() === 'production certified') {
        return 'prodCert'
    }
    if (status?.toLowerCase() === 'design certified') {
        return 'preCert'
    }
    if (status?.toLowerCase() === 'earb approved') {
        return 'earbAppr'
    }
    if (status?.toLowerCase() === 'darb approved') {
        return 'darbAppr'
    }
    if (status?.toLowerCase() === 'proposed') {
        return 'proposed'
    }
    if (status?.toLowerCase() === 'api catalog') {
        return 'catalog'
    }
    return 'draft'
}

export const getSortedList = (
    apiItem: ApiEndpoint,
    reviewers: Reviewer | undefined
) => {
    if (
        (apiItem?.proposed &&
            reviewers?.isEnggReviewer &&
            !reviewers?.isArchReviewer &&
            !apiItem?.darb_eng) ||
        (apiItem?.proposed &&
            reviewers?.isArchReviewer &&
            !reviewers?.isEnggReviewer &&
            !apiItem?.darb_arch) ||
        (reviewers?.isEArbReviewer &&
            !reviewers?.isEnggReviewer &&
            !reviewers?.isArchReviewer &&
            !apiItem?.earb &&
            apiItem?.darb_arch &&
            apiItem?.darb_eng) ||
        (apiItem?.darb_eng &&
            apiItem?.darb_arch &&
            !apiItem?.earb &&
            reviewers?.isEArbReviewer)
    ) {
        return true
    }
    return false
}
