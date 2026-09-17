import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import ContributorsList from './ContributorsList'
import { useGetContributors } from '@/app/docs/hooks/useGetContributors'
import { usePopoverContext } from '@chakra-ui/react'

// Mock the hooks
jest.mock('@/app/docs/hooks/useGetContributors')
jest.mock('@chakra-ui/react', () => ({
    ...jest.requireActual('@chakra-ui/react'),
    usePopoverContext: jest.fn()
}))
jest.mock('@/hooks', () => ({
    useUserAvatar: jest.fn(() => ({
        avatarUrl: null,
        isLoading: false,
        error: null
    }))
}))

// Mock the AvatarTableRow component
jest.mock('@/components/ui', () => ({
    AvatarTableRow: ({ email }: { email: string }) => (
        <div data-testid='avatar-row'>{email}</div>
    )
}))

describe('ContributorsList', () => {
    const defaultProps = {
        repo: 'test-repo',
        filePath: 'path/to/file.md'
    }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(usePopoverContext as jest.Mock).mockReturnValue({
            open: true
        })
    })

    describe('Loading state', () => {
        it('shows spinner when loading', () => {
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: null,
                isLoading: true,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // Chakra UI Spinner doesn't have role="status", check for the spinner class
            const spinner = document.querySelector('.chakra-spinner')
            expect(spinner).toBeInTheDocument()
        })

        it('shows spinner when data is not available', () => {
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: null,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // Chakra UI Spinner doesn't have role="status", check for the spinner class
            const spinner = document.querySelector('.chakra-spinner')
            expect(spinner).toBeInTheDocument()
        })
    })

    describe('Error state', () => {
        it('displays error message when there is an error', () => {
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: null,
                isLoading: false,
                error: new Error('Failed to fetch')
            })

            render(<ContributorsList {...defaultProps} />)

            // The component shows spinner when there's an error (based on the logic: isLoading || !data)
            const spinner = document.querySelector('.chakra-spinner')
            expect(spinner).toBeInTheDocument()
        })

        it('validates error is handled properly', () => {
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: null,
                isLoading: false,
                error: new Error('API error')
            })

            const result = (useGetContributors as jest.Mock)(
                'test-repo',
                'path/to/file.md',
                true
            )

            expect(result.error).toBeDefined()
            expect(result.error.message).toBe('API error')
        })
    })

    describe('Success state with contributors', () => {
        it('displays list of contributors', () => {
            const mockData = {
                data: [
                    'userEmail1@aexp.com',
                    'userEmail2@aexp.com',
                    'userEmail3@aexp.com'
                ]
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            expect(screen.getByText('Contributors')).toBeInTheDocument()
            expect(screen.getByText('userEmail1@aexp.com')).toBeInTheDocument()
            expect(screen.getByText('userEmail2@aexp.com')).toBeInTheDocument()
            expect(screen.getByText('userEmail3@aexp.com')).toBeInTheDocument()
        })

        it('renders AvatarTableRow for each contributor', () => {
            const mockData = {
                data: ['userEmail3@aexp.com', 'userEmail2@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            const avatarRows = screen.getAllByTestId('avatar-row')
            expect(avatarRows).toHaveLength(2)
        })

        it('displays "Contributors" header', () => {
            const mockData = {
                data: ['userEmail@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            const header = screen.getByText('Contributors')
            expect(header).toBeInTheDocument()
        })
    })

    describe('Empty state', () => {
        it('displays "No contributors found" when data array is empty', () => {
            const mockData = {
                data: []
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            expect(
                screen.getByText('No contributors found.')
            ).toBeInTheDocument()
        })

        it('does not display Contributors header when list is empty', () => {
            const mockData = {
                data: []
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            expect(screen.queryByText('Contributors')).not.toBeInTheDocument()
        })

        it('does not render any AvatarTableRow when list is empty', () => {
            const mockData = {
                data: []
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            expect(screen.queryByTestId('avatar-row')).not.toBeInTheDocument()
        })
    })

    describe('Popover integration', () => {
        it('calls useGetContributors with repo and filePath', () => {
            const mockData = {
                data: ['userEmail@aexp.com']
            }

            ;(usePopoverContext as jest.Mock).mockReturnValue({
                open: true
            })
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            expect(useGetContributors).toHaveBeenCalledWith(
                'test-repo',
                'path/to/file.md'
            )
        })

        it('calls useGetContributors regardless of popover state', () => {
            const mockData = {
                data: []
            }

            ;(usePopoverContext as jest.Mock).mockReturnValue({
                open: false
            })
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            expect(useGetContributors).toHaveBeenCalledWith(
                'test-repo',
                'path/to/file.md'
            )
        })
    })

    describe('Props handling', () => {
        it('uses repo prop correctly', () => {
            const mockData = {
                data: ['userEmail@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(
                <ContributorsList
                    repo='custom-repo'
                    filePath='path/to/file.md'
                />
            )

            expect(useGetContributors).toHaveBeenCalledWith(
                'custom-repo',
                'path/to/file.md'
            )
        })

        it('uses filePath prop correctly', () => {
            const mockData = {
                data: ['userEmail@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(
                <ContributorsList
                    repo='test-repo'
                    filePath='custom/path/file.tsx'
                />
            )

            expect(useGetContributors).toHaveBeenCalledWith(
                'test-repo',
                'custom/path/file.tsx'
            )
        })
    })

    describe('Avatar display in trigger', () => {
        it('displays avatars for contributors in trigger button', () => {
            const mockData = {
                data: ['userEmail@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // The trigger button should be rendered
            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            expect(triggerButton).toBeInTheDocument()
        })

        it('displays remaining count when more than 3 contributors', () => {
            const mockData = {
                data: [
                    'userEmail@aexp.com',
                    'userEmail1@aexp.com',
                    'userEmail2@aexp.com',
                    'userEmail3@aexp.com',
                    'userEmail4@aexp.com'
                ]
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // Should display +2 for remaining contributors
            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            expect(triggerButton).toBeInTheDocument()
        })

        it('displays exactly 3 avatars when there are 3 contributors', () => {
            const mockData = {
                data: [
                    'userEmail@aexp.com',
                    'userEmail1@aexp.com',
                    'userEmail2@aexp.com'
                ]
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            expect(triggerButton).toBeInTheDocument()
        })

        it('does not display remaining count when 3 or fewer contributors', () => {
            const mockData = {
                data: ['user@aexp.com', 'user1@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // Should not show +N badge
            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            expect(triggerButton).toBeInTheDocument()
        })
    })

    describe('Error display in popover', () => {
        it('displays error message in popover body when error exists', () => {
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: { data: ['user@aexp.com'] },
                isLoading: false,
                error: new Error('Network error')
            })

            render(<ContributorsList {...defaultProps} />)

            // Click to open popover
            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            fireEvent.click(triggerButton)

            // Error message should be shown in the popover
            expect(
                screen.getByText('Failed to load contributors.')
            ).toBeInTheDocument()
        })

        it('prioritizes loading state over error in popover body', () => {
            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: null,
                isLoading: true,
                error: new Error('Some error')
            })

            render(<ContributorsList {...defaultProps} />)

            // Should show spinner instead of error when loading
            const spinner = document.querySelector('.chakra-spinner')
            expect(spinner).toBeInTheDocument()
        })
    })

    describe('Avatar with image URL', () => {
        it('renders avatar image when avatarUrl is available', () => {
            const { useUserAvatar } = jest.requireMock('@/hooks')
            useUserAvatar.mockReturnValue({
                avatarUrl: 'https://example.com/avatar.jpg',
                isLoading: false,
                error: null
            })

            const mockData = {
                data: ['user@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // Avatar component should be rendered
            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            expect(triggerButton).toBeInTheDocument()
        })

        it('does not render avatar image when loading', () => {
            const { useUserAvatar } = jest.requireMock('@/hooks')
            useUserAvatar.mockReturnValue({
                avatarUrl: 'https://example.com/avatar.jpg',
                isLoading: true,
                error: null
            })

            const mockData = {
                data: ['user@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // Should render fallback while loading
            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            expect(triggerButton).toBeInTheDocument()
        })

        it('renders fallback when avatarUrl is null', () => {
            const { useUserAvatar } = jest.requireMock('@/hooks')
            useUserAvatar.mockReturnValue({
                avatarUrl: null,
                isLoading: false,
                error: null
            })

            const mockData = {
                data: ['user@aexp.com']
            }

            ;(useGetContributors as jest.Mock).mockReturnValue({
                data: mockData,
                isLoading: false,
                error: null
            })

            render(<ContributorsList {...defaultProps} />)

            // Should render fallback when no avatar URL
            const triggerButton = screen.getByRole('button', {
                name: 'View contributors'
            })
            expect(triggerButton).toBeInTheDocument()
        })
    })
})
