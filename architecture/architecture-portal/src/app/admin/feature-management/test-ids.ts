export const FEATURE_MANAGEMENT_TEST_IDS = {
    // FeatureManagementGuard
    guardLoading: 'feature-management-guard-loading',
    guardAccessDenied: 'feature-management-guard-access-denied',
    // FeatureManagementTabs
    tabs: 'feature-management-tabs',
    tabBtn: (value: string) => `feature-management-tab-btn-${value}`,
    // FeatureFlagsPanel
    flagsTable: 'feature-flags-table',
    flagsLoading: 'feature-flags-loading',
    flagsEmpty: 'feature-flags-empty',
    flagNameCell: (name: string) => `feature-flag-name-${name}`,
    flagValueSwitch: (name: string) => `feature-flag-value-switch-${name}`,
    flagHistoryBtn: (name: string) => `feature-flag-history-btn-${name}`,
    flagDeleteBtn: (name: string) => `feature-flag-delete-btn-${name}`,
    addFlagTriggerBtn: 'add-flag-trigger-btn',
    addFlagDialog: 'add-flag-dialog',
    addFlagNameInput: 'add-flag-name-input',
    addFlagValueSwitch: 'add-flag-value-switch',
    addFlagBtn: 'add-flag-btn',
    addFlagCancelBtn: 'add-flag-cancel-btn',
    // PilotGroupsPanel
    groupsTable: 'pilot-groups-table',
    groupsLoading: 'pilot-groups-loading',
    groupsEmpty: 'pilot-groups-empty',
    groupNameCell: (groupId: string) => `pilot-group-name-${groupId}`,
    groupMembersBtn: (groupId: string) => `pilot-group-members-btn-${groupId}`,
    groupHistoryBtn: (groupId: string) => `pilot-group-history-btn-${groupId}`,
    groupDeleteBtn: (groupId: string) => `pilot-group-delete-btn-${groupId}`,
    addGroupTriggerBtn: 'add-group-trigger-btn',
    addGroupDialog: 'add-group-dialog',
    addGroupNameInput: 'add-group-name-input',
    addGroupBtn: 'add-group-btn',
    addGroupCancelBtn: 'add-group-cancel-btn',
    // PilotGroupMembersDialog
    membersDialog: 'pilot-group-members-dialog',
    memberRow: (email: string) => `pilot-group-member-row-${email}`,
    memberRemoveBtn: (email: string) =>
        `pilot-group-member-remove-btn-${email}`,
    memberTagsInput: 'pilot-group-member-tags-input',
    memberAddBtn: 'pilot-group-member-add-btn',
    // AuditLogDialog
    auditLogDialog: 'audit-log-dialog',
    auditLogEmpty: 'audit-log-empty',
    auditLogLoading: 'audit-log-loading'
} as const
