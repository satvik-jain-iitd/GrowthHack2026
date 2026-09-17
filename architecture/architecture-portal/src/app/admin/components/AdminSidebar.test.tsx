import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminSidebar, AdminSidebarType } from './AdminSidebar'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'

const mockSetSelectedPlaybook = jest.fn()
const mockSetExpandedPlaybook = jest.fn()
const mockUseAdminContext = jest.fn()

jest.mock('@/context', () => ({
    useAdminContext: () => mockUseAdminContext()
}))

const leafItem: AdminSidebarType = {
    playbook_id: 'leaf-1',
    href: '/leaf',
    label: 'Leaf Item',
    children: []
}

const nestedChild: AdminSidebarType = {
    playbook_id: 'child-1',
    href: '/child',
    label: 'Child Item',
    children: []
}

const parentItem: AdminSidebarType = {
    playbook_id: 'parent-1',
    href: '/parent',
    label: 'Parent Item',
    children: [nestedChild]
}

const makeContext = (overrides: Record<string, unknown> = {}) => ({
    selectedPlaybook: { playbook_id: 'leaf-1', playbook_nm: 'Leaf Item' },
    setSelectedPlaybook: mockSetSelectedPlaybook,
    expandedPlaybook: [] as string[],
    setExpandedPlaybook: mockSetExpandedPlaybook,
    ...overrides
})

describe('AdminSidebar', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('desktop sidebar (isMobile=false)', () => {
        it('renders leaf sidebar items', () => {
            mockUseAdminContext.mockReturnValue(makeContext())
            render(<AdminSidebar sidebar={[leafItem]} />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('leaf-1'))
            ).toBeInTheDocument()
        })

        it('renders parent item with children', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ selectedPlaybook: undefined })
            )
            render(<AdminSidebar sidebar={[parentItem]} />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarParentItem('parent-1'))
            ).toBeInTheDocument()
        })

        it('clicking a leaf item calls setSelectedPlaybook but not setExpandedPlaybook', () => {
            mockUseAdminContext.mockReturnValue(makeContext())
            render(<AdminSidebar sidebar={[leafItem]} />)
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('leaf-1'))
            )
            expect(mockSetSelectedPlaybook).toHaveBeenCalledWith({
                playbook_id: 'leaf-1',
                playbook_nm: 'Leaf Item'
            })
            expect(mockSetExpandedPlaybook).not.toHaveBeenCalled()
        })

        it('clicking a collapsed parent expands it and calls setExpandedPlaybook', () => {
            const expandedPlaybook: string[] = []
            mockUseAdminContext.mockReturnValue(
                makeContext({ expandedPlaybook })
            )
            render(<AdminSidebar sidebar={[parentItem]} />)
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarParentItem('parent-1'))
            )
            expect(mockSetSelectedPlaybook).toHaveBeenCalledWith({
                playbook_id: 'parent-1',
                playbook_nm: 'Parent Item'
            })
            expect(mockSetExpandedPlaybook).toHaveBeenCalledWith(['parent-1'])
        })

        it('shows children when parent is expanded', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ expandedPlaybook: ['parent-1'] })
            )
            render(<AdminSidebar sidebar={[parentItem]} />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('child-1'))
            ).toBeInTheDocument()
        })

        it('hides children when parent is not expanded', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ expandedPlaybook: [] })
            )
            render(<AdminSidebar sidebar={[parentItem]} />)
            expect(
                screen.queryByTestId(ADMIN_TEST_IDS.sidebarLeafItem('child-1'))
            ).not.toBeInTheDocument()
        })

        it('clicking an already-expanded parent collapses it', () => {
            const expandedPlaybook = ['parent-1']
            mockUseAdminContext.mockReturnValue(
                makeContext({ expandedPlaybook })
            )
            render(<AdminSidebar sidebar={[parentItem]} />)
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarParentItem('parent-1'))
            )
            expect(mockSetExpandedPlaybook).toHaveBeenCalledWith([])
        })

        it('highlights the active item (isActive branch)', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({
                    selectedPlaybook: {
                        playbook_id: 'leaf-1',
                        playbook_nm: 'Leaf Item'
                    }
                })
            )
            render(<AdminSidebar sidebar={[leafItem]} />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('leaf-1'))
            ).toBeInTheDocument()
        })

        it('renders non-active item without highlight (isActive=false branch)', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({
                    selectedPlaybook: {
                        playbook_id: 'other',
                        playbook_nm: 'Other'
                    }
                })
            )
            render(<AdminSidebar sidebar={[leafItem]} />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('leaf-1'))
            ).toBeInTheDocument()
        })
    })

    describe('useEffect auto-selection', () => {
        it('auto-selects first sidebar item when no selectedPlaybook and sidebar is non-empty', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ selectedPlaybook: undefined })
            )
            render(<AdminSidebar sidebar={[leafItem]} />)
            expect(mockSetSelectedPlaybook).toHaveBeenCalledWith({
                playbook_id: 'leaf-1',
                playbook_nm: 'Leaf Item'
            })
        })

        it('does not auto-select when selectedPlaybook is already set', () => {
            mockUseAdminContext.mockReturnValue(makeContext())
            render(<AdminSidebar sidebar={[leafItem]} />)
            expect(mockSetSelectedPlaybook).not.toHaveBeenCalled()
        })

        it('does not auto-select when sidebar is empty', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ selectedPlaybook: undefined })
            )
            render(<AdminSidebar sidebar={[]} />)
            expect(mockSetSelectedPlaybook).not.toHaveBeenCalled()
        })
    })

    describe('mobile sidebar (isMobile=true)', () => {
        it('renders the button with selected playbook name', () => {
            mockUseAdminContext.mockReturnValue(makeContext())
            render(<AdminSidebar sidebar={[leafItem]} isMobile />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarMobileButton)
            ).toBeInTheDocument()
        })

        it('accordion is collapsed by default — drawer items are not visible', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({
                    selectedPlaybook: {
                        playbook_id: 'x',
                        playbook_nm: 'Selected'
                    }
                })
            )
            render(
                <AdminSidebar
                    sidebar={[
                        {
                            ...leafItem,
                            playbook_id: 'drawer-1',
                            label: 'Drawer Item'
                        }
                    ]}
                    isMobile
                />
            )
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarMobileButton)
            ).toBeInTheDocument()
            expect(
                screen.queryByTestId(ADMIN_TEST_IDS.sidebarLeafItem('drawer-1'))
            ).not.toBeInTheDocument()
        })

        it('clicking the button expands the accordion and shows the drawer', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({
                    selectedPlaybook: {
                        playbook_id: 'x',
                        playbook_nm: 'Selected'
                    }
                })
            )
            render(
                <AdminSidebar
                    sidebar={[
                        {
                            ...leafItem,
                            playbook_id: 'drawer-1',
                            label: 'Drawer Item'
                        }
                    ]}
                    isMobile
                />
            )
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarMobileButton)
            )
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('drawer-1'))
            ).toBeInTheDocument()
        })

        it('clicking the button again collapses the accordion', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({
                    selectedPlaybook: {
                        playbook_id: 'x',
                        playbook_nm: 'Selected'
                    }
                })
            )
            render(
                <AdminSidebar
                    sidebar={[
                        {
                            ...leafItem,
                            playbook_id: 'drawer-1',
                            label: 'Drawer Item'
                        }
                    ]}
                    isMobile
                />
            )
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarMobileButton)
            )
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarMobileButton)
            )
            expect(
                screen.queryByTestId(ADMIN_TEST_IDS.sidebarLeafItem('drawer-1'))
            ).not.toBeInTheDocument()
        })

        it('clicking a sidebar leaf item inside mobile accordion collapses it', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({
                    selectedPlaybook: {
                        playbook_id: 'x',
                        playbook_nm: 'Selected'
                    }
                })
            )
            render(
                <AdminSidebar
                    sidebar={[
                        {
                            ...leafItem,
                            playbook_id: 'drawer-1',
                            label: 'Drawer Item'
                        }
                    ]}
                    isMobile
                />
            )
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarMobileButton)
            )
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('drawer-1'))
            ).toBeInTheDocument()
            fireEvent.click(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarLeafItem('drawer-1'))
            )
            expect(
                screen.queryByTestId(ADMIN_TEST_IDS.sidebarLeafItem('drawer-1'))
            ).not.toBeInTheDocument()
        })

        it('renders without crashing when selectedPlaybook is undefined (optional chaining)', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ selectedPlaybook: undefined })
            )
            render(<AdminSidebar sidebar={[leafItem]} isMobile />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.sidebarMobileButton)
            ).toBeInTheDocument()
        })
    })
})
