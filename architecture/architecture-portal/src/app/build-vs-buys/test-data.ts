// ─────────────────────────────────────────────────────────────────────────────
// Build vs Buy module — test assertion constants
//
//   BVB_TEST_TEXT  → visible text strings used in test assertions
//   BVB_TEST_LABEL → regex patterns for getByLabelText / findByText
//   BVB_TEST_ROLE  → ARIA role strings used in getByRole queries
// ─────────────────────────────────────────────────────────────────────────────

export const BVB_TEST_TEXT = {
    // ── Common ─────────────────────────────────────────────────────────────
    loading: 'Loading...',
    pending: 'Pending',

    // ── Workflow stepper labels ────────────────────────────────────────────
    awaitingAcceptance: 'Awaiting Acceptance',
    inProgress: 'In Progress',
    inReview: 'In Review',
    awaitingApproval: 'Awaiting Approval',
    complete: 'Complete',

    // ── Workflow trigger ───────────────────────────────────────────────────
    viewDetails: 'View Details',

    // ── Action button labels ───────────────────────────────────────────────
    submitForReview: 'Submit for Review',
    agree: 'Agree',
    approve: 'Approve',
    reject: 'Reject',

    // ── Status badge labels ────────────────────────────────────────────────
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    statusInProgress: 'In Progress',
    statusNotApplicable: 'N/A',

    // ── Component / page headings ──────────────────────────────────────────
    acceptanceListHeading: 'BvB Acceptance List',
    noReviewers: 'No REVIEWERS found.',

    // ── Feedback modal ─────────────────────────────────────────────────────
    feedbackTitle: 'Provide Feedback',
    feedbackPlaceholder: 'Feedback',
    submit: 'Submit',
    cancel: 'Cancel',

    // ── Onboarding ─────────────────────────────────────────────────────────
    onboardingHeading: 'Build vs. Buy Onboarding Request'
}

export const BVB_TEST_LABEL = {
    feedbackConfirmation: /By submitting, you are confirming you/i,
    deciders: 'DECIDERS'
}

export const BVB_TEST_ROLE = {
    button: 'button',
    link: 'link'
}
