import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UserAvatar } from './UserAvatar'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { render } from '@/test/utils/test-utils'
import { useUserAvatar } from '@/hooks'

jest.mock('@/hooks', () => ({
    useUserAvatar: jest.fn()
}))

describe('UserAvatar', () => {
    beforeEach(() => {
        useUserAvatar.mockReturnValue({
            avatarUrl: null,
            isLoading: false,
            error: null
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render avatar with fallback when email is not provided', () => {
        render(<UserAvatar name='Test User' />)

        const avatar = screen.getByText('TU')
        expect(avatar).toBeInTheDocument()
    })

    it('should render avatar with image when email is provided and single name', () => {
        const testEmail = 'test@test.com'
        const testName = 'Test User'
        useUserAvatar.mockReturnValue({
            avatarUrl: API_ENDPOINTS.GET_USER_ICON(testEmail),
            isLoading: false,
            error: null
        })

        render(<UserAvatar email={testEmail} name={testName} />)

        const avatarImage = screen.getByRole('img', { hidden: true })
        expect(avatarImage).toHaveAttribute(
            'src',
            API_ENDPOINTS.GET_USER_ICON(testEmail)
        )
    })

    it('should render avatar with badge when multiple names are provided', () => {
        const testEmail = 'test@test.com'
        const testName = 'Test User, Test user2'

        render(<UserAvatar email={testEmail} name={testName} />)

        const badge = screen.getByText('2')
        expect(badge).toBeInTheDocument()
    })
})
