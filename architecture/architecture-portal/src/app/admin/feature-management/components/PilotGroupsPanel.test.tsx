import React from 'react'
import '@testing-library/jest-dom'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'
import { render } from '@/test/utils/test-utils'
import { PilotGroupsPanel } from './PilotGroupsPanel'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'
import { PilotGroup } from '@/types/PilotGroup'

const mockUsePilotGroups = jest.fn()
const mockUsePilotGroupAuditLogs = jest.fn()
const mockCreatePilotGroupMutate = jest.fn()
const mockDeletePilotGroupMutate = jest.fn()

jest.mock('@/hooks', () => ({
    usePilotGroups: () => mockUsePilotGroups(),
    useCreatePilotGroup: () => ({ mutate: mockCreatePilotGroupMutate }),
    useDeletePilotGroup: () => ({ mutate: mockDeletePilotGroupMutate }),
    usePilotGroupAuditLogs: (id: string) => mockUsePilotGroupAuditLogs(id)
}))

jest.mock('@/components/ui', () => ({
    AvatarTableRow: ({ email }: { email: string }) => (
        <div data-testid='avatar-table-row'>{email}</div>
    )
}))

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}))

jest.mock('./AuditLogDialog', () => ({
    AuditLogDialog: ({ isOpen, title }: { isOpen: boolean; title: string }) =>
        isOpen ? <div data-testid='audit-log-dialog'>{title}</div> : null
}))

jest.mock('./PilotGroupMembersDialog', () => ({
    PilotGroupMembersDialog: ({
        isOpen,
        groupName,
        members
    }: {
        isOpen: boolean
        groupName: string
        members: string[]
    }) =>
        isOpen ? (
            <div data-testid='members-dialog'>
                {groupName} - {members.length} members
            </div>
        ) : null
}))

const groups: PilotGroup[] = [
    {
        group_id: 'g1',
        group_nm: 'Group One',
        members: ['a@example.com', 'b@example.com'],
        created_on_ts: '2024-01-01T00:00:00Z',
        last_edited_by: 'alice@example.com',
        last_edited_on_ts: '2024-01-02T10:00:00Z'
    },
    {
        group_id: 'g2',
        group_nm: 'Group Two',
        members: undefined as unknown as string[],
        created_on_ts: '2024-01-01T00:00:00Z',
        last_edited_by: '',
        last_edited_on_ts: ''
    }
]

describe('PilotGroupsPanel', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUsePilotGroupAuditLogs.mockReturnValue({
            data: [],
            isLoading: false
        })
    })

    it('shows a spinner while loading', () => {
        mockUsePilotGroups.mockReturnValue({ data: [], isLoading: true })
        render(<PilotGroupsPanel />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.groupsLoading)
        ).toBeInTheDocument()
    })

    it('shows empty state when there are no groups', () => {
        mockUsePilotGroups.mockReturnValue({ data: [], isLoading: false })
        render(<PilotGroupsPanel />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.groupsEmpty)
        ).toBeInTheDocument()
    })

    it('renders a row per group with name, member count, and edited metadata', () => {
        mockUsePilotGroups.mockReturnValue({ data: groups, isLoading: false })
        render(<PilotGroupsPanel />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.groupNameCell('g1'))
        ).toHaveTextContent('Group One')
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    })

    it('shows 0 members and no avatar when members/last_edited_by are missing', () => {
        mockUsePilotGroups.mockReturnValue({ data: groups, isLoading: false })
        render(<PilotGroupsPanel />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.groupNameCell('g2'))
        ).toHaveTextContent('Group Two')
        expect(screen.getAllByTestId('avatar-table-row')).toHaveLength(1)
    })

    it('opens the members dialog for the clicked group', async () => {
        const user = userEvent.setup()
        mockUsePilotGroups.mockReturnValue({ data: groups, isLoading: false })
        render(<PilotGroupsPanel />)

        expect(screen.queryByTestId('members-dialog')).not.toBeInTheDocument()

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.groupMembersBtn('g1')
            )
        )

        expect(screen.getByTestId('members-dialog')).toHaveTextContent(
            'Group One - 2 members'
        )
    })

    it('opens the audit history dialog for the clicked group', async () => {
        const user = userEvent.setup()
        mockUsePilotGroups.mockReturnValue({ data: groups, isLoading: false })
        render(<PilotGroupsPanel />)

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.groupHistoryBtn('g1')
            )
        )

        expect(screen.getByTestId('audit-log-dialog')).toHaveTextContent(
            'Audit History: Group One'
        )
    })

    it('deleting a group calls deletePilotGroup.mutate and shows a success toast', async () => {
        const user = userEvent.setup()
        mockUsePilotGroups.mockReturnValue({ data: groups, isLoading: false })
        mockDeletePilotGroupMutate.mockImplementation((_vars, opts) =>
            opts.onSuccess()
        )
        render(<PilotGroupsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.groupDeleteBtn('g1'))
        )

        expect(mockDeletePilotGroupMutate).toHaveBeenCalledWith(
            { groupId: 'g1' },
            expect.any(Object)
        )
        expect(toast.success).toHaveBeenCalledWith(
            'Pilot group "Group One" deleted'
        )
    })

    it('shows an error toast when deleting a group fails', async () => {
        const user = userEvent.setup()
        mockUsePilotGroups.mockReturnValue({ data: groups, isLoading: false })
        mockDeletePilotGroupMutate.mockImplementation((_vars, opts) =>
            opts.onError()
        )
        render(<PilotGroupsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.groupDeleteBtn('g1'))
        )

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to delete pilot group "Group One"'
        )
    })

    it('does not create a group when the name is blank or whitespace', async () => {
        const user = userEvent.setup()
        mockUsePilotGroups.mockReturnValue({ data: [], isLoading: false })
        render(<PilotGroupsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addGroupTriggerBtn)
        )
        await user.type(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addGroupNameInput),
            '   '
        )
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addGroupBtn)
        ).toBeDisabled()
        expect(mockCreatePilotGroupMutate).not.toHaveBeenCalled()
    })

    it('shows an error toast when creating a group fails', async () => {
        const user = userEvent.setup()
        mockUsePilotGroups.mockReturnValue({ data: [], isLoading: false })
        mockCreatePilotGroupMutate.mockImplementation((_vars, opts) =>
            opts.onError()
        )
        render(<PilotGroupsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addGroupTriggerBtn)
        )
        await user.type(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addGroupNameInput),
            'New Group'
        )
        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addGroupBtn)
        )

        expect(toast.error).toHaveBeenCalledWith('Failed to create pilot group')
    })

    it('closes the add dialog via its own close button', async () => {
        const user = userEvent.setup()
        mockUsePilotGroups.mockReturnValue({ data: [], isLoading: false })
        render(<PilotGroupsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addGroupTriggerBtn)
        )
        const dialog = await screen.findByTestId(
            FEATURE_MANAGEMENT_TEST_IDS.addGroupDialog
        )
        await user.click(within(dialog).getByRole('button', { name: /close/i }))

        await waitFor(() => {
            expect(dialog).toHaveAttribute('data-state', 'closed')
        })
    })
})
