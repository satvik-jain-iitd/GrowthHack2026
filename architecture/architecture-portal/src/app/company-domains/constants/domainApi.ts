export const REVIEW_LABELS = {
    ENGINEER_REVIEW: 'HEAD ENGINEER REVIEW',
    ARCHITECT_REVIEW: 'ENTERPRISE ARCHITECT REVIEW',
    EARB_REVIEW: 'E-ARB REVIEW'
}

export const APPROVAL_MESSAGES = {
    ENGINEER_REVIEW:
        'By approving this operation, you confirm that the operation has completed the Domain Architecture Review Board (DARB) review. Once all required approvals are complete, the operation will move to the ARB Approved state.',
    ARCHITECT_REVIEW:
        'By approving this operation, you confirm that the operation has completed the Domain Architecture Review Board (DARB) review. Once all required approvals are complete, the operation will move to the ARB Approved state.',
    EARB_REVIEW:
        'By approving this operation, you confirm that the operation has completed the E-ARB review. The operation will move to the EARB Approved state'
}

export const USER_MESSAGES = {
    DELEGATE_ERROR_TITLE: 'Delegation Unsuccessful',
    QUICK_FILTER_TOOLTIP: 'Filter APIs and operations by approval status',
    QUICK_FILTER_PROPOSED:
        'Filter APIs and operations that are ready for ARB review',
    QUICK_FILTER_DARB_APPROVED:
        'Filter APIs and operations that are ready for EARB review'
}

export const B2B_GATEWAY_DOMAIN = {
    ID: '369a3236-3150-48f3-a51c-84a2b4384fa8',
    NAME: 'Third Party Domains'
}
