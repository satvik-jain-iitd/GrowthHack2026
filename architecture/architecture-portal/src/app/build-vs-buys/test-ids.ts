// ─────────────────────────────────────────────────────────────────────────────
// Build vs Buy module — data-testid attribute values
// ─────────────────────────────────────────────────────────────────────────────

export const BVB_TEST_IDS = {
    // ── Workflow ───────────────────────────────────────────────────────────
    workflowStepper: 'bvb-stepper',
    workflowActorTable: 'bvb-actor-table',
    workflowActionButtons: 'bvb-action-buttons',
    workflowStatusText: 'status-text',

    // ── Feedback Modal ─────────────────────────────────────────────────────
    feedbackModal: 'feedback-modal',
    feedbackModalClosed: 'feedback-modal-closed',
    feedbackSubmit: 'feedback-submit',
    feedbackClose: 'feedback-close',

    // ── Actor Table ────────────────────────────────────────────────────────
    iconFeedback: 'icon-feedback',
    /** Dynamic testid per reviewer email — e.g. BVB_TEST_IDS.avatarRow('user@aexp.com') */
    avatarRow: (email: string) => `avatar-${email}`,

    // ── Workflow Details ────────────────────────────────────────────────────
    workflowViewDetails: 'workflow-view-details',

    // ── Action Buttons ─────────────────────────────────────────────────────
    submitForReviewBtn: 'submit-for-review-btn',
    abstainBtn: 'abstain-btn',
    disagreeBtn: 'disagree-btn',
    agreeBtn: 'agree-btn',
    approveDecisionBtn: 'approve-decision-btn',
    rejectDecisionBtn: 'reject-decision-btn',
    approveAcceptanceBtn: 'approve-acceptance-btn',
    rejectAcceptanceBtn: 'reject-acceptance-btn',
    actionButtonsContainer: 'action-buttons-container',

    // ── Feedback Modal (real component) ────────────────────────────────────
    feedbackTitle: 'feedback-title',
    feedbackConfirmationText: 'feedback-confirmation-text',
    feedbackTextarea: 'feedback-textarea',
    feedbackSubmitBtn: 'feedback-submit-btn',
    feedbackCancelBtn: 'feedback-cancel-btn',
    feedbackApprovalWarning: 'feedback-approval-warning',

    // ── Actor Table ────────────────────────────────────────────────────────
    actorTableHeading: 'actor-table-heading',
    actorTableDescription: 'actor-table-description',
    actorTableEmptyState: 'actor-table-empty-state',
    actorTableColumnHeader: 'actor-table-column-header',
    actorStatusCell: (email: string) => `actor-status-${email}`,
    reviewersSegment: 'reviewers-segment',
    decidersSegment: 'deciders-segment',

    // ── Stepper ────────────────────────────────────────────────────────────
    stepperStepTitle: (index: number) => `stepper-step-title-${index}`,

    // ── Onboarding ─────────────────────────────────────────────────────────
    buildBuyForm: 'build-buy-form',
    onboardingHeading: 'onboarding-heading',
    onboardingInstructionText: 'onboarding-instruction-text',
    onboardingFirstField: 'first-field',
    onboardingRestFields: 'rest-fields',
    needHelp: 'need-help',

    // ── Status Badge ───────────────────────────────────────────────────────
    statusBadge: 'status-badge',
    statusBadgeLabel: 'status-badge-label',
    statusBadgeWrapper: 'status-badge-wrapper',

    // ── Approval ───────────────────────────────────────────────────────────
    acceptancePage: 'bvb-acceptance-page',

    // ── Page-level mocks (shared component stubs used in page.test.tsx) ────
    documentLayout: 'document-layout',
    indexComponent: 'index-component'
}
