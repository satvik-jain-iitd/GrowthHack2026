export const ADMIN_TEST_IDS = {
    // AdminContainer (mocked AdminLayout)
    adminLayout: 'admin-layout',
    // AdminContent (mocked AdminUsers)
    adminUsers: 'admin-users',
    adminUsersLoading: 'admin-users-loading',
    // AdminLayout (mocked children)
    adminTabs: 'admin-tabs',
    adminSidebar: 'admin-sidebar',
    adminSidebarMobile: 'admin-sidebar-mobile',
    adminContent: 'admin-content',
    // AdminUsers (mocked icons)
    iconEdit: 'icon-edit',
    iconTrash: 'icon-trash',
    // AdminUsers (mocked combobox)
    comboboxContent: 'combobox-content',
    comboboxItem: 'combobox-item',
    comboboxEmpty: 'combobox-empty',
    // AdminCards
    cardTitle: 'admin-card-title',
    cardDescription: 'admin-card-description',
    cardImage: (index: number, variant: string) =>
        `admin-card-image-${index}-${variant}`,
    // AdminContent
    playbookName: 'admin-playbook-name',
    contentDescription: 'admin-content-description',
    // AdminHeader
    adminHeading: 'admin-heading',
    adminHeaderDescription: 'admin-header-description',
    // AdminTabs
    adminTabBtn: (value: string) => `admin-tab-btn-${value}`,
    // AdminSidebar
    sidebarLeafItem: (id: string) => `sidebar-leaf-${id}`,
    sidebarParentItem: (id: string) => `sidebar-parent-${id}`,
    sidebarMobileButton: 'sidebar-mobile-button',
    // AdminUsers table
    noDataPresent: 'admin-no-data-present',
    addRowBtn: 'admin-add-row-btn',
    saveRowBtn: (index: number) => `admin-save-row-btn-${index}`,
    cancelRowBtn: (index: number) => `admin-cancel-row-btn-${index}`,
    personaHeader: 'admin-persona-header',
    emailHeader: 'admin-email-header',
    nameHeader: 'admin-name-header',
    inheritHeader: 'admin-inherit-header',
    actionsHeader: 'admin-actions-header',
    displayPersonaCell: (index: number) => `admin-display-persona-${index}`,
    displayEmailCell: (index: number) => `admin-display-email-${index}`,
    displayNameCell: (index: number) => `admin-display-name-${index}`,
    personaCombobox: (index: number) => `admin-persona-combobox-${index}`,
    userCombobox: (index: number) => `admin-user-combobox-${index}`
} as const
