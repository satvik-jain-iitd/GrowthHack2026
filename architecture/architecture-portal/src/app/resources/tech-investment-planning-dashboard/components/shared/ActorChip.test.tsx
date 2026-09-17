import { render, screen } from '@/test/utils/test-utils'
import { ActorChip } from '@/app/resources/tech-investment-planning-dashboard/components/shared/ActorChip'

jest.mock('@/hooks/useUserInfo', () => ({
    useUserInfo: jest.fn(() => ({
        userInfo: null,
        isLoading: false,
        error: null
    }))
}))

jest.mock('@/constants/apiEndpoints', () => ({
    API_ENDPOINTS: {
        GET_USER_ICON: (email: string) => `/mock-icon/${email}`
    }
}))

import { useUserInfo } from '@/hooks/useUserInfo'
const mockUseUserInfo = useUserInfo as jest.Mock

describe('ActorChip', () => {
    beforeEach(() => {
        mockUseUserInfo.mockReturnValue({
            userInfo: null,
            isLoading: false,
            error: null
        })
    })

    describe('chip variant (default)', () => {
        it('shows email as fallback when userInfo is null', () => {
            render(<ActorChip email='user@example.com' />)
            expect(screen.getByText('user@example.com')).toBeInTheDocument()
        })

        it('shows displayName when userInfo is resolved', () => {
            mockUseUserInfo.mockReturnValue({
                userInfo: {
                    displayName: 'John Doe',
                    userId: '1',
                    jobTitle: '',
                    userPrincipalName: 'user@example.com'
                },
                isLoading: false,
                error: null
            })
            render(<ActorChip email='user@example.com' />)
            expect(screen.getByText('John Doe')).toBeInTheDocument()
        })
    })

    describe('avatar-only variant', () => {
        it('does not show name text in DOM', () => {
            mockUseUserInfo.mockReturnValue({
                userInfo: {
                    displayName: 'Jane Doe',
                    userId: '2',
                    jobTitle: '',
                    userPrincipalName: 'jane@example.com'
                },
                isLoading: false,
                error: null
            })
            render(<ActorChip email='jane@example.com' variant='avatar-only' />)
            expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
        })
    })

    describe('activity variant', () => {
        it('shows displayName and email sub-label when they differ', () => {
            mockUseUserInfo.mockReturnValue({
                userInfo: {
                    displayName: 'John Doe',
                    userId: '1',
                    jobTitle: '',
                    userPrincipalName: 'john@example.com'
                },
                isLoading: false,
                error: null
            })
            render(<ActorChip email='john@example.com' variant='activity' />)
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.getByText('john@example.com')).toBeInTheDocument()
        })

        it('omits email when displayName equals email', () => {
            mockUseUserInfo.mockReturnValue({
                userInfo: {
                    displayName: 'john@example.com',
                    userId: '1',
                    jobTitle: '',
                    userPrincipalName: 'john@example.com'
                },
                isLoading: false,
                error: null
            })
            render(<ActorChip email='john@example.com' variant='activity' />)
            expect(screen.getByText('john@example.com')).toBeInTheDocument()
            // email sub-label should not appear twice
            expect(screen.getAllByText('john@example.com')).toHaveLength(1)
        })
    })
})
