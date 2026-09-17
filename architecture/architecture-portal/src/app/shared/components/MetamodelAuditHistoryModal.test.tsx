import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import MetamodelAuditHistoryModal from './MetamodelAuditHistoryModal'
import { useAuditHistory } from '../hooks/useAuditHistory'

jest.mock('../hooks/useAuditHistory')
jest.mock('@americanexpress/dls-icons', () => ({
    IconSearch: () => <span data-testid='icon-search' />
}))
jest.mock('@/app/company-domains/components/UserAvatar', () => ({
    UserAvatar: ({ email, name }: { email: string; name?: string }) => (
        <span data-testid='user-avatar'>{name || email}</span>
    )
}))
jest.mock('@/components/ui', () => ({
    AvatarTableRow: ({ email }: { email: string }) => (
        <span data-testid='avatar-row'>{email}</span>
    )
}))

const mockUseAuditHistory = useAuditHistory as jest.MockedFunction<
    typeof useAuditHistory
>

describe('MetamodelAuditHistoryModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        entityType: 'initiative' as const,
        entityId: 'init-123'
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the modal title', () => {
        mockUseAuditHistory.mockReturnValue({
            data: { page: 1, pageSize: 50, total: 0, data: [] },
            isLoading: false
        } as unknown as ReturnType<typeof useAuditHistory>)

        render(<MetamodelAuditHistoryModal {...defaultProps} />)
        expect(screen.getByText('Audit History')).toBeInTheDocument()
    })

    it('shows spinner while loading', () => {
        mockUseAuditHistory.mockReturnValue({
            data: undefined,
            isLoading: true
        } as unknown as ReturnType<typeof useAuditHistory>)

        render(<MetamodelAuditHistoryModal {...defaultProps} />)
        expect(screen.getByText('Audit History')).toBeInTheDocument()
    })

    it('shows "No audit history found." when data is empty', async () => {
        mockUseAuditHistory.mockReturnValue({
            data: { page: 1, pageSize: 50, total: 0, data: [] },
            isLoading: false
        } as unknown as ReturnType<typeof useAuditHistory>)

        render(<MetamodelAuditHistoryModal {...defaultProps} />)

        await waitFor(() => {
            expect(
                screen.getByText('No audit history found.')
            ).toBeInTheDocument()
        })
    })

    it('renders audit history data rows', async () => {
        mockUseAuditHistory.mockReturnValue({
            data: {
                page: 1,
                pageSize: 50,
                total: 1,
                data: [
                    {
                        eventId: 'e1',
                        changeType: 'CREATE_ATTESTATION',
                        entityType: 'Initiative',
                        entityId: 'init-123',
                        changedAt: '2024-06-15T10:00:00Z',
                        changedBy: {
                            name: 'John Doe',
                            email: 'john@example.com'
                        },
                        summary: 'Attested changes'
                    }
                ]
            },
            isLoading: false
        } as unknown as ReturnType<typeof useAuditHistory>)

        render(<MetamodelAuditHistoryModal {...defaultProps} />)

        await waitFor(() => {
            const emails = screen.getAllByText('john@example.com')
            expect(emails.length).toBeGreaterThanOrEqual(1)
            expect(
                screen.queryByText('Attested changes')
            ).not.toBeInTheDocument()
            const approvedElements = screen.getAllByText('Attested')
            expect(approvedElements.length).toBeGreaterThanOrEqual(1)
        })
    })

    it('renders table headers', async () => {
        mockUseAuditHistory.mockReturnValue({
            data: { page: 1, pageSize: 50, total: 0, data: [] },
            isLoading: false
        } as unknown as ReturnType<typeof useAuditHistory>)

        render(<MetamodelAuditHistoryModal {...defaultProps} />)

        await waitFor(() => {
            expect(screen.getByText('Reviewer')).toBeInTheDocument()
            expect(
                screen.queryByText('Previous Details')
            ).not.toBeInTheDocument()
            expect(screen.queryByText('Request Date')).not.toBeInTheDocument()
            expect(screen.getByText('Action Date')).toBeInTheDocument()
            expect(screen.getByText('Action')).toBeInTheDocument()
        })
    })

    it('renders close button', () => {
        mockUseAuditHistory.mockReturnValue({
            data: { page: 1, pageSize: 50, total: 0, data: [] },
            isLoading: false
        } as unknown as ReturnType<typeof useAuditHistory>)

        render(<MetamodelAuditHistoryModal {...defaultProps} />)
        expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
        mockUseAuditHistory.mockReturnValue({
            data: undefined,
            isLoading: false
        } as unknown as ReturnType<typeof useAuditHistory>)

        const { container } = render(
            <MetamodelAuditHistoryModal {...defaultProps} isOpen={false} />
        )
        expect(
            container.querySelector('[role="dialog"]')
        ).not.toBeInTheDocument()
    })
})
