import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { TBMMappingGuard } from './TBMMappingGuard'

const mockUseUserContext = jest.fn()
const mockUseAuthBlueSso = jest.fn()

jest.mock('@/context/UserContext', () => ({
    useUserContext: () => mockUseUserContext()
}))

jest.mock('use-authblue-sso', () => ({
    useAuthBlueSso: () => mockUseAuthBlueSso()
}))

jest.mock('./AccessDeniedState', () => ({
    AccessDeniedState: () => (
        <div data-testid='access-denied-state'>Access Denied</div>
    )
}))

jest.mock('./CapabilityLoadingSpinner', () => ({
    CapabilityLoadingSpinner: () => (
        <div data-testid='loading-spinner'>Loading...</div>
    )
}))

describe('TBMMappingGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('shows loading spinner when auth is loading', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: false })
        mockUseUserContext.mockReturnValue({ groups: [] })

        render(
            <TBMMappingGuard>
                <div data-testid='child-content'>Protected Content</div>
            </TBMMappingGuard>
        )

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
        expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
        expect(
            screen.queryByTestId('access-denied-state')
        ).not.toBeInTheDocument()
    })

    it('shows children when user has TBM allowed group', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({
            groups: ['GG-Apptio-Target-Process-Central-Financial-Planning']
        })

        render(
            <TBMMappingGuard>
                <div data-testid='child-content'>Protected Content</div>
            </TBMMappingGuard>
        )

        expect(screen.getByTestId('child-content')).toBeInTheDocument()
        expect(
            screen.queryByTestId('access-denied-state')
        ).not.toBeInTheDocument()
    })

    it('shows children when user is admin', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({
            groups: ['GG-AXP-ARCH-PORTAL-ADMIN']
        })

        render(
            <TBMMappingGuard>
                <div data-testid='child-content'>Protected Content</div>
            </TBMMappingGuard>
        )

        expect(screen.getByTestId('child-content')).toBeInTheDocument()
    })

    it('shows access denied when user has no matching groups', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({ groups: ['SomeOtherGroup'] })

        render(
            <TBMMappingGuard>
                <div data-testid='child-content'>Protected Content</div>
            </TBMMappingGuard>
        )

        expect(screen.getByTestId('access-denied-state')).toBeInTheDocument()
        expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
    })

    it('shows access denied when user has no groups', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({ groups: [] })

        render(
            <TBMMappingGuard>
                <div data-testid='child-content'>Protected Content</div>
            </TBMMappingGuard>
        )

        expect(screen.getByTestId('access-denied-state')).toBeInTheDocument()
    })

    it('shows access denied when groups is undefined', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({})

        render(
            <TBMMappingGuard>
                <div data-testid='child-content'>Protected Content</div>
            </TBMMappingGuard>
        )

        expect(screen.getByTestId('access-denied-state')).toBeInTheDocument()
    })
})
