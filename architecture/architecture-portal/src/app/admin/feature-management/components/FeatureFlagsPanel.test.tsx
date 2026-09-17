import React from 'react'
import '@testing-library/jest-dom'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'
import { render } from '@/test/utils/test-utils'
import { FeatureFlagsPanel } from './FeatureFlagsPanel'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'
import { FeatureFlag } from '@/types/FeatureFlag'

const mockUseFeatureFlags = jest.fn()
const mockUseFeatureFlagAuditLogs = jest.fn()
const mockSetFeatureFlagMutate = jest.fn()
const mockDeleteFeatureFlagMutate = jest.fn()

jest.mock('@/hooks', () => ({
    useFeatureFlags: () => mockUseFeatureFlags(),
    useSetFeatureFlag: () => ({ mutate: mockSetFeatureFlagMutate }),
    useDeleteFeatureFlag: () => ({ mutate: mockDeleteFeatureFlagMutate }),
    useFeatureFlagAuditLogs: (name: string) => mockUseFeatureFlagAuditLogs(name)
}))

jest.mock('@/components/ui', () => ({
    AvatarTableRow: ({ email }: { email: string }) => (
        <div data-testid='avatar-table-row'>{email}</div>
    )
}))

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}))

const flags: FeatureFlag[] = [
    {
        name: 'my-flag',
        value: true,
        lastEditedBy: 'alice@example.com',
        lastEditedOn: '2024-01-01T10:00:00Z'
    },
    {
        name: 'other-flag',
        value: false,
        lastEditedBy: '',
        lastEditedOn: ''
    }
]

describe('FeatureFlagsPanel', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseFeatureFlagAuditLogs.mockReturnValue({
            data: [],
            isLoading: false
        })
    })

    it('shows a spinner while loading', () => {
        mockUseFeatureFlags.mockReturnValue({ data: [], isLoading: true })
        render(<FeatureFlagsPanel />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.flagsLoading)
        ).toBeInTheDocument()
    })

    it('shows empty state when there are no flags', () => {
        mockUseFeatureFlags.mockReturnValue({ data: [], isLoading: false })
        render(<FeatureFlagsPanel />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.flagsEmpty)
        ).toBeInTheDocument()
    })

    it('renders a row per feature flag with name, status, and edited metadata', () => {
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        render(<FeatureFlagsPanel />)
        expect(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.flagNameCell('my-flag')
            )
        ).toHaveTextContent('my-flag')
        expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    })

    it('does not render an avatar when lastEditedBy is empty', () => {
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        render(<FeatureFlagsPanel />)
        const avatars = screen.getAllByTestId('avatar-table-row')
        expect(avatars).toHaveLength(1)
    })

    it('toggling a flag to off calls setFeatureFlag.mutate with the correct value', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        mockSetFeatureFlagMutate.mockImplementation((_vars, opts) =>
            opts.onSuccess()
        )
        render(<FeatureFlagsPanel />)

        const statusCell = screen.getByTestId(
            FEATURE_MANAGEMENT_TEST_IDS.flagValueSwitch('my-flag')
        )
        await user.click(within(statusCell).getByRole('radio', { name: 'Off' }))

        expect(mockSetFeatureFlagMutate).toHaveBeenCalledWith(
            { name: 'my-flag', value: false },
            expect.any(Object)
        )
        expect(toast.success).toHaveBeenCalledWith(
            'Feature flag "my-flag" updated'
        )
    })

    it('shows an error toast when toggling a flag fails', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        mockSetFeatureFlagMutate.mockImplementation((_vars, opts) =>
            opts.onError()
        )
        render(<FeatureFlagsPanel />)

        const statusCell = screen.getByTestId(
            FEATURE_MANAGEMENT_TEST_IDS.flagValueSwitch('my-flag')
        )
        await user.click(within(statusCell).getByRole('radio', { name: 'Off' }))

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to update feature flag "my-flag"'
        )
    })

    it('deleting a flag calls deleteFeatureFlag.mutate and shows a success toast', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        mockDeleteFeatureFlagMutate.mockImplementation((_vars, opts) =>
            opts.onSuccess()
        )
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.flagDeleteBtn('my-flag')
            )
        )

        expect(mockDeleteFeatureFlagMutate).toHaveBeenCalledWith(
            { name: 'my-flag' },
            expect.any(Object)
        )
        expect(toast.success).toHaveBeenCalledWith(
            'Feature flag "my-flag" deleted'
        )
    })

    it('shows an error toast when deleting a flag fails', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        mockDeleteFeatureFlagMutate.mockImplementation((_vars, opts) =>
            opts.onError()
        )
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.flagDeleteBtn('my-flag')
            )
        )

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to delete feature flag "my-flag"'
        )
    })

    it('opens the audit history dialog for the clicked flag', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.flagHistoryBtn('my-flag')
            )
        )

        expect(screen.getByText('Audit History: my-flag')).toBeInTheDocument()
    })

    it('setting the initial status to On before adding sends value true', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: [], isLoading: false })
        mockSetFeatureFlagMutate.mockImplementation((_vars, opts) =>
            opts.onSuccess()
        )
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagTriggerBtn)
        )
        await user.type(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagNameInput),
            'new-flag'
        )
        const statusGroup = screen.getByTestId(
            FEATURE_MANAGEMENT_TEST_IDS.addFlagValueSwitch
        )
        await user.click(within(statusGroup).getByRole('radio', { name: 'On' }))
        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagBtn)
        )

        expect(mockSetFeatureFlagMutate).toHaveBeenCalledWith(
            { name: 'new-flag', value: true },
            expect.any(Object)
        )
    })

    it('does not create a flag when the name is blank or whitespace', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: [], isLoading: false })
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagTriggerBtn)
        )
        await user.type(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagNameInput),
            '   '
        )
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagBtn)
        ).toBeDisabled()
        expect(mockSetFeatureFlagMutate).not.toHaveBeenCalled()
    })

    it('shows an error toast when creating a flag fails', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: [], isLoading: false })
        mockSetFeatureFlagMutate.mockImplementation((_vars, opts) =>
            opts.onError()
        )
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagTriggerBtn)
        )
        await user.type(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagNameInput),
            'new-flag'
        )
        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagBtn)
        )

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to create feature flag'
        )
    })

    it('closes the add dialog via its own close button', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: [], isLoading: false })
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.addFlagTriggerBtn)
        )
        const dialog = await screen.findByTestId(
            FEATURE_MANAGEMENT_TEST_IDS.addFlagDialog
        )
        await user.click(within(dialog).getByRole('button', { name: /close/i }))

        await waitFor(() => {
            expect(dialog).toHaveAttribute('data-state', 'closed')
        })
    })

    it('closes the audit history dialog via its own close button', async () => {
        const user = userEvent.setup()
        mockUseFeatureFlags.mockReturnValue({ data: flags, isLoading: false })
        render(<FeatureFlagsPanel />)

        await user.click(
            screen.getByTestId(
                FEATURE_MANAGEMENT_TEST_IDS.flagHistoryBtn('my-flag')
            )
        )
        expect(screen.getByText('Audit History: my-flag')).toBeInTheDocument()

        const historyDialog = screen.getByTestId(
            FEATURE_MANAGEMENT_TEST_IDS.auditLogDialog
        )
        await user.click(
            within(historyDialog).getByRole('button', { name: /close/i })
        )

        await waitFor(() => {
            expect(historyDialog).toHaveAttribute('data-state', 'closed')
        })
    })
})
