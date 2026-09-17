import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { NavigationProvider } from '@/context'
import { FeatureManagementGuard } from './FeatureManagementGuard'
import { FEATURE_MANAGEMENT_TEST_IDS } from '../test-ids'

const mockUseUserContext = jest.fn()
const mockUseAuthBlueSso = jest.fn()

jest.mock('@/context/UserContext', () => ({
    useUserContext: () => mockUseUserContext()
}))

jest.mock('use-authblue-sso', () => ({
    useAuthBlueSso: () => mockUseAuthBlueSso()
}))

describe('FeatureManagementGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('shows loading spinner when auth is not loaded', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: false })
        mockUseUserContext.mockReturnValue({ groups: [] })

        render(
            <NavigationProvider>
                <FeatureManagementGuard>
                    <div data-testid='child-content'>Protected Content</div>
                </FeatureManagementGuard>
            </NavigationProvider>
        )

        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.guardLoading)
        ).toBeInTheDocument()
        expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(FEATURE_MANAGEMENT_TEST_IDS.guardAccessDenied)
        ).not.toBeInTheDocument()
    })

    it('shows access denied when user is not an admin', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({ groups: ['SomeOtherGroup'] })

        render(
            <NavigationProvider>
                <FeatureManagementGuard>
                    <div data-testid='child-content'>Protected Content</div>
                </FeatureManagementGuard>
            </NavigationProvider>
        )

        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.guardAccessDenied)
        ).toBeInTheDocument()
        expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
    })

    it('shows access denied when groups is undefined', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({})

        render(
            <NavigationProvider>
                <FeatureManagementGuard>
                    <div data-testid='child-content'>Protected Content</div>
                </FeatureManagementGuard>
            </NavigationProvider>
        )

        expect(
            screen.getByTestId(FEATURE_MANAGEMENT_TEST_IDS.guardAccessDenied)
        ).toBeInTheDocument()
    })

    it('renders children when user is an admin', () => {
        mockUseAuthBlueSso.mockReturnValue({ isLoaded: true })
        mockUseUserContext.mockReturnValue({
            groups: ['GG-AXP-ARCH-PORTAL-ADMIN']
        })

        render(
            <NavigationProvider>
                <FeatureManagementGuard>
                    <div data-testid='child-content'>Protected Content</div>
                </FeatureManagementGuard>
            </NavigationProvider>
        )

        expect(screen.getByTestId('child-content')).toBeInTheDocument()
        expect(
            screen.queryByTestId(FEATURE_MANAGEMENT_TEST_IDS.guardAccessDenied)
        ).not.toBeInTheDocument()
        expect(
            screen.queryByTestId(FEATURE_MANAGEMENT_TEST_IDS.guardLoading)
        ).not.toBeInTheDocument()
    })
})
