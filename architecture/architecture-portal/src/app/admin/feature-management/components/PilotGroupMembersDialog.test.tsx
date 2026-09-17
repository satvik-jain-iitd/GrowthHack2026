import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'
import { render } from '@/test/utils/test-utils'
import { PilotGroupMembersDialog } from './PilotGroupMembersDialog'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'

const mockAddMembersMutate = jest.fn()
const mockRemoveMembersMutate = jest.fn()

jest.mock('@/hooks', () => ({
    useAddPilotGroupMembers: () => ({ mutate: mockAddMembersMutate }),
    useRemovePilotGroupMembers: () => ({ mutate: mockRemoveMembersMutate })
}))

jest.mock('@/components/ui', () => ({
    AvatarTableRow: ({ email }: { email: string }) => (
        <div data-testid='avatar-table-row'>{email}</div>
    )
}))

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}))

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    groupId: 'g1',
    groupName: 'Group One',
    members: ['alice@example.com']
}

describe('PilotGroupMembersDialog', () => {
    beforeEach(() => jest.clearAllMocks())

    it('does not render when isOpen is false', () => {
        render(<PilotGroupMembersDialog {...defaultProps} isOpen={false} />)
        expect(
            screen.queryByTestId(FEATURE_MANAGEMENT_TEST_IDS.membersDialog)
        ).not.toBeInTheDocument()
    })

    it('renders the group name and current members', () => {
        render(<PilotGroupMembersDialog {...defaultProps} />)
        expect(
            screen.getByText('Manage Members: Group One')
        ).toBeInTheDocument()
        expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    })

    it('shows "No members yet." when the group has no members', () => {
        render(<PilotGroupMembersDialog {...defaultProps} members={[]} />)
        expect(screen.getByText('No members yet.')).toBeInTheDocument()
    })

    it('the Add button is disabled until an email is entered', () => {
        render(<PilotGroupMembersDialog {...defaultProps} />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.memberAddBtn)
        ).toBeDisabled()
    })

    it('adds a typed email as a tag and enables the Add button', async () => {
        const user = userEvent.setup()
        render(<PilotGroupMembersDialog {...defaultProps} />)

        await user.type(
            screen.getByPlaceholderText('Type an email and press Enter'),
            'new@example.com{Enter}'
        )

        expect(screen.getByText('new@example.com')).toBeInTheDocument()
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.memberAddBtn)
        ).toBeEnabled()
    })

    it('clicking Add calls addMembers.mutate with the entered emails and shows a success toast', async () => {
        const user = userEvent.setup()
        mockAddMembersMutate.mockImplementation((_vars, opts) =>
            opts.onSuccess()
        )
        render(<PilotGroupMembersDialog {...defaultProps} />)

        await user.type(
            screen.getByPlaceholderText('Type an email and press Enter'),
            'new@example.com{Enter}'
        )
        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.memberAddBtn)
        )

        expect(mockAddMembersMutate).toHaveBeenCalledWith(
            { groupId: 'g1', memberEmails: ['new@example.com'] },
            expect.any(Object)
        )
        expect(toast.success).toHaveBeenCalledWith('Added members to Group One')
    })

    it('shows an error toast when adding members fails', async () => {
        const user = userEvent.setup()
        mockAddMembersMutate.mockImplementation((_vars, opts) => opts.onError())
        render(<PilotGroupMembersDialog {...defaultProps} />)

        await user.type(
            screen.getByPlaceholderText('Type an email and press Enter'),
            'new@example.com{Enter}'
        )
        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.memberAddBtn)
        )

        expect(toast.error).toHaveBeenCalledWith('Failed to add members')
    })

    it('removing a member calls removeMembers.mutate and shows a success toast', async () => {
        const user = userEvent.setup()
        mockRemoveMembersMutate.mockImplementation((_vars, opts) =>
            opts.onSuccess()
        )
        render(<PilotGroupMembersDialog {...defaultProps} />)

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.memberRemoveBtn('alice@example.com')
            )
        )

        expect(mockRemoveMembersMutate).toHaveBeenCalledWith(
            { groupId: 'g1', memberEmails: ['alice@example.com'] },
            expect.any(Object)
        )
        expect(toast.success).toHaveBeenCalledWith(
            'Removed alice@example.com from Group One'
        )
    })

    it('shows an error toast when removing a member fails', async () => {
        const user = userEvent.setup()
        mockRemoveMembersMutate.mockImplementation((_vars, opts) =>
            opts.onError()
        )
        render(<PilotGroupMembersDialog {...defaultProps} />)

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.memberRemoveBtn('alice@example.com')
            )
        )

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to remove alice@example.com'
        )
    })

    it('calls onClose when the Close button is clicked', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(<PilotGroupMembersDialog {...defaultProps} onClose={onClose} />)

        const closeTextButton = screen.getByText('Close').closest('button')
        await user.click(closeTextButton as HTMLButtonElement)
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose via the dialog close (X) trigger', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(<PilotGroupMembersDialog {...defaultProps} onClose={onClose} />)

        const closeTrigger = document.querySelector(
            '[data-part="close-trigger"]'
        )
        await user.click(closeTrigger as HTMLButtonElement)
        expect(onClose).toHaveBeenCalledTimes(1)
    })
})
