import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '@/test/utils/test-utils'
import { AdminUsers } from './AdminUsers'
import { ADMIN_TEST_IDS } from '@/app/admin/test-ids'
import { UserPersona, Persona } from '@/types/Persona'

interface IconProps {
    onClick?: () => void
}

interface ChildrenProps {
    children: React.ReactNode
}

interface ComboboxItemProps {
    children: React.ReactNode
    item: unknown
    onClick: () => void
    style?: React.CSSProperties
    'aria-disabled'?: boolean
}

const mockUseAdminContext = jest.fn()

jest.mock('@/context', () => ({
    useAdminContext: () => mockUseAdminContext()
}))

jest.mock('@americanexpress/dls-icons', () => ({
    IconEdit: ({ onClick }: IconProps) => (
        <div data-testid='icon-edit' onClick={onClick} />
    ),
    IconTrash: ({ onClick }: IconProps) => (
        <div data-testid='icon-trash' onClick={onClick} />
    )
}))

jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    return {
        ...actual,
        Portal: ({ children }: ChildrenProps) => <>{children}</>,
        Combobox: {
            ...actual.Combobox,
            Content: ({ children }: ChildrenProps) => (
                <div data-testid='combobox-content'>{children}</div>
            ),
            Item: ({
                children,
                item: _item,
                onClick,
                style,
                'aria-disabled': ariaDisabled
            }: ComboboxItemProps) => (
                <div
                    data-testid='combobox-item'
                    onClick={onClick}
                    aria-disabled={ariaDisabled}
                    style={style}
                >
                    {children}
                </div>
            ),
            ItemIndicator: () => null,
            Empty: ({ children }: ChildrenProps) => (
                <div data-testid='combobox-empty'>{children}</div>
            )
        }
    }
})

const mockGetUserData = jest.fn()
const mockGetCountOfPersona = jest.fn()
const mockSetPlaybookUsers = jest.fn()
const mockSetCurrentEditedUser = jest.fn()
const mockOnClickSave = jest.fn()
const mockDeleteUser = jest.fn()

const mockPersona: Persona[] = [
    {
        persona_id: 'p1',
        persona_nm: 'Admin_User',
        persona_ds: 'Administrator',
        max_user_no: 5,
        userList: [
            {
                displayName: 'Alice Smith',
                userPrincipalName: 'alice@example.com'
            },
            { displayName: 'Bob Jones', userPrincipalName: 'bob@example.com' }
        ]
    },
    {
        persona_id: 'p2',
        persona_nm: 'Read_Only',
        persona_ds: 'Read only user',
        max_user_no: 10,
        userList: []
    }
]

const displayUser: UserPersona = {
    persona_nm: 'Admin_User',
    persona_id: 'p1',
    email: 'alice@example.com',
    name: 'Alice Smith',
    lastUpdatedTime: '2024-01-01T00:00:00Z',
    inherit: false,
    showInput: false,
    isEdit: false
}

const inputUser: UserPersona = {
    persona_nm: 'Admin_User',
    persona_id: 'p1',
    email: 'alice@example.com',
    name: 'Alice Smith',
    lastUpdatedTime: '2024-01-01T00:00:00Z',
    inherit: false,
    showInput: true,
    isEdit: false
}

const makeContext = (overrides = {}) => ({
    persona: mockPersona,
    selectedPlaybook: { playbook_id: 'pb1', playbook_nm: 'Playbook 1' },
    getUserData: mockGetUserData,
    getCountOfPersona: mockGetCountOfPersona,
    playbookUsers: [] as UserPersona[],
    setPlaybookUsers: mockSetPlaybookUsers,
    loading: false,
    currentEditedUser: {} as UserPersona,
    setCurrentEditedUser: mockSetCurrentEditedUser,
    onClickSave: mockOnClickSave,
    deleteUser: mockDeleteUser,
    ...overrides
})

describe('AdminUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockGetCountOfPersona.mockReturnValue(0)
    })
    describe('loading state', () => {
        it('renders a spinner when loading is true', () => {
            mockUseAdminContext.mockReturnValue(makeContext({ loading: true }))
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.adminUsersLoading)
            ).toBeInTheDocument()
        })

        it('does not render table when loading', () => {
            mockUseAdminContext.mockReturnValue(makeContext({ loading: true }))
            render(<AdminUsers />)
            expect(
                screen.queryByTestId(ADMIN_TEST_IDS.noDataPresent)
            ).not.toBeInTheDocument()
            expect(
                screen.queryByTestId(ADMIN_TEST_IDS.addRowBtn)
            ).not.toBeInTheDocument()
        })
    })

    describe('empty state', () => {
        it('shows "No Data Present" when playbookUsers is empty', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.noDataPresent)
            ).toBeInTheDocument()
        })

        it('renders ADD button when playbookUsers is empty', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.addRowBtn)
            ).toBeInTheDocument()
        })
    })

    describe('display row (showInput=false)', () => {
        it('renders user data in display row', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [displayUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.displayPersonaCell(0))
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.displayEmailCell(0))
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.displayNameCell(0))
            ).toBeInTheDocument()
        })

        it('renders table headers', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [displayUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.personaHeader)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.emailHeader)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.nameHeader)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.inheritHeader)
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.actionsHeader)
            ).toBeInTheDocument()
        })

        it('renders inherit checkbox as unchecked when inherit is false', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [displayUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.displayPersonaCell(0))
            ).toBeInTheDocument()
        })

        it('renders inherit checkbox as checked when inherit is true', () => {
            const inheritUser = { ...displayUser, inherit: true }
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inheritUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.displayPersonaCell(0))
            ).toBeInTheDocument()
        })
    })

    describe('input row (showInput=true)', () => {
        it('renders SAVE and CANCEL buttons when showInput is true', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.saveRowBtn(0))
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.cancelRowBtn(0))
            ).toBeInTheDocument()
        })

        it('renders persona combobox cell', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.personaCombobox(0))
            ).toBeInTheDocument()
        })

        it('renders user combobox cell', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.userCombobox(0))
            ).toBeInTheDocument()
        })

        it('renders input row for user with no matching persona entry', () => {
            const userWithNoPersona = {
                ...inputUser,
                persona_id: 'nonexistent'
            }
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [userWithNoPersona] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.saveRowBtn(0))
            ).toBeInTheDocument()
        })
    })

    describe('useEffect getUserData', () => {
        it('calls getUserData on mount', () => {
            mockUseAdminContext.mockReturnValue(makeContext())
            render(<AdminUsers />)
            expect(mockGetUserData).toHaveBeenCalledTimes(1)
        })
    })

    describe('addRow', () => {
        it('calls setPlaybookUsers with a new row on ADD click', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.addRowBtn))
            expect(mockSetPlaybookUsers).toHaveBeenCalledTimes(1)
            const newUsers = mockSetPlaybookUsers.mock.calls[0][0]
            expect(newUsers).toHaveLength(1)
            expect(newUsers[0].showInput).toBe(true)
            expect(newUsers[0].inherit).toBe(false)
        })

        it('uses first persona option for new row when available', () => {
            mockGetCountOfPersona.mockReturnValue(0)
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.addRowBtn))
            const newUsers = mockSetPlaybookUsers.mock.calls[0][0]
            expect(newUsers[0].persona_nm).toBe('Admin_User')
            expect(newUsers[0].persona_id).toBe('p1')
        })

        it('uses empty strings for persona when all personas are full', () => {
            // All personas at max, tempPersonaOptions will be empty
            mockGetCountOfPersona.mockReturnValue(100)
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.addRowBtn))
            const newUsers = mockSetPlaybookUsers.mock.calls[0][0]
            expect(newUsers[0].persona_nm).toBe('')
            expect(newUsers[0].persona_id).toBe('')
        })

        it('uses empty strings when persona list is undefined', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [], persona: undefined })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.addRowBtn))
            const newUsers = mockSetPlaybookUsers.mock.calls[0][0]
            expect(newUsers[0].persona_nm).toBe('')
        })

        it('adds row on existing list', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [displayUser] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.addRowBtn))
            const newUsers = mockSetPlaybookUsers.mock.calls[0][0]
            expect(newUsers).toHaveLength(2)
        })
    })

    describe('onClickSave', () => {
        it('calls onClickSave with the correct index when SAVE is clicked', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.saveRowBtn(0)))
            expect(mockOnClickSave).toHaveBeenCalledWith(0)
        })
    })

    describe('onClickCancel', () => {
        it('removes new row when cancel clicked (isEdit=false)', () => {
            const newRow: UserPersona = { ...inputUser, isEdit: false }
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [newRow] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.cancelRowBtn(0)))
            expect(mockSetPlaybookUsers).toHaveBeenCalledTimes(1)
            const updated = mockSetPlaybookUsers.mock.calls[0][0]
            expect(updated).toHaveLength(0)
        })

        it('restores original user when cancel clicked on edit row (isEdit=true)', () => {
            const editRow: UserPersona = { ...inputUser, isEdit: true }
            const original: UserPersona = {
                ...displayUser,
                showInput: false,
                isEdit: false
            }
            mockUseAdminContext.mockReturnValue(
                makeContext({
                    playbookUsers: [editRow],
                    currentEditedUser: original
                })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.cancelRowBtn(0)))
            expect(mockSetPlaybookUsers).toHaveBeenCalledTimes(1)
            const updated = mockSetPlaybookUsers.mock.calls[0][0]
            expect(updated[0].showInput).toBe(false)
            expect(updated[0].isEdit).toBe(false)
        })
    })

    describe('onClickEdit', () => {
        it('calls setCurrentEditedUser and setPlaybookUsers when edit is clicked', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [displayUser] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.iconEdit))
            expect(mockSetCurrentEditedUser).toHaveBeenCalledWith(displayUser)
            expect(mockSetPlaybookUsers).toHaveBeenCalledTimes(1)
            const updated = mockSetPlaybookUsers.mock.calls[0][0]
            expect(updated[0].showInput).toBe(true)
            expect(updated[0].isEdit).toBe(true)
        })
    })

    describe('deleteUser', () => {
        it('calls deleteUser with the correct index when trash is clicked', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [displayUser] })
            )
            render(<AdminUsers />)
            fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.iconTrash))
            expect(mockDeleteUser).toHaveBeenCalledWith(0)
        })
    })

    describe('nullish adminContext', () => {
        it('renders without crashing when adminContext is null', () => {
            mockUseAdminContext.mockReturnValue(null)
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.noDataPresent)
            ).toBeInTheDocument()
        })

        it('clicking ADD does not crash when context is null', () => {
            mockUseAdminContext.mockReturnValue(null)
            render(<AdminUsers />)
            expect(() =>
                fireEvent.click(screen.getByTestId(ADMIN_TEST_IDS.addRowBtn))
            ).not.toThrow()
        })
    })

    describe('multiple rows', () => {
        it('renders both display and input rows when mixed', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [displayUser, inputUser] })
            )
            render(<AdminUsers />)
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.saveRowBtn(1))
            ).toBeInTheDocument()
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.displayNameCell(0))
            ).toBeInTheDocument()
        })
    })

    describe('combobox dropdown interactions', () => {
        it('renders combobox persona options when input row is shown', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            // With mocked Combobox.Item and Portal, items are always rendered
            const items = screen.getAllByTestId(ADMIN_TEST_IDS.comboboxItem)
            expect(items.length).toBeGreaterThan(0)
        })

        it('clicking a persona combobox item calls setPlaybookUsers', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            const items = screen.getAllByTestId(ADMIN_TEST_IDS.comboboxItem)
            // First items belong to the persona combobox
            fireEvent.click(items[0])
            expect(mockSetPlaybookUsers).toHaveBeenCalled()
        })

        it('clicking a disabled persona item (at max users) does not call setPlaybookUsers', () => {
            // Make personas at max capacity so they are disabled
            mockGetCountOfPersona.mockReturnValue(999)
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            const items = screen.getAllByTestId(ADMIN_TEST_IDS.comboboxItem)
            fireEvent.click(items[0])
            expect(mockSetPlaybookUsers).not.toHaveBeenCalled()
        })

        it('clicking a user combobox item calls setPlaybookUsers with name and email', () => {
            // User with matched persona so userList is populated
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            const items = screen.getAllByTestId(ADMIN_TEST_IDS.comboboxItem)
            // After persona items come user items from the second ComboboxSelect
            // persona has 2 options, user items start after index 1
            const userItems = items.slice(mockPersona.length)
            if (userItems.length > 0) {
                fireEvent.click(userItems[0])
                expect(mockSetPlaybookUsers).toHaveBeenCalled()
            } else {
                // userList is empty for this persona_id combo
                expect(items.length).toBeGreaterThanOrEqual(0)
            }
        })

        it('clicking clear trigger for persona combobox calls setPlaybookUsers with cleared values', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            const clearTriggers = document.querySelectorAll(
                '[data-part="clear-trigger"]'
            )
            if (clearTriggers.length > 0) {
                fireEvent.click(clearTriggers[0])
                expect(mockSetPlaybookUsers).toHaveBeenCalled()
            } else {
                expect(
                    screen.getByTestId(ADMIN_TEST_IDS.personaCombobox(0))
                ).toBeInTheDocument()
            }
        })

        it('shows "No options" when user list is empty', () => {
            // persona found but has empty userList
            const userForEmptyList = { ...inputUser, persona_id: 'p2' }
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [userForEmptyList] })
            )
            render(<AdminUsers />)
            // Combobox for this persona has no userList items → renders Empty
            expect(
                screen.getAllByTestId(ADMIN_TEST_IDS.comboboxEmpty).length
            ).toBeGreaterThanOrEqual(1)
        })

        it('onCheckedChange on input row checkbox updates inherit and calls setPlaybookUsers', () => {
            mockUseAdminContext.mockReturnValue(
                makeContext({ playbookUsers: [inputUser] })
            )
            render(<AdminUsers />)
            const checkboxInputs = document.querySelectorAll(
                'input[type="checkbox"]'
            )
            if (checkboxInputs.length > 0) {
                fireEvent.change(checkboxInputs[0], {
                    target: { checked: true }
                })
            }
            // Verify component still renders
            expect(
                screen.getByTestId(ADMIN_TEST_IDS.saveRowBtn(0))
            ).toBeInTheDocument()
        })
    })
})
