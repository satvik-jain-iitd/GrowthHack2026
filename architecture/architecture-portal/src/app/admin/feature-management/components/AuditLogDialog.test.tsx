import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import { AuditLogDialog } from './AuditLogDialog'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'
import { AuditLogEntry } from '@/types/AuditLog'

const entries: AuditLogEntry[] = [
    {
        action: 'CREATE',
        details: 'Flag created',
        changedBy: 'alice@example.com',
        changedAt: '2024-01-01T10:00:00Z'
    },
    {
        action: 'UPDATE',
        details: 'Flag toggled on',
        changedBy: 'bob@example.com',
        changedAt: '2024-02-01T10:00:00Z'
    }
]

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    entries: [] as AuditLogEntry[],
    isLoading: false,
    title: 'Audit History: my-flag'
}

describe('AuditLogDialog', () => {
    beforeEach(() => jest.clearAllMocks())

    it('does not render dialog content when isOpen is false', () => {
        render(<AuditLogDialog {...defaultProps} isOpen={false} />)
        expect(
            screen.queryByTestId(FEATURE_MANAGEMENT_TEST_IDS.auditLogDialog)
        ).not.toBeInTheDocument()
    })

    it('renders the title when open', () => {
        render(<AuditLogDialog {...defaultProps} />)
        expect(screen.getByText('Audit History: my-flag')).toBeInTheDocument()
    })

    it('shows a spinner when loading', () => {
        render(<AuditLogDialog {...defaultProps} isLoading />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.auditLogLoading)
        ).toBeInTheDocument()
    })

    it('shows empty state when there are no entries and not loading', () => {
        render(<AuditLogDialog {...defaultProps} entries={[]} />)
        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.auditLogEmpty)
        ).toBeInTheDocument()
    })

    it('renders a table row per audit log entry', () => {
        render(<AuditLogDialog {...defaultProps} entries={entries} />)
        expect(screen.getByText('CREATE')).toBeInTheDocument()
        expect(screen.getByText('Flag created')).toBeInTheDocument()
        expect(screen.getByText('alice@example.com')).toBeInTheDocument()
        expect(screen.getByText('UPDATE')).toBeInTheDocument()
        expect(screen.getByText('Flag toggled on')).toBeInTheDocument()
        expect(screen.getByText('bob@example.com')).toBeInTheDocument()
        expect(
            screen.queryByTestId(FEATURE_MANAGEMENT_TEST_IDS.auditLogEmpty)
        ).not.toBeInTheDocument()
    })

    it('calls onClose when the close button is clicked', async () => {
        const user = userEvent.setup()
        const onClose = jest.fn()
        render(<AuditLogDialog {...defaultProps} onClose={onClose} />)
        await user.click(screen.getByRole('button', { name: /close/i }))
        expect(onClose).toHaveBeenCalledTimes(1)
    })
})
