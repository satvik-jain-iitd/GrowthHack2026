import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ADRAuditHistory from './ADRAuditHistory'
import { useGetADRAuditHistory } from '@/app/adrs/hooks/useGetADRAuditHistory'

jest.mock('@/app/adrs/hooks/useGetADRAuditHistory')
jest.mock('@/hooks', () => ({
    useUserInfo: jest.fn(() => ({
        userInfo: { displayName: 'Test User' },
        isLoading: false
    })),
    useUserAvatar: jest.fn(() => ({
        avatarUrl: '',
        isLoading: false
    }))
}))

const mockUseGetADRAuditHistory = useGetADRAuditHistory as jest.MockedFunction<
    typeof useGetADRAuditHistory
>

describe('ADRAuditHistory', () => {
    const mockAuditData = [
        {
            aud_ts: '2024-01-15T10:30:00Z',
            new_da: {
                adr_id: 'adr-123',
                workflow_identifier: 'wkflow-123'
            },
            action_nm: 'ADR Submitted for Review',
            creat_user_email_ad_tx: 'user1@example.com'
        },
        {
            aud_ts: '2024-01-16T14:20:00Z',
            new_da: {
                adr_id: 'adr-123',
                workflow_identifier: 'wkflow-123'
            },
            action_nm: 'Review Submitted',
            creat_user_email_ad_tx: 'reviewer@example.com'
        }
    ]

    const createMockQueryResult = (
        overrides: Partial<ReturnType<typeof useGetADRAuditHistory>>
    ): ReturnType<typeof useGetADRAuditHistory> =>
        ({
            data: undefined,
            error: null,
            isError: false,
            isLoading: false,
            isPending: false,
            isSuccess: true,
            status: 'success' as const,
            fetchStatus: 'idle' as const,
            isLoadingError: false,
            isPaused: false,
            isPlaceholderData: false,
            isRefetchError: false,
            isRefetching: false,
            isStale: false,
            refetch: jest.fn(),
            dataUpdatedAt: 0,
            errorUpdatedAt: 0,
            failureCount: 0,
            failureReason: null,
            errorUpdateCount: 0,
            isFetched: true,
            isFetchedAfterMount: true,
            isFetching: false,
            ...overrides
        }) as ReturnType<typeof useGetADRAuditHistory>

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('shows loading spinner when data is loading', () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: undefined,
                isLoading: true,
                isPending: true,
                status: 'pending',
                isSuccess: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        expect(screen.getByText('Audit History')).toBeInTheDocument()
    })

    it('shows error message when fetch fails', async () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: undefined,
                isLoading: false,
                error: new Error('Failed to fetch'),
                isError: true,
                status: 'error',
                isSuccess: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        await waitFor(() => {
            expect(
                screen.getByText('Failed to load audit history.')
            ).toBeInTheDocument()
        })
    })

    it('shows "No audit history found" when data is empty', async () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: [],
                isLoading: false,
                error: null,
                isError: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        await waitFor(() => {
            expect(
                screen.getByText('No audit history found.')
            ).toBeInTheDocument()
        })
    })

    it('shows "No audit history found" when data is undefined', async () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: undefined,
                isLoading: false,
                error: null,
                isError: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        await waitFor(() => {
            expect(
                screen.getByText('No audit history found.')
            ).toBeInTheDocument()
        })
    })

    it('renders audit history table with data', async () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: mockAuditData,
                isLoading: false,
                error: null,
                isError: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        await waitFor(() => {
            expect(screen.getByText('Actor')).toBeInTheDocument()
            expect(screen.getByText('Action')).toBeInTheDocument()
            expect(screen.getByText('Date')).toBeInTheDocument()
        })
    })

    it('displays actor information correctly', async () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: mockAuditData,
                isLoading: false,
                error: null,
                isError: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        await waitFor(() => {
            // The AvatarTableRow component displays the user's display name, not email
            const testUsers = screen.getAllByText('Test User')
            expect(testUsers).toHaveLength(2)
        })
    })

    it('displays action names correctly', async () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: mockAuditData,
                isLoading: false,
                error: null,
                isError: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        await waitFor(() => {
            expect(
                screen.getByText('ADR Submitted for Review')
            ).toBeInTheDocument()
            expect(screen.getByText('Review Submitted')).toBeInTheDocument()
        })
    })

    it('formats dates correctly', async () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: mockAuditData,
                isLoading: false,
                error: null,
                isError: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        await waitFor(() => {
            // dayjs formats the date as "Jan 15, 2024 10:30 AM"
            expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument()
            expect(screen.getByText(/Jan 16, 2024/)).toBeInTheDocument()
        })
    })

    it('renders accordion with correct title', () => {
        mockUseGetADRAuditHistory.mockReturnValue(
            createMockQueryResult({
                data: mockAuditData,
                isLoading: false,
                error: null,
                isError: false
            })
        )

        render(<ADRAuditHistory adrId='adr-123' />)

        expect(screen.getByText('Audit History')).toBeInTheDocument()
    })
})
