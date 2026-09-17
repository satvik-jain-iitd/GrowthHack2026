import React from 'react'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/test-utils'
import { BVB_TEST_IDS } from '@/app/build-vs-buys/test-ids'

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockUseUserContext = jest.fn()

jest.mock('@/context', () => ({
    useUserContext: () => mockUseUserContext()
}))

interface BuildBuyFormChildren {
    firstField: React.ReactNode
    restFields: React.ReactNode
    onSubmit: () => void
}

jest.mock('@/app/onboarding-form/components/BuildBuyForm', () => ({
    BuildBuyForm: ({
        adsId,
        email,
        children
    }: {
        adsId: string
        email: string
        activeFormDisplayText: string
        children: (args: BuildBuyFormChildren) => React.ReactNode
    }) => (
        <div
            data-testid='build-buy-form'
            data-ads-id={adsId}
            data-email={email}
        >
            {children({
                firstField: <div data-testid='first-field' />,
                restFields: <div data-testid='rest-fields' />,
                onSubmit: jest.fn()
            })}
        </div>
    )
}))

jest.mock('@/app/onboarding-form/components/NeedHelp', () => ({
    NeedHelp: ({ isBvB }: { isBvB?: boolean }) => (
        <div data-testid='need-help' data-is-bvb={String(isBvB)} />
    )
}))

import BvBOnboarding from './BvBOnboarding'

// ── Helpers ────────────────────────────────────────────────────────────────

const mockUser = {
    attributes: {
        adsId: 'ads123',
        email: 'user@example.com'
    }
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('BvBOnboarding', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the page heading', () => {
        mockUseUserContext.mockReturnValue(mockUser)
        render(<BvBOnboarding />)
        expect(
            screen.getByTestId(BVB_TEST_IDS.onboardingHeading)
        ).toHaveTextContent('Build vs. Buy Onboarding Request')
    })

    it('renders the instruction text', () => {
        mockUseUserContext.mockReturnValue(mockUser)
        render(<BvBOnboarding />)
        expect(
            screen.getByTestId(BVB_TEST_IDS.onboardingInstructionText)
        ).toHaveTextContent(/If this is your first time onboarding/)
    })

    it('passes adsId and email from user attributes to BuildBuyForm', () => {
        mockUseUserContext.mockReturnValue(mockUser)
        render(<BvBOnboarding />)
        const form = screen.getByTestId(BVB_TEST_IDS.buildBuyForm)
        expect(form).toHaveAttribute('data-ads-id', 'ads123')
        expect(form).toHaveAttribute('data-email', 'user@example.com')
    })

    it('uses empty string defaults when user has no attributes', () => {
        mockUseUserContext.mockReturnValue({})
        render(<BvBOnboarding />)
        const form = screen.getByTestId(BVB_TEST_IDS.buildBuyForm)
        expect(form).toHaveAttribute('data-ads-id', '')
        expect(form).toHaveAttribute('data-email', '')
    })

    it('uses empty string defaults when user is null', () => {
        mockUseUserContext.mockReturnValue(null)
        render(<BvBOnboarding />)
        const form = screen.getByTestId(BVB_TEST_IDS.buildBuyForm)
        expect(form).toHaveAttribute('data-ads-id', '')
        expect(form).toHaveAttribute('data-email', '')
    })

    it('uses empty string defaults when user is undefined', () => {
        mockUseUserContext.mockReturnValue(undefined)
        render(<BvBOnboarding />)
        const form = screen.getByTestId(BVB_TEST_IDS.buildBuyForm)
        expect(form).toHaveAttribute('data-ads-id', '')
        expect(form).toHaveAttribute('data-email', '')
    })

    it('renders the firstField and restFields from the render prop', () => {
        mockUseUserContext.mockReturnValue(mockUser)
        render(<BvBOnboarding />)
        expect(
            screen.getByTestId(BVB_TEST_IDS.onboardingFirstField)
        ).toBeInTheDocument()
        expect(
            screen.getByTestId(BVB_TEST_IDS.onboardingRestFields)
        ).toBeInTheDocument()
    })

    it('renders NeedHelp with isBvB=true', () => {
        mockUseUserContext.mockReturnValue(mockUser)
        render(<BvBOnboarding />)
        const needHelp = screen.getByTestId(BVB_TEST_IDS.needHelp)
        expect(needHelp).toBeInTheDocument()
        expect(needHelp).toHaveAttribute('data-is-bvb', 'true')
    })

    it('uses empty defaults when attributes exist but adsId/email are missing', () => {
        mockUseUserContext.mockReturnValue({ attributes: {} })
        render(<BvBOnboarding />)
        const form = screen.getByTestId(BVB_TEST_IDS.buildBuyForm)
        expect(form).toHaveAttribute('data-ads-id', '')
        expect(form).toHaveAttribute('data-email', '')
    })
})
